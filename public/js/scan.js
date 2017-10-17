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
