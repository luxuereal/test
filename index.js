// Require dependencies
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/animation', express.static(path.join(__dirname, 'animation')))
// Handle files auto
app.listen(3000, '127.0.0.1', () => {
    console.log('Server started on port 3000');
});
