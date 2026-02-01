const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
const { formation, formationelement } = require('../models'); // Assurez-vous que les modèles sont bien importés

// Crée une instance de Router
const router = express.Router();
router.use(cors());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Configuration de multer pour le stockage des fichiers
const storage = multer.memoryStorage(); // Ou une autre stratégie de stockage
const upload = multer({ storage });

// Route pour ajouter une formation
router.post('/', upload.single('photo'), async(req, res) => {
    const { titre, description, debut, fin, elements } = req.body;
    const photo = req.file; // récupère le fichier uploadé

    if (!elements || elements.length === 0) {
        return res.status(400).send({ error: 'At least one element is required' });
    }

    try {
        // Crée une nouvelle formation
        const newFormation = await formation.create({
            titre,
            description,
            photo: photo ? photo.buffer.toString('base64') : null,
            debut,
            fin,
        });

        // Traitez les éléments ici
        await Promise.all(elements.map(async(element) => {
            await formationelement.create({
                formationId: newFormation.id,
                element,
            });
        }));

        res.status(201).send(newFormation);
    } catch (error) {
        console.error('Erreur lors de la création de la formation', error);
        res.status(500).send({ error: 'Erreur lors de la création de la formation' });
    }
});

// Route pour obtenir toutes les formations
router.get('/', async(req, res) => {
    try {
        const formations = await formation.findAll({
            include: [{ model: formationelement }]
        });
        res.status(200).send(formations);
    } catch (error) {
        console.error('Erreur lors de la récupération des formations', error);
        res.status(500).send({ error: 'Erreur lors de la récupération des formations' });
    }
});

// Route pour mettre à jour une formation
router.put('/:id', upload.single('photo'), async(req, res) => {
    const { id } = req.params;
    const { titre, description, debut, fin, elements } = req.body;
    const photo = req.file; // Récupère le fichier uploadé

    try {
        const existingFormation = await formation.findByPk(id);
        if (!existingFormation) return res.status(404).send({ error: 'Formation non trouvée' });

        existingFormation.titre = titre;
        existingFormation.description = description;
        existingFormation.photo = photo ? photo.buffer.toString('base64') : existingFormation.photo; // Met à jour ou garde l'ancienne image
        existingFormation.debut = debut;
        existingFormation.fin = fin;

        await existingFormation.save();

        // Mettre à jour les éléments existants
        await formationelement.destroy({ where: { formationId: id } }); // Supprimez les anciens éléments
        await Promise.all(elements.map(async(element) => {
            await formationelement.create({
                formationId: existingFormation.id,
                element,
            });
        }));

        res.status(200).send(existingFormation);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la formation', error);
        res.status(500).send({ error: 'Erreur lors de la mise à jour de la formation' });
    }
});

// Route pour supprimer une formation
router.delete('/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const existingFormation = await formation.findByPk(id);
        if (!existingFormation) return res.status(404).send({ error: 'Formation non trouvée' });

        await existingFormation.destroy();
        await formationelement.destroy({ where: { formationId: id } }); // Supprimez les éléments liés
        res.status(204).send(); // Pas de contenu à renvoyer
    } catch (error) {
        console.error('Erreur lors de la suppression de la formation', error);
        res.status(500).send({ error: 'Erreur lors de la suppression de la formation' });
    }
});

// Exportez le router
module.exports = router;