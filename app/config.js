var https = require('https')
var http = require('http')
var crypto = require('crypto')
var hash = crypto.createHash('sha1')
var config_app = {
    appid: 'wxa6b156cea6fb64e9',
    secret: '5eff45b467d8aa27adecd65778867bc5'
}

exports.getToken = function(callback){
    console.log('* begin get Token here')
    var url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + config_app.appid + '&secret=' + config_app.secret
    var accessToken
    https.get(url, function(res){
        // console.log(res)
        res.setEncoding('utf8')
        res.on('data', function(chunk){
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

exports.getSign = function(ticket){
    var noncestr = 'Wm3WZYTPz0wzccnW'
    var timestamp = Math.round(Date.now()/1000)
    var url = 'http://timmycheng.cn/scan'
    var string = 'jsapi_ticket=' + ticket + '&noncestr=' + noncestr + "&timestamp=" + timestamp + "&url=" + url
    // console.log(string)
    hash.update(string, 'utf8')
    var sign = hash.digest('hex')
    return {
        'appid': config_app.appid,
        'timestamp': timestamp,
        'noncestr': noncestr,
        'signature': sign
    }
    
    
}