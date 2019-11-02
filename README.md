# TODOList App

  This is an application that will help you make a list of tasks and monitor their progress.

## Description
  The application allows you to create case records with the heading, a brief description and priority of 
execution (high, normal and low). After creation, a new record is placed at the beginning of the queue, 
shifting the already created ones. You can easily change any parameters of an already created record, as
well as mark the recording as “done” after completing the task. All "done" tasks are transferred to the 
end of the queue, and they are sorted by the same principle as the "open" tasks. 
Do not worry if the number of current tasks will be quite large, because you can perform a search by 
title or simply filter by priority of execution, as well as display only all "done" tasks to make a 
retrospective :)

## Installation

  This is a web application, so installation is not required. Just follow the link [TODOList](https://artem-bohush.github.io/toDoList/).

## Usage
  If you have a desire to add some kind of functionality, you should understand the already written 
application logic in the src/js/modules/initAppLogic.js file. All application logic is described by the 
following sentence - to get data from the form, make some conversions(if neeeded), write/overwrite to 
the database (in this case, local storage is used), immediately extract just written/overwritten data 
and render the corresponding changes to the user. Yes, it sounds like work with component state change 
and subsequent rerendering)
  So, with regard to the code: 
  - first written a function for retrieving data:
```
const tasksRetriever = function getAllTasks() {
  // some code...
};
```
- next there is a function for writing data:
```
const taskWriter = function setAllTasks(tasks) {
  // some code...
};
```
- then we have a function for rendering data:
```
const tasksDrawer = function showAllTasks() {
const currentTasks = tasksRetriever();
    // some code...
};
```
As you can see this function use previous one for retrieving data, and then call the next one for creating a string of html code.
- html code generator function:
```
const newTaskCardHtml = function createHtml(task) {
  return `
    // html code
  `;
};
```
- this immediately invoked function does the first rendering after opening a page and set id counter value:
```
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
```
By the way, as for the id - we assign a unique id to each task and, when generating the html code, we assign it to the corresponding element on the page. When a click is made on one of the options (done, edit, delete), we determine the id of the current element and can find the corresponding object in the database.
- there is also a function to open and close the data entry form of the task:
```
const formToggle = function hideTaskDataForm(show) {
  // some simple logic
};
```
- then we have event handlers with uncomplicated logic that call one or another function at a certain moment.

## Support
  If you have any questions, please drop me a line at art.bohush@gmail.com
