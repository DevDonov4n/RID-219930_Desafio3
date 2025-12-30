/**
 * =========================================================
 * BOARD DE TAREFAS — CÓDIGO FINAL
 * =========================================================
 * Funcionalidades:
 * - Criar tarefas
 * - Concluir / desfazer conclusão
 * - Persistência no LocalStorage
 * - Contador de tarefas concluídas
 * - Animações visuais
 */

/* =========================================================
 * ESTADO INICIAL
 * ========================================================= */

const initialTasks = [
  {
    id: 1,
    name: 'Tarefa Exemplar',
    tag: 'front-end',
    createdAt: '01/08/2025',
    checked: true
  }
];

/* =========================================================
 * LOCAL STORAGE
 * ========================================================= */

const saveTasksInLocalStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('tasks')) || [];
};

/* =========================================================
 * UTILITÁRIOS
 * ========================================================= */

const getCurrentDate = () => {
  return new Date().toLocaleDateString('pt-BR');
};

/* =========================================================
 * CONTADOR
 * ========================================================= */

const updateTasksCounter = () => {
  const tasks = loadTasksFromLocalStorage();
  const completed = tasks.filter(task => task.checked).length;

  const counter = document.getElementById('tasks-counter');
  if (!counter) return;

  counter.textContent =
    completed === 1
      ? '1 tarefa concluída'
      : `${completed} tarefas concluídas`;
};

/* =========================================================
 * DOM — CRIAÇÃO DE TAREFA
 * ========================================================= */

const createTaskElement = (task) => {
  const li = document.createElement('li');
  li.className = 'task-item';

  if (task.checked) {
    li.classList.add('completed');
  }

  const info = document.createElement('div');
  info.className = 'task-info';

  const title = document.createElement('h3');
  title.textContent = task.name;

  const tag = document.createElement('span');
  tag.className = 'task-tag';
  tag.textContent = task.tag;

  const date = document.createElement('small');
  date.textContent = `Criado em: ${task.createdAt}`;

  info.append(title, tag, date);

  const button = document.createElement('button');
  button.textContent = task.checked ? 'Concluído' : 'Concluir';

  button.addEventListener('click', () => {
    toggleTaskStatus(task.id);
  });

  li.append(info, button);
  return li;
};

/* =========================================================
 * RENDERIZAÇÃO
 * ========================================================= */

const renderTasks = () => {
  const list = document.getElementById('tasks-list');
  if (!list) return;

  list.innerHTML = '';

  const tasks = loadTasksFromLocalStorage();
  tasks.forEach(task => {
    list.appendChild(createTaskElement(task));
  });

  updateTasksCounter();
};

/* =========================================================
 * REGRAS DE NEGÓCIO
 * ========================================================= */

const addTask = (name, tag) => {
  const tasks = loadTasksFromLocalStorage();

  const newTask = {
    id: Date.now(),
    name,
    tag,
    createdAt: getCurrentDate(),
    checked: false
  };

  saveTasksInLocalStorage([...tasks, newTask]);
  renderTasks();
};

const toggleTaskStatus = (taskId) => {
  const tasks = loadTasksFromLocalStorage();

  const updated = tasks.map(task =>
    task.id === taskId
      ? { ...task, checked: !task.checked }
      : task
  );

  saveTasksInLocalStorage(updated);
  renderTasks();
};

const removeCompletedTasks = () => {
  const tasks = loadTasksFromLocalStorage();
  const activeTasks = tasks.filter(task => !task.checked);

  saveTasksInLocalStorage(activeTasks);
  renderTasks();
};

/* =========================================================
 * EVENTOS
 * ========================================================= */

const handleCreateTask = (event) => {
  event.preventDefault();

  const nameInput = event.target.querySelector('#desc');
  const tagInput = event.target.querySelector('#tag');

  if (!nameInput.value.trim()) return;

  addTask(nameInput.value, tagInput.value);
  event.target.reset();
};

/* =========================================================
 * INICIALIZAÇÃO
 * ========================================================= */

window.onload = () => {
  const form = document.getElementById('create-task-form');
  form.addEventListener('submit', handleCreateTask);

  const removeBtn = document.getElementById('remove-completed-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', removeCompletedTasks);
  }

  if (!localStorage.getItem('tasks')) {
    saveTasksInLocalStorage(initialTasks);
  }

  renderTasks();
};
