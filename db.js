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
    console.log("getFromDBById: " + id);
    const data = envelopes.find(env => env.id === id);
    if (!data) {
        return null;
    } else {
        return data
    }
}

const getEnvelopeByCategory = category => {
    const envelope = envelopes.find(env => env.category === category);
    if (envelope) {
        return envelope;
    } else {
        console.log(`Could not find envelope with category ${category}`)
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

const deleteEnvelope = envelopeId => {
    const envelopes = getAllFromDB('envelopes');
    const envIndex = envelopes.findIndex(env => env.id === envelopeId);
    if (envIndex !== -1) {
        let deletedEnvelope = envelopes.splice(envIndex, 1);
        return deletedEnvelope;
    } else {
        console.log(`No envelope with id ${envelopeId}`)
    }
}

const addExpense = (amount, envelopeId) => {
    let envelope = getFromDBById('envelopes', envelopeId);
    if (envelope) {
        if (envelope.balance < amount) {
            return null
        }
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
    updateEnvelope,
    getEnvelopeByCategory,
    deleteEnvelope
}

