const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-dni', authController.verifyDNI);
router.post('/complete-data', authController.completeData);

module.exports = router;
