const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const clearButton = document.querySelector('#clear-completed');
const itemsLeft = document.querySelector('#items-left');

let todos = JSON.parse(localStorage.getItem('todos') || '[]');

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function updateItemsLeft() {
  const remaining = todos.filter(todo => !todo.completed).length;
  itemsLeft.textContent = `${remaining} item${remaining === 1 ? '' : 's'} left`;
}

function createTodoElement(todo) {
  const item = document.createElement('li');
  item.className = 'todo-item';
  item.dataset.id = todo.id;

  const label = document.createElement('label');
  label.className = 'todo-item__label';

  const checkboxWrapper = document.createElement('div');
  checkboxWrapper.className = 'todo-item__checkbox';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = todo.completed;
  checkbox.setAttribute('aria-label', 'Mark todo as completed');

  const checkMark = document.createElement('span');

  checkboxWrapper.append(checkbox, checkMark);

  const text = document.createElement('span');
  text.className = 'todo-item__text';
  if (todo.completed) text.classList.add('completed');
  text.textContent = todo.text;

  label.append(checkboxWrapper, text);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = '×';
  removeButton.setAttribute('aria-label', 'Remove todo');

  item.append(label, removeButton);

  checkbox.addEventListener('change', () => {
    todo.completed = checkbox.checked;
    text.classList.toggle('completed', todo.completed);
    saveTodos();
    updateItemsLeft();
  });

  removeButton.addEventListener('click', () => {
    todos = todos.filter(entry => entry.id !== todo.id);
    renderTodos();
    saveTodos();
  });

  return item;
}

function renderTodos() {
  list.innerHTML = '';
  todos.forEach(todo => list.appendChild(createTodoElement(todo)));
  updateItemsLeft();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  todos.unshift(newTodo);
  input.value = '';
  renderTodos();
  saveTodos();
  input.focus();
});

clearButton.addEventListener('click', () => {
  todos = todos.filter(todo => !todo.completed);
  renderTodos();
  saveTodos();
});

renderTodos();
