const express = require('express');
const app = express();
const port = 4001;

const bodyParser = require('body-parser');
const cors = require('cors');

const apiRouter = require('./api');

// MIDDLEWAREs

app.use(bodyParser.json());

app.use(cors())





app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.use('/api', apiRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
