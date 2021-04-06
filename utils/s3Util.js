const aws = require('aws-sdk');
const spacesEndpoint = new aws.Endpoint('ams3.digitaloceanspaces.com');

aws.config.update({
    secretAccessKey: 'secret',
    accessKeyId: 'secret',
    endpoint: spacesEndpoint,
    signatureVersion: 'v4',
    region: 'ams3'
});

// Set S3 endpoint to DigitalOcean Spaces
const s3 = new aws.S3();

const getSignedUrl = async (key) => {

    // get task id from the body
    // check if the task id belong to the customer
    // if yes, then get the keys return the urls
    const s3GetObjectParams = {
        Bucket: 'fieldbot',
        Key: key,
        Expires: 60,
    };

    return new Promise((resolve, reject) => {
        s3.getSignedUrl('getObject', s3GetObjectParams, (err, url) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(url);
            }
        });
    });
};

const generatePutObjectSignedUrl = async (key, mimeType) => {

    const s3PutObjectParams = {
        Bucket: 'fieldbot',
        Key: key,
        ContentType: mimeType,
        ACL: 'private',
        // expires in 10 minutes
        Expires: 600,
    };

    const putObjectSignedUrl = () => new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', s3PutObjectParams, (err, url) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(url);
            }
        });
    });

    const result = {
        signedUrl: await putObjectSignedUrl(),
        key
    };

    return result;
};

const deleteObject = async (key) => {

    const s3DeleteObjectParams = {
        Bucket: 'fieldbot',
        Key: key,
    }

    const deleteObject = () => new Promise((resolve, reject) => {
        s3.deleteObject(s3DeleteObjectParams, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data);
            }
        });
    });

    const result = {
        data: await deleteObject(),
    }

    return result;

}

module.exports = { getSignedUrl, generatePutObjectSignedUrl, deleteObject }