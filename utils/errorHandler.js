const winston = require('./../config/winston');

const handleError = (error, res) => {
    winston.error(`${error.status} - ${error.message}`);

    if (error.status === 401) {
        return res.status(401).json({ error: error.message });
    }

    if (error.status === 403) {
        return res.status(403).json({ error: error.message });
    }

    if (error.status === 404) {
        return res.status(404).json({ error: error.message });
    }

    if (error.status === 409) {
        return res.status(409).json({ error: error.message });
    }

    if (error.status === 500) {
        return res.status(500).json({ error: error.message });
    }

    return res.sendStatus(500);
}

module.exports = { handleError };