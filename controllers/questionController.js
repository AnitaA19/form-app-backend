const Question = require('../models/QuestionModel');
const db = require('../config/config');

const createQuestionController = async (req, res) => {
  const { template_id, name, description, answerType, answers, show_answer } = req.body;

  console.log("Request body:", req.body);

  if (!template_id || !name || !answerType || !Array.isArray(answers)) {
    return res.status(400).json({ message: "Missing required fields or invalid answers format" });
  }

  const user_id = req.user.userId;

  try {
    console.log(`Creating question with template_id: ${template_id} and user_id: ${user_id}`);

    // Ensure that answers is an array and check if there are multiple options
    const formattedAnswers = answers;

    const result = await Question.create(
      template_id,
      user_id,
      name,
      description,
      answerType,
      formattedAnswers, // Store answers as an array
      show_answer || 0
    );

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      template_id,
      question_id: result.insertId,
    });
  } catch (error) {
    console.error("Error while creating question:", error.message);

    res.status(500).json({
      success: false,
      message: "An error occurred while creating the question",
    });
  }
};


const getAllQuestionsByUserController = async (req, res) => {
  const user_id = req.user.userId;

  try {
    const [result] = await db.promise().query(
      `SELECT id AS question_id, template_id, name, description, answer_type, answers, show_answer 
       FROM questions 
       WHERE user_id = ?`, 
      [user_id]
    );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this user",
      });
    }

    const questions = result.map(question => {
      let parsedAnswers = [];
      try {
        // Check if 'answers' is a string
        if (typeof question.answers === 'string') {
          // Try to parse the string as JSON
          try {
            parsedAnswers = JSON.parse(question.answers);
          } catch (parseError) {
            console.warn("Answers string is not valid JSON, trying to split it", parseError);
            // If it's not valid JSON, split by commas and trim extra spaces
            parsedAnswers = question.answers.split(',').map(answer => answer.trim());
          }
        } else if (Array.isArray(question.answers)) {
          // If it's already an array, use it directly
          parsedAnswers = question.answers;
        }
      } catch (error) {
        console.error("Error parsing answers for question_id:", question.question_id, error);
      }

      return {
        ...question,
        answers: parsedAnswers,
      };
    });

    res.status(200).json({
      success: true,
      questions: questions,
    });
  } catch (error) {
    console.error("Error while fetching questions for the user:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching questions for the user",
    });
  }
};





const deleteQuestionController = async (req, res) => {
  const { question_id } = req.params;

  try {
    const [result] = await db.promise().query(
      `DELETE FROM questions WHERE id = ?`,
      [question_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting question:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the question",
    });
  }
};

const updateQuestionController = async (req, res) => {
  const { question_id } = req.params;
  const { name, description, answerType, answers, show_answer } = req.body;

  if (!name || !answerType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Convert answers to JSON string
    const answersJSON = JSON.stringify(answers);

    const [result] = await db.promise().query(
      `UPDATE questions 
       SET name = ?, description = ?, answer_type = ?, answers = ?, show_answer = ? 
       WHERE id = ?`,
      [name, description, answerType, answersJSON, show_answer || 0, question_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error("Error while updating question:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the question",
    });
  }
};



module.exports = { 
  createQuestionController, 
  getAllQuestionsByUserController,
  deleteQuestionController,
  updateQuestionController
};

 