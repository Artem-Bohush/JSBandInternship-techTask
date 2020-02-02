function initAppLogic() {
  function retrieveTasks() {
    const tasks = localStorage.getItem('allTasks');
    if (tasks !== null && tasks !== undefined) {
      return JSON.parse(tasks);
    }
    return null;
  }

  function writeTasks(tasks) {
    const serialAllTasks = JSON.stringify(tasks);
    try {
      localStorage.setItem('allTasks', serialAllTasks);
    } catch (e) {
      alert(
        'An error occurred while trying to save data :( Local storage is not available or data storage limit exceeded.'
      );
    }
  }

  function determineRightClass(task) {
    if (task.priority === 'high') {
      return 'status-high';
    }
    if (task.priority === 'normal') {
      return 'status-normal';
    }
    return 'status-low';
  }

  function generateHTMLCode(task) {
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
  }

  function drawTasks() {
    const currentTasks = retrieveTasks();
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
      const template = accordingToFiltersAndTitle.map(task => generateHTMLCode(task));
      const html = template.join(' ');
      document.querySelector('.cards-field').innerHTML = html;
    }
  }

  let counter = 0;
  (() => {
    drawTasks();
    const currentCounter = localStorage.getItem('counter');
    if (currentCounter) {
      counter = Number(currentCounter);
    } else {
      localStorage.setItem('counter', counter);
    }
  })();

  const statusSelect = document.querySelector('#statusSelect');
  statusSelect.addEventListener('change', () => {
    drawTasks();
  });

  const prioritySelect = document.querySelector('#prioritySelect');
  prioritySelect.addEventListener('change', () => {
    drawTasks();
  });

  const titleSearch = document.querySelector('#titleSearch');
  titleSearch.addEventListener('input', () => {
    drawTasks();
  });

  function toggleForm(show) {
    if (show === true) {
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
        document.querySelector('.title-required').style.display = 'none';
        document.querySelector('#task-title').style.border = '1px solid #CED4DA';
        document.querySelector('.overlay').classList.remove('fade');
      }, 300);
    }
  }

  const createTaskBtn = document.querySelector('#createTask');
  createTaskBtn.addEventListener('click', () => {
    toggleForm(true);
    document.querySelector('#editTask').style.display = 'none';
    document.querySelector('#saveTask').style.display = 'block';
  });

  const cancelAddingTaskBtn = document.querySelector('#cancelAddingTask');
  cancelAddingTaskBtn.addEventListener('click', () => {
    toggleForm(false);
  });

  const titleInput = document.querySelector('#task-title');
  titleInput.addEventListener('input', () => {
    document.querySelector('.title-required').style.display = 'none';
    document.querySelector('#task-title').style.border = '1px solid #80BDFF';
  });

  titleInput.addEventListener('blur', () => {
    document.querySelector('#task-title').style.border = '1px solid #CED4DA';
  });

  const saveTaskBtn = document.querySelector('#saveTask');
  saveTaskBtn.addEventListener('click', e => {
    e.preventDefault();
    const taskTitleInput = document.querySelector('#task-title');
    if (taskTitleInput.value !== '') {
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
      const currentTasks = retrieveTasks();
      if (currentTasks !== null) {
        currentTasks.unshift(newTask);
        writeTasks(currentTasks);
      } else {
        const newTaskList = [];
        newTaskList.push(newTask);
        writeTasks(newTaskList);
      }
      toggleForm(false);
      drawTasks();
    } else {
      document.querySelector('.title-required').style.display = 'block';
      taskTitleInput.style.border = '1px solid #FF2525';
    }
  });

  let toEditTaskId = '';
  const cardsField = document.querySelector('.cards-field');
  cardsField.addEventListener('click', e => {
    const { target } = e;
    if (target.getAttribute('id') === 'done') {
      const taskId = target.parentElement.getAttribute('id');
      const currentTasks = retrieveTasks();
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
      writeTasks(currentTasks);
      drawTasks();
    } else if (target.getAttribute('id') === 'edit') {
      const taskId = target.parentElement.getAttribute('id');
      toEditTaskId = taskId;
      const currentTasks = retrieveTasks();
      const toEdit = currentTasks.find(t => t.id === Number(taskId));
      toggleForm(true);
      document.querySelector('#task-title').value = toEdit.title;
      document.querySelector('#task-description').value = toEdit.description;
      document.querySelector('#task-priority').value = toEdit.priority;
      document.querySelector('#saveTask').style.display = 'none';
      document.querySelector('#editTask').style.display = 'block';
    } else if (target.getAttribute('id') === 'delete') {
      const taskId = target.parentElement.getAttribute('id');
      const currentTasks = retrieveTasks();
      const toDelete = currentTasks.find(t => t.id === Number(taskId));
      const toDeleteIndex = currentTasks.indexOf(toDelete);
      currentTasks.splice(toDeleteIndex, 1);
      writeTasks(currentTasks);
      drawTasks();
    }
  });

  const editTaskBtn = document.querySelector('#editTask');
  editTaskBtn.addEventListener('click', e => {
    e.preventDefault();
    const taskTitleInput = document.querySelector('#task-title');
    if (taskTitleInput.value !== '') {
      const form = document.querySelector('#taskData');
      const formData = new FormData(form);
      const editedTaskData = {};
      formData.forEach((value, key) => {
        editedTaskData[key] = value;
      });
      const currentTasks = retrieveTasks();
      const toEdit = currentTasks.find(t => t.id === Number(toEditTaskId));
      const toEditIndex = currentTasks.indexOf(toEdit);
      toEdit.title = editedTaskData.title;
      toEdit.description = editedTaskData.description;
      toEdit.priority = editedTaskData.priority;
      currentTasks[toEditIndex] = toEdit;
      writeTasks(currentTasks);
      toggleForm(false);
      drawTasks();
    } else {
      document.querySelector('.title-required').style.display = 'block';
      taskTitleInput.style.border = '1px solid #FF2525';
    }
  });
}

export default initAppLogic;
