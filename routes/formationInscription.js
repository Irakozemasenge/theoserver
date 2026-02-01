'use strict';
const express = require('express');
const router = express.Router();
const { formationinscription } = require('../models');
const Joi = require('joi');

// Schéma de validation pour les inscriptions
const inscriptionSchema = Joi.object({
    formationId: Joi.number().integer().required(),
    nomcomplet: Joi.string().required(),
    tel: Joi.string().required(),
    email: Joi.string().email().required(),
    motivation: Joi.string().required(),
    status: Joi.string().allow(null),
});

// CREATE: Créer une nouvelle inscription
router.post('/', async(req, res) => {
    const { error } = inscriptionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const newInscription = await formationinscription.create(req.body);
        res.status(201).json(newInscription);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'inscription.', error: err });
    }
});

// READ: Récupérer toutes les inscriptions
router.get('/', async(req, res) => {
    try {
        const inscriptions = await formationinscription.findAll();
        res.status(200).json(inscriptions);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération des inscriptions.', error: err });
    }
});

// READ: Récupérer une inscription par son ID
router.get('/:id', async(req, res) => {
    try {
        const inscription = await formationinscription.findByPk(req.params.id);
        if (!inscription) {
            return res.status(404).json({ message: 'Inscription non trouvée.' });
        }
        res.status(200).json(inscription);
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l\'inscription.', error: err });
    }
});

// UPDATE: Mettre à jour une inscription par son ID
router.put('/:id', async(req, res) => {
    const { error } = inscriptionSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const [updated] = await formationinscription.update(req.body, {
            where: { id: req.params.id },
        });
        if (updated) {
            const updatedInscription = await formationinscription.findByPk(req.params.id);
            res.status(200).json(updatedInscription);
        } else {
            res.status(404).json({ message: 'Inscription non trouvée.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'inscription.', error: err });
    }
});

// DELETE: Supprimer une inscription par son ID
router.delete('/:id', async(req, res) => {
    try {
        const deleted = await formationinscription.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Inscription non trouvée.' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l\'inscription.', error: err });
    }
});

module.exports = router;