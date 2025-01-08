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
    const result = await Question.create(template_id, user_id, name, description, answerType, show_answer, answers, correct_answer);

    return res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "Question created successfully",
      template_id,
      question_id: result.insertId,
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
    const questions = await Question.findAllByUserId(user_id);

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
    const result = await Question.update(question_id, name, description, answerType, show_answer, answers, correct_answer);

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
    const result = await Question.delete(questionId, userId);

    if (result.affectedRows > 0) {
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
      JOIN authUser u ON q.user_id = u.id`
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