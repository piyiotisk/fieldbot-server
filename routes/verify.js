const express = require('express');
const router = express.Router();

const verifyEmailService = require('../services/verifyEmailService');

router.get('/', async (req, res, next) => {
    try {
        await verifyEmailService.verify(req.query);
        res.redirect('https://fieldbot.io/login');
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

module.exports = router;
