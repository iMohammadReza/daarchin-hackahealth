const mongoose = require('mongoose')
const Schema = mongoose.Schema
var timestamps = require('mongoose-timestamp')

const ActionSchema = new Schema({
    text : { type: String, required : true},
    type : { type : String, required : true}, //bool, selfExamination, weight
    point : { type: Number, required : true},
    qid: { type: String},
    cancer: {type: Boolean},
    sex : { type: Number}, //0: both, 1:female, 2:male
    tag : { type: Number}
})

ActionSchema.plugin(timestamps)

module.exports = mongoose.model('Action' , ActionSchema)