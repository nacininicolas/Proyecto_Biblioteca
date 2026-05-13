const cursosValidos = ["INFO-7MO", "INFO-6TO", "ELEC-7MO"];

const usuarios = [
  { email: "admin@nexus.com", password: "admin123", rol: "bibliotecaria", nombre: "Admin", apellido: "NEXUS", curso: "INFO-7MO" },
  { email: "gomez@escuela.edu.ar", password: "profe123", rol: "profesor", nombre: "Profesor", apellido: "Gomez", curso: "INFO-6TO" }
];

let usuarioLogueado = null;

const libros = [
  {
    codigo: "NEX-001",
    titulo: "Programacion I",
    autor: "Pablo Gomez",
    editorial: "Aula Tecnica",
    anio: 2022,
    genero: "Programacion",
    stock: 5,
    disponibles: 4
  },
  {
    codigo: "NEX-002",
    titulo: "Base de Datos",
    autor: "Laura Perez",
    editorial: "Conocimiento Sur",
    anio: 2021,
    genero: "Base de datos",
    stock: 4,
    disponibles: 4
  },
  {
    codigo: "NEX-003",
    titulo: "Redes Informaticas",
    autor: "Martin Lopez",
    editorial: "TecnoEscuela",
    anio: 2023,
    genero: "Redes",
    stock: 6,
    disponibles: 6
  },
  {
    codigo: "NEX-004",
    titulo: "Hardware Basico",
    autor: "Carla Diaz",
    editorial: "Manual Escolar",
    anio: 2020,
    genero: "Hardware",
    stock: 3,
    disponibles: 2
  }
];

const movimientos = [
  {
    fecha: "19/04/2026",
    libro: "Programacion I",
    persona: "4to 2da",
    accion: "Prestamo"
  },
  {
    fecha: "19/04/2026",
    libro: "Hardware Basico",
    persona: "Profesor Gomez",
    accion: "Prestamo"
  }
];

const cuerpoTablaLibros = document.getElementById("cuerpoTablaLibros");
const cuerpoTablaConsulta = document.getElementById("cuerpoTablaConsulta");
const cuerpoTablaMovimientos = document.getElementById("cuerpoTablaMovimientos");
const inputBuscador = document.getElementById("inputBuscador");
const inputBuscadorUsuarios = document.getElementById("inputBuscadorUsuarios");
const formularioAgregarLibro = document.getElementById("formularioAgregarLibro");
const mensajeLibro = document.getElementById("mensajeLibro");
const mensajeCatalogo = document.getElementById("mensajeCatalogo");
const mensajeConsulta = document.getElementById("mensajeConsulta");
const formularioPrestamos = document.getElementById("formularioPrestamos");
const mensajePrestamo = document.getElementById("mensajePrestamo");
const selectLibroPrestamo = document.getElementById("selectLibroPrestamo");
const resumenStock = document.getElementById("resumen-stock");
const barraNavegacion = document.getElementById("barraNavegacion");
const seccionLogin = document.getElementById("seccion-login");
const formularioLogin = document.getElementById("formularioLogin");
const mensajeLogin = document.getElementById("mensajeLogin");
const formularioRegistro = document.getElementById("formularioRegistro");
const mensajeRegistro = document.getElementById("mensajeRegistro");
const botonesSeccion = document.querySelectorAll("[data-seccion]");
const botonesBarraNavegacion = document.querySelectorAll("#barraNavegacion [data-seccion]");
const seccionesPrincipales = document.querySelectorAll(
  "#seccion-inicio, #seccion-buscar, #seccion-consulta, #seccion-agregar, #seccion-prestamos"
);
const seccionesBibliotecaria = ["seccion-inicio", "seccion-buscar", "seccion-agregar", "seccion-prestamos"];
const seccionesUsuarios = ["seccion-consulta"];

function mostrarMensaje(elemento, texto) {
  elemento.textContent = texto;
}

