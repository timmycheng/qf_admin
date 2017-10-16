var mongoose = require('mongoose')
var ObjectId = mongoose.Schema.Types.ObjectId
var User = require('../models/user')

var attendSchema = new mongoose.Schema({
    nickname: String,
    lesson: String,
    createAt: {
        type: Date,
        default: Date.now()
    },
})
var Attend = mongoose.model('attend', attendSchema)


exports.attend = function(req, res){
    var attendObj = {
        'nickname': req.body.username,
        'lesson': req.body.lesson,
    }
    var _attend = new Attend(attendObj)
    _attend.save(function(err, recd){
        if(err){
            console.log(err)
        }
       res.redirect('/')
    })
}

exports.login = function(req, res){
    var _user = req.body.user
	var username = _user.username
	var password = _user.password

	User.findOne({username: username},function(err, user){
		if(err){
			console.log(err)
		}
		if(!user){
			console.log('用户不存在')
            // return res.redirect('/signup')
            return res.redirect('/')
		}
		
		user.comparePassword(password, function(err, isMatch){
			if(err){
				console.log(err)
			}
			if(isMatch){
				req.session.user = user
                console.log('密码匹配')
                // console.log(req.session.user)
				return res.redirect('/')
			}else{
				console.log('密码不匹配')
                // return res.redirect('/signin')
                return res.redirect('/')
				
			}
		})
	})
}

exports.getAttend = function(req, res, next){
    Attend
        .find({})
        .sort('creatAt')
        .exec(function(err, list){
            if(err){
                console.log(err)
            }
            req.list = list
            next()
        })
}