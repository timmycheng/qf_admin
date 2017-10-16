var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId

var attendSchema = new mongoose.Schema({
    nickname: String,
    lesson: String,
    createAt: {
        type: Date,
        default: Date.now()
    },
})
var Attend = mongoose.model('attend', attendSchema)

module.exports = Attend