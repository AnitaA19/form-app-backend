const Question = require('../models/QuestionModel');

const createQuestionController = async (req, res) => {
  const { template_id, name, description, answerType, answers } = req.body;

  console.log("Request body:", req.body); // Log the request body for debugging

  if (!template_id || !name || !answerType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const user_id = req.user.userId; 

  try {
    console.log(`Creating question with template_id: ${template_id} and user_id: ${user_id}`);

    const result = await Question.create(template_id, user_id, name, description, answerType, answers);

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

module.exports = { createQuestionController };
 