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
  - first, a function was written to extract data from local storage
```
// Foo
var bar = 0;
```

## Support
  If you have any questions, please drop me a line at art.bohush@gmail.com
