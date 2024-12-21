const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { createQuestionController,  getAllQuestionsByUserController, deleteQuestionController,updateQuestionController } = require("../controllers/questionController");

// Create question
router.post('/:template_id/questions', authenticate, createQuestionController);

// Get all questions created by the authenticated user
router.get('/questions/user', authenticate, getAllQuestionsByUserController);

router.put('/questions/:question_id', updateQuestionController);

// Delete question by ID
router.delete('/questions/:question_id', authenticate, deleteQuestionController);

module.exports = router;
