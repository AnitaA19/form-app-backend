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

  static validateCorrectAnswer(answerType, answers, correct_answer) {
    if (answerType === 'checkbox') {
      // Ensure correct_answer is an array
      if (!Array.isArray(correct_answer)) {
        throw new Error("Correct answer must be an array for checkbox type questions");
      }

      const validAnswers = correct_answer.every(answer => 
        answers.some(a => a.id === answer)
      );
      if (!validAnswers) {
        throw new Error("All correct answers must exist in the answers array");
      }
    } else if (answerType === 'text') {
      if (typeof correct_answer !== 'string') {
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

      this.validateCorrectAnswer(answerType, answers, correct_answer);

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
      
      const serializedAnswers = JSON.stringify(answers);
      const serializedCorrectAnswer = JSON.stringify(correct_answer);

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
}

module.exports = Question;