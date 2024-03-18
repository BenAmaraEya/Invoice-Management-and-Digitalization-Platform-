const cron = require('node-cron');
const Bordereau = require('./models/Bordereau');
const Facture = require('./models/Facture');

// Planifier une tâche qui s'exécute chaque 15 minutes pour les tests
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Starting automatic bordereau creation process...');

        // Récupérer toutes les natures distinctes de factures existantes
        const natures = await Facture.aggregate('nature', 'DISTINCT', { plain: false });

        console.log(`Found ${natures.length} distinct natures:`, natures);

        // Pour chaque nature, vérifier si un bordereau correspondant existe pour la date actuelle
        for (const { DISTINCT: nature } of natures) {
            console.log(`Checking for existing bordereau for nature: ${nature}`);
            const existingBordereau = await Bordereau.findOne({ 
                where: { nature, date: new Date().toISOString().split('T')[0] } 
            });

            // Si aucun bordereau n'existe pour cette nature et cette date, le créer
            if (!existingBordereau) {
                console.log(`Creating new bordereau for nature: ${nature}`);
                await Bordereau.create({ nature, date: new Date() });
                console.log(`Created bordereau for nature ${nature}`);
            } else {
                console.log(`Bordereau already exists for nature ${nature}`);
            }
        }

        console.log('Automatic bordereau creation process completed.');
    } catch (error) {
        console.error('Error creating automatic bordereaux:', error);
    }
}, {
    timezone: 'Africa/Tunis' // Spécifiez votre fuseau horaire ici
});
