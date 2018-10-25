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

			    var lista_template = templater`<div class="lista col-md-4 col-xs-4 col-sd-4">
				<button type="button" class="close" data-action-id="${ 'uuid' }" 
				data-action-name="delete" aria-label="Close">
				<span aria-hidden="true">&times;</span>
				</button>
				<button type="button" class="close item_plus"
				data-action-name="add_item" aria-label="Add" data-action-id="${ 'uuid' }"> 
				<span aria-hidden="true">&plus;</span>
				</button>						
			    <p class="titulo" data-action-name="update_list" data-action-id="${ 'uuid' }">${ 'name' }</p>
			    <p>Prioridad: ${ 'get_priority' }
			    <span style="float: right;">Tareas: ${ 'nro_tareas' }</span></p>
			  	</div>`;

				for (var i = 0; i < res.length; i++) {
					$("#listas").append(lista_template( res[i] ));
					HDD.setJ(res[i].uuid,res[i]);
				}

				//eliminar listas
				$('[data-action-name="delete"]').on("click",function(event) {
					event.preventDefault();
				    event.stopPropagation();
				    var uuid = $(event.target).attr('data-action-id');

				    _confirma(
				    "¿Estas seguro de eliminar la lista?",
				    function(){

				    $.ajax({
				        type: 'DELETE',
				        url:  '/api/v1/list/'+uuid+'/',   
				        beforeSend: function (xhr) {
				            xhr.setRequestHeader("Authorization", 'jwt '+ HDD.get('jwt'));
				        },
				        complete: function (Req, textStatus)
				        {
				        	_exito_redirect('Lista eliminada','/dashboard/')
				        }
				      });

				    },
				    	function(){swal("Cancelado", "", "info");}
				    )

				});

				// abrir modal crear lista
				$('#open_modal_lista').on("click",function(event) {
				    $('#modal_lista').find('[data-action-name="add_list"]').removeClass('hide');
				    $("#btn_list_update").addClass('hide');	
				    HDD.unset('lista_seleccionada');
				    $("#lista_label_titulo").text('Crear lista');
				    $("#lista_titulo").val("");				    				
					$('#modal_lista').modal('toggle');
				});

				// crear listas
				$('[data-action-name="add_list"]').on("click",function(event) {
					event.preventDefault();
				    event.stopPropagation();

				    $.ajax({
				        type: 'POST',
				        url:  '/api/v1/list/', 
				        data: {
						  "name": $("#lista_titulo").val(),
						  "priority": $("#lista_priority option:selected").val()
				        },				        
				        beforeSend: function (xhr) {
				            xhr.setRequestHeader("Authorization", 'jwt '+ HDD.get('jwt'));
				        },
				        complete: function (Req, textStatus)
				        {
				        	if(Req.status == 201)
							{
				        		_exito_redirect('Lista creada','/dashboard/');
				        	}
				        	else
				        	{
				        		_error('Ocurrio un error');
				        	}
				        }
				      });
				});

				// ver o editar una lista modal
				$('[data-action-name="update_list"]').on("dblclick",function(event) {
					event.preventDefault();
				    event.stopPropagation();
				    var uuid = $(event.target).attr('data-action-id')
				    var obj = HDD.getJ(uuid);
				    HDD.set('lista_seleccionada',uuid)
				    $("#lista_label_titulo").text('Editar lista');
				    $("#lista_titulo").val(obj.name);

				    $('#lista_priority option')
				     .removeAttr('selected')
				     .filter('[value='+obj.priority+']')
				     .attr('selected', true).change();
				    $('#modal_lista').find('[data-action-name="add_list"]').addClass('hide');
				    $("#btn_list_update").removeClass('hide');
				    $('#modal_lista').modal('toggle');
		
				});


				// editar una lista accion
				$('[data-action-name="update_list_click"]').on("click",function(event) {
					event.preventDefault();
				    event.stopPropagation();

					_confirma(
				    "¿Estas seguro de editar la lista?",
				    function(){

				    $.ajax({
				        type: 'PATCH',
				        url:  '/api/v1/list/'+HDD.get('lista_seleccionada')+'/',  
				        data: {
						  "name": $("#lista_titulo").val(),
						  "priority": $("#lista_priority option:selected").val()
				        },				         
				        beforeSend: function (xhr) {
				            xhr.setRequestHeader("Authorization", 'jwt '+ HDD.get('jwt'));
				        },
				        complete: function (Req, textStatus)
				        {
				        	_exito_redirect('Lista actualizada','/dashboard/')
				        }
				      });

				    },
				    	function(){swal("Cancelado", "", "info");}
				    )

				});

				// crear tareas para una lista boton
				$('[data-action-name="add_item"]').on("click",function(event) {
					event.preventDefault();
				    event.stopPropagation();
				    HDD.set('lista_seleccionada',$(event.target).attr('data-action-id'))
				    $('#modal_item').modal('toggle');
				});

				// crear tareas para una lista accion
				$('[data-action-name="add_item_click"]').on("click",function(event) {
				    $.ajax({
				        type: 'POST',
				        url:  '/api/v1/item/', 
				        data: {
						  "title": $("#item_titulo").val(),
						  "priority": $("#item_priority option:selected").val(),
						  "uuid_list": HDD.get('lista_seleccionada'),
						  "note":$("#nota").val()
						  //"due_date": "string",
				        },				        
				        beforeSend: function (xhr) {
				            xhr.setRequestHeader("Authorization", 'jwt '+ HDD.get('jwt'));
				        },
				        complete: function (Req, textStatus)
				        {
				        	if(Req.status == 201)
							{
				        		_exito_redirect('tarea creada','/dashboard/');
				        	}
				        	else
				        	{
				        		_error('Ocurrio un error');
				        	}
				        }
				      });
				});

			}// fin 200 principal

        },//fin complete
    });

});