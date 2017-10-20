var mongoose = require('mongoose')
var LessonSchema = new mongoose.Schema({
    name: String,
    teacher: String,
    times: {
        week: Number,
        timeBegin: Number,
        timeEnd: Number,
    }, 
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }

})

LessonSchema.pre('save', function(next){
    if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
    }
    next()
})

LessonSchema.statics = {
    fetch: function(cb){
        return this
                .find({})
                .sort('meta.createAt')
                .exec(cb)
    },
    findById: function(id, cb){
        return this
                .find({_id: id})
                .exec(cb)
    }
}

var Lesson = mongoose.model('lesson', LessonSchema)
module.exports = Lesson