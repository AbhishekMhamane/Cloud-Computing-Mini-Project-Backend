const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

const fileRoutes = require('./routes/fileRoute');

const app = express();

require('dotenv').config();
const port = process.env.PORT || 5000;
const mongoDB_URL = process.env.MONGODB_URL;

app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.urlencoded());
app.use(express.json());

mongoose.connect(mongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/files',fileRoutes);

app.listen( port ,()=>{
    console.log('listening on port 3000');
})