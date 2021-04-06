const axios = require('axios');

const convertImageToBase64 = async (imageUrl) => {
    let image = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    return Buffer.from(image.data, 'base64').toString('base64');
}

const convertImagesToFiles = async (images) => {
    if (!images || images.length === 0) {
        return;
    }

    const filePromises = await images.map(async (image) => {
        return {
            key: image.key,
            content: await convertImageToBase64(image.signedUrl)
        }
    });

    const files = await Promise.all(filePromises);

    const attachments = files.map((file) => {
        return {
            filename: file.key,
            encoding: 'base64',
            content: file.content
        }
    });

    return attachments;
}

const productionEmail = async (from, to, cc, customer, job) => {
    const { firstName, lastName, phone } = customer;
    const { id, name, description, images } = job;

    const attachments = await convertImagesToFiles(images);

    return {
        from: from, // sender address
        to: to,
        subject: `Details about job: ${id}`, // Subject line
        attachments,
        html:
            `<!DOCTYPE html>
            <html>
            <body>
            
            <h1>Job: ${id} for ${firstName} ${lastName}</h1>
            <h2>Customer details: </h2>
            <p> Phone: ${phone}</p>
            
            <h2>Job details:</h2>
            <p>Name: ${name}</p>
            <p>Description: ${description}</p>
            </body>
            </html>
            `
        ,
    }
};

module.exports = productionEmail;