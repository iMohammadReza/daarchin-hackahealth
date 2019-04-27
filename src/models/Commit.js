const mongoose = require('mongoose')
const Schema = mongoose.Schema
var timestamps = require('mongoose-timestamp')

const CommitSchema = new Schema({
    action : { type : Schema.Types.ObjectId, ref : 'Action', required : true},
    user : { type : Schema.Types.ObjectId, ref : 'User', required : true},
    Value : { type: Object, required: true}
})

CommitSchema.plugin(timestamps)

module.exports = mongoose.model('Commit' , CommitSchema)