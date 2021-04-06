const express = require('express');
const router = express.Router();

const signupService = require('../services/signupService');

/* POST signup page. */
router.post('/', async (req, res, next) => {
    try {
        const user = await signupService.signup(req);
        return res.status(201).json(user);
    } catch (err) {
        return res.status(409).json({ error: err.message });
    }
});

module.exports = router;
