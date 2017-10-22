var express = require('express')
var session = require('express-session')
var path = require('path')
var port =  process.env.PORT || 3009
var app = express()

var bodyParser = require('body-parser')
var serveStatic = require('serve-static')
var cookieParser = require('cookie-parser')

var mongoose = require('mongoose')
var mongoStore = require('connect-mongo')(session)
var mongoUrl = 'mongodb://timmycheng.cn:27017/qf-admin'

var wilddog = require('wilddog')
var wd_config = {
	syncURL: "https://wd1656114870exzhuv.wilddogio.com"
}
wilddog.initializeApp(wd_config)

// 设置
mongoose.Promise = global.Promise

app.set('views', './app/views')
app.set('view engine', 'pug')
app.use(bodyParser.json())

app.use(cookieParser())
app.use(require('connect-multiparty')())

app.use(session({
	secret: 'qf',
	store:new mongoStore({
		url: mongoUrl,
		collection: 'sessions'
	}),
	resave: false,
    saveUninitialized: true
}))

app.use(bodyParser.urlencoded({
	extended: true,
}))

app.use(express.static(path.join(__dirname, 'public')))
app.locals.moment = require('moment')
app.locals.accessToken = ''
app.locals.accessTokenExpired = ''
app.locals.ticket = ''
app.locals.ticketExpired = ''
app.locals.ref = wilddog.sync().ref('scanObj')



// 启动服务
app.listen(port)

require('./app/route')(app)

mongoose.connect(mongoUrl, {useMongoClient: true}, function(err){
	if (err) console.log('Connet to MongoDB err', err)
	else console.log('Start web server at', port, '...')
})


