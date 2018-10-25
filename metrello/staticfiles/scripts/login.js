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
			
        	try{
				var res = JSON.parse(Req.responseText);            	
        	}catch(err){
				console.log('Respuesta no es json u otro : ' + err);
				console.log(Req.responseText)
			}

			if(Req.status == 500)
			{
				_info('Error en el servidor, contacte a soporte');
				return;
			}

			if(Req.status == 400)
			{
				_info('No se puede iniciar sesion con los datos proporcionados');
				return;
			}

			if(Req.status == 200)
			{
				HDD.set('jwt',res.token);
				setTimeout(function(){ location.href = '/dashboard/'; }, 50);
			}

        },//fin complete
    });
})