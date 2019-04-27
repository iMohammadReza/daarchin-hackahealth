const mongoose = require('mongoose')
const Schema = mongoose.Schema
var timestamps = require('mongoose-timestamp')

const TipSchema = new Schema({
    context : { type : String , required : true},
    cancer: {type: Boolean},
    sex : { type: Number}, //0: both, 1:female, 2:male
    tag : { type: Number},
    point : { type: Number}
})

TipSchema.plugin(timestamps)

module.exports = mongoose.model('Tip' , TipSchema)