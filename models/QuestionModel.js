const db = require("../config/config");  

class Question {
  constructor(template_id, user_id, name, description, answerType, answers, correct_answer, show_answer = 0) {
    this.template_id = template_id;
    this.user_id = user_id;
    this.name = name;
    this.description = description;
    this.answerType = answerType;
    this.answers = answers;
    this.correct_answer = correct_answer;  // Add correct_answer here
    this.show_answer = show_answer;
  }

  static async create(template_id, user_id, name, description, answerType, answers, correct_answer, show_answer = 0) {
    const connection = db;
    try {
      if (!['checkbox', 'text'].includes(answerType)) {
        throw new Error("Invalid answer type");
      }

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
        INSERT INTO questions (template_id, user_id, name, description, answer_type, answers, correct_answer, show_answer)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await connection.promise().query(query, [
        template_id,
        user_id,
        name,
        description,
        answerType,
        JSON.stringify(answers),
        correct_answer,  // Store correct_answer here
        show_answer,
      ]);

      return result;
    } catch (error) {
      throw new Error(error.message || "Failed to create question");
    }
  }
}


module.exports = Question;