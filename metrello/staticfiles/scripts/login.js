$("#btn_login").on("click",function(){
    $.ajax({
        type: 'POST',
        url:  '/auth/obtain_token/',
        data: {
		  "username": $("#username").val(),
		  "password": $("#password").val(),
        },
        complete: function (Req, textStatus)
        {
			
			alert(Req.status);
        	try{
				var res = JSON.parse(Req.responseText);            	
        	}catch(err){
				console.log('Respuesta no es json u otro : ' + err);
				console.log(Req.responseText)
				return false;
			}

        },//fin complete
    });
})