const db = require("../config/config");

class Question {
  constructor(template_id, user_id, name, description, answerType, show_answer = 0, answers, correct_answer) {
    this.template_id = template_id;
    this.user_id = user_id;
    this.name = name;
    this.description = description;
    this.answerType = answerType;
    this.show_answer = show_answer;
    this.answers = answers;
    this.correct_answer = correct_answer;
  }

  validateCorrectAnswer() {
    if (this.answerType === 'checkbox') {
      if (!Array.isArray(this.correct_answer)) {
        throw new Error("Correct answer must be an array for checkbox type questions");
      }
  
      const normalizedAnswers = this.answers.map(a => a.trim().toLowerCase());
  
      const validAnswers = this.correct_answer.every(index => 
        index >= 0 && index < this.answers.length
      );
  
      if (!validAnswers) {
        throw new Error("All correct answers must be valid indices in the answers array");
      }
    } else if (this.answerType === 'text') {
      if (typeof this.correct_answer !== 'string') {
        throw new Error("Correct answer must be a string for text type questions");
      }
    }
  }
  

  static async create(template_id, user_id, name, description, answerType, show_answer = 0, answers, correct_answer) {
    const connection = db;
    try {
      if (!['checkbox', 'text'].includes(answerType)) {
        throw new Error("Invalid answer type");
      }

      const question = new Question(template_id, user_id, name, description, answerType, show_answer, answers, correct_answer);
      question.validateCorrectAnswer();

      const [templateCheck] = await connection.promise().query(
        `SELECT 1 FROM templates WHERE id = ?`,
        [template_id]
      );
      if (templateCheck.length === 0) {
        throw new Error("Template not found");
      }

      const [userCheck] = await connection.promise().query(
        `SELECT 1 FROM authUser WHERE id = ?`,
        [user_id]
      );
      if (userCheck.length === 0) {
        throw new Error("User not found");
      }

      const query = `
        INSERT INTO questions (template_id, user_id, name, description, answer_type, show_answer, answers, correct_answer)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const serializedAnswers = JSON.stringify(answers.map(a => a.trim()));
      const serializedCorrectAnswer = answerType === 'checkbox' 
        ? JSON.stringify(correct_answer)
        : JSON.stringify(correct_answer);

      const [result] = await connection.promise().query(query, [
        template_id,
        user_id,
        name,
        description,
        answerType,
        show_answer,
        serializedAnswers,
        serializedCorrectAnswer
      ]);

      return result;
    } catch (error) {
      throw new Error(error.message || "Failed to create question");
    }
  }

  static async findAllByUserId(user_id) {
    const connection = db;
    try {
      const [result] = await connection.promise().query(
        `SELECT 
          id AS question_id, 
          template_id, 
          name, 
          description, 
          answer_type, 
          show_answer, 
          answers, 
          correct_answer
        FROM questions
        WHERE user_id = ?`,
        [user_id]
      );

      return result.map(question => {
        let parsedAnswers = [];
        let parsedCorrectAnswer = [];

        try {
          if (question.answers) {
            parsedAnswers = typeof question.answers === 'string' ? JSON.parse(question.answers) : question.answers;
          }
        } catch (e) {
          console.error(`Failed to parse answers for question_id ${question.question_id}:`, e.message);
        }
        try {
          if (question.correct_answer) {
            parsedCorrectAnswer = typeof question.correct_answer === 'string' ? JSON.parse(question.correct_answer) : question.correct_answer;
          }
        } catch (e) {
          console.error(`Failed to parse correct_answer for question_id ${question.question_id}:`, e.message);
        }

        return {
          ...question,
          answers: parsedAnswers,
          correct_answer: parsedCorrectAnswer,
        };
      });
    } catch (error) {
      throw new Error(error.message || "Failed to fetch questions");
    }
  }

  static async update(question_id, name, description, answerType, show_answer, answers, correct_answer) {
    const connection = db;
    try {
      const query = `
        UPDATE questions
        SET name = ?, 
            description = ?, 
            answer_type = ?, 
            show_answer = ?, 
            answers = ?, 
            correct_answer = ?
        WHERE id = ?
      `;
  
      const serializedAnswers = answers.length > 0 ? JSON.stringify(answers) : '[]';
      const serializedCorrectAnswer = correct_answer.length > 0 ? JSON.stringify(correct_answer) : '[]';
  
      const [result] = await connection.promise().query(query, [
        name,
        description,
        answerType,
        show_answer || 0,
        serializedAnswers,
        serializedCorrectAnswer,
        question_id
      ]);
  
      return result;
    } catch (error) {
      throw new Error(error.message || "Failed to update question");
    }
  }
  

  static async delete(question_id, user_id) {
    const connection = db;
    try {
      const [result] = await connection.promise().query(
        `DELETE FROM questions WHERE id = ? AND user_id = ?`,
        [question_id, user_id]
      );

      return result;
    } catch (error) {
      throw new Error(error.message || "Failed to delete question");
    }
  }
}

module.exports = Question;