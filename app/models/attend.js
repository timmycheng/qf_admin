var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

var AttendSchema = new mongoose.Schema({
    nickname: String,
    lesson: String,
    createAt: {
        type: Date,
        default: Date.now()
    },
})

AttendSchema.methods = {
    fetch: function(cb){
        return this
        .find({})
        .sort('createAt')
        .exec(cb)
    }
}

var Attend = mongoose.model('attend', AttendSchema)
module.exports = Attend