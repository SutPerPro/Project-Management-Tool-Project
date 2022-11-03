/*
Sprint task file that gives all the functionality of the sprint_task.html file
*/ 

function displayAll() {

    // doing the current tasks in the sprint first
    // getting the index of this sprint on the sprint board
    let sprintIndex = retrieve(SPRINT_INDEX_KEY);

    // retrieving and reinitialising the sprint board
    let sprintBoard = new SprintBoard;
    sprintBoard.fromData(retrieve(SPRINT_BOARD_KEY));

    // the sprint that we are looking at
    let sprint = sprintBoard.sprints[sprintIndex];

    // putting the tasks into the output
    let sprintRef = document.getElementById("sprintTasks");
    let output = "";

    let toDoList = sprint.toDo;
    for (let i = 0; i < toDoList.length; i++) {
        output += `<article><h3>${toDoList[i].title}</h3>`;
        output += `Tag: ${toDoList[i].tag}<br>`;
        output += `Story Point(s): ${toDoList[i].storyPoints}<br>`;
        output += `<button onclick="removeFromSprint('To Do', ${i})">Remove</button></article>`;
    }

    let inProgressList = sprint.inProgress;
    for (let i = 0; i < inProgressList.length; i++) {
        output += `<article><h3>${inProgressList[i].title}</h3>`;
        output += `Tag: ${inProgressList[i].tag}<br>`;
        output += `Story Point(s): ${inProgressList[i].storyPoints}<br>`;
        output += `<button onclick="removeFromSprint('In Progress', ${i})">Remove</button></article>`;
    }

    let completedList = sprint.completed;
    for (let i = 0; i < completedList.length; i++) {
        output += `<article><h3>${completedList[i].title}</h3>`;
        output += `Tag: ${completedList[i].tag}<br>`;
        output += `Story Point(s): ${completedList[i].storyPoints}<br>`;
        output += `<button onclick="removeFromSprint('Done', ${i})">Remove</button></article>`;
    }

    sprintRef.innerHTML = output;

    // doing the backlogged tasks next
    // getting the project backlog
    let projectBacklog = new ProjectBacklog;
    projectBacklog.fromData(retrieve(PROJECT_BACKLOG_DATA_KEY));

    let backlogRef = document.getElementById("backlogTasks");
    output = "";

    for (let i = 0; i < projectBacklog.tasks.length; i++) {
        output += `<article><h3>${projectBacklog.tasks[i].title}</h3>`;
        output += `Tag: ${projectBacklog.tasks[i].tag}<br>`;
        output += `Story Point(s): ${projectBacklog.tasks[i].storyPoints}<br>`;
        output += `<button onclick="addToSprint(${i})">Add</button></article>`;
    }

    backlogRef.innerHTML = output;
}

function addToSprint(index) {
    // getting the backlog
    let backlog = new ProjectBacklog;
    backlog.fromData(retrieve(PROJECT_BACKLOG_DATA_KEY));

    // getting the sprint and the sprintboard
    let sprintBoard = new SprintBoard;
    sprintBoard.fromData(retrieve(SPRINT_BOARD_KEY));

    let sprintIndex = retrieve(SPRINT_INDEX_KEY);

    let sprint = sprintBoard.sprints[sprintIndex]; // found the sprint

    // moving the task to the sprint
    let task = backlog.tasks[index];
    
    if (task.progress == "To Do") {
        sprint.toDo.push(task);
    } else if (task.progress == "In Progress") {
        sprint.inProgress.push(task);
    } else {
        sprint.completed.push(task);
    }

    // removing the task from project backlog
    backlog.removeTask(index);

    // saving the final results
    store(SPRINT_BOARD_KEY, sprintBoard);
    store(PROJECT_BACKLOG_DATA_KEY, backlog);

    // displaying the new changes
    displayAll()
}

function removeFromSprint(list, index) {
    // getting the project backlog
    let backlog = new ProjectBacklog;
    backlog.fromData(retrieve(PROJECT_BACKLOG_DATA_KEY));

    // getting the sprint
    let board = new SprintBoard;
    board.fromData(retrieve(SPRINT_BOARD_KEY));
    let sprintIndex = retrieve(SPRINT_INDEX_KEY);

    let sprint = board.sprints[sprintIndex];

    // re-adding the task back to backlog
    // PLACEHOLDER SINCE IF YOU CAN MOVE TO AND FROM SPRINT THEN SPRINT HAS NOT STARTED
    // REQUIREMENTS STATE THAT ALL TASKS SHOULD ONLY BE 'TO DO' WHEN MADE SO ALL TASKS
    // SHOULD BE IN 'TO DO' LIST
    if (list == "Done") {
        task = sprint.completed[index];
        backlog.tasks.push(task);
    } else if (list == "In Progress") {
        task = sprint.inProgress[index];
        backlog.tasks.push(task);
    } else if (list == "To Do") {
        task = sprint.toDo[index];
        backlog.tasks.push(task);
    }

    // removing the task from the sprint
    sprint.removeTask(list, index);

    // storing the changes
    store(SPRINT_BOARD_KEY, board);
    store(PROJECT_BACKLOG_DATA_KEY, backlog);

    // displaying te changes
    displayAll();
}

window.onload = function () {
    // displaying the info required on this page
    displayAll();
}