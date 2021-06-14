const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

const verifyPassword = require('../middleware/verifyPassword')


//liste des differente route de l'api en leurs précisant, dans l'ordre, leurs middlewares
router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;