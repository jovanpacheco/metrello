//* localStorage *//
var HDD = {
    get: function(key) {
        return localStorage.getItem(key);
    },
    get_default: function(key, value_default) {
    	try{
    		return localStorage.getItem(key);
    	}
    	catch{
    		return value_default;
    	}
    },
    set: function(key, val) {
        return localStorage.setItem(key, val);
    },
    unset: function(key) {
        return localStorage.removeItem(key);
    },
    setJ:function(key,val)
    {
        return localStorage.setItem(key, JSON.stringify(val));
    },
    getJ:function(key)
    {
        return JSON.parse(localStorage.getItem(key));
    }
};

//* session *//

function cerrar_session(redirect=true) {

    HDD.unset('username');
    HDD.unset('jwt');
    
    for (var i = 0; i < localStorage.length; i++) {
        HDD.unset(localStorage.key(i)); 
    }

    for(var x = 0; x <= localStorage.length; x++) {
        localStorage.removeItem(localStorage.key(x))
    }

	if (redirect)
	{
		setTimeout(function(){ location.href = '/login'; }, 40);
	}
};

function token_invalido() {
    HDD.set('last_url',window.location.pathname);
    cerrar_session(true);
};

$("#salir").on('click',function(){
    cerrar_session(true);
})


//* alertas *//

function _info(mensaje) {
    swal({
        title: "",
        text: mensaje,
        type: "info",
        showCancelButton: false,
        confirmButtonColor: "#23c6c8",
    });
};

function _error(mensaje) {
    swal({
        title: "Error",
        text: mensaje,
        type: "error",
        showCancelButton: false,
        confirmButtonColor: "#23c6c8",
    });
};

function _error_redirect(mensaje,redirect,titulo='Error') {
    swal({  
        title: titulo,
        text: mensaje,
        type: "error",
        showCancelButton: false,
        confirmButtonColor: "#23c6c8",
        confirmButtonText: "Cerrar",
        closeOnConfirm: false
        }, function () {
            location.href = redirect;
    });
};

function _exito(mensaje) {
	swal({
	title: "Información",
		text: mensaje,
		type: "success",
		showCancelButton: false,
		confirmButtonColor: "#23C6C8",
		confirmButtonText: "Cerrar",
		closeOnConfirm: false,
	});
};

function _exito_redirect(mensaje,dire) {
	swal({
	title: "Información",
		text: mensaje,
		type: "success",
		showCancelButton: false,
		confirmButtonColor: "#23C6C8",
		confirmButtonText: "Cerrar",
		closeOnConfirm: false
	}).then(function() {
		location.href = dire;
	});
};

function _confirma(mensaje,si,no) {

  swal({
      title: "Información",
      text: mensaje,
      icon: "warning",
      buttons: [
        'No',
        'Si'
      ],
      dangerMode: true,
    }).then(function(isConfirm) {
      if (isConfirm) {
        si()
      } else {
        no()
      }
    })

}


function usuario_conectado(fun, redirect=true) {
    $("#loader").addClass('loading');
    
    if (HDD.get('jwt') == null)
    {
        cerrar_session(redirect);
        return;
    }

    if (HDD.get('username') == null)
    {
        $.ajax({
        type: 'GET',
        url:  '/api/user',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", 'jwt '+ HDD.get('jwt'));
        },        
        complete: function (Req, textStatus)
        {
            var res = JSON.parse(Req.responseText);
            HDD.set('username',res.username);
            $("#text_username").text(HDD.get('username'));
        },//fin complete
        });
    }
    else
    {
        $("#text_username").text(HDD.get('username'));
    }


    $.ajax({
        type: 'POST',
        url:  '/auth/verify_jwt_token/',
        data: {
          "token": HDD.get('jwt'),
        },
        complete: function (Req, textStatus)
        {
            if(Req.status != 200)
            {
                cerrar_session(redirect);
            }
            else
            {
                $("#loader").removeClass('loading');
                fun();
            }
        },//fin complete
    });
}




function templater ( strings, ...keys ) {
  return function( data ) {
      let temp = strings.slice();

      keys.forEach( ( key, i ) => {
          temp[ i ] = temp[ i ] + data[ key ];
      } );

      return temp.join( '' );
  }
};


function extend(obj, src) {
    Object.keys(src).forEach(function(key) { obj[key] = src[key]; });
    return obj;
}