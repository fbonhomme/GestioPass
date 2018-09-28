const mongoose = require('mongoose');
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: 'string',
    lastName: 'string',
    email: {
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    updated: { 
        type: Date, 
        default: Date.now 
    }
});

mongoose.model('User', userSchema);

