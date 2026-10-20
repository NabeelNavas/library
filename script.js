// The single source of truth: every book lives in this array.
const myLibrary = [];

// Constructor for creating book objects.
function Book(title, author, pages, read) {
  this.id = crypto.randomUUID();
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// Prototype method that flips a book instance's read status.
Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// Takes details, creates a book, and stores it in the array.
function addBookToLibrary(title, author, pages, read) {
  const book = new Book(title, author, pages, read);
  myLibrary.push(book);
  return book;
}

// Cache the elements we need.
const libraryElement = document.querySelector("#library");
const summaryElement = document.querySelector("#library-summary");
const emptyMessage = document.querySelector("#empty-message");
const dialog = document.querySelector("#book-dialog");
const bookForm = document.querySelector("#book-form");
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(text) {
  clearTimeout(toastTimer);
  toast.textContent = text;
  toastTimer = setTimeout(() => {
    toast.textContent = "";
  }, 3500);
}

// Build one card for one book, using the book's id as the data attribute.
function createBookCard(book) {
  const card = document.createElement("article");
  card.className = book.read ? "book-card is-read" : "book-card";
  card.dataset.id = book.id;

  const status = document.createElement("span");
  status.className = book.read
    ? "book-status status-read"
    : "book-status status-unread";
  status.textContent = book.read ? "Read" : "Not read";

  const title = document.createElement("h2");
  title.textContent = book.title;

  const author = document.createElement("p");
  author.className = "book-author";
  author.textContent = `by ${book.author}`;

  const pages = document.createElement("p");
  pages.className = "book-pages";
  pages.textContent = `${book.pages} pages`;

  const details = document.createElement("div");
  details.append(author, pages);

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "button toggle-read-button";
  toggleButton.textContent = book.read ? "Mark as unread" : "Mark as read";

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "button remove-button";
  removeButton.textContent = "Remove";

  actions.append(toggleButton, removeButton);

  card.append(status, title, details, actions);
  return card;
}

// Loop through the array and render every book from scratch.
function displayBooks() {
  libraryElement.replaceChildren();

  for (const book of myLibrary) {
    libraryElement.append(createBookCard(book));
  }

  const count = myLibrary.length;
  summaryElement.textContent =
    count === 1 ? "1 book" : `${count} books`;
  emptyMessage.hidden = count !== 0;
}

// Click handling is delegated, so cards added later keep working.
libraryElement.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  const card = button.closest(".book-card");
  const book = myLibrary.find((item) => item.id === card.dataset.id);
  if (!book) return;

  if (button.classList.contains("toggle-read-button")) {
    book.toggleRead();
  }

  if (button.classList.contains("remove-button")) {
    const index = myLibrary.findIndex((item) => item.id === book.id);
    myLibrary.splice(index, 1);
    showToast(`Removed "${book.title}" from your library.`);
  }

  displayBooks();
});

// The "New Book" button opens the dialog.
document.querySelector("#new-book-button").addEventListener("click", () => {
  dialog.showModal();
  document.querySelector("#title").focus();
});

document.querySelector("#close-dialog").addEventListener("click", () => {
  dialog.close();
});

// preventDefault stops the form from trying to submit to a server.
bookForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.querySelector("#title").value.trim();
  const author = document.querySelector("#author").value.trim();
  const pages = Number(document.querySelector("#pages").value);
  const read = document.querySelector("#read").checked;

  if (!title || !author || !pages) {
    showToast("Please fill in a title, author, and page count.");
    return;
  }

  addBookToLibrary(title, author, pages, read);
  displayBooks();
  bookForm.reset();
  dialog.close();
  showToast(`Added "${title}" to your library.`);
});

// A few books so the cards are visible on first load.
addBookToLibrary("The Hobbit", "J.R.R. Tolkien", 310, true);
addBookToLibrary("Dune", "Frank Herbert", 412, false);
addBookToLibrary("The Left Hand of Darkness", "Ursula K. Le Guin", 304, true);

displayBooks();
