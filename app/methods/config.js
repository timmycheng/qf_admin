var https = require('https')
var http = require('http')
var crypto = require('crypto')
var hash = crypto.createHash('sha1')
var Url = require('url')
var config_app = {
    appid: 'wxa6b156cea6fb64e9',
    secret: '5eff45b467d8aa27adecd65778867bc5'
}
var config_card = {
    card_id: 'poLTHtzt_LCAezyRmqhCAAs2iei4'
}

// 获取access token
exports.getToken = function(callback){
    console.log('* begin get Token here')
    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config_app.appid + '&secret=' + config_app.secret
    var accessToken
    https.get(url, function(res){
        // console.log(res)
        res.setEncoding('utf8')
        res.on('data', function(chunk){
            // console.log(chunk)
            accessToken = JSON.parse(chunk)
            accessToken.expires_in = accessToken.expires_in * 1000 + Date.now()
        })
        res.on('end', function(){
            // console.log(accessToken)
            // return accessToken
            return callback(accessToken)
        })
    }).on('error', function(err){
        console.log('https get error: ', err)
    })
}

// 获取jsapi ticket
exports.getTicket = function(token, callback){
    console.log('* begin get ticket')
    var url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' + token + '&type=jsapi'
    // console.log(token)
    var ticket
    https.get(url, function(res){
        res.setEncoding('utf8')
        res.on('data', function(chunk){
            ticket = JSON.parse(chunk)
            ticket.expires_in = ticket.expires_in * 1000 + Date.now()
        })
        res.on('end', function(){
            return callback(ticket)
        })
    }).on('error', function(err){
        console.log('http get error: ', err)
    })
}

// 计算jssdk 签名
exports.getSign = function(ticket){
    var noncestr = 'Wm3WZYTPz0wzccnW'
    var timestamp = Math.round(Date.now()/1000)
    var url = 'http://timmycheng.cn:3009/scan'
    var string = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + "&timestamp=" + timestamp + "&url=" + url
    // console.log(string)
    hash.update(string, 'utf8')
    var sign = hash.digest('hex')
    // console.log(sign)
    return {
        'appid': config_app.appid,
        'timestamp': timestamp,
        'noncestr': noncestr,
        'signature': sign
    }
}

// 获取用户open id
exports.getOpenId = function(code, token, callback){
    console.log('get open id here')
    // console.log(token)
    var result
    var url = 'https://api.weixin.qq.com/card/membercard/userinfo/get?access_token=' + token
    var data = {
        "card_id": config_card.card_id,
        "code": code
    }
    // console.log(data)
    var opt = Url.parse(url)
    opt.method = 'POST'
    opt.headers = {
        "Content-Type": 'application/json',
        "Content-Length": JSON.stringify(data).length
    }
    var post = https.request(opt, function(res){
        res.on('data', function(chunk){
            result = JSON.parse(chunk)
        })
        .on('end', function(){
            return callback(result)
        })
    })
    post.write(JSON.stringify(data))
    post.end()
    
}

exports.getUserInfo = function(datestamp, callback){
    
}

exports.changeUserCredit = function(credit, code, token, callback){
    var result
    var url = 'https://api.weixin.qq.com/card/membercard/updateuser?access_token=' + token
    var data = {
        "code": code,
        "card_id": config_card.card_id,
        "add_bonus": credit,
        "notify_optional": {
            "is_notify_bonus": true
        }
    }
    var opt = Url.parse(url)
    opt.method = 'POST'
    opt.headers = {
        "Content-Type": 'application/json',
        "Content-Length": JSON.stringify(data).length
    }
    var post = https.request(opt, function(res){
        res.on('data', function(chunk){
            result = JSON.parse(chunk)
        })
        .on('end', function(){
            return callback(result)
        })
    })
    post.write(JSON.stringify(data))
    post.end()
}

