const express = require('express');
const router = express.Router();

const loginService = require('../services/loginService');
const { handleError } = require('../utils/errorHandler');

/* POST login page. */
router.post('/', async (req, res, next) => {
    try {
        const token = await loginService.login(req);
        return res.json({ authorization: token });
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/reset-password', async (req, res, next) => {
    try {
        await loginService.resetPassword(req);
        return res.sendStatus(200);
    } catch (err) {
        handleError(err, res);
    }
});

router.put('/update-password', async (req, res, next) => {
    try {
        await loginService.updatePassword(req);
        return res.sendStatus(200);
    } catch (err) {
        handleError(err, res);
    }
});

module.exports = router;
