const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");
const pdf = require("html-pdf-node");

router.get("/api/v1/code/:code", async (req, res) => {
  const { service, amount } = req.query;
  const code = req.params.code;

  const invoiceTemplate = fs.readFileSync(
    path.join(__dirname, "invoice.html"),
    "utf8"
  );
  console.log(__dirname);

  const filledTemplate = invoiceTemplate
    .replace("{{service}}", service)
    .replace("{{amount}}", amount)
    .replace("{{code}}", code);

  const file = { content: filledTemplate };

  pdf
    .generatePdf(file, { format: "A4" })
    .then((pdfBuffer) => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=invoice-${code}.pdf`
      );
      res.send(pdfBuffer);
      console.log("pdfBuffer", pdfBuffer);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to generate PDF" });
    });
});

router.get("/", async (req, res) => {
  const randomCode = Math.random().toString(36).substring(2, 10);

  const qrUrl = `${req.protocol}://${req.get(
    "host"
  )}/invoice/api/v1/code/${randomCode}?amount=1&service=software+service`;

  QRCode.toDataURL(qrUrl, (err, src) => {
    if (err) res.send("Error occurred");
    console.log(qrUrl);
    res.send(`
            <html>
                <body>
                    <h1>Scan the QR Code</h1>
                    <img src="${src}" alt="QR Code"/>
                </body>
            </html>
        `);
  });
});

module.exports = router;
