const express = require('express');
const {getAllFromDB, addToDB, getFromDBById} = require('./db');
const apiRouter = express.Router();



// ENVELOPES routes
const envelopesRouter = express.Router();

const validateEnvelope = (req, res, next) => {
    console.log('validating envelope...')
    
    const knownCategories = getAllFromDB('envelopes').map(env => env.category);
    console.log(knownCategories);
    
    console.log(req.body);
    if (!req.body.category || !req.body.balance) {
        console.log('envelope either lacks category or balance...')
        res.status(404).send();
    } else if (knownCategories.includes(req.body.category)) {
        console.log('envelope category already known');
        res.status(400).send();
    } else {
        console.log('envelope looks valid...')
        next()
    }
}

envelopesRouter.get('/', (req, res, next) => {
    res.status(200).send(getAllFromDB('envelopes'));
})

envelopesRouter.post('/', validateEnvelope, (req, res, next) => {
    const envelope = req.body;
    const addedEnvelope = addToDB('envelopes', envelope);
    res.status(201).send(addedEnvelope);

})

// TODO 
// + do envelopesRouter.param('envelopeId', (req, res, next, id)...)
// test it with postman

envelopesRouter.param('envelopeId', (req, res, next, id) => {
    let envelopeId = Number(id);
    if (Number.isInteger(envelopeId)) {
        req.envelopeId = envelopeId;
        next()
    } else {
        res.status(404).send('Envelope id has to be an integer.')
    }
    
});

envelopesRouter.get('/:envelopeId', (req, res, next) => {
    const envelope = getFromDBById('envelopes', req.envelopeId);
    if (envelope) {
        res.status(200).send(envelope);

    } else {
        res.status(400).send(`Envelope with id ${req.envelopeId} does not exist.`);
    }
});

apiRouter.use('/envelopes', envelopesRouter);



// BALANCE / TRANSACTIONs routes



module.exports = apiRouter