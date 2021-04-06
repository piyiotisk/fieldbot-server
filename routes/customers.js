const express = require('express');
const router = express.Router();
const customersService = require('../services/customersService');
const { auth } = require('../middleware/authorization');
const { handleError } = require('../utils/errorHandler');

// use auth for every route
router.use(auth);

router.get('/', async (req, res, next) => {
    try {
        const response = await customersService.findCustomersByCompanyId(req);
        return res.status(200).json({ customers: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.get('/count', async (req, res, next) => {
    try {
        const response = await customersService.countCustomersByCompanyId(req);
        return res.status(200).json({ count: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const response = await customersService.findCustomerById(req);
        return res.status(200).json({ customer: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.get('/search/:searchTerm', async (req, res, next) => {
    try {
        const response = await customersService.searchCustomersByCompanyId(req);
        return res.status(200).json({ customers: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const response = await customersService.save(req);
        return res.status(201).json({ customer: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const response = await customersService.update(req, parseInt(req.params.id));
        return res.status(200).json({ customer: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        await customersService.deleteCustomer(req, parseInt(req.params.id));
        return res.sendStatus(200);
    } catch (err) {
        handleError(err, res);
    }
});


module.exports = router;
