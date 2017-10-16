function post(){
    // console.log('in', $('#cardId').val())
    if($('#cardId').val()){
        console.log('post')
        $.post(
            'scan',
            {'cardId': $('#cardId').val()},
            function(data){
                // console.log(data)
                // alert(data)
                if(data.success)
                {
                    alert('成功！')
                    $('#cardId').val('')
                }else{
                    alert('卡号错误，请检查卡号！')
                }
            }    
        )
    }
}