function normalizarTexto(texto) {
  return texto.trim().replace(/\s+/g, " ");
}

function codigoCursoValido(codigoCurso) {
  return cursosValidos.includes(codigoCurso);
}

function cambiarSeccion(idSeccion) {
  if (usuarioLogueado && usuarioLogueado.rol === "bibliotecaria" && !seccionesBibliotecaria.includes(idSeccion)) {
    idSeccion = "seccion-inicio";
  }

  if (usuarioLogueado && usuarioLogueado.rol !== "bibliotecaria" && !seccionesUsuarios.includes(idSeccion)) {
    idSeccion = "seccion-consulta";
  }

  if (seccionLogin) {
    seccionLogin.classList.add("oculto");
  }

  seccionesPrincipales.forEach((seccion) => {
    seccion.classList.add("oculto");
  });

  const seccionSeleccionada = document.getElementById(idSeccion);

  if (seccionSeleccionada) {
    seccionSeleccionada.classList.remove("oculto");
  }

  if (resumenStock) {
    resumenStock.classList.toggle("oculto", idSeccion !== "seccion-inicio");
  }
}

function iniciarApp() {
  seccionesPrincipales.forEach((seccion) => {
    seccion.classList.add("oculto");
  });

  if (resumenStock) {
    resumenStock.classList.add("oculto");
  }

  if (barraNavegacion) {
    barraNavegacion.classList.add("oculto");
  }

  if (seccionLogin) {
    seccionLogin.classList.remove("oculto");
  }
}

function aplicarPermisosPorRol() {
  botonesSeccion.forEach((boton) => {
    boton.classList.remove("oculto");
  });

  if (usuarioLogueado.rol === "bibliotecaria") {
    if (barraNavegacion) {
      barraNavegacion.classList.remove("oculto");
    }

    botonesBarraNavegacion.forEach((boton) => {
      boton.classList.toggle("oculto", !seccionesBibliotecaria.includes(boton.dataset.seccion));
    });

    renderizarLibros(inputBuscador.value);
    cambiarSeccion("seccion-inicio");
    return;
  }

  if (barraNavegacion) {
    barraNavegacion.classList.add("oculto");
  }

  renderizarConsultaUsuarios(inputBuscadorUsuarios.value);
  cambiarSeccion("seccion-consulta");
  const nombreMostrado = usuarioLogueado.nombre
    ? `${usuarioLogueado.nombre} ${usuarioLogueado.apellido || ""}`.trim()
    : usuarioLogueado.email;
  mostrarMensaje(
    mensajeConsulta,
    `Bienvenido/a ${usuarioLogueado.rol}: ${nombreMostrado}. Puedes consultar el catalogo.`
  );
}

function renderizarLibros(filtro = "") {
  const termino = filtro.trim().toLowerCase();

  const librosFiltrados = libros.filter((libro) => {
    const textoCompleto = `${libro.codigo} ${libro.titulo} ${libro.autor} ${libro.editorial} ${libro.anio} ${libro.genero}`.toLowerCase();
    return textoCompleto.includes(termino);
  });

  cuerpoTablaLibros.innerHTML = "";

  if (librosFiltrados.length === 0) {
    cuerpoTablaLibros.innerHTML = `
      <tr>
        <td colspan="9">No se encontraron libros con esa busqueda.</td>
      </tr>
    `;
    return;
  }

  librosFiltrados.forEach((libro) => {
    const fila = document.createElement("tr");
    const claseStockBajo = libro.disponibles <= 1 ? "estado-bajo" : "";
    const puedeEliminar = usuarioLogueado && usuarioLogueado.rol === "bibliotecaria";
    const celdaAcciones = puedeEliminar
      ? `
        <button class="boton boton--peligro btn-eliminar-libro" type="button" data-codigo="${libro.codigo}">
          Eliminar
        </button>
      `
      : "Solo lectura";

    fila.innerHTML = `
      <td>${libro.codigo}</td>
      <td>${libro.titulo}</td>
      <td>${libro.autor}</td>
      <td>${libro.editorial}</td>
      <td>${libro.anio}</td>
      <td>${libro.genero}</td>
      <td>${libro.stock}</td>
      <td class="${claseStockBajo}">${libro.disponibles}</td>
      <td>${celdaAcciones}</td>
    `;

    cuerpoTablaLibros.appendChild(fila);
  });
}

