const db = require('../models');

(async function tokenCronJob() {
  await db.query('UPDATE `token` SET status=0 WHERE `expire_at` < NOW();');
})();