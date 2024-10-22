const cron = require('node-cron');
const db = require('../models');

function scheduleEmailCronJob() {
// cron.schedule('0 0 * * *', async () => { // Runs every day at midnight
console.log("running....................");
cron.schedule('*/1 * * * *', async () => { // Runs every minute
  try {
    console.log("running....................");
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    const users = await db.User.findAll({
      where: {
        status: 'active'
      }
    });

    const emailsToSend = [];
    const oddDays = [1, 3, 5]; // Monday, Wednesday, Friday (considering Monday as day 1)
    const evenDays = [0, 2, 4, 6]; // Sunday, Tuesday, Thursday, Saturday

    for (const user of users) {
      let emailIds = [];
      if (oddDays.includes(dayOfWeek)) {
        emailIds = await db.Email.findAll({
          where: {
            id: {
              [db.Sequelize.Op.and]: [
                db.Sequelize.literal('id % 2 = 1'), // Odd IDs
              ]
            },
            status: 'active'
          }
        });
      } else if (evenDays.includes(dayOfWeek)) {
        emailIds = await db.Email.findAll({
          where: {
            id: {
              [db.Sequelize.Op.and]: [
                db.Sequelize.literal('id % 2 = 0'), // Even IDs
              ]
            },
            status: 'active'
          }
        });
      }

      for (const email of emailIds) {
        emailsToSend.push({
          user_id: user.id,
          email_id: email.id,
          status: 'not sent',
          send_at: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
        });
      }
    }
console.log("emailsToSend----->>>>", emailsToSend);
    await db.EmailQueue.bulkCreate(emailsToSend);
    console.log('Emails added to queue successfully.');
  } catch (error) {
    console.error('Error generating email queue:', error);
  }
});
}

module.exports = scheduleEmailCronJob;
