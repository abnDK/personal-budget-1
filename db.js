const envelopes = require('./envelopes');

const getAllFromDB = model => {
    
    model = model.toLowerCase();
    
    switch (model) {
        case 'envelopes':
            return envelopes;
        case 'transaction':
            console.log('TODO: transactions file - is it the right model name?')
        default:
            console.log('Please provide known model name...');
    }
}

const getFromDBById = (model, id) => {
    const data = envelopes.find(env => env.id === id);
    console.log(id);
    if (!data) {
        return null;
    } else {
        return data
    }
}

const addToDB = (model, data) => {
    
    let container;
    
    switch (model) {
        case 'envelopes':
            container = envelopes;
            break;
        case 'transaction':
            console.log('TODO: transactions file - is it the right model name?')
            break;
        default:
            console.log('Please provide known model name...');
            return null;
    }

    console.log('adding data to container...')

    data.id = setId(container);

    container.push(data);

    return data;

}

const updateEnvelope = (updatedEnvelope, envelopeId) => {
    let targetEnvelope = envelopes.find(env => env.id === envelopeId);
    if (targetEnvelope) {
        if (typeof updatedEnvelope.category === 'string') {
            targetEnvelope.category = updatedEnvelope.category;
        }
        if (!Number.isNaN(Number(updatedEnvelope.balance))) {
            targetEnvelope.balance = updatedEnvelope.balance;
        }
        if (typeof updatedEnvelope.description === 'string') {
            targetEnvelope.description = updatedEnvelope.description;
        }
        return targetEnvelope;
    } else {
        return null
    }
}

const addExpense = (amount, envelopeId) => {
    let envelope = getFromDBById('envelopes', envelopeId);
    if (envelope) {
        envelope.balance -= amount;
        return envelope;
    } else {
        return null;
    }
}

const setId = container => {
  
    let IDs = container.map(elem => Number(elem.id));

    // works since ECMAscript 6 - "..." = spread operator. See https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript for more
    let maxId = Math.max(...IDs);
    
    return maxId + 1;
}

module.exports = {
    getAllFromDB,
    addToDB,
    getFromDBById,
    addExpense,
    updateEnvelope
}

