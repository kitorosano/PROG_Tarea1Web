const HTML_INPUT_NOMBRE = $('#input__nombre');
const HTML_ERROR_NOMBRE = $('#error__nombre');
const HTML_ERROR_NOMBRE_TAMANIO = $('#error__nombre_tamanio');
const HTML_INPUT_APELLIDO = $('#input__apellido');
const HTML_ERROR_APELLIDO = $('#error__apellido');
const HTML_ERROR_APELLIDO_TAMANIO = $('#error__apellido_tamanio');
const HTML_INPUT_FECHANAC = $('#input__fechaNac');
const HTML_ERROR_FECHANAC = $('#error__fechaNac');
const HTML_ERROR_FECHANAC_FORMATO = $('#error__fechaNac_formato');
const HTML_INPUT_CORREO = $('#input__correo');
const HTML_ERROR_CORREO = $('#error__correo');
const HTML_ERROR_CORREO_FORMATO = $('#error__correo_formato');
const HTML_ERROR_CORREO_REPETIDO = $('#error__correo_repetido');
const HTML_INPUT_DIRECCION = $('#input__direccion');
const HTML_ERROR_DIRECCION = $('#error__direccion');
const HTML_ERROR_DIRECCION_TAMANIO = $('#error__direccion_tamanio');

const HTML_FORM_BUTTON = $('#formulario__button');


