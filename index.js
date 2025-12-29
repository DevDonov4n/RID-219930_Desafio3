/**
 * =========================================================
 * BOARD DE TAREFAS — DOCUMENTAÇÃO COMPLETA
 * =========================================================
 *
 * Esta aplicação implementa um Board de Tarefas (To-Do List)
 * utilizando JavaScript puro, HTML semântico e LocalStorage.
 *
 * Funcionalidades:
 * - Carregar tarefas ao abrir a página
 * - Adicionar novas tarefas
 * - Marcar / desmarcar tarefas como concluídas
 * - Atualizar estado das tarefas
 * - Exibir nome, data de criação e botão de conclusão
 *
 * Tecnologias:
 * - JavaScript (ES6+)
 * - Manipulação do DOM
 * - LocalStorage
 */

/* =========================================================
 * ESTADO INICIAL DA APLICAÇÃO
 * =========================================================
 *
 * Estrutura de uma tarefa:
 * {
 *   id: number,
 *   name: string,
 *   tag: string,
 *   createdAt: string,
 *   checked: boolean
 * }
 */

let initialTasks = [
  {
    id: 1,
    name: 'Tarefa Exemplar',
    tag: 'front-end',
    createdAt: '01/08/2025',
    checked: true
  }
];

/* =========================================================
 * LOCAL STORAGE — PERSISTÊNCIA DE DADOS
 * =========================================================
 */

/**
 * Salva as tarefas no LocalStorage.
 * @param {Array<Object>} tasks
 */
const saveTasksInLocalStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

/**
 * Recupera as tarefas do LocalStorage.
 * @returns {Array<Object>}
 */
const loadTasksFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('tasks')) || [];
};

/* =========================================================
 * UTILITÁRIOS
 * =========================================================
 */

/**
 * Retorna a data atual formatada (pt-BR).
 * @returns {string}
 */
const getCurrentDate = () => {
  return new Date().toLocaleDateString('pt-BR');
};

/* =========================================================
 * CRIAÇÃO DE ELEMENTOS VISUAIS (DOM)
 * =========================================================
 */

/**
 * Cria o elemento visual de uma tarefa.
 * Responsabilidade única: criar o HTML da tarefa.
 *
 * @param {Object} task
 * @returns {HTMLLIElement}
 */
const createTaskElement = (task) => {
  const listItem = document.createElement('li');
  listItem.id = task.id;
  listItem.className = 'task-item';

  const taskName = document.createElement('span');
  taskName.textContent = task.name;
  if (task.checked) taskName.classList.add('task-done');

  const taskDate = document.createElement('small');
  taskDate.textContent = `Criada em: ${task.createdAt}`;

  const finishButton = document.createElement('button');
  finishButton.textContent = task.checked ? 'Desmarcar' : 'Concluir';
  finishButton.onclick = () => toggleTaskStatus(task.id);

  listItem.append(taskName, taskDate, finishButton);
  return listItem;
};

/* =========================================================
 * RENDERIZAÇÃO
 * =========================================================
 */

/**
 * Renderiza todas as tarefas na tela.
 */
const renderTasks = () => {
  const tasksList = document.getElementById('tasks-list');

  if (!tasksList) {
    console.error('Elemento #tasks-list não encontrado no DOM');
    return;
  }

  tasksList.innerHTML = '';

  const tasks = loadTasksFromLocalStorage();
  tasks.forEach(task => {
    tasksList.appendChild(createTaskElement(task));
  });
};

/* =========================================================
 * REGRAS DE NEGÓCIO (TASKS)
 * =========================================================
 */

/**
 * Adiciona uma nova tarefa.
 * @param {string} name
 * @param {string} tag
 */
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

/**
 * Alterna o estado de conclusão da tarefa.
 * @param {number} taskId
 */
const toggleTaskStatus = (taskId) => {
  const tasks = loadTasksFromLocalStorage();

  const updatedTasks = tasks.map(task =>
    task.id === taskId
      ? { ...task, checked: !task.checked }
      : task
  );

  saveTasksInLocalStorage(updatedTasks);
  renderTasks();
};

/* =========================================================
 * EVENTOS
 * =========================================================
 */

/**
 * Handler do formulário de criação de tarefas.
 * @param {Event} event
 */
const handleCreateTask = (event) => {
  event.preventDefault();

  const taskNameInput = event.target.querySelector('#desc');
  const taskTagInput = event.target.querySelector('#tag');

  const taskName = taskNameInput.value;
  const taskTag = taskTagInput.value;

  if (!taskName.trim()) return;

  addTask(taskName, taskTag);
  event.target.reset();
};

/* =========================================================
 * INICIALIZAÇÃO DA APLICAÇÃO
 * =========================================================
 */

window.onload = () => {
  const form = document.getElementById('create-task-form');
  form.addEventListener('submit', handleCreateTask);

  // Inicializa o LocalStorage caso esteja vazio
  if (!localStorage.getItem('tasks')) {
    saveTasksInLocalStorage(initialTasks);
  }

  renderTasks();
};
