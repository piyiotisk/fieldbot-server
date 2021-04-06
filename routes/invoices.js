const express = require('express');
const router = express.Router();
const invoicesService = require('../services/invoicesService');
const { auth } = require('../middleware/authorization');
const { handleError } = require('../utils/errorHandler');

router.use(auth);

router.get('/job/:id', async (req, res, next) => {
    try {
        const response = await invoicesService.findByJobId(req);
        return res.status(200).json({ invoice: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const response = await invoicesService.save(req);
        return res.status(201).json({ invoice: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const response = await invoicesService.update(req);
        return res.status(201).json({ invoice: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await invoicesService.deleteInvoice(req);
        return res.sendStatus(204);
    } catch (err) {
        handleError(err, res);
    }
});

module.exports = router;