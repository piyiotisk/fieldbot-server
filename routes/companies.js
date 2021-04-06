const express = require('express');
const router = express.Router();
const companiesService = require('../services/companiesService');
const { auth } = require('../middleware/authorization');
const { handleError } = require('../utils/errorHandler');

router.use(auth);
// get all companies for a user
router.get('/', async (req, res, next) => {
    try {
        const response = await companiesService.getCompanyByUser(req);
        return res.status(200).json({ company: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const response = await companiesService.save(req);
        return res.status(201).json({ company: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.put('/', async (req, res, next) => {
    try {
        const response = await companiesService.update(req);
        return res.status(201).json({ company: response });
    } catch (err) {
        handleError(err, res);
    }
});

// TODO: Delete a company
module.exports = router;
