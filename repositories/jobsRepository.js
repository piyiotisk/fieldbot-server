const knex = require('../knex/knex');

const { getSignedUrl, deleteObject } = require('../utils/s3Util');

const mapDTOToDB = (job) => {
    const {
        name,
        description,
        status,
        address,
        companyId: fk_company_id,
        userId: fk_user_id,
        customerId: fk_customer_id,
        images,
        scheduledAt: scheduled_at
    } = job;

    const result = {
        name,
        description,
        status,
        address,
        fk_company_id,
        fk_user_id,
        fk_customer_id,
        images,
        scheduled_at
    }

    return result;
};


const mapDBToDTO = async (dbObject) => {
    let images;
    if (dbObject.images && dbObject.images.keys) {
        const imagesPromises = dbObject.images.keys.map(async (key) => {
            return { key, signedUrl: await getSignedUrl(key) }
        });
        images = await Promise.all(imagesPromises);
    }

    const {
        id,
        name,
        description,
        status,
        address,
        fk_company_id: companyId,
        fk_user_id: userId,
        fk_customer_id: customerId,
        scheduled_at: scheduledAt,
        updatedAt,
    } = dbObject;

    const result = {
        id,
        name,
        description,
        status,
        address,
        companyId,
        userId,
        customerId,
        images,
        scheduledAt,
        updatedAt
    }
    return result;
};

const mapTagsJobToDTO = (tags, job) => {
    let tagsDTO = null;
    if (tags) {
        tagsDTO = tags.map(tag => tag.value);
    };

    return {
        ...job,
        tags: tagsDTO
    }
};

const saveTags = async (job) => {
    const { tags } = job;
    if (tags) {
        const promises = tags.map(async (tag) => {
            return await knex('tags')
                .insert({
                    value: tag
                })
                .returning('*')
                .then((res) => res[0])
                .catch((err) => {
                    throw Error(`Saving a tag failed`);
                });
        });
        return Promise.all(promises);
    };
}

const createJobsTagsMappings = async (tags, job) => {
    if (tags) {
        const promises = tags.map(async (tag) => {
            return await knex('jobs_tags')
                .insert({
                    fk_job_id: job.id,
                    fk_tag_id: tag.id
                })
                .catch((err) => {
                    throw Error(`Creating a tag to job mapping failed`);
                });
        });
        return Promise.all(promises);
    };
};

const save = async (job) => {
    const savedTags = await saveTags(job);
    const dbObject = mapDTOToDB(job);
    const savedJob = await knex('jobs')
        .insert({
            createdAt: new Date(),
            ...dbObject
        })
        .returning('*')
        .then(async (res) => await mapDBToDTO(res[0]))
        .catch((err) => {
            throw Error(`Saving job: ${JSON.stringify(job)} failed`);
        });

    await createJobsTagsMappings(savedTags, savedJob);

    return mapTagsJobToDTO(savedTags, savedJob);
};

const update = async (job) => {
    if (job.tags) {
        await deleteTagsByJobId(job.id);
    }

    const savedTags = await saveTags(job);

    // delete all images and they will be reuploaded on update
    await deleteJobImages(job.id)

    const { id } = job;
    const dbObject = mapDTOToDB(job);

    const updatedJob = await knex('jobs')
        .where('id', '=', id)
        .update({
            updatedAt: new Date(),
            ...dbObject
        })
        .returning('*')
        .then(async (res) => await mapDBToDTO(res[0]))
        .catch((err) => {
            throw Error(`Updating job with id:${id} failed`);
        });

    await createJobsTagsMappings(savedTags, updatedJob);

    return mapTagsJobToDTO(savedTags, updatedJob);
};

const deleteTagsByJobId = async (id) => {
    let jobsTagsIDsToDelete = await knex('jobs_tags')
        .leftJoin('tags', 'jobs_tags.fk_tag_id', 'tags.id')
        .where('fk_job_id', '=', id)
        .select('jobs_tags.id')
        .catch((err) => {
            throw Error(`Finding jobs_tags ids to delete failed: ${err}`);
        });

    jobsTagsIDsToDelete = jobsTagsIDsToDelete.map(jobTags => jobTags.id);

    await knex('jobs_tags')
        .where('id', 'IN', jobsTagsIDsToDelete)
        .del()
        .catch((err) => {
            throw Error(`Deleting tags failed: ${err}`);
        });

    let tagsIDsToDelete = await knex('jobs_tags')
        .leftJoin('tags', 'jobs_tags.fk_tag_id', 'tags.id')
        .where('fk_job_id', '=', id)
        .select('tags.id')
        .catch((err) => {
            throw Error(`Finding tag ids to delete failed: ${err}`);
        });

    tagsIDsToDelete = tagsIDsToDelete.map(tag => tag.id);

    await knex('tags')
        .where('id', 'IN', tagsIDsToDelete)
        .del()
        .catch((err) => {
            throw Error(`Deleting tags failed: ${err}`);
        });
};

