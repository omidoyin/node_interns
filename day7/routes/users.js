// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { User } = require("../models"); // Adjust the path according to your project structure
const { createWallet, getBalance, transferTokens } = require("../utils");
// const { createWallet, signPayload, getBalance, transferTokens } = require('../utils/walletUtils');

// GET all users
router.get("/api/v1/user", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/v1/user/account (Get balance of user wallet)
router.get("/api/v1/user/account", async (req, res) => {
  const { address } = req.query;
  try {
    const balance = await getBalance(address);
    res.json({ balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST /api/v1/user/wallet (Create a wallet for the user)
router.post("/api/v1/user/wallet", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { address, privateKey } = createWallet();
    user.wallet_id = address;
    await user.save();

    res.json({ wallet_id: address, privateKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/v1/user/sign (Sign payload)
router.get("/api/v1/user/sign", async (req, res) => {
  const { private_key, payload } = req.query;
  try {
    const signedPayload = signPayload(private_key, payload);
    res.json({ signedPayload });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET /api/v1/user/transfer (Transfer tokens)
router.get("/api/v1/user/transfer", async (req, res) => {
  const { private_key, to_address, amount } = req.query;
  try {
    const txHash = await transferTokens(private_key, to_address, amount);
    res.json({ transactionHash: txHash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET one user by ID
router.get("/api/v1/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST add a new user
router.post("/api/v1/user", async (req, res) => {
  const { name, wallet_id } = req.body;
  try {
    const newUser = await User.create({ name, wallet_id });
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT update a user by ID
router.put("/api/v1/user/:id", async (req, res) => {
  const { id } = req.params;
  const { name, wallet_id } = req.body;
  try {
    let user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.name = name;
    user.wallet_id = wallet_id;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE a user by ID
router.delete("/api/v1/user/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
