/*const cron = require('node-cron');
const Bordereau = require('../models/Bordereau');

// Schedule a task to create Bordereau entries daily at midnight
cron.schedule('0 0 * * *', async () => {
    try {
        
        const natureList = ['TND', 'Nature 2'];

        for (const nature of natureList) {
            await Bordereau.create({ nature });
        }

        console.log('Bordereau entries created successfully.');
    } catch (error) {
        console.error('Error creating Bordereau entries:', error);
    }
});
*/