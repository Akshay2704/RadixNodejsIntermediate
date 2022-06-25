const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	userName: {
		type: String,
		trim: true,		
		required: true,
	},
	email: {
		type: String,
		trim: true,
        unique: true,
		required: true
	},
	password: {
		type: String,
		trim: true,
		required: true
	},
    accessToken: { 
        type: String 
    },
});


module.exports = mongoose.model('User', UserSchema);