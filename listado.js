const DONE_TYPING_INTERVAL = 500, //time in ms (1 seconds)
	ORDER_ASC_BY_FECHANAC = 'FechaNac+-',
	ORDER_DESC_BY_FECHANAC = 'FechaNac-+';
let usuariosArray = [],
	ordenamientoActual = ORDER_ASC_BY_FECHANAC,
	totalUsuarios = 0, // Rough total usuarios count
	typingTimer, //timer identifier
	currentPage = 1,
	usuariosPerPage = 6,
	editando = false,
	filterText = '';

// HTML Elements
const HTML_PAGINATION_FIRST_PAGE = $('#firstPage');
const HTML_PAGINATION_PREV_PAGE = $('#prevPage');
const HTML_PAGINATION_NEXT_PAGE = $('#nextPage');
const HTML_PAGINATION_LAST_PAGE = $('#lastPage');
const HTML_PAGINATION_CURRENT_PAGE = $('#pagination');
const HTML_LOADER = $('#loader');
const HTML_SEARCH_INPUT = $('#searchUsuario');
const HTML_ORDER_BY_FECHANAC = $('#orderByFechaNac');
const HTML_LISTADO_USUARIOS = $('#listado_usuarios');

function sortUsuarios(criteria, array) {
	let result = [];
	if (criteria === ORDER_ASC_BY_FECHANAC) {
		result = array.sort(function (a, b) {
			let aDate = new Date(a.fechaNac),
				bDate = new Date(b.fechaNac);
			if (aDate < bDate) return -1;
			if (aDate > bDate) return 1;
			return 0;
		});
		HTML_ORDER_BY_FECHANAC.html('&#8595');
	} else if (criteria === ORDER_DESC_BY_FECHANAC) {
		result = array.sort(function (a, b) {
			let aDate = new Date(a.fechaNac),
				bDate = new Date(b.fechaNac);
			if (aDate > bDate) return -1;
			if (aDate < bDate) return 1;
			return 0;
		});
		HTML_ORDER_BY_FECHANAC.html('&#8593');
	}

	return result;
}

function showUsuarios() {
	let htmlContentToAppend = '';

	for (let i = 0; i < usuariosArray.length; i++) {
		let usuario = usuariosArray[i]; // {nombre, apellido, fechaNac, correo, direccion}

		// Filtrar usuarios por texto ingresado en el input
		if (usuario.correo.toUpperCase().indexOf(filterText) > -1)
			htmlContentToAppend += `
      <tr>
        <td>${usuario.nombre}</td>
        <td>${usuario.apellido}</td>
        <td>${usuario.fechaNac}</td>
        <td><strong>${usuario.correo}</strong></td>
        <td>${usuario.direccion}</td>
        <td>
          <button onclick="desactivarUsuario(${i})" class="table_button table_button__desactivar" data-active="${
				usuario.activo
			}">${usuario.activo ? 'Desactivar' : 'Activar'}</button>
          ${
						usuario.activo
							? `<button onclick="editandoUsuario(${i})" class="table_button table_button__editar">Editar</button>`
							: ''
					}
        </td>
      </tr>
    `;
	}

	HTML_LISTADO_USUARIOS.html(htmlContentToAppend);
}

function sortAndShowUsuarios(array, sortCriteria = ordenamientoActual) {
	ordenamientoActual = sortCriteria; //Establezco mi criterio de ordenamiento
	usuariosArray = sortUsuarios(ordenamientoActual, array); //Reordeno mis productos de acuerdo al criterio de ordenamiento establecido
	showUsuarios(); //Muestro los productos ordenados
}

function numPages() {
	return Math.ceil(totalUsuarios / usuariosPerPage);
}

function changePage(page) {
	// Get usuarios
	usuariosArray = JSON.parse(localStorage.getItem('usuarios')) || [];
  totalUsuarios = usuariosArray.length;

	// Reduce usuarios array
	let usuariosReduced = usuariosArray.slice(
		(page - 1) * usuariosPerPage,
		page * usuariosPerPage
	);
	sortAndShowUsuarios(usuariosReduced);

	// Validate page
	if (page < 1) page = 1;
	if (page > numPages()) page = numPages();

	// Disable buttons
  HTML_PAGINATION_FIRST_PAGE.prop('disabled', page === 1);
  HTML_PAGINATION_PREV_PAGE.prop('disabled', page === 1);
  HTML_PAGINATION_NEXT_PAGE.prop('disabled', page === numPages());
  HTML_PAGINATION_LAST_PAGE.prop('disabled', page === numPages());

  // Set current page
  HTML_PAGINATION_CURRENT_PAGE.html(`Página ${page} de ${numPages()}`);

	HTML_LOADER.css('display', 'none'); // hide loader
}

function editandoUsuario(index) {
	let usuario = usuariosArray[index];
	// Rellenar formulario con datos del usuario
	HTML_INPUT_NOMBRE.val(usuario.nombre);
	HTML_INPUT_APELLIDO.val(usuario.apellido);
	HTML_INPUT_FECHANAC.val(usuario.fechaNac);
	HTML_INPUT_CORREO.attr('readonly', true).val(usuario.correo);
	HTML_INPUT_DIRECCION.val(usuario.direccion);

	cambiarEstadoEdicion(true);
}

function desactivarUsuario(index) {
	usuariosArray = usuariosArray.map((u, i) => {
		if (i === index) u.activo = !u.activo;
		return u;
	});
	localStorage.setItem('usuarios', JSON.stringify(usuariosArray));
	showUsuarios();
	limpiarFormulario();
}

function cambiarEstadoEdicion(estado) {
	editando = estado;

	if (!estado) {
		HTML_FORM_BUTTON.text('Agregar usuario');
		HTML_INPUT_CORREO.attr('readonly', false);
	} else {
		HTML_FORM_BUTTON.text('Actualizar usuario');
		HTML_INPUT_CORREO.attr('readonly', true);
	}
}


document.addEventListener('DOMContentLoaded', (e) => {
	// Search input
	//on keyup, start the countdown
	HTML_SEARCH_INPUT.keyup(function () {
		clearTimeout(typingTimer);
		typingTimer = setTimeout(doneTyping, DONE_TYPING_INTERVAL);
	});

	//user is "finished typing," do something
	function doneTyping() {
		filterText = HTML_SEARCH_INPUT.val().toUpperCase();
		changePage(1); // reset pagination
	}

	// Order by fechaNac
	HTML_ORDER_BY_FECHANAC.click(function () {
		if (ordenamientoActual === ORDER_ASC_BY_FECHANAC)
			sortAndShowUsuarios(usuariosArray, ORDER_DESC_BY_FECHANAC);
		else sortAndShowUsuarios(usuariosArray, ORDER_ASC_BY_FECHANAC);
	});

	// Pagination
	HTML_PAGINATION_FIRST_PAGE.click(function () {
		if (currentPage > 1) {
			currentPage = 1;
			changePage(currentPage);
		}
	});

	HTML_PAGINATION_PREV_PAGE.click(function () {
		if (currentPage > 1) {
			currentPage--;
			changePage(currentPage);
		}
	});

	HTML_PAGINATION_NEXT_PAGE.click(function () {
		if (currentPage < numPages()) {
			currentPage++;
			changePage(currentPage);
		}
	});

	HTML_PAGINATION_LAST_PAGE.click(function () {
		if (currentPage < numPages()) {
			currentPage = numPages();
			changePage(currentPage);
		}
	});

	changePage(1);
});