document.addEventListener('DOMContentLoaded', (e) => {
	/** === FORMULARIO DE USUARIOS === */
	HTML_INPUT_NOMBRE.on('input', function () {
		let nombre = $(this).val();

		if (nombre.length > 0) {
			HTML_ERROR_NOMBRE.addClass('hidden');
			if (nombre.length > 12) {
				HTML_INPUT_NOMBRE.removeClass('valid').addClass('invalid');
				HTML_ERROR_NOMBRE_TAMANIO.removeClass('hidden');
			} else {
				HTML_INPUT_NOMBRE.removeClass('invalid').addClass('valid');
				HTML_ERROR_NOMBRE_TAMANIO.addClass('hidden');
			}
		} else {
			HTML_INPUT_NOMBRE.removeClass('valid').addClass('invalid');
			HTML_ERROR_NOMBRE.removeClass('hidden');
			HTML_ERROR_NOMBRE_TAMANIO.addClass('hidden');
		}
	});
	HTML_INPUT_APELLIDO.on('input', function () {
		let apellido = $(this).val();

		if (apellido.length > 0) {
			HTML_ERROR_APELLIDO.addClass('hidden');
			if (apellido.length > 12) {
				HTML_INPUT_APELLIDO.removeClass('valid').addClass('invalid');
				HTML_ERROR_APELLIDO_TAMANIO.removeClass('hidden');
			} else {
				HTML_INPUT_APELLIDO.removeClass('invalid').addClass('valid');
				HTML_ERROR_APELLIDO_TAMANIO.addClass('hidden');
			}
		} else {
			HTML_INPUT_APELLIDO.removeClass('valid').addClass('invalid');
			HTML_ERROR_APELLIDO.removeClass('hidden');
			HTML_ERROR_APELLIDO_TAMANIO.addClass('hidden');
		}
	});
	HTML_INPUT_FECHANAC.on('input', function () {
		let fechaNacl = $(this).val();
		let edad = calcularEdad(fechaNacl);

		if (isNaN(edad)) {
			HTML_INPUT_FECHANAC.removeClass('valid').addClass('invalid');
			HTML_ERROR_FECHANAC_FORMATO.removeClass('hidden');
			HTML_ERROR_FECHANAC.addClass('hidden');
			return;
		}

		HTML_ERROR_FECHANAC_FORMATO.addClass('hidden');
		if (edad > 18) {
			HTML_INPUT_FECHANAC.removeClass('invalid').addClass('valid');
			HTML_ERROR_FECHANAC.addClass('hidden');
		} else {
			HTML_INPUT_FECHANAC.removeClass('invalid').addClass('valid');
			HTML_ERROR_FECHANAC.removeClass('hidden');
		}
	});
	HTML_INPUT_CORREO.on('input', function () {
		let correo = $(this).val();

		if (correo.length > 0) {
			HTML_ERROR_CORREO.addClass('hidden');
			if (!correo.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
				HTML_INPUT_CORREO.removeClass('valid').addClass('invalid');
				HTML_ERROR_CORREO_FORMATO.removeClass('hidden');
			} else {
				HTML_INPUT_CORREO.removeClass('invalid').addClass('valid');
				HTML_ERROR_CORREO_FORMATO.addClass('hidden');
			}
		} else {
			HTML_INPUT_CORREO.removeClass('valid').addClass('invalid');
			HTML_ERROR_CORREO.removeClass('hidden');
			HTML_ERROR_CORREO_FORMATO.addClass('hidden');
		}
	});
	HTML_INPUT_DIRECCION.on('input', function () {
		let direccion = $(this).val();

		if (direccion.length > 0) {
			HTML_ERROR_DIRECCION.addClass('hidden');
			if (direccion.length > 50) {
				HTML_INPUT_DIRECCION.removeClass('valid').addClass('invalid');
				HTML_ERROR_DIRECCION_TAMANIO.removeClass('hidden');
			} else {
				HTML_INPUT_DIRECCION.removeClass('invalid').addClass('valid');
				HTML_ERROR_DIRECCION_TAMANIO.addClass('hidden');
			}
		} else {
			HTML_INPUT_DIRECCION.removeClass('valid').addClass('invalid');
			HTML_ERROR_DIRECCION.removeClass('hidden');
			HTML_ERROR_DIRECCION_TAMANIO.addClass('hidden');
		}
	});

	HTML_FORM_BUTTON.on('click', function () {
		let nombre = HTML_INPUT_NOMBRE.val();
		let apellido = HTML_INPUT_APELLIDO.val();
		let fechaNac = HTML_INPUT_FECHANAC.val();
		let correo = HTML_INPUT_CORREO.val();
		let direccion = HTML_INPUT_DIRECCION.val();

		// Validar que todos los campos esten llenos
		if (!nombre || !apellido || !fechaNac || !correo || !direccion) return;

		// Validar que todos los campos esten validos
		let nuevoUsuario = {
			nombre,
			apellido,
			fechaNac,
			correo,
			direccion,
			activo: true,
		};

		// Agregar el nuevo usuario al array de usuarios
		if (!editando) {
			// validar correo repetido
			let correoRepetido = usuariosArray.some((u) => u.correo === correo);
			if (correoRepetido) {
				HTML_INPUT_CORREO.removeClass('valid').addClass('invalid');
				HTML_ERROR_CORREO_REPETIDO.removeClass('hidden');
				return;
			}
			usuariosArray.push(nuevoUsuario);
		} else {
			usuariosArray = usuariosArray.map((u) =>
				u.correo === correo ? nuevoUsuario : u
			);
		}

		localStorage.setItem('usuarios', JSON.stringify(usuariosArray));
		limpiarFormulario();

    cambiarEstadoEdicion(false); // Dejar de editar

		changePage(1); // Recargar la tabla
	});
});

function calcularEdad(fechaNac) {
	let hoy = new Date();
	let cumpleanos = new Date(fechaNac);
	let edad = hoy.getFullYear() - cumpleanos.getFullYear();
	let m = hoy.getMonth() - cumpleanos.getMonth();

	if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
		edad--;
	}

	return edad;
}

function limpiarFormulario() {
	HTML_INPUT_NOMBRE.val('');
	HTML_INPUT_APELLIDO.val('');
	HTML_INPUT_FECHANAC.val('');
	HTML_INPUT_CORREO.val('');
	HTML_INPUT_DIRECCION.val('');
	// limpiar validaciones
	HTML_INPUT_NOMBRE.removeClass('valid');
	HTML_INPUT_APELLIDO.removeClass('valid');
	HTML_INPUT_FECHANAC.removeClass('valid');
	HTML_INPUT_CORREO.removeClass('valid');
	HTML_INPUT_DIRECCION.removeClass('valid');
}