const findTagsByJobId = async (id) => {
    const tags = await knex('jobs_tags')
        .leftJoin('tags', 'jobs_tags.fk_tag_id', 'tags.id')
        .where('fk_job_id', '=', id)
        .orderBy('value')
        .catch((err) => {
            throw Error(`Finding tags for the job failed: ${err}`);
        });

    if (tags.length === 0 || tags === undefined) {
        return null;
    }
    return tags;
};

const findTagsByCompanyId = async (companyId) => {
    const jobs = await knex('jobs')
        .select('id')
        .where('fk_company_id', '=', companyId)
        .then((res) => {
            return res.map((job) => job.id)
        });


    const tagsIds = await knex('jobs_tags')
        .select('fk_tag_id')
        .where('fk_job_id', 'IN', jobs)
        .then((res) => {
            return res.map((tag) => tag.fk_tag_id)
        });


    const tags = await knex('tags')
        .select('*')
        .where('id', 'IN', tagsIds)
        .then((res) => {
            return res.map((tag) => tag.value)
        });
    const dedupTags = [...new Set(tags)];

    if (dedupTags.length === 0 || dedupTags === undefined) {
        return null;
    }
    return dedupTags;
}

const findJobById = async (id) => {
    const savedJob = await knex('jobs')
        .where('id', '=', id)
        .then(async (res) => await mapDBToDTO(res[0]))
        .catch((err) => {
            throw Error(`Finding job with id:${id} failed`);
        });

    const savedTags = await findTagsByJobId(id);
    return mapTagsJobToDTO(savedTags, savedJob);
};

const countJobsByCompanyIdAndStatus = async (id, status) => {
    return await knex('jobs')
        .where('fk_company_id', '=', id)
        .where('status', '=', status)
        .count()
        .then((res) => res[0].count)
        .catch((err) => {
            throw Error(`Counting jobs for a company with id:${id} and ${status} failed. ${err.message}`);
        });
};

const findJobsByCustomer = async (customerId) => {
    const savedJobsPromises = await knex('jobs')
        .where('fk_customer_id', '=', customerId)
        .then((res) => res.map(async (element) => await mapDBToDTO(element)))
        .catch((err) => {
            throw Error(`Finding jobs for a customer with id:${customerId} failed`);
        });

    const savedJobs = await Promise.all(savedJobsPromises);

    const promises = savedJobs.map(async (job) => {
        const savedTags = await findTagsByJobId(job.id);
        return mapTagsJobToDTO(savedTags, job);
    });
    return await Promise.all(promises);
};

const findJobsByStatus = async (companyId, status) => {
    const savedJobsPromises = await knex('jobs')
        .where('fk_company_id', '=', companyId)
        .where('status', '=', status)
        .then((res) => res.map(async (element) => await mapDBToDTO(element)))
        .catch((err) => {
            throw Error(`Finding jobs for a company with id:${companyId} and status ${status} failed`);
        });

    const savedJobs = await Promise.all(savedJobsPromises);

    const promises = savedJobs.map(async (job) => {
        const savedTags = await findTagsByJobId(job.id);
        return mapTagsJobToDTO(savedTags, job);
    });
    return await Promise.all(promises);
};

const deleteJob = async (id) => {
    const job = await findJobById(id);

    if (job.tags) {
        await deleteTagsByJobId(id);
    }

    await deleteJobImages(id)

    return await knex('jobs')
        .where('id', '=', id)
        .del()
        .catch((err) => {
            throw Error(`Deleting job with id:${id} failed with error: ${err.message}`);
        });
};

const deleteJobImages = async (jobId) => {
    const job = await findJobById(jobId);
    if (job.images && job.images.length > 0) {
        const keys = job.images.map((image) => image.key);
        const promises = keys.map(async (key) => await deleteObject(key));
        await Promise.all(promises);
    }
}

module.exports = { save, findJobById, findJobsByCustomer, deleteJob, update, findTagsByJobId, findTagsByCompanyId, countJobsByCompanyIdAndStatus, findJobsByStatus }
