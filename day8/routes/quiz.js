// routes/quiz.js
const express = require("express");
const router = express.Router();
const { Quiz, Answer,sequelize } = require("../models");


// Get all quizzes
router.get("/api/v1/quiz", async (req, res) => {
  try {
    const quizzes = await Quiz.findAll({
        include: {
            model: Answer,
            as: 'answers',
          },
    });
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a single quiz
router.get("/api/v1/quiz/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: Answer,
    });
    if (quiz) {
      res.json(quiz);
    } else {
      res.status(404).json({ error: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new quiz with answers
router.post("/api/v1/quiz", async (req, res) => {
  const { type, question, correct_answer, answers } = req.body;

  try {
    // Start a transaction to ensure both quiz and answers are saved together
    const result = await sequelize.transaction(async (t) => {
      // Create the quiz
      const quiz = await Quiz.create(
        {
          type,
          question,
          correct_answer,
        },
        { transaction: t }
      );

      // If answers are provided, save them
      if (answers && answers.length > 0) {
        const quizAnswers = answers.map((answer) => ({
          quizId: quiz.id,
          answer: answer.answer, // assuming answer is an object with an `answer` field
        }));

        await Answer.bulkCreate(quizAnswers, { transaction: t });
      }

      return quiz;
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Update a quiz
router.put("/api/v1/quiz/:id", async (req, res) => {
  try {
    const [updated] = await Quiz.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const updatedQuiz = await Quiz.findByPk(req.params.id);
      res.json(updatedQuiz);
    } else {
      res.status(404).json({ error: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a quiz
router.delete("/api/v1/quiz/:id", async (req, res) => {
  try {
    const deleted = await Quiz.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Quiz not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
