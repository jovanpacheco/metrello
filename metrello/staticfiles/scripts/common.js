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
	if (redirect)
	{
		setTimeout(function(){ location.href = '/login'; }, 200);
	}
};

function token_invalido() {
    HDD.set('last_url',window.location.pathname);
    cerrar_session(true);
};



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
	title: "Informacion",
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
	title: "Informacion",
		text: mensaje,
		type: "success",
		showCancelButton: false,
		confirmButtonColor: "#23C6C8",
		confirmButtonText: "Cerrar",
		closeOnConfirm: false
	}, function () {
		location.href = dire;
	});
};

function _confirma(mensaje,si,no) {
    swal({
        title: "Informacion",
        text: mensaje,
        type: "success",
        showCancelButton: true,
        confirmButtonColor: '#E60026',
        confirmButtonText: 'Si!',
        confirmButtonColor: '#0070B8',
        cancelButtonText: "No!",
        closeOnConfirm: false,
        closeOnCancel: false
    },
    function(isConfirm) {

        if (isConfirm) {
        	si();
        } else {
           	no();
        }
    });
}