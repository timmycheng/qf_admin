var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')
var SALT_WORK_FACTOR = 10
var UserSchema = new mongoose.Schema({
	username: {
		unique: true,
		type: String
	},
	nickname: String,
	password: String,
	role: {
		type: Number,
		default: 0
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

UserSchema.pre('save', function(next){
	var user = this
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now()
	}
	else{
		this.meta.updateAt = Date.now()
	}
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
		if(err) return next(err)
			bcrypt.hash(user.password,salt, null, function(err, hash){
				if(err) return next(err)
				user.password = hash
				next()
			})
	})

	//next()
})
UserSchema.methods = {
	comparePassword:function(_password, cb){
		var password = this.password
		bcrypt.compare(_password, password, function(err, isMatch){
			if(err) return cb(err)
			cb(null, isMatch)
		})
	}
}

UserSchema.statics = {
	fetch:function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById:function(id, cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
}

var User = mongoose.model('User', UserSchema)

module.exports = User