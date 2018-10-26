(function( window, undefined ){

usuario_conectado(function(){


$("#btn_clave").on("click",function(){

	if($("#password1").val() != $("#password2").val())
	{
		_info('Las claves no coinciden');
	}
	else
	{
	    $.ajax({
	        type: 'POST',
	        url:  '/api/password_reset/',
	        data: {
			  "password": $("#password2").val(),
			  "password1": $("#password1").val()
			},
	        beforeSend: function (xhr) {
	            xhr.setRequestHeader("Authorization", 'jwt '+ HDD.get('jwt'));
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
					_info('La clave no cumple las condiciones');
					return;
				}

				if(Req.status == 201)
				{
					_exito_redirect("Clave cambiada",'/perfil/')
				}

	        },//fin complete
	    });		
	}

});


});

})( window );