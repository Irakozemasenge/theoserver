'use strict';
const express = require('express');
const multer = require('multer');
const Joi = require('joi');
const { admin } = require('../models'); // Utilisation du modèle admin
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const bcrypt = require('bcryptjs');

const router = express.Router();

// Configuration de multer pour le téléchargement de fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/Admin/');
    },
    filename: (req, file, cb) => {
        const uniqueFilename = uuidv4() + path.extname(file.originalname);
        cb(null, uniqueFilename);
    },
});

const upload = multer({ storage });

// Schéma de validation pour les données de l'utilisateur
const validateUser = (userData) => {
    const schema = Joi.object({
        firstname: Joi.string().required().messages({
            'any.required': 'Le prénom est requis.',
            'string.empty': 'Le prénom ne doit pas être vide.',
        }),
        lastname: Joi.string().required().messages({
            'any.required': 'Le nom de famille est requis.',
            'string.empty': 'Le nom de famille ne doit pas être vide.',
        }),
        email: Joi.string().email().required().messages({
            'any.required': 'L\'adresse email est requise.',
            'string.empty': 'L\'adresse email ne doit pas être vide.',
            'string.email': 'L\'adresse email doit être valide.',
        }),
        password: Joi.string().required().messages({
            'any.required': 'Le mot de passe est requis.',
            'string.empty': 'Le mot de passe ne doit pas être vide.',
        }),
        photo: Joi.any().optional(),
    });
    return schema.validate(userData, { abortEarly: false });
};

// Créer un administrateur
router.post('/createAccount', upload.single('photo'), async(req, res) => {
    try {
        const existingAdmin = await admin.findOne({ where: { email: req.body.email } });
        if (existingAdmin) {
            return res.status(400).send('Cet email est déjà utilisé.');
        }

        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newAdmin = await admin.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            photo: req.file ? req.file.filename : null,
        });

        res.status(201).send(newAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la création de l\'administrateur.');
    }
});

// Connexion d'un administrateur
router.post('/login', async(req, res) => {
    try {
        const existingAdmin = await admin.findOne({ where: { email: req.body.email } });
        if (!existingAdmin) {
            return res.status(400).send('Vous n\'êtes pas inscrit. Veuillez vérifier votre adresse e-mail.');
        }

        const validPassword = await bcrypt.compare(req.body.password, existingAdmin.password);
        if (!validPassword) {
            return res.status(400).send('Mot de passe incorrect.');
        }

        res.json(existingAdmin.id);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la connexion.');
    }
});

// Récupérer un administrateur par ID
router.get('/getOne/:id', async(req, res) => {
    try {
        const adminId = req.params.id;
        const foundAdmin = await admin.findOne({ where: { id: adminId } });

        if (!foundAdmin) {
            return res.status(404).send('Administrateur non trouvé.');
        }

        res.status(200).send(foundAdmin);
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la récupération de l\'administrateur.');
    }
});

// Mise à jour des informations de l'administrateur
router.put('/Updateuser/:id', upload.single('photo'), async(req, res) => {
    try {
        const adminId = req.params.id;
        const { firstname, lastname, email } = req.body;
        const updateFields = { firstname, lastname, email };

        if (req.file) {
            updateFields.photo = req.file.filename;
        }

        const [updated] = await admin.update(updateFields, { where: { id: adminId } });

        if (!updated) {
            return res.status(404).send('Administrateur non trouvé.');
        }

        res.status(200).send('Informations de l\'administrateur mises à jour avec succès.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la mise à jour des informations de l\'administrateur.');
    }
});

// Mise à jour du mot de passe de l'administrateur
router.put('/UpdateuserPassword/:id', async(req, res) => {
    try {
        const adminId = req.params.id;
        const { newPassword, oldPassword } = req.body;

        if (!newPassword || !oldPassword) {
            return res.status(400).send("Veuillez fournir à la fois l'ancien et le nouveau mot de passe.");
        }

        const Oneadmin = await admin.findByPk(adminId);
        if (!Oneadmin) {
            return res.status(404).send("Administrateur non trouvé.");
        }

        const isMatch = await bcrypt.compare(oldPassword, Oneadmin.password);
        if (!isMatch) {
            return res.status(400).send("L'ancien mot de passe est incorrect.");
        }

        const salt = await bcrypt.genSalt(10);
        Oneadmin.password = await bcrypt.hash(newPassword, salt);
        await Oneadmin.save();

        res.status(200).send('Mot de passe mis à jour avec succès.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erreur lors de la mise à jour du mot de passe.');
    }
});

module.exports = router;