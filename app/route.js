

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

    app.use(function(req, res, next){
        console.log('get AccessToken')
        next()
    })

    app.use(function(req, res, next){
        console.log('get apiTicket & signature')
        next()
    })

    // 主页
    app.get('/', function(req, res){
        console.log('index here')
        res.send('index here')
    })
    // 扫描功能
    app.get('/scan', function(req, res){
        console.log('scan here')
        res.send('scan here')
    })
    app.post('/scan', function(req, res){
        console.log('post scan result')
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