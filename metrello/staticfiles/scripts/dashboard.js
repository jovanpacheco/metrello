usuario_conectado(function(){

    $.ajax({
        type: 'GET',
        url:  '/api/v1/list/',   
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

			if(Req.status == 200)
			{

			    var lista_template = templater`
			    <div class="lista col-md-4 col-xs-4 col-sd-4">
				<button type="button" class="close" data-action-id="5" 
				data-action-name="delete" aria-label="Close">
				<span aria-hidden="true">&times;</span>
				</button>
				<button type="button" class="close" data-action-id="6" 
				data-action-name="add" aria-label="Close">
				<span aria-hidden="true">&plus;</span>
				</button>						
			    <p class="titulo">${ 'name' }</p>
			    <p>Prioridad: ${ 'get_priority' }
			    <span style="float: right;">Tareas: ${ 'nro_tareas' }</span></p>
			  	</div>`;
				for (var i = 0; i < res.length; i++) {
					$("#listas").append(lista_template( res[i] ));
				}

			}

        },//fin complete
    });


});


$('*').on("click",function(event) {
	var id = $(event.target).attr('data-action-id');
    alert(5)
});

$('[data-action-name="delete"]').click(function() {
    //Do Acction
});