const Question = require('../models/QuestionModel');
const db = require('../config/config');

const createQuestionController = async (req, res) => {
  const { 
    template_id, 
    name, 
    description, 
    answerType, 
    show_answer, 
    answers, 
    correct_answer 
  } = req.body;


  if (!template_id || !name || !answerType || !Array.isArray(answers)) {
    return res.status(400).json({ 
      success: false,
      message: "Missing required fields or invalid answers format" 
    });
  }

  const user_id = req.user.userId;

  try {
    const stringifiedAnswers = JSON.stringify(answers);
    let stringifiedCorrectAnswer;

    if (Array.isArray(correct_answer)) {
      stringifiedCorrectAnswer = JSON.stringify(correct_answer);
    } else if (typeof correct_answer === 'number') {
      stringifiedCorrectAnswer = JSON.stringify([correct_answer]);
    } else {
      return res.status(400).json({ 
        success: false,
        message: "Correct answer must be an array of integers or a single integer." 
      });
    }

    console.log('Creating question with params:', {
      template_id,
      user_id,
      name,
      description,
      answerType,
      show_answer,
      answers: stringifiedAnswers,
      correct_answer: stringifiedCorrectAnswer
    });

    const result = await db.promise().query(
      `INSERT INTO questions (
        template_id, 
        user_id, 
        name, 
        description, 
        answer_type, 
        show_answer, 
        answers, 
        correct_answer
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        template_id,
        user_id,
        name,
        description,
        answerType,
        show_answer || 0,
        stringifiedAnswers,
        stringifiedCorrectAnswer
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      template_id,
      question_id: result[0].insertId,
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the question",
      error: error.message 
    });
  }
};

const getAllQuestionsByUserController = async (req, res) => {
  const user_id = req.user.userId;

  try {
      const [result] = await db.promise().query(
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

      console.log("Raw database result:", result);

      const questions = result.map(question => {
          let parsedAnswers = [];
          let parsedCorrectAnswer = [];

          try {
              if (question.answers) {
                  parsedAnswers = typeof question.answers === 'string' ? JSON.parse(question.answers) : question.answers;
              }
          } catch (e) {
              console.error(`Failed to parse answers for question_id ${question.question_id}:`, e.message);
              parsedAnswers = [];
          }
          try {
              if (question.correct_answer) {
                  parsedCorrectAnswer = typeof question.correct_answer === 'string' ? JSON.parse(question.correct_answer) : question.correct_answer;
              }
          } catch (e) {
              console.error(`Failed to parse correct_answer for question_id ${question.question_id}:`, e.message);
              parsedCorrectAnswer = [];
          }

          return {
              ...question,
              answers: parsedAnswers,
              correct_answer: parsedCorrectAnswer,
          };
      });

      res.status(200).json({
          success: true,
          questions: questions,
      });
  } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({
          success: false,
          message: "An error occurred while fetching questions for the user",
          error: error.message,
      });
  }
};


const updateQuestionController = async (req, res) => {
  const { question_id } = req.params;
  const { 
    name, 
    description, 
    answerType, 
    show_answer, 
    answers, 
    correct_answer 
  } = req.body;

  if (!name || !answerType) {
    return res.status(400).json({ 
      success: false,
      message: "Missing required fields" 
    });
  }

  try {
    const [result] = await db.promise().query(
      `UPDATE questions
      SET name = ?, 
          description = ?, 
          answer_type = ?, 
          show_answer = ?, 
          answers = ?, 
          correct_answer = ?
      WHERE id = ?`,
      [
        name,
        description,
        answerType,
        show_answer || 0,
        JSON.stringify(answers),
        JSON.stringify(correct_answer),
        question_id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        message: "Question not found" 
      });
    }

    res.status(200).json({
      success: true,
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the question",
      error: error.message
    });
  }
};

const deleteQuestionController = async (req, res) => {
  const questionId = req.params.questionId;
  const userId = req.user.userId;

  try {
    const [result] = await db.promise().query(
      `DELETE FROM questions WHERE id = ? AND user_id = ?`,
      [questionId, userId]
    );

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: 'Question deleted successfully.',
      });
    } else {
      // Log the failed attempt for better debugging
      console.log('Delete attempt failed for questionId:', questionId, 'by userId:', userId);

      return res.status(404).json({
        success: false,
        message: 'Question not found or you do not have permission to delete it.',
      });
    }
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the question.',
      error: error.message,
    });
  }
};


module.exports = {
  createQuestionController,
  getAllQuestionsByUserController,
  deleteQuestionController,
  updateQuestionController
};