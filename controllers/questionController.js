const Question = require('../models/QuestionModel');
const db = require('../config/config');
const { STATUS_CODES } = require('../constants');

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
    return res.status(STATUS_CODES.BAD_REQUEST).json({ 
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
      return res.status(STATUS_CODES.BAD_REQUEST).json({ 
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

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Question created successfully",
      template_id,
      question_id: result[0].insertId,
    });
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
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

      res.status(STATUS_CODES.SUCCESS).json({
          success: true,
          questions: questions,
      });
  } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
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
    return res.status(STATUS_CODES.BAD_REQUEST).json({ 
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
      return res.status(STATUS_CODES.NOT_FOUND).json({ 
        success: false,
        message: "Question not found" 
      });
    }

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Question updated successfully",
    });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while updating the question",
      error: error.message
    });
  }
};

const deleteQuestionController = async (req, res) => {
  const questionId = req.params.questionId;
  const userId = req.user.userId;

  console.log('User trying to delete question:', userId);
  console.log('Attempting to delete question with ID:', questionId);

  try {
    const [result] = await db.promise().query(
      `SELECT id FROM questions WHERE id = ? AND user_id = ?`,
      [questionId, userId]
    );

    if (result.length === 0) {
      console.log('No matching question found or user does not have permission');
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Question not found or you do not have permission to delete it.',
      });
    }

    const [deleteResult] = await db.promise().query(
      `DELETE FROM questions WHERE id = ? AND user_id = ?`,
      [questionId, userId]
    );

    if (deleteResult.affectedRows > 0) {
      return res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: 'Question deleted successfully.',
      });
    } else {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: 'Question not found or you do not have permission to delete it.',
      });
    }
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'An error occurred while deleting the question.',
      error: error.message,
    });
  }
};

const getAllQuestionsController = async (req, res) => {
  try {
    const [result] = await db.promise().query(
      `SELECT 
        q.id AS question_id, 
        q.template_id, 
        q.user_id, 
        q.name, 
        q.description, 
        q.answer_type, 
        q.answers,
        u.email AS user_email
      FROM questions q
      JOIN authUsers u ON q.user_id = u.ID`
    );

    const questionsByAuthors = result.reduce((acc, question) => {
      let parsedAnswers = [];

      try {
        if (question.answers) {
          parsedAnswers = typeof question.answers === 'string' ? JSON.parse(question.answers) : question.answers;
        }
      } catch (e) {
        console.error(`Failed to parse answers for question_id ${question.question_id}:`, e.message);
      }

      const authorQuestions = acc[question.user_email] || [];
      authorQuestions.push({
        ...question,
        answers: parsedAnswers,
      });
      acc[question.user_email] = authorQuestions;

      return acc;
    }, {});

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      questions_by_authors: questionsByAuthors,
    });
  } catch (error) {
    console.error('Error fetching questions by authors:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "An error occurred while fetching questions by authors",
      error: error.message,
    });
  }
};

module.exports = {
  createQuestionController,
  getAllQuestionsByUserController,
  deleteQuestionController,
  updateQuestionController,
  getAllQuestionsController
};