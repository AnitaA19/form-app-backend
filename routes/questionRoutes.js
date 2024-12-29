const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { createQuestionController,  getAllQuestionsByUserController, deleteQuestionController,updateQuestionController } = require("../controllers/questionController");

router.post('/:template_id/questions', authenticate, createQuestionController);

router.get('/questions/user', authenticate, getAllQuestionsByUserController);

router.put('/questions/:question_id', updateQuestionController);

router.delete('/questions/:questionId', authenticate, deleteQuestionController);

module.exports = router;
