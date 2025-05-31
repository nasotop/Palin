const _ui = {
	form_nuevo_usuario: "FormNuevoUsuario",
	modal_nuevo_usuario: "ModalNuevoUsuario",
	button_modal_nuevo_usuario: "BtnModalNuevoUsuario",
	button_guardar_nuevo_usuario: "BtnGuardarNuevoUsuario",
	button_cancelar_nuevo_usuario: "BtnLimpiarNuevoUsuario",
};

let pass = "";
let modalFormNuevoUsuario;
window.addEventListener(
	"load",
	() => {
		InitModalNuevoUsuario();
	},
	false
);

const InitModalNuevoUsuario = () => {
	modalFormNuevoUsuario = new bootstrap.Modal(`#${_ui.modal_nuevo_usuario}`, {
		backdrop: "static",
	});
	document
		.getElementById(_ui.button_modal_nuevo_usuario)
		.addEventListener("click", () => {
			OpenModal();
		});
	document
		.getElementById(_ui.button_guardar_nuevo_usuario)
		.addEventListener("click", SaveNuevoUsuario);
	document
		.getElementById(_ui.button_cancelar_nuevo_usuario)
		.addEventListener("click", CleanModalNuevoUsuario);
	document
		.getElementById(_ui.modal_nuevo_usuario)
		.addEventListener("hide.bs.modal", ResetFormNuevoUsuario);
};

const OpenModal = () => {
	modalFormNuevoUsuario.show();
};
const CleanModalNuevoUsuario = () => {
	ResetFormNuevoUsuario();
};

const ResetFormNuevoUsuario = () => {
	document.getElementById(_ui.form_nuevo_usuario).reset();

	const inputs = document
		.getElementById(_ui.form_nuevo_usuario)
		.querySelectorAll("input");
	inputs.forEach((input) => {
		const elemento_mensaje = input.parentElement.querySelector(
			`#${input.id}_mensaje`
		);
		elemento_mensaje.classList.add("opacity-0");
		input.classList.remove("is-invalid");
		input.classList.remove("is-valid");
		elemento_mensaje.innerText = "El campo no puede estar vacio";
	});
};
const SaveNuevoUsuario = () => {
	const inputs = document
		.getElementById(_ui.form_nuevo_usuario)
		.querySelectorAll("input");

	const validaciones = [];

	inputs.forEach((input) => {
		validaciones.push(ValidateInputRequired(input));
		if (input.type === "date") {
			validaciones.push(ValidateDate(input));
		}
		if (input.id === "correo_usuario") {
			validaciones.push(ValidateMailFormat(input));
		}
		if (input.id === "clave_usuario") {
			validaciones.push(ValidatePass(input));
		}
		if (input.id === "clave_validacion_usuario") {
			validaciones.push(ValidateEqualsPass(input));
		}
	});

	return alert(
		validaciones.includes(false)
			? "debe cumplir con las validaciones"
			: "Formulario enviado"
	);
};

const ValidatePass = (input) => {
	const elemento_mensaje = input.parentElement.querySelector(
		`#${input.id}_mensaje`
	);
	const regex = /^(?=.*[A-Z])(?=.*\d).+$/;
	if (input.value.length < 6 || input.value.length > 18) {
		return SetInvalidInput(
			input,
			elemento_mensaje,
			"La clave debe tener entre 8 y 18 caracteres"
		);
	}

	if (!regex.test(input.value)) {
		return SetInvalidInput(
			input,
			elemento_mensaje,
			"La clave debe tener al menos una mayuscula y un numero"
		);
	}

	pass = input.value;

	return SetValidInput(input, elemento_mensaje);
};

const ValidateEqualsPass = (input) => {
	const elemento_mensaje = input.parentElement.querySelector(
		`#${input.id}_mensaje`
	);
	if (pass === "" || input.value !== pass) {
		return SetInvalidInput(
			input,
			elemento_mensaje,
			"Las claves deben ser iguales"
		);
	}
	return SetValidInput(input, elemento_mensaje);
};

const ValidateMailFormat = (input) => {
	const elemento_mensaje = input.parentElement.querySelector(
		`#${input.id}_mensaje`
	);
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const validacion = regex.test(input.value);

	if (!validacion) {
		return SetInvalidInput(
			input,
			elemento_mensaje,
			"El correo debe tener formato correcto"
		);
	}
	return SetValidInput(input, elemento_mensaje);
};

const ValidateDate = (input) => {
	const elemento_mensaje = input.parentElement.querySelector(
		`#${input.id}_mensaje`
	);

	if (input.value === "") {
		return SetInvalidInput(
			input,
			elemento_mensaje,
			"El campo no puede estar vacio"
		);
	}
	const value = new Date(input.value);
	const actualDate = new Date();

	if (value >= actualDate) {
		return SetInvalidInput(
			input,
			elemento_mensaje,
			"La fecha no puede ser mayor o igual al día de hoy"
		);
	}

	var fechaMinima = new Date(value);

	fechaMinima.setFullYear(value.getFullYear() + 13);

	if (actualDate < fechaMinima) {
		return SetInvalidInput(input, elemento_mensaje, "Debe tener 13 o mas años");
	}
	return SetValidInput(input, elemento_mensaje);
};
const ValidateInputRequired = (input) => {
	var elemento_mensaje = input.parentElement.querySelector(
		`#${input.id}_mensaje`
	);
	if (input.getAttribute("required") === null) {
		return SetValidInput(input, elemento_mensaje);
	}

	if (input.value.trim() === "") {
		return SetInvalidInput(input, elemento_mensaje);
	}
	return SetValidInput(input, elemento_mensaje);
};

const SetInvalidInput = (input, validation_element, validation_message) => {
	input.classList.add("is-invalid");
	input.classList.remove("is-valid");
	validation_element.classList.remove("opacity-0");
	validation_element.style.fontStyle = "bold";
	validation_element.style.color = "red";
	if (validation_message != null) {
		validation_element.innerText = validation_message;
	}
	return false;
};

const SetValidInput = (input, validation_element) => {
	input.classList.add("is-valid");
	input.classList.remove("is-invalid");
	validation_element.classList.add("opacity-0");
	validation_element.style.color = "green";

	return true;
};
