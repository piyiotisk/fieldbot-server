const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/authorization');
const { handleError } = require('../utils/errorHandler');

const jobsService = require('../services/jobsService');
router.use(auth);

router.post('/images/uploadUrl', async (req, res) => {
    const response = await jobsService.generatePutObjectSignedUrl(req);
    return res.status(200).json({ signedUrl: response.signedUrl, key: response.key });
});

router.post('/', async (req, res) => {
    try {
        const response = await jobsService.save(req);
        return res.status(201).json({ job: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.get('/tags', async (req, res) => {
    try {
        const response = await jobsService.findTagsByCompanyId(req)
        return res.status(200).json({ tags: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.get('/customer/:customerId', async (req, res) => {
    try {
        const response = await jobsService.findJobsByCustomer(req);
        return res.status(200).json({ jobs: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const response = await jobsService.update(req);
        return res.status(200).json({ job: response });
    } catch (err) {
        handleError(err, res);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await jobsService.deleteJobById(req);
        return res.sendStatus(204);
    } catch (err) {
        handleError(err, res);
    }
});

router.get('/counts', async (req, res) => {
    try {
        const response = await jobsService.jobCounts(req);
        return res.status(200).json({ jobCounts: response });
    } catch (err) {
        handleError(err, res);
    }
})

router.get('/pending', async (req, res) => {
    try {
        const response = await jobsService.pendingJobs(req);
        return res.status(200).json({ jobs: response });
    } catch (err) {
        handleError(err, res);
    }
})

router.get('/inprogress', async (req, res) => {
    try {
        const response = await jobsService.inProgressJobs(req);
        return res.status(200).json({ jobs: response });
    } catch (err) {
        handleError(err, res);
    }
})

router.get('/finished', async (req, res) => {
    try {
        const response = await jobsService.finishedJobs(req);
        return res.status(200).json({ jobs: response });
    } catch (err) {
        handleError(err, res);
    }
})

router.get('/:id', async (req, res) => {
    try {
        const response = await jobsService.findJobById(req);
        return res.status(200).json({ job: response });
    } catch (err) {
        handleError(err, res);
    }
})

router.post('/:id/email', async (req, res) => {
    try {
        await jobsService.sendJobByEmail(req);
        return res.sendStatus(200);
    } catch (err) {
        handleError(err, res);
    }
});

module.exports = router;