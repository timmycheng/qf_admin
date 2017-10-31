function post(){
    // console.log('in', $('#cardId').val())
    if($('#cardId').val()){
        // console.log('post')
        var loading = weui.loading('loading')
        $.post(
            'scan',
            {'cardId': $('#cardId').val()},
            function(data){
                // console.log(data)
                // alert(data)
                loading.hide(function(){
                    if(data.success)
                    {
                        weui.alert('成功！')
                        $('#cardId').val('')
                    }else{
                        weui.alert('卡号错误，请检查卡号！')
                    }
                })
            }    
        )
    }
}
function scan(){
    //- console.log('in')
    wx.scanQRCode({
        needResult: 1,
        scanType: ['qrCode', 'barCode'],
        success: function(res){
            //- console.log(res)
            $('#cardId').val(res.resultStr)
        }
    })
}
function startRecord(){
    wx.startRecord()
}
function stopRecord(){
    wx.stopRecord({
        success: function(res){
            alert(res.localId)
        }
    })
}