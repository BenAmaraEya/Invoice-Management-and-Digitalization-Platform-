const cron = require('node-cron');


cron.schedule('0 0 * * *', async () => {
  await createBordereauForNature('3WMTND');
  await createBordereauForNature('Nature2');
 
}, {
  timezone: 'Africa/Tunis' 
});