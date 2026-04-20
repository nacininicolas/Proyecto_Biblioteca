const books = [
  {
    code: "NEX-001",
    title: "Programacion I",
    author: "Pablo Gomez",
    genre: "Programacion",
    stock: 5,
    available: 4
  },
  {
    code: "NEX-002",
    title: "Base de Datos",
    author: "Laura Perez",
    genre: "Base de datos",
    stock: 4,
    available: 4
  },
  {
    code: "NEX-003",
    title: "Redes Informaticas",
    author: "Martin Lopez",
    genre: "Redes",
    stock: 6,
    available: 6
  },
  {
    code: "NEX-004",
    title: "Hardware Basico",
    author: "Carla Diaz",
    genre: "Hardware",
    stock: 3,
    available: 2
  }
];

const movements = [
  {
    date: "19/04/2026",
    book: "Programacion I",
    person: "4to 2da",
    action: "Prestamo"
  },
  {
    date: "19/04/2026",
    book: "Hardware Basico",
    person: "Profesor Gomez",
    action: "Prestamo"
  }
];

const booksTableBody = document.getElementById("booksTableBody");
const movementsTableBody = document.getElementById("movementsTableBody");
const searchInput = document.getElementById("searchInput");
const addBookForm = document.getElementById("addBookForm");
const bookMessage = document.getElementById("bookMessage");
const catalogMessage = document.getElementById("catalogMessage");
const loanForm = document.getElementById("loanForm");
const loanMessage = document.getElementById("loanMessage");
const loanBook = document.getElementById("loanBook");

function renderBooks(filter = "") {
  const term = filter.trim().toLowerCase();

  const filteredBooks = books.filter((book) => {
    const fullText = `${book.code} ${book.title} ${book.author} ${book.genre}`.toLowerCase();
    return fullText.includes(term);
  });

  booksTableBody.innerHTML = "";

  if (filteredBooks.length === 0) {
    booksTableBody.innerHTML = `
      <tr>
        <td colspan="7">No se encontraron libros con esa busqueda.</td>
      </tr>
    `;
    return;
  }

  filteredBooks.forEach((book) => {
    const row = document.createElement("tr");
    const lowStockClass = book.available <= 1 ? "status-low" : "";

    row.innerHTML = `
      <td>${book.code}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.genre}</td>
      <td>${book.stock}</td>
      <td class="${lowStockClass}">${book.available}</td>
      <td>
        <button class="button button--danger delete-book-button" type="button" data-code="${book.code}">
          Eliminar
        </button>
      </td>
    `;

    booksTableBody.appendChild(row);
  });
}

function renderSummary() {
  const totalTitulos = books.length;
  const totalEjemplares = books.reduce((sum, book) => sum + book.stock, 0);
  const totalDisponibles = books.reduce((sum, book) => sum + book.available, 0);
  const totalPrestados = totalEjemplares - totalDisponibles;

  document.getElementById("totalTitulos").textContent = totalTitulos;
  document.getElementById("totalEjemplares").textContent = totalEjemplares;
  document.getElementById("totalDisponibles").textContent = totalDisponibles;
  document.getElementById("totalPrestados").textContent = totalPrestados;
}

function renderLoanOptions() {
  loanBook.innerHTML = "";

  books.forEach((book) => {
    const option = document.createElement("option");
    option.value = book.code;
    option.textContent = `${book.title} (${book.available}/${book.stock} disponibles)`;
    loanBook.appendChild(option);
  });
}

function renderMovements() {
  movementsTableBody.innerHTML = "";

  movements
    .slice()
    .reverse()
    .forEach((movement) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${movement.date}</td>
        <td>${movement.book}</td>
        <td>${movement.person}</td>
        <td>${movement.action}</td>
      `;
      movementsTableBody.appendChild(row);
    });
}

function showMessage(element, text) {
  element.textContent = text;
}

searchInput.addEventListener("input", (event) => {
  showMessage(catalogMessage, "");
  renderBooks(event.target.value);
});

booksTableBody.addEventListener("click", (event) => {
  const target = event.target;

  if (!target.classList.contains("delete-book-button")) {
    return;
  }

  const selectedCode = target.dataset.code;
  const bookIndex = books.findIndex((book) => book.code === selectedCode);

  if (bookIndex === -1) {
    showMessage(catalogMessage, "No se pudo encontrar el libro.");
    return;
  }

  const book = books[bookIndex];

  if (book.available !== book.stock) {
    showMessage(
      catalogMessage,
      "No se puede eliminar un libro que tiene ejemplares prestados."
    );
    return;
  }

  const confirmed = window.confirm(`Quieres eliminar "${book.title}" del catalogo?`);

  if (!confirmed) {
    return;
  }

  books.splice(bookIndex, 1);
  showMessage(catalogMessage, "Libro eliminado correctamente del catalogo.");

  renderBooks(searchInput.value);
  renderSummary();
  renderLoanOptions();
});

addBookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const code = document.getElementById("bookCode").value.trim();
  const title = document.getElementById("bookTitle").value.trim();
  const author = document.getElementById("bookAuthor").value.trim();
  const genre = document.getElementById("bookGenre").value.trim();
  const stock = Number(document.getElementById("bookStock").value);

  if (!code || !title || !author || !genre || stock < 1) {
    showMessage(bookMessage, "Completa todos los campos con datos validos.");
    return;
  }

  const bookExists = books.some((book) => book.code.toLowerCase() === code.toLowerCase());

  if (bookExists) {
    showMessage(bookMessage, "Ese codigo ya existe. Usa uno diferente.");
    return;
  }

  books.push({
    code,
    title,
    author,
    genre,
    stock,
    available: stock
  });

  addBookForm.reset();
  document.getElementById("bookStock").value = 1;
  showMessage(bookMessage, "Libro agregado correctamente al catalogo.");
  showMessage(catalogMessage, "");

  renderBooks(searchInput.value);
  renderSummary();
  renderLoanOptions();
});

loanForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const selectedCode = loanBook.value;
  const person = document.getElementById("loanPerson").value.trim();
  const action = document.getElementById("loanAction").value;
  const book = books.find((item) => item.code === selectedCode);

  if (!person) {
    showMessage(loanMessage, "Ingresa el nombre de la persona.");
    return;
  }

  if (!book) {
    showMessage(loanMessage, "Selecciona un libro valido.");
    return;
  }

  if (action === "prestamo") {
    if (book.available === 0) {
      showMessage(loanMessage, "No hay ejemplares disponibles para prestar.");
      return;
    }

    book.available -= 1;
  } else {
    if (book.available === book.stock) {
      showMessage(loanMessage, "Todos los ejemplares ya figuran como disponibles.");
      return;
    }

    book.available += 1;
  }

  movements.push({
    date: new Date().toLocaleDateString("es-AR"),
    book: book.title,
    person,
    action: action === "prestamo" ? "Prestamo" : "Devolucion"
  });

  loanForm.reset();
  showMessage(loanMessage, "Movimiento registrado correctamente.");

  renderBooks(searchInput.value);
  renderSummary();
  renderLoanOptions();
  renderMovements();
});

renderBooks();
renderSummary();
renderLoanOptions();
renderMovements();
