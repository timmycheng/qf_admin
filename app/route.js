require('http')
var config = require('./config')
var db = require('./db')

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
                // console.log(token.access_token)
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
        // console.log('get apiTicket & signature')
        if('' === app.locals.ticket || Date.now() > app.locals.ticketExpired){
            console.log('---- ticket expired. need requeset.')
            config.getTicket(app.locals.accessToken, function(ticket){
                // console.log(ticket.ticket)
                app.locals.ticket = ticket.ticket
                app.locals.ticketExpired = ticket.expires_in
                app.locals.signature = config.getSign(ticket.ticket)
                // console.log(app.locals)
                next()
            })
        }else{
            console.log("---- do not need request new ticket")
            next()
        }
        // console.log('the access token is ', app.locals.accessToken)
    })

    // 主页
    app.get('/', function(req, res){
        console.log('index here')
        res.send('index here')
        // console.log(app.locals)
    })
    // 扫描功能
    app.get('/scan', function(req, res){
        // console.log('scan here')
        // res.send('scan here')
        // console.log(app.locals.accessToken)
        // console.log(app.locals.ticket)
        // console.log(app.locals.signature.signature)
        res.render('scan')
    })
    app.post('/scan', function(req, res){
        // console.log('post scan result')
        // console.log('req card id is: ', req.body.cardId)
        // console.log(app.locals.accessToken)
        var cardId = req.body.cardId
        var classId = req.body.classId
        // console.log(cardId)
        config.getOpenId(cardId, app.locals.accessToken, function(openId){
            db.attend(openId, classId, Date.now(), function(ret){
                res.status(200).send(ret)
            })           
        })
        
        res.send('post scan result')
    })
    // 用户
    app.get('/user/login', function(req, res){
        console.log('user login interface')
        res.send('user login interface')
    })
    app.post('/user/login', function(req, res){
        console.log('user login action')
        res.send('user login action')
    })
    app.get('/user/logout', function(req, res){
        console.log('user logout')
        res.send('user logout')
    })
    app.get('/user/:id', function(req, res){
        console.log('user information')
        res.send('user information')
    })
    // 课程
    app.get('/classid', function(req, res){
        console.log('class id')
        res.send('class id')
    })
    app.get('/class/list', function(req, res){
        console.log('class list')
        res.send('class list')
    })
    app.get('/class/:id', function(req, res){
        console.log('class information')
        res.send('class information')
    })
    app.post('/class', function(req, res){
        console.log('arrange classes')
        res.send('arrange classes')
    })


}