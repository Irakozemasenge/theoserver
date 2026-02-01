const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const adminRouter = require('./routes/AdminCTL');
const routeContacts = require('./routes/contact');
const formationRouter = require('./routes/formation');
const inscriptionRouter = require('./routes/formationInscription');

// Définir le dossier des fichiers statiques
app.use('/uploads/Admin', express.static('./uploads/Admin'));
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send("<h1>Bonjour mon frère!<hr></h1>");
});
app.use("/api/admin", adminRouter);
app.use('/api/contacts', routeContacts);
app.use('/api/formations', formationRouter);
app.use('/api/inscriptions', inscriptionRouter);
const PORT = process.env.PORT || 8004;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});