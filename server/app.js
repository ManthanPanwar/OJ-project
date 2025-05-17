require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middlewares/errorHandler');
const dbConnection = require('./config/db'); 

const app = express();
dbConnection();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/users', require('./routes/userRoutes'));
app.use(errorHandler)

module.exports = app;