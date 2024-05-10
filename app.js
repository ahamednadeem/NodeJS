const express = require('express');
const bodyParser = require('body-parser'); 
const morgan = require('morgan');
const dotenv = require('dotenv');

// configure dotenv
dotenv.config();
const app = express();
app.use(express.json())
const port = process.env.PORT;

// Parsing middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(morgan('dev'));

const routes = require('./routes/user');
app.use('/user', routes);

// Start the server
app.listen(port, () => console.log(`Listening on port ${process.env.PORT}`));
