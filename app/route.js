require('http')
var config = require('./methods/config')
var db = require('./methods/db')

module.exports = function(app){
    // comment because session is not ready
    // app.use(function(req, res, next){
    //     var _user = req.session._user
    //     app.local.user = _user
    //     next()
    // })

    app.use(function(req, res, next){
        var date = app.locals.moment(Date.now()).format('hh:mm:ss')
        console.log(date, req.ip, req.method, req.originalUrl)
        next()
    })
    // get access token
    app.use(function(req, res, next){
        // console.log('get AccessToken')
        if('' ===  app.locals.accessToken || Date.now() > app.locals.accessTokenExpired){
            console.log('---- token expired. need request.')
            config.getToken(function(token){
                app.locals.accessToken = token.access_token
                app.locals.accessTokenExpired = token.expires_in
                next()
            })
        }else{
            console.log("---- do not need request new token")
            next()
        }
    })
    // get ticket and signature
    app.use(function(req, res, next){
        if('' === app.locals.ticket || Date.now() > app.locals.ticketExpired){
            console.log('---- ticket expired. need requeset.')
            config.getTicket(app.locals.accessToken, function(ticket){
                app.locals.ticket = ticket.ticket
                app.locals.ticketExpired = ticket.expires_in
                app.locals.signature = config.getSign(ticket.ticket)
                next()
            })
        }else{
            console.log("---- do not need request new ticket")
            next()
        }
    })

    // 主页
    app.get('/', db.getAttend, function(req, res){
        res.render('index', {
            list: req.list
        })
    })
    // 扫描页面
    app.get('/scan', function(req, res){
        res.render('scan')
    })
    // 上传扫描结果
    app.post('/scan', function(req, res){
        var cardId = req.body.cardId
        var scanObj
        config.getOpenId(cardId, app.locals.accessToken, function(openId){
            var nickname = openId.nickname
            if(openId.errmsg === 'ok' && openId.has_active){
                scanObj = {
                    'nickname': nickname,
                    'timestamp': Date.now()
                }
                app.locals.ref.push(scanObj, function(err){
                    if(err){
                        res.send({success: 0, msg: err})
                    }else{
                        res.send({success: 1})
                    }
                })
            }
        })
    })
    // 确认签到结果
    app.post('/attend',function(req, res, next){
        app.locals.ref.remove()
        next()
    }, db.attend)
}