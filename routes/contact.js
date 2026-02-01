const express = require('express');
const router = express.Router();
const { contact } = require('../models'); // Assurez-vous que ce chemin est correct
const Joi = require('joi');

// Schéma de validation Joi
const contactSchema = Joi.object({
    nom: Joi.string().required().messages({
        'any.required': 'Le nom est requis.',
        'string.empty': 'Le nom ne doit pas être vide.',
    }),
    email: Joi.string().email().required().messages({
        'any.required': 'L\'adresse email est requise.',
        'string.empty': 'L\'adresse email ne doit pas être vide.',
        'string.email': 'L\'adresse email doit être valide.',
    }),
    message: Joi.string().required().messages({
        'any.required': 'Le message est requis.',
        'string.empty': 'Le message ne doit pas être vide.',
    }),
});

// CREATE: Créer un nouveau contact
router.post('/', async(req, res) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const newContact = await contact.create(req.body);
        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du contact.', error });
    }
});

// READ: Récupérer tous les contacts
router.get('/', async(req, res) => {
    try {
        const contacts = await contact.findAll({
            order: [
                ['createdAt', 'DESC']
            ], // Trier par date en ordre décroissant
        });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des contacts.', error });
    }
});

// READ: Récupérer un contact par son ID
router.get('/:id', async(req, res) => {
    try {
        const contactDetails = await contact.findByPk(req.params.id);
        if (!contactDetails) {
            return res.status(404).json({ message: 'Contact non trouvé.' });
        }
        res.status(200).json(contactDetails);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du contact.', error });
    }
});

// UPDATE: Mettre à jour un contact par son ID
router.put('/:id', async(req, res) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const [updated] = await contact.update(req.body, {
            where: { id: req.params.id },
        });
        if (updated) {
            const updatedContact = await contact.findByPk(req.params.id);
            res.status(200).json(updatedContact);
        } else {
            res.status(404).json({ message: 'Contact non trouvé.' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour du contact.', error });
    }
});

// DELETE: Supprimer un contact par son ID
router.delete('/:id', async(req, res) => {
    try {
        const deleted = await contact.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Contact non trouvé.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du contact.', error });
    }
});

module.exports = router;