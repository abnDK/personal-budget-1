const express = require('express');
const {getAllFromDB, addToDB, getFromDBById, addExpense} = require('./db');
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

envelopesRouter.param('envelopeId', (req, res, next, id) => {
    let envelopeId = Number(id);
    if (Number.isInteger(envelopeId)) {
        req.envelopeId = envelopeId;
        next()
    } else {
        res.status(404).send('Envelope id has to be an integer.')
    }
    
});

envelopesRouter.get('/', (req, res, next) => {
    res.status(200).send(getAllFromDB('envelopes'));
})

envelopesRouter.post('/', validateEnvelope, (req, res, next) => {
    const envelope = req.body;
    const addedEnvelope = addToDB('envelopes', envelope);
    res.status(201).send(addedEnvelope);

})

envelopesRouter.get('/:envelopeId', (req, res, next) => {
    const envelope = getFromDBById('envelopes', req.envelopeId);
    if (envelope) {
        res.status(200).send(envelope);

    } else {
        res.status(400).send(`Envelope with id ${req.envelopeId} does not exist.`);
    }
});

envelopesRouter.put('/:envelopeId', (req, res, next) => {
    const expenseAmount = Number(req.body.amount);
    if (Number.isInteger(expenseAmount)) {
        const envelope = addExpense(expenseAmount, req.envelopeId);
        if (envelope) {
            res.status(200).send(envelope);
        } else {
            res.status(400).send(`Could not find envelope with id ${req.envelopeId}`)
        }
    } else {
        res.status(400).send('Request body did not contain any amount.')
    }
});

apiRouter.use('/envelopes', envelopesRouter);

// EXPENSE routes

/*
add expense, link it to envelope/category

or

PUT envelope/id { amount: xxx } => envelope balance -= amount ? 


*/



module.exports = apiRouter