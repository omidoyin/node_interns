const express = require("express");
const router = express.Router();
const { Email } = require("../models"); // Assuming your Email model is exported as Email

// GET all emails
router.get("/api/v1/email", async (req, res) => {
  try {
    const emails = await Email.findAll();
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET one email by ID
router.get("/api/v1/email/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const email = await Email.findByPk(id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.json(email);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST add a new email
router.post("/api/v1/email", async (req, res) => {
  const { slug, subject, body, status } = req.body;
  try {
    const newEmail = await Email.create({ slug, subject, body, status });
    res.status(201).json(newEmail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT update an email by ID
router.put("/api/v1/email/:id", async (req, res) => {
  const { id } = req.params;
  const { slug, subject, body, status } = req.body;
  try {
    let email = await Email.findByPk(id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    email.slug = slug;
    email.subject = subject;
    email.body = body;
    email.status = status;
    await email.save();
    res.json(email);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE delete an email by ID
router.delete("/api/v1/email/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const email = await Email.findByPk(id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    await email.destroy();
    res.json({ message: "Email deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
