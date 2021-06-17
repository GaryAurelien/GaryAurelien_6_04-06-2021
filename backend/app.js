/********************Importation modules*********************/

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');


/**************************Sécurité**************************/

//Helmet vous aide à protéger votre application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.
const helmet = require('helmet');
//dotenv
require('dotenv').config()

/**************************Importation route et divers**************************/

const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')


mongoose.connect( process.env.DB_URL ,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));;

const app =  express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(helmet());
app.disable('x-powered-by');
app.use(bodyParser.json());


app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);

//on export app que l'on utilisera dans server.js
module.exports = app;


