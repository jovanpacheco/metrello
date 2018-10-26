(function( window, undefined ){


function main(Req, res) {
	var lista_template = 
	templater`<div class="lista col-md-4 col-xs-4 col-sd-4" data-action-id="${ 'uuid' }"> 
	<button type="button" class="close"  
	data-action-name="delete_list" aria-label="Close">
	<i aria-hidden="true" class="fa fa-times"></i>
	</button>
	<button type="button" class="close item_plus"
	data-action-name="add_item" aria-label="Add"> 
	<i aria-hidden="true" class="fa fa-plus"></i>
	</button>	
	<button type="button" class="close items"
	data-action-name="items_for_list" aria-label="Tareas"> 
	<i aria-hidden="true" class="fa fa-list"></i>
	</button>								
    <p class="titulo" data-action-name="update_list">${ 'name' }</p>
    <p>Prioridad: ${ 'get_priority' }
    <span style="float: right;">Tareas: ${ 'nro_tareas' }</span></p>
  	</div>`;

	for (var i = 0; i < res.length; i++) {
		$("#listas").append(lista_template( res[i] ));
		HDD.setJ(res[i].uuid,res[i]);
	}

	//eliminar listas
	$('[data-action-name="delete_list"]').on("click",function(event) {
		event.preventDefault();
	    event.stopPropagation();
	    var uuid = $(event.target).parent().attr('data-action-id');

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
	    var uuid = $(event.target).parent().attr('data-action-id')
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

	// modal para todas las tareas de una lista 
	$('[data-action-name="items_for_list"]').on("click",function(event) {

		var uuid = $(event.target).parent().attr('data-action-id');
	    $.ajax({
	        type: 'GET',
	        url:  '/api/v1/list/'+uuid+'/items',   
	        beforeSend: function (xhr) {
	            xhr.setRequestHeader("Authorization", 'jwt '+ HDD.get('jwt'));
	        },
	        complete: function (Rq, textStatus)
	        {
				
				var data_tareas = JSON.parse(Rq.responseText);
				if(Rq.status == 200)
				{
					if (data_tareas.length == 0)
					{
						_info("No tiene tareas para esta lista.")
						return;
					}

					var tarea_template = 
					templater`<li class="list-group-item justify-content-between align-items-center">
			          <div class="d-flex justify-content-between">
			          <i>${ 'title' }</i>
			          <span class="badge badge-${'color'} badge-pill">${ 'get_priority' }</span>
			          <span class="badge badge-secondary badge-pill"><i class="fa fa-${'icono'}"></i></span>
			          </div>
			          <div>${'note'}</div>			         
			        </li>`;

			        $("#lista_de_tareas").html("");
			        $("#item_label_tareas").text("");
					for (var i = 0; i < data_tareas.length; i++) {
						var tipo_prioridad, icono ='';

						if (data_tareas[i].priority == 1)
						{
							tipo_prioridad='danger'
						}
						if (data_tareas[i].priority == 2)
						{
							tipo_prioridad='warning'
						}
						if (data_tareas[i].priority == 3)
						{
							tipo_prioridad='primary'
						}
						if (data_tareas[i].priority == 4)
						{
							tipo_prioridad='info'
						}	

						if (data_tareas[i].completed)
						{
							icono = 'chevron-up';
						}
						else
						{
							icono = 'chevron-down';
						}

						$("#item_label_tareas").text(data_tareas[i].uuid_list);
						$("#lista_de_tareas").append(tarea_template(
						extend(data_tareas[i], {color:tipo_prioridad,icono:icono})));

						//HDD.setJ(data_tareas[i].uuid,data_tareas[i]);
					}
					$('#modal_tareas').modal('toggle');
					return;
				}

	        },//fin complete traer tareas
	    });


	});





	// crear tareas para una lista boton
	$('[data-action-name="add_item"]').on("click",function(event) {
		event.preventDefault();
	    event.stopPropagation();
	    HDD.set('lista_seleccionada',$(event.target).parent().attr('data-action-id'))
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
};


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
			    main(Req, res);
			}// fin 200 principal

        },//fin complete
    });

});

})( window );