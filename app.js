const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const morgan = require('morgan');
const winston = require('./config/winston');

const healthcheckRouter = require('./routes/healthcheck');
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const verifyRouter = require('./routes/verify');
const companiesRouter = require('./routes/companies');
const customersRouter = require('./routes/customers');
const jobsRouter = require('./routes/jobs');
const invoicesRouter = require('./routes/invoices');

const app = express();

// disable some express headers to improve performance
app.disable('etag').disable('x-powered-by');

app.use(morgan('combined', { stream: winston.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());
app.options('*', cors());

// Routes
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
app.use('/verify', verifyRouter);
app.use('/healthcheck', healthcheckRouter);
app.use('/companies', companiesRouter);
app.use('/customers', customersRouter);
app.use('/jobs', jobsRouter);
app.use('/invoices', invoicesRouter);

module.exports = app;
