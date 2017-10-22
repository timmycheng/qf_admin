var mongoose = require('mongoose')
var User = require('../models/user')
var Attend = require('../models/attend')
var Lesson = require('../models/lesson')
var moment = require('moment')

// 参加课程 － 签到
exports.addAttend = function(req, res){
    // console.log(req.body)
    var attendObj = {
        'user': req.body.username,
        'lesson': req.body.lesson,
    }
    var _attend = new Attend(attendObj)
    // console.log(_attend)
    _attend.save(function(err, recd){
        if(err){
            console.log(err)
        }
       res.redirect('/')
    })
}

// 添加课程
exports.addLesson = function(req, res){
    var lessonObj = {
        'name': req.body.name,
        'teacher': req.body.teacher,
        'times': req.body.times
    }
    // console.log(lessonObj)
    var _lesson = new Lesson(lessonObj)
    // console.log(_lesson)
    _lesson.save(function(err, lesn){
        if(err){
            console.log(err)
        }
        // console.log('done', lesn)
        res.redirect('/')
    })
}

// 用户登录
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

// 获取签到清单 － 签到表
exports.getAttend = function(req, res, next){
    Attend
        .find({})
        .populate('lesson', 'name')
        .sort('creatAt')
        .exec(function(err, list){
            if(err){
                console.log(err)
            }else{
                req.list = list
            }
            next()
        })
}

// 获取课程清单 － 课程表
exports.getLesson = function(req, res, next){
    Lesson
        .find({})
        .sort('createAt')
        .exec(function(err, lessons){
            if(err){
                console.log(err)
            }else{
                req.lessons = lessons
            }
            next()
        })
}

// 获取目前可签到的课程
exports.getLesTime = function(req, res){
    var weekday = moment().isoWeekday()
    // console.log(weekday,typeof(weekday))
    var time = parseInt(moment().format('HHmm'))
    // console.log(time,typeof(time))
    Lesson
        .find({
            'times.week': weekday,
            'times.timeBegin': {$lt: time},
            'times.timeEnd': {$gt: time}
        })
        .sort('createAt')
        .exec(function(err, lesn){
            if(err){
                console.log(err)
            }else{
                // console.log(lesn)
                res.send(lesn)
            }
            
        })
}