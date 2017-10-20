var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

var AttendSchema = new mongoose.Schema({
    nickname: String,
    lesson: String,
    createAt: Date
})

AttendSchema.pre('save', function(next){
    this.createAt = Date.now()
    next()
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