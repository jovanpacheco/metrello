/*usuario_conectado(function(){
	location.href = '/dashboard/'
},
false);*/

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


$("#btn_registro").on("click",function(){

	if($("#first_name").val() != "" && $("#email").val() != ""
		&& $("#last_name").val() !== "" && $("#password1").val())
	{

	if($("#password1").val() != $("#password2").val())
	{
		_info('Las claves no coinciden');

	}

    $.ajax({
        type: 'POST',
        url:  '/api/users/',
        data: {
          "first_name": $("#first_name").val(),
		  "last_name": $("#last_name").val(),
		  "email": $("#email").val(),
		  "password": $("#password1").val(),
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
				_info('No se puede registrar con los datos suministrados');
				return;
			}

			if(Req.status == 201)
			{
				HDD.set('jwt',res.token);
				HDD.set('username',res.username);
				setTimeout(function(){ location.href = '/dashboard/'; }, 50);
			}

        },//fin complete
    });
	}
	else
	{
		_info('Complete todos los datos');
	}

});