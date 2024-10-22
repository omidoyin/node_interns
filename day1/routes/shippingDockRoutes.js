// routes/shippingDockRoutes.js
const express = require("express");
const router = express.Router();
const {shipping_dock:ShippingDock} = require("../models/index");
// const ShippingDock = require("../models/shippingDock");

// GET all shipping docks
router.get("/api/v1/shipping_dock", async (req, res) => {
  try {
    const shippingDocks = await ShippingDock.findAll();
    res.json(shippingDocks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// GET one shipping dock by ID
router.get("/api/v1/shipping_dock/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const shippingDock = await ShippingDock.findByPk(id);
    if (!shippingDock) {
      return res.status(404).json({ message: "Shipping dock not found" });
    }
    res.json(shippingDock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST add a new shipping dock
router.post("/api/v1/shipping_dock", async (req, res) => {
  const { name, status } = req.body;
  try {
    const newShippingDock = await ShippingDock.create({ name, status });
    res.status(201).json(newShippingDock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// PUT update a shipping dock by ID
router.put("/api/v1/shipping_dock/:id", async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;
  try {
    let shippingDock = await ShippingDock.findByPk(id);
    if (!shippingDock) {
      return res.status(404).json({ message: "Shipping dock not found" });
    }
    shippingDock.name = name;
    shippingDock.status = status;
    await shippingDock.save();
    res.json(shippingDock);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE delete a shipping dock by ID
router.delete("/api/v1/shipping_dock/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const shippingDock = await ShippingDock.findByPk(id);
    if (!shippingDock) {
      return res.status(404).json({ message: "Shipping dock not found" });
    }
    await shippingDock.destroy();
    res.json({ message: "Shipping dock deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
