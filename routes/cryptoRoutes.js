const express = require('express');
const router = express.Router();
const { getAllCrypto, getGainers, getNewListings, addCrypto } = require('../controllers/cryptoController');

router.get('/', getAllCrypto);
router.get('/gainers', getGainers);
router.get('/new', getNewListings);
router.post('/', addCrypto);

module.exports = router;