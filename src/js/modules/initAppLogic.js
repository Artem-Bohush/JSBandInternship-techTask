function initAppLogic() {
  const tasksRetriever = function getAllTasks() {
    const tasks = localStorage.getItem('allTasks');
    if (tasks !== null && tasks !== undefined) {
      return JSON.parse(tasks);
    }
    return null;
  };

  const taskWriter = function setAllTasks(tasks) {
    const serialAllTasks = JSON.stringify(tasks);
    try {
      localStorage.setItem('allTasks', serialAllTasks);
    } catch (e) {
      alert(
        'An error occurred while trying to save data :( Local storage is not available or data storage limit exceeded.'
      );
    }
  };

  const determineRightClass = function checkPriority(task) {
    if (task.priority === 'high') {
      return 'status-high';
    }
    if (task.priority === 'normal') {
      return 'status-normal';
    }
    return 'status-low';
  };

  const newTaskCardHtml = function createHtml(task) {
    return `
      <div class="task-card ${task.status === 'done' ? 'done' : ''}">
        <div class="task-card-top-group">
          <h3 class="task-card-title">${task.title}</h3>
          <p class="task-card-descr">${task.description}</p>
        </div>
        <div class="task-card-bottom-group">
          <div class="task-card-priority ${determineRightClass(task)}">${task.priority}</div>
          <div class="task-card-options">
            <div class="dropdown">
              <button class="btn btn-secondary dropdown-toggle" type="button" 
                id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" 
                aria-expanded="false"><span class="icon-settings"></span></button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenu2" id="${task.id}">
                <button class="dropdown-item" type="button" id="done"
                  ${task.status === 'done' ? 'disabled' : ''}>done</button>
                <button class="dropdown-item" type="button" id="edit" 
                  ${task.status === 'done' ? 'disabled' : ''}>edit</button>
                <button class="dropdown-item" type="button" id="delete">delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  const tasksDrawer = function showAllTasks() {
    const currentTasks = tasksRetriever();
    if (currentTasks !== null) {
      const neededStatus = document.querySelector('#statusSelect').value;
      const neededPriority = document.querySelector('#prioritySelect').value;
      const neededTitle = document.querySelector('#titleSearch').value;
      const accordingToFiltersAndTitle = [];
      if (neededTitle !== '') {
        currentTasks.forEach(element => {
          if (element.title.indexOf(neededTitle) !== -1) {
            if (neededStatus === 'all' && neededPriority === 'all') {
              accordingToFiltersAndTitle.push(element);
            } else if (neededStatus === 'all' && element.priority === neededPriority) {
              accordingToFiltersAndTitle.push(element);
            } else if (neededPriority === 'all' && element.status === neededStatus) {
              accordingToFiltersAndTitle.push(element);
            } else if (element.status === neededStatus && element.priority === neededPriority) {
              accordingToFiltersAndTitle.push(element);
            }
          }
        });
      } else {
        currentTasks.forEach(element => {
          if (neededStatus === 'all' && neededPriority === 'all') {
            accordingToFiltersAndTitle.push(element);
          } else if (neededStatus === 'all' && element.priority === neededPriority) {
            accordingToFiltersAndTitle.push(element);
          } else if (neededPriority === 'all' && element.status === neededStatus) {
            accordingToFiltersAndTitle.push(element);
          } else if (element.status === neededStatus && element.priority === neededPriority) {
            accordingToFiltersAndTitle.push(element);
          }
        });
      }
      const template = accordingToFiltersAndTitle.map(task => newTaskCardHtml(task));
      const html = template.join(' ');
      document.querySelector('.cards-field').innerHTML = html;
    }
  };

  let counter = 0;
  (() => {
    tasksDrawer();
    const currentCounter = localStorage.getItem('counter');
    if (currentCounter) {
      counter = Number(currentCounter);
    } else {
      localStorage.setItem('counter', counter);
    }
  })();

  const statusSelect = document.querySelector('#statusSelect');
  statusSelect.addEventListener('change', () => {
    tasksDrawer();
  });

  const prioritySelect = document.querySelector('#prioritySelect');
  prioritySelect.addEventListener('change', () => {
    tasksDrawer();
  });

  const titleSearch = document.querySelector('#titleSearch');
  titleSearch.addEventListener('input', () => {
    tasksDrawer();
  });

  const formToggle = function hideTaskDataForm(status) {
    if (status === true) {
      document.querySelector('.overlay').classList.add('appear');
      document.querySelector('.overlay').style.display = 'block';
      setTimeout(() => {
        document.querySelector('.overlay').classList.remove('appear');
      }, 300);
    } else {
      document.querySelector('.overlay').classList.add('fade');
      document.querySelector('#task-title').value = '';
      document.querySelector('#task-description').value = '';
      document.querySelector('#task-priority').value = 'high';
      setTimeout(() => {
        document.querySelector('.overlay').style.display = 'none';
        document.querySelector('.overlay').classList.remove('fade');
      }, 300);
    }
  };

  const createTaskBtn = document.querySelector('#createTask');
  createTaskBtn.addEventListener('click', () => {
    formToggle(true);
    document.querySelector('#editTask').style.display = 'none';
    document.querySelector('#saveTask').style.display = 'block';
  });

  const cancelAddingTaskBtn = document.querySelector('#cancelAddingTask');
  cancelAddingTaskBtn.addEventListener('click', () => {
    formToggle(false);
  });

  const saveTaskBtn = document.querySelector('#saveTask');
  saveTaskBtn.addEventListener('click', e => {
    e.preventDefault();
    const form = document.querySelector('#taskData');
    const formData = new FormData(form);
    const newTask = {
      id: counter,
      status: 'open',
    };
    counter += 1;
    localStorage.setItem('counter', counter);
    formData.forEach((value, key) => {
      newTask[key] = value;
    });
    const currentTasks = tasksRetriever();
    if (currentTasks !== null) {
      currentTasks.unshift(newTask);
      taskWriter(currentTasks);
    } else {
      const newTaskList = [];
      newTaskList.push(newTask);
      taskWriter(newTaskList);
    }
    formToggle(false);
    tasksDrawer();
  });

  let toEditTaskId = '';
  const cardsField = document.querySelector('.cards-field');
  cardsField.addEventListener('click', e => {
    const { target } = e;
    if (target.getAttribute('id') === 'done') {
      const taskId = target.parentElement.getAttribute('id');
      const currentTasks = tasksRetriever();
      currentTasks.find(t => t.id === Number(taskId)).status = 'done';
      for (let i = 0; i < currentTasks.length; i += 1) {
        if (
          i !== currentTasks.length - 1 &&
          currentTasks[i].status === 'done' &&
          currentTasks[i + 1].status !== 'done'
        ) {
          const temp = currentTasks[i];
          currentTasks[i] = currentTasks[i + 1];
          currentTasks[i + 1] = temp;
        }
      }
      taskWriter(currentTasks);
      tasksDrawer();
    } else if (target.getAttribute('id') === 'edit') {
      const taskId = target.parentElement.getAttribute('id');
      toEditTaskId = taskId;
      const currentTasks = tasksRetriever();
      const toEdit = currentTasks.find(t => t.id === Number(taskId));
      formToggle(true);
      document.querySelector('#task-title').value = toEdit.title;
      document.querySelector('#task-description').value = toEdit.description;
      document.querySelector('#task-priority').value = toEdit.priority;
      document.querySelector('#saveTask').style.display = 'none';
      document.querySelector('#editTask').style.display = 'block';
    } else if (target.getAttribute('id') === 'delete') {
      const taskId = target.parentElement.getAttribute('id');
      const currentTasks = tasksRetriever();
      const toDelete = currentTasks.find(t => t.id === Number(taskId));
      const toDeleteIndex = currentTasks.indexOf(toDelete);
      currentTasks.splice(toDeleteIndex, 1);
      taskWriter(currentTasks);
      tasksDrawer();
    }
  });

  const editTaskBtn = document.querySelector('#editTask');
  editTaskBtn.addEventListener('click', e => {
    e.preventDefault();
    const form = document.querySelector('#taskData');
    const formData = new FormData(form);
    const editedTaskData = {};
    formData.forEach((value, key) => {
      editedTaskData[key] = value;
    });
    const currentTasks = tasksRetriever();
    const toEdit = currentTasks.find(t => t.id === Number(toEditTaskId));
    const toEditIndex = currentTasks.indexOf(toEdit);
    toEdit.title = editedTaskData.title;
    toEdit.description = editedTaskData.description;
    toEdit.priority = editedTaskData.priority;
    currentTasks[toEditIndex] = toEdit;
    taskWriter(currentTasks);
    formToggle(false);
    tasksDrawer();
  });
}

export default initAppLogic;
