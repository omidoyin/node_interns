const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const {transaction:Transaction} = require('../models/index');
const { Parser } = require('json2csv');

// Setup multer for file upload
const upload = multer({ dest: 'uploads/' });

// Import transactions from CSV
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    const transactions = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        transactions.push(row);
      })
      .on('end', async () => {
        try {
          await Transaction.bulkCreate(transactions);
          res.status(200).send('File successfully imported');
        } catch (error) {
          res.status(500).send('Error importing file: ' + error.message);
        }
      });
  } catch (error) {
    res.status(500).send('Error processing file: ' + error.message);
  }
});

// Export transactions to CSV
router.get('/export', async (req, res) => {
  try {
    const transactions = await Transaction.findAll();
    const json2csv = new Parser();
    const csv = json2csv.parse(transactions);
    res.header('Content-Type', 'text/csv');
    res.attachment('transactions.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).send('Error exporting data: ' + error.message);
  }
});

module.exports = router;
