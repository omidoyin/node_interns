const cron = require('node-cron');
const db = require('../models');
const nodemailer = require('nodemailer');


function scheduleEmailSendingCronJob() {
// Initialize nodemailer transporter using Mailtrap credentials
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  // host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '3dc471a3111840',
    pass: 'c3d9025c10f931'
  }
});

// cron.schedule('0 0 * * *', async () => { // Runs every day at midnight
cron.schedule('*/1 * * * *', async () => { // Runs every minute
  try {
    const today = new Date();

    const emailQueue = await db.EmailQueue.findAll({
      where: {
        send_at: {
          [db.Sequelize.Op.lte]: today // Get emails with send_at date less than or equal to today
        }
      },
      include: [{
        model: db.User,
        attributes: ['email', 'name']
      }, {
        model: db.Email,
        attributes: ['subject', 'body']
      }]
    });

    for (const queueItem of emailQueue) {
      const { email, name } = queueItem.User;
      const { subject, body } = queueItem.Email;

      // Replace placeholders in email body with actual user data
      const mailOptions = {
        from: 'your_email@example.com',
        to: email,
        subject: subject,
        text: body.replace('{{{NAME}}}', name).replace('{{{EMAIL}}}', email)
      };

      // Send email using nodemailer
      await transporter.sendMail(mailOptions);

      // Update email status to 'sent'
      await queueItem.update({ status: 'sent' });
    }

    console.log('Emails sent successfully.');
  } catch (error) {
    console.error('Error sending emails:', error);
  }
});

}

module.exports = scheduleEmailSendingCronJob;
