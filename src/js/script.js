window.addEventListener('DOMContentLoaded', function () {

    'use strict';

    const tasksRetriever = function getAllTasks() {
        const tasks = localStorage.getItem('allTasks');
        if (tasks !== null) {
            return JSON.parse(tasks);
        } else {
            return null;
        }
    };

    const taskWriter = function setAllTasks(tasks) {
        const serialAllTasks = JSON.stringify(tasks);
        try {
            localStorage.setItem('allTasks', serialAllTasks);
        } catch (e) {
            if (e == QUOTA_EXCEEDED_ERR) {
             alert('Exceeded task limit! The task was not saved.');
            }
        }
    };

    const newTaskCardHtml = function createHtml(task) {
        return `
            <div class="task-card ${task.status === 'done' ? 'done' : ''}">
                <div class="task-card-top-group">
                    <h3 class="task-card-title">${task.title}</h3>
                    <p class="task-card-descr">${task.description}</p>
                </div>
                <div class="task-card-bottom-group">
                    <div class="task-card-priority">${task.priority}</div>
                    <div class="task-card-options">
                        <div class="dropdown">
                            <button class="btn btn-secondary dropdown-toggle" type="button" 
                                id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" 
                                aria-expanded="false">...</button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu2" id="${task.id}">
                                <button class="dropdown-item" type="button" id="done">done</button>
                                <button class="dropdown-item" type="button" id="edit">edit</button>
                                <button class="dropdown-item" type="button" id="delete">delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
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
    (function () {
        tasksDrawer();
        const a = localStorage.getItem('counter');
        if (a) {
            counter = +a;
        } else {
            localStorage.setItem('counter', counter);
        }
    }());

    const createTask = document.querySelector('#createTask');
    createTask.addEventListener('click', () => {
        document.querySelector('.overlay').style.display = 'block';
        document.querySelector('#editTask').style.display = 'none';
        document.querySelector('#saveTask').style.display = 'block';
    });

    const cancelAddingTask = document.querySelector('#cancelAddingTask');
    cancelAddingTask.addEventListener('click', () => {
        document.querySelector('.overlay').style.display = 'none';
    });

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

    const saveTask = document.querySelector('#saveTask');
    saveTask.addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.getElementsByTagName('form')[0];
        const formData = new FormData(form);
        const newTask = {
            id: counter,
            status: 'open'
        };
        counter += 1;
        localStorage.setItem('counter', counter);
        formData.forEach(function (value, key) {
            newTask[key] = value;
        });
        const currentTasks = tasksRetriever();
        if (currentTasks !== null) {
            currentTasks.unshift(newTask);
            taskWriter(currentTasks);
        } else {
            const t = [];
            t.push(newTask);
            taskWriter(t);
        }
        document.querySelector('.overlay').style.display = 'none';
        tasksDrawer();    
    });

    let toEditTaskId = '';

    const cardsField = document.querySelector('.cards-field');
    cardsField.addEventListener('click', (e) => {
        const target = e.target;
        if (target.getAttribute('id') === 'done') {
            const taskId = target.parentElement.getAttribute('id');
            const currentTasks = tasksRetriever();
            currentTasks.find(t => t.id === +taskId).status = 'done';
            taskWriter(currentTasks);
            tasksDrawer();
        } else if (target.getAttribute('id') === 'edit') {
            const taskId = target.parentElement.getAttribute('id');
            toEditTaskId = taskId;
            const currentTasks = tasksRetriever();
            const toEdit = currentTasks.find(t => t.id === +taskId);
            document.querySelector('.overlay').style.display = 'block';
            document.querySelector('#task-title').value = toEdit.title;
            document.querySelector('#task-description').value = toEdit.description;
            document.querySelector('#task-priority').value = toEdit.priority;
            document.querySelector('#saveTask').style.display = 'none';
            document.querySelector('#editTask').style.display = 'block';
        } else if (target.getAttribute('id') === 'delete') {
            const taskId = target.parentElement.getAttribute('id');
            const currentTasks = tasksRetriever();
            const toDelete = currentTasks.find(t => t.id === +taskId);
            const toDeleteIndex = currentTasks.indexOf(toDelete);
            currentTasks.splice(toDeleteIndex, 1);
            taskWriter(currentTasks);
            tasksDrawer();
        }
    });

    const editTask = document.querySelector('#editTask');
    editTask.addEventListener('click', (e) => {
        e.preventDefault();
        const form = document.getElementsByTagName('form')[0];
        const formData = new FormData(form);
        const editedTaskData = {};
        formData.forEach(function (value, key) {
            editedTaskData[key] = value;
        });
        const currentTasks = tasksRetriever();
        currentTasks.forEach(element => {
            if (element.id === +toEditTaskId) {
                element.title = editedTaskData.title;
                element.description = editedTaskData.description;
                element.priority = editedTaskData.priority;
            }
        });
        taskWriter(currentTasks);
        document.querySelector('.overlay').style.display = 'none';
        tasksDrawer();
    });

});