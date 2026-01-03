/**
 * =========================================================
 * BOARD DE TAREFAS (TO-DO LIST)
 * =========================================================
 *
 * Descrição geral:
 * Esta aplicação implementa um Board de Tarefas utilizando
 * JavaScript puro, HTML semântico e LocalStorage.
 *
 * O objetivo é permitir que o usuário:
 * - Crie novas tarefas
 * - Marque tarefas como concluídas
 * - Visualize data e etiqueta da tarefa
 * - Tenha persistência dos dados mesmo ao recarregar a página
 * - Veja um contador de tarefas concluídas
 *
 * Este arquivo contém:
 * - Gerenciamento de estado (LocalStorage)
 * - Regras de negócio
 * - Manipulação do DOM
 * - Eventos da aplicação
 *
 * Estrutura de uma tarefa:
 * {
 *   id: number        // Identificador único
 *   name: string      // Nome da tarefa
 *   tag: string       // Etiqueta (ex: frontend, backend)
 *   createdAt: string// Data de criação (pt-BR)
 *   checked: boolean // Indica se a tarefa foi concluída
 * }
 */

/* =========================================================
 * ESTADO INICIAL DA APLICAÇÃO
 * =========================================================
 *
 * Utilizado apenas para inicializar o LocalStorage
 * caso ainda não exista nenhuma tarefa salva.
 */

const initialTasks = [
  {
    id: 1,
    name: 'Tarefa Exemplar',
    tag: 'Etiqueta Exemplar',
    createdAt: '01/08/2025',
    checked: true
  }
];

/* =========================================================
 * LOCAL STORAGE — PERSISTÊNCIA DE DADOS
 * ========================================================= */

/**
 * Salva o array de tarefas no LocalStorage.
 * Toda alteração nas tarefas deve passar por esta função.
 *
 * @param {Array<Object>} tasks - Lista de tarefas atualizada
 */
const saveTasksInLocalStorage = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

/**
 * Recupera as tarefas salvas no LocalStorage.
 *
 * @returns {Array<Object>} Lista de tarefas
 * Caso não exista nada salvo, retorna um array vazio.
 */
const loadTasksFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('tasks')) || [];
};

/* =========================================================
 * FUNÇÕES UTILITÁRIAS
 * ========================================================= */

/**
 * Retorna a data atual formatada no padrão pt-BR.
 *
 * @returns {string} Data formatada (dd/mm/aaaa)
 */
const getCurrentDate = () => {
  return new Date().toLocaleDateString('pt-BR');
};

/* =========================================================
 * CONTADOR DE TAREFAS CONCLUÍDAS
 * ========================================================= */

/**
 * Atualiza o texto que informa quantas tarefas
 * estão marcadas como concluídas.
 *
 * Esta função deve ser chamada sempre que:
 * - Uma tarefa for criada
 * - Uma tarefa for concluída/desconcluída
 * - Tarefas concluídas forem removidas
 */
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
 * CRIAÇÃO DE ELEMENTOS DO DOM
 * ========================================================= */

/**
 * Cria o elemento <li> que representa uma tarefa na interface.
 *
 * Responsabilidade única:
 * - Criar e estruturar o HTML da tarefa
 * - Associar o evento do botão "Concluir"
 *
 * @param {Object} task - Objeto da tarefa
 * @returns {HTMLLIElement} Elemento da lista
 */
const createTaskElement = (task) => {
  const li = document.createElement('li');
  li.className = 'task-item';

  // Aplica estilo visual se a tarefa estiver concluída
  if (task.checked) {
    li.classList.add('completed');
  }

  /* Conteúdo da tarefa (lado esquerdo) */
  const content = document.createElement('div');
  content.className = 'task-content';

  const title = document.createElement('h3');
  title.textContent = task.name;

  const meta = document.createElement('div');
  meta.className = 'task-meta';

  const tag = document.createElement('span');
  tag.className = 'task-tag';
  tag.textContent = task.tag || 'Sem Etiqueta';

  const date = document.createElement('span');
  date.className = 'task-date';
  date.textContent = `Criado em: ${task.createdAt}`;

  meta.append(tag, date);
  content.append(title, meta);

  /* Botão de ação */
  const button = document.createElement('button');
  button.className = 'task-complete-btn';

  const span = document.createElement('span');
  span.textContent = task.checked ? '✓' : 'Concluir';

  button.appendChild(span);


  button.addEventListener('click', () => {
    // Se a tarefa JÁ está concluída → apenas desfaz
    if (task.checked) {
      toggleTaskStatus(task.id);
      return;
    }

    // Se NÃO está concluída → anima antes de concluir
    button.classList.add('is-animating');

    setTimeout(() => {
      toggleTaskStatus(task.id);
    }, 1000);
    });

  li.append(content, button);
  return li;
};

/* =========================================================
 * RENDERIZAÇÃO DA LISTA
 * ========================================================= */

/**
 * Renderiza todas as tarefas na tela.
 *
 * Responsabilidades:
 * - Limpar a lista atual
 * - Criar os elementos visuais das tarefas
 * - Atualizar o contador de tarefas concluídas
 */
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

/**
 * Adiciona uma nova tarefa.
 *
 * @param {string} name - Nome da tarefa
 * @param {string} tag - Etiqueta da tarefa
 */
const addTask = (name, tag) => {
  const tasks = loadTasksFromLocalStorage();

  const newTask = {
    id: Date.now(), // Gera ID único
    name,
    tag,
    createdAt: getCurrentDate(),
    checked: false
  };

  saveTasksInLocalStorage([...tasks, newTask]);
  renderTasks();
};

/**
 * Alterna o estado de conclusão de uma tarefa.
 *
 * @param {number} taskId - ID da tarefa
 */
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

/**
 * Remove todas as tarefas que estão concluídas.
 */
const removeCompletedTasks = () => {
  const tasks = loadTasksFromLocalStorage();
  const activeTasks = tasks.filter(task => !task.checked);

  saveTasksInLocalStorage(activeTasks);
  renderTasks();
};

/* =========================================================
 * EVENTOS
 * ========================================================= */

/**
 * Handler do formulário de criação de tarefas.
 *
 * Responsabilidade:
 * - Capturar valores do formulário
 * - Validar o nome da tarefa
 * - Criar a tarefa
 *
 * @param {Event} event
 */
const handleCreateTask = (event) => {
  event.preventDefault();

  const nameInput = event.target.querySelector('#desc');
  const tagInput = event.target.querySelector('#tag');

  if (!nameInput.value.trim()) return;

  addTask(nameInput.value, tagInput.value);
  event.target.reset();
};

/* =========================================================
 * INICIALIZAÇÃO DA APLICAÇÃO
 * ========================================================= */

/**
 * Executado quando a página é carregada.
 *
 * Responsabilidades:
 * - Registrar eventos
 * - Inicializar o LocalStorage (se necessário)
 * - Renderizar tarefas salvas
 */
window.onload = () => {
  const form = document.getElementById('create-task-form');
  form.addEventListener('submit', handleCreateTask);

  const removeBtn = document.getElementById('remove-completed-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', removeCompletedTasks);
  }

  // Inicializa tarefas padrão caso o LocalStorage esteja vazio
  if (!localStorage.getItem('tasks')) {
    saveTasksInLocalStorage(initialTasks);
  }

  renderTasks();
};
