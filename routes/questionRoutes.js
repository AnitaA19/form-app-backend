const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const { createQuestionController } = require("../controllers/questionController");

// Ensure this is correct
router.post('/:template_id/questions', authenticate, createQuestionController);

module.exports = router;
