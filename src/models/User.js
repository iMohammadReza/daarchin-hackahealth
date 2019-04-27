const mongoose = require('mongoose')
const Schema = mongoose.Schema
var timestamps = require('mongoose-timestamp')

const UserSchema = new Schema({
    name : { type : String , required : true},
    phone : { type: String, required : true},
    phone2 : { type: String, required : true},
    score : { type: Number, default: 0},
    game : { type: Object, default: []},
    cencer : {type: Boolean, required: true},
    periodDay : { type: Number, default: -1},
    age : { type: Number, required: true},
    sex : { type: Number, required: true} //0: undefined, 1:female, 2:male
})

UserSchema.plugin(timestamps)

module.exports = mongoose.model('User' , UserSchema)