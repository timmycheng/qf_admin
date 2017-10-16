function post(){
    // console.log('in', $('#cardId').val())
    if($('#cardId').val()){
        console.log('post')
        $.post(
            'scan',
            {'cardId': $('#cardId').val()},
            function(data){
                console.log(data)
            }    
        )
    }
}