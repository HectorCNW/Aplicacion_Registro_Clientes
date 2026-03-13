const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');

// Rutas Google OAuth
router.post('/google', oauthController.googleAuth);
router.post('/google/verify', oauthController.verifyGoogleToken);

// Rutas Facebook OAuth
router.post('/facebook/verify', oauthController.verifyFacebookToken);

// Rutas Apple OAuth (puedes agregar si es necesario)
router.post('/apple/verify', oauthController.verifyAppleToken);

router.get('/status', oauthController.oauthStatus);

module.exports = router;
