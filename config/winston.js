const winston = require('winston');
const config = require('config');
const winstonOptions = config.get('winston');

// your centralized logger object
const logger = winston.createLogger({
    transports: [
        new (winston.transports.File)(winstonOptions.file)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

if (process.env.NODE_ENV !== 'production') {
    logger
        .clear()
        .add(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }));
}

// silence all logging when testing
if (process.env.NODE_ENV === 'test') {
    logger.transports.forEach((t) => (t.silent = true));
}

module.exports = logger;
