const express = require('express');
const {
    getAllFromDB,
    addToDB, 
    getFromDBById,
    addExpense, 
    updateEnvelope, 
    getEnvelopeByCategory, 
    deleteEnvelope
} = require('./db');
const envelopes = require('./envelopes');
const apiRouter = express.Router();



// ENVELOPES routes
const envelopesRouter = express.Router();

const validateNewEnvelope = (req, res, next) => {
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

envelopesRouter.param('expenseAmount', (req, res, next, amount) => {
    const expenseAmount = Number(amount);
    if (Number.isNaN(expenseAmount)) {
        // not a clean number. Probably lettes in amount...
        res.status(404).send('Expense amount has to be a number.')
    } else {
        req.expenseAmount = expenseAmount;
        next();
    }
})

envelopesRouter.get('/', (req, res, next) => {
    res.status(200).send(getAllFromDB('envelopes'));
})

envelopesRouter.post('/', validateNewEnvelope, (req, res, next) => {
    const envelope = req.body;
    const addedEnvelope = addToDB('envelopes', envelope);
    res.status(201).send(addedEnvelope);

})


// Transfer budget from one envelope to another
envelopesRouter.post('/transfer/:from/:to', (req, res, next) => {
    const transferRequest = req.body;
    const fromEnvelopeId = Number(req.params.from);
    const toEnvelopeId = Number(req.params.to);
    const amount = transferRequest.amount;

    const fromEnvelope = getFromDBById('envelopes', fromEnvelopeId);
    const toEnvelope = getFromDBById('envelopes', toEnvelopeId);

    if (fromEnvelope && toEnvelope) {

        fromEnvelope.balance -= amount;
        toEnvelope.balance += amount;
    
        updatedFromEnvelope = updateEnvelope(fromEnvelope, fromEnvelopeId);
        updatedToEnvelope = updateEnvelope(toEnvelope, toEnvelopeId);
    
        res.status(200).send({updatedFromEnvelope, updatedToEnvelope})
    } else {
        res.status(400).send('something went wrong transfering funds from one envelope to another.')
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

// PUT for updating balance of envelope
envelopesRouter.put('/:envelopeId', (req, res, next) => {
    const updatedEnvelope = req.body;
    
    const envelope = updateEnvelope(updatedEnvelope, req.envelopeId);
    if (envelope) {
        res.status(200).send(envelope);
    } else {
        res.status(400).send(`Either invalid id or invalid data types.`)
    }
});

// POST and GET route to add expense / withdraw from envelope balance.

envelopesRouter.post('/:envelopeId', (req, res, next) => {
    const expense = req.body.expense;
    console.log(req.envelopeId);
    const envelope = getFromDBById('envelopes', req.envelopeId);
    console.log(envelope)
    if (expense > envelope.balance) {
        res.status(400).send('Expense larger than balance. Cannot withdraw.')
    }
    if (!Number.isNaN(Number(expense))) {
        const updatedEnvelope = addExpense(expense, req.envelopeId);
        res.status(200).send(updatedEnvelope);
    } else {
        res.status(400).send('Expense datatype has to be a number.')
    }
    
})

envelopesRouter.get('/:envelopeId/:expenseAmount', (req, res, next) => {
    const envelope = getFromDBById('envelopes', req.envelopeId);
    if (req.expenseAmount > envelope.balance) {
        res.status(400).send('Expense larger than balance. Cannot withdraw.');
    }
    const updatedEnvelope = addExpense(req.expenseAmount, req.envelopeId);
    if (updatedEnvelope) {
        res.status(200).send(updatedEnvelope);
    } else {
        res.status(400).send(`Could not find envelope with id ${req.envelopeId}`)
    }
    
})


// DELETE envelope route

envelopesRouter.delete('/:envelopeId', (req, res, next) => {
    const deletedEnvelope = deleteEnvelope(req.envelopeId);
    res.status(200).send(deletedEnvelope);
})



apiRouter.use('/envelopes', envelopesRouter);

// EXPENSE routes

/*
add expense, link it to envelope/category

or

PUT envelope/id { amount: xxx } => envelope balance -= amount ? 


*/



module.exports = apiRouter