function renderizarConsultaUsuarios(filtro = "") {
  const termino = filtro.trim().toLowerCase();

  const librosFiltrados = libros.filter((libro) => {
    const textoCompleto = `${libro.codigo} ${libro.titulo} ${libro.autor} ${libro.editorial} ${libro.anio} ${libro.genero}`.toLowerCase();
    return textoCompleto.includes(termino);
  });

  cuerpoTablaConsulta.innerHTML = "";

  if (librosFiltrados.length === 0) {
    cuerpoTablaConsulta.innerHTML = `
      <tr>
        <td colspan="6">No se encontraron libros con esa busqueda.</td>
      </tr>
    `;
    return;
  }

  librosFiltrados.forEach((libro) => {
    const fila = document.createElement("tr");
    const estadoDisponibilidad = libro.disponibles > 0
      ? `${libro.disponibles} disponibles`
      : "Sin ejemplares disponibles";
    const claseDisponibilidad = libro.disponibles > 0 ? "etiqueta-disponible" : "etiqueta-no-disponible";

    fila.innerHTML = `
      <td>
        <strong>${libro.titulo}</strong>
        <span class="codigo-consulta">${libro.codigo}</span>
      </td>
      <td>${libro.autor}</td>
      <td>${libro.editorial}</td>
      <td>${libro.anio}</td>
      <td>${libro.genero}</td>
      <td><span class="${claseDisponibilidad}">${estadoDisponibilidad}</span></td>
    `;

    cuerpoTablaConsulta.appendChild(fila);
  });
}

function renderizarResumen() {
  const totalTitulos = libros.length;
  const totalEjemplares = libros.reduce((suma, libro) => suma + libro.stock, 0);
  const totalDisponibles = libros.reduce((suma, libro) => suma + libro.disponibles, 0);
  const totalPrestados = totalEjemplares - totalDisponibles;

  document.getElementById("totalTitulos").textContent = totalTitulos;
  document.getElementById("totalEjemplares").textContent = totalEjemplares;
  document.getElementById("totalDisponibles").textContent = totalDisponibles;
  document.getElementById("totalPrestados").textContent = totalPrestados;
}

function renderizarOpcionesPrestamo() {
  selectLibroPrestamo.innerHTML = "";

  libros.forEach((libro) => {
    const opcion = document.createElement("option");
    opcion.value = libro.codigo;
    opcion.textContent = `${libro.titulo} (${libro.disponibles}/${libro.stock} disponibles)`;
    selectLibroPrestamo.appendChild(opcion);
  });
}

