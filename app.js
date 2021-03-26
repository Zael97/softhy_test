const express = require('express');
const router = require('./routes/routes');
const app = express();
const cors = require('cors');
const corsOptions = {
    "Access-Control-Allow-Origin": "http://localhost:8080"
}
app.use(cors(corsOptions));
app.use(express.static('uploads'));
app.use(router);
module.exports = app;

