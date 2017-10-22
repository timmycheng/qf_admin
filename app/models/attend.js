var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId
var AttendSchema = new mongoose.Schema({
    user: String,
    lesson: {
        type: ObjectId,
        ref: 'lesson'
    },
    createAt: {
        type: Date,
        default: Date.now()
    }
})
AttendSchema.pre('save', function(next){
    this.createAt = Date.now()
    next()
})
var Attend = mongoose.model('attend', AttendSchema)

module.exports = Attend