function renderizarMovimientos() {
  cuerpoTablaMovimientos.innerHTML = "";

  movimientos
    .slice()
    .reverse()
    .forEach((movimiento) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${movimiento.fecha}</td>
        <td>${movimiento.libro}</td>
        <td>${movimiento.persona}</td>
        <td>${movimiento.accion}</td>
      `;
      cuerpoTablaMovimientos.appendChild(fila);
    });
}

botonesSeccion.forEach((boton) => {
  boton.addEventListener("click", () => {
    cambiarSeccion(boton.dataset.seccion);
  });
});

formularioLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const email = document.getElementById("inputUsuario").value.trim().toLowerCase();
  const password = document.getElementById("inputPasswordLogin").value;
  const usuario = usuarios.find((item) => item.email === email);

  if (!email || !password) {
    mostrarMensaje(mensajeLogin, "Ingresa tu email y contrasena.");
    return;
  }

  if (!usuario) {
    mostrarMensaje(mensajeLogin, "No encontramos una cuenta con ese mail. Registrate para crear una.");
    return;
  }

  if (usuario.password !== password) {
    mostrarMensaje(mensajeLogin, "La contrasena no coincide.");
    return;
  }

  usuarioLogueado = usuario;
  mostrarMensaje(mensajeLogin, "");
  seccionLogin.classList.add("oculto");
  aplicarPermisosPorRol();
});

formularioRegistro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const dni = document.getElementById("inputRegistroDni").value.trim();
  const nombre = normalizarTexto(document.getElementById("inputRegistroNombre").value);
  const apellido = normalizarTexto(document.getElementById("inputRegistroApellido").value);
  const email = document.getElementById("inputRegistroMail").value.trim().toLowerCase();
  const password = document.getElementById("inputRegistroPassword").value;
  const telefono = normalizarTexto(document.getElementById("inputRegistroTelefono").value);
  const codigoCurso = document.getElementById("inputRegistroCodigoCurso").value.trim().toUpperCase();

  if (!/^\d{7,8}$/.test(dni)) {
    mostrarMensaje(mensajeRegistro, "Ingresa un DNI valido, solo numeros.");
    return;
  }

  if (!nombre || !apellido || !email || password.length < 6 || !telefono || !codigoCurso) {
    mostrarMensaje(mensajeRegistro, "Completa todos los campos con datos validos.");
    return;
  }

  if (!codigoCursoValido(codigoCurso)) {
    mostrarMensaje(mensajeRegistro, "Ingresa un codigo de curso valido.");
    return;
  }

  const emailExiste = usuarios.some((usuario) => usuario.email === email);
  const dniExiste = usuarios.some((usuario) => usuario.dni === dni);

  if (emailExiste) {
    mostrarMensaje(mensajeRegistro, "Ese mail ya esta registrado. Inicia sesion con esa cuenta.");
    return;
  }

  if (dniExiste) {
    mostrarMensaje(mensajeRegistro, "Ese DNI ya esta registrado.");
    return;
  }

  usuarioLogueado = {
    dni,
    nombre,
    apellido,
    email,
    password,
    telefono,
    curso: codigoCurso,
    rol: "estudiante"
  };

  usuarios.push(usuarioLogueado);
  formularioRegistro.reset();
  mostrarMensaje(mensajeRegistro, "");
  mostrarMensaje(mensajeLogin, "");
  seccionLogin.classList.add("oculto");
  aplicarPermisosPorRol();
});

inputBuscador.addEventListener("input", (evento) => {
  mostrarMensaje(mensajeCatalogo, "");
  renderizarLibros(evento.target.value);
});

inputBuscadorUsuarios.addEventListener("input", (evento) => {
  mostrarMensaje(mensajeConsulta, "");
  renderizarConsultaUsuarios(evento.target.value);
});

cuerpoTablaLibros.addEventListener("click", (evento) => {
  const objetivo = evento.target;

  if (!objetivo.classList.contains("btn-eliminar-libro")) {
    return;
  }

  if (!usuarioLogueado || usuarioLogueado.rol !== "bibliotecaria") {
    mostrarMensaje(mensajeCatalogo, "No tienes permiso para eliminar libros.");
    return;
  }

  const codigoSeleccionado = objetivo.dataset.codigo;
  const indiceLibro = libros.findIndex((libro) => libro.codigo === codigoSeleccionado);

  if (indiceLibro === -1) {
    mostrarMensaje(mensajeCatalogo, "No se pudo encontrar el libro.");
    return;
  }

  const libro = libros[indiceLibro];

  if (libro.disponibles !== libro.stock) {
    mostrarMensaje(
      mensajeCatalogo,
      "No se puede eliminar un libro que tiene ejemplares prestados."
    );
    return;
  }

  const confirmado = window.confirm(`Quieres eliminar "${libro.titulo}" del catalogo?`);

  if (!confirmado) {
    return;
  }

  libros.splice(indiceLibro, 1);
  mostrarMensaje(mensajeCatalogo, "Libro eliminado correctamente del catalogo.");

  renderizarLibros(inputBuscador.value);
  renderizarConsultaUsuarios(inputBuscadorUsuarios.value);
  renderizarResumen();
  renderizarOpcionesPrestamo();
});

formularioAgregarLibro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const codigo = document.getElementById("inputCodigo").value.trim();
  const titulo = document.getElementById("inputTitulo").value.trim();
  const autor = document.getElementById("inputAutor").value.trim();
  const editorial = document.getElementById("inputEditorial").value.trim();
  const anio = Number(document.getElementById("inputAnio").value);
  const genero = document.getElementById("inputGenero").value.trim();
  const stock = Number(document.getElementById("inputStock").value);
  const anioActual = new Date().getFullYear();

  if (!codigo || !titulo || !autor || !editorial || !genero || stock < 1 || anio < 1000 || anio > anioActual + 1) {
    mostrarMensaje(mensajeLibro, "Completa todos los campos con datos validos.");
    return;
  }

  const libroExiste = libros.some((libro) => libro.codigo.toLowerCase() === codigo.toLowerCase());

  if (libroExiste) {
    mostrarMensaje(mensajeLibro, "Ese codigo ya existe. Usa uno diferente.");
    return;
  }

  libros.push({
    codigo,
    titulo,
    autor,
    editorial,
    anio,
    genero,
    stock,
    disponibles: stock
  });

  formularioAgregarLibro.reset();
  document.getElementById("inputStock").value = 1;
  mostrarMensaje(mensajeLibro, "Libro agregado correctamente al catalogo.");
  mostrarMensaje(mensajeCatalogo, "");

  renderizarLibros(inputBuscador.value);
  renderizarConsultaUsuarios(inputBuscadorUsuarios.value);
  renderizarResumen();
  renderizarOpcionesPrestamo();
});

formularioPrestamos.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const codigoSeleccionado = selectLibroPrestamo.value;
  const persona = document.getElementById("inputPersonaPrestamo").value.trim();
  const accion = document.getElementById("selectAccionPrestamo").value;
  const libro = libros.find((item) => item.codigo === codigoSeleccionado);

  if (!persona) {
    mostrarMensaje(mensajePrestamo, "Ingresa el nombre de la persona.");
    return;
  }

  if (!libro) {
    mostrarMensaje(mensajePrestamo, "Selecciona un libro valido.");
    return;
  }

  if (accion === "prestamo") {
    if (libro.disponibles === 0) {
      mostrarMensaje(mensajePrestamo, "No hay ejemplares disponibles para prestar.");
      return;
    }

    libro.disponibles -= 1;
  } else {
    if (libro.disponibles === libro.stock) {
      mostrarMensaje(mensajePrestamo, "Todos los ejemplares ya figuran como disponibles.");
      return;
    }

    libro.disponibles += 1;
  }

  movimientos.push({
    fecha: new Date().toLocaleDateString("es-AR"),
    libro: libro.titulo,
    persona,
    accion: accion === "prestamo" ? "Prestamo" : "Devolucion"
  });

  formularioPrestamos.reset();
  mostrarMensaje(mensajePrestamo, "Movimiento registrado correctamente.");

  renderizarLibros(inputBuscador.value);
  renderizarConsultaUsuarios(inputBuscadorUsuarios.value);
  renderizarResumen();
  renderizarOpcionesPrestamo();
  renderizarMovimientos();
});

renderizarLibros();
renderizarConsultaUsuarios();
renderizarResumen();
renderizarOpcionesPrestamo();
renderizarMovimientos();
iniciarApp();
