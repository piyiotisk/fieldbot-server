const uuid = require('uuid');

const jobsRepository = require('../repositories/jobsRepository');
const userRepository = require('../repositories/userRepository');
const customersRepository = require('../repositories/customersRepository');
const { isJobValid } = require('../validators/jobsValidator');
const s3Util = require('../utils/s3Util');
const emailService = require('./emailService/emailService');
const email = require('../services/emailService/emailTemplates/emailJobProduction');
const companiesRepository = require('../repositories/companiesRepository');

const save = async (req) => {
    if (!isJobValid(req)) {
        const error = Error('Job object does not pass validation');
        error.status = 400;
        throw error;
    }

    const job = req.body;
    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id } = user;

    if (!fk_company_id) {
        const error = Error('User does not have a company');
        error.status = 400;
        throw error;
    }

    const jobToSave = {
        ...job,
        companyId: fk_company_id
    }
    return await jobsRepository.save(jobToSave);
}


const update = async (req) => {
    if (!isJobValid(req)) {
        const error = Error('Job object does not pass validation');
        error.status = 400;
        throw error;
    }

    const job = req.body;
    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id } = user;

    if (!fk_company_id) {
        const error = Error('User does not have a company');
        error.status = 400;
        throw error;
    }

    const id = parseInt(req.params.id);
    const jobToUpdate = {
        id,
        ...job,
        companyId: fk_company_id
    }

    return await jobsRepository.update(jobToUpdate);
}

const findTagsByCompanyId = async (req) => {
    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id } = user;

    if (!fk_company_id) {
        const error = Error('User does not have a company');
        error.status = 400;
        throw error;
    }

    return await jobsRepository.findTagsByCompanyId(fk_company_id);
}

const findJobsByCustomer = async (req) => {
    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id } = user;

    // TODO: check if customer belong to this company
    const customerId = parseInt(req.params.customerId);
    return await jobsRepository.findJobsByCustomer(customerId);
}

const deleteJobById = async (req) => {
    // TODO: check that user is authorized to delete job
    const jobId = req.params.id;

    return await jobsRepository.deleteJob(jobId);
}

const findJobById = async (req) => {
    const jobId = req.params.id;

    return await jobsRepository.findJobById(jobId);
};

const jobCounts = async (req) => {
    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id: companyId } = user;

    const pendingJobsCount = await jobsRepository.countJobsByCompanyIdAndStatus(companyId, 'PENDING');
    const inProgressJobsCount = await jobsRepository.countJobsByCompanyIdAndStatus(companyId, 'IN_PROGRESS');
    const finishedJobCounts = await jobsRepository.countJobsByCompanyIdAndStatus(companyId, 'FINISHED');

    return { pendingJobsCount, inProgressJobsCount, finishedJobCounts }
}

const pendingJobs = async (req) => {
    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id: companyId } = user;

    return await jobsRepository.findJobsByStatus(companyId, 'PENDING');
}

const inProgressJobs = async (req) => {
    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id: companyId } = user;

    return await jobsRepository.findJobsByStatus(companyId, 'IN_PROGRESS');
}

const finishedJobs = async (req) => {
    const { fromDate, toDate } = req.query;
    const from = new Date(fromDate);
    const to = new Date(toDate);

    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id: companyId } = user;

    const jobs = await jobsRepository.findJobsByStatus(companyId, 'FINISHED');
    return jobs.filter((job) => job.updatedAt >= from && job.updatedAt <= to);
}

const generatePutObjectSignedUrl = async (req) => {
    const { file } = req.body;
    const mimeType = file.type
    const fileExtension = mimeType.slice(6);

    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id } = user;

    // companyId/uuid.png
    const key = `${fk_company_id}/${uuid.v4()}.${fileExtension}`;

    return await s3Util.generatePutObjectSignedUrl(key, mimeType);
}

const sendJobByEmail = async (req) => {
    // TODO: validate req
    // Get user email from req JWT token
    const user = await userRepository.getUserByEmail(req.userEmail);
    const { fk_company_id: companyId } = user;

    // Get company's email
    const { email: from } = await companiesRepository.findCompanyById(companyId);

    if (!from) {
        return Error(`Please add an email address to your companies settings`);
    }

    // Find job
    const jobId = parseInt(req.params.id);
    const job = await jobsRepository.findJobById(jobId);

    // check if job belongs to the company requesting to send the email
    if (job.companyId !== companyId) {
        return Error(`Job with id: ${jobId}, does not belong to user: ${JSON.stringify(user)}`);
    }

    // Get customer info
    const customer = await customersRepository.findCustomerById(job.customerId, companyId);
    const { emailTo: to, emailCc: cc } = req.body;
    const htmlEmail = await email(from, to, cc, customer, job);

    // send email
    await emailService.send(htmlEmail);
}

module.exports = { save, findTagsByCompanyId, findJobsByCustomer, update, deleteJobById, findJobById, generatePutObjectSignedUrl, sendJobByEmail, jobCounts, pendingJobs, inProgressJobs, finishedJobs }