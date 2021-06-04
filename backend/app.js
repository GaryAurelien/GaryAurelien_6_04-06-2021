//on apporte express dans la const express
const express = require('express');

//on cree notre application dans la const app (application express)
const app =  express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use((req, res, next) => {
    console.log('requete reçue !');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

//methode app.use 
app.use((req, res, next) => {
    res.json({ message: 'Votre requete a bien été reçue !'});
    next();
});

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès');
});

//on export app que l'on utilisera dans server.js
module.exports = app;