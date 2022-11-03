/*
Sprint file that contains all code required for the sprint.html file
*/
"use strict";

function editTasksButton() {
    // allowing the button to be seen
    document.getElementById("editSprintTasks").style.display = "block";

    let htmlRef = document.getElementById("editSprintTasks");
    let html = "";

    // getting the index of the sprint
    let sprintIndex = retrieve(SPRINT_INDEX_KEY);

    // making the button
    html += `<button onclick="editTasks(${sprintIndex})">Add/Remove Tasks</button>`;

    htmlRef.innerHTML = html;
}

function editTasks(index) {
    // storing this index of this sprint in the sprintboard
    store(SPRINT_INDEX_KEY, index);

    // changing the location of the browser
    window.location = "./sprint_task.html";
}

function display() {
    // retrieving the sprint index from storage
    let index = retrieve(SPRINT_INDEX_KEY);

    // retrieving the sprintboard from storage
    let sprintBoard = new SprintBoard;
    sprintBoard.fromData(retrieve(SPRINT_BOARD_KEY));

    // getting the right sprint
    let sprint = sprintBoard.sprints[index];

    // checking if the tasks in this sprint can be changed
    if (sprint.status == "To Do") {
        editTasksButton();
    }

    // displaying the sprint name properly
    let sprintNameRef = document.getElementById("sprintName");
    let sprintNameOutput = `${sprint.name}`;
    sprintNameRef.innerHTML = sprintNameOutput;

    // displaying the dates the sprint goes on for
    let dateRef = document.getElementById("date");
    let dateOutput = "";
    let start = sprint.startDate;
    let end = sprint.endDate;
    dateOutput += `${start.getDate()}/${start.getMonth()+1}/${start.getFullYear()} `;
    dateOutput += `to ${end.getDate()}/${end.getMonth()+1}/${end.getFullYear()}`;
    dateRef.innerHTML = dateOutput;

    // doing the to do list first
    let toDoRef = document.getElementById("toDoContent");
    let toDoOutput = "";
    let toDoList = sprint.toDo;

    for (let i = 0; i < toDoList.length; i++) {
        toDoOutput += `<article><h3>${toDoList[i].title}</h3>`;
        toDoOutput += `Tag: ${toDoList[i].tag}<br>`;
        toDoOutput += `Story Point(s): ${toDoList[i].storyPoints}<br>`;
        toDoOutput += `<button onclick="expandTask('To Do', ${i})">Expand</button>`;
        if (sprint.status != "Done") { // should not be able to move tasks if sprint is done
            toDoOutput += `<button onclick="moveTask('To Do', ${i})">Move Right</button>`;
        }
        toDoOutput += `</article>`;
    }

    toDoRef.innerHTML = toDoOutput;

    // doing the in progress list next
    let inProgressRef = document.getElementById("inProgressContent");
    let inProgressOutput = "";
    let inProgressList = sprint.inProgress;

    for (let i = 0; i < inProgressList.length; i++) {
        inProgressOutput += `<article><h3>${inProgressList[i].title}</h3>`;
        inProgressOutput += `Tag: ${inProgressList[i].tag}<br>`;
        inProgressOutput += `Story Point(s): ${inProgressList[i].storyPoints}<br>`;
        if (sprint.status != "Done") { // should not be able to move tasks if sprint is done
            inProgressOutput += `<button onclick="moveTask('In Progress', ${i}, 'L')">Move Left</button>`;
        }
        inProgressOutput += `<button onclick="expandTask('In Progress', ${i})">Expand</button>`;
        if (sprint.status != "Done") { // should not be able to move tasks if sprint is done
            inProgressOutput += `<button onclick="moveTask('In Progress', ${i}, 'R')">Move Right</button>`;
        }
        inProgressOutput += `</article>`;
    }

    inProgressRef.innerHTML = inProgressOutput;

    // doing the done list next
    let completedRef = document.getElementById("doneContent");
    let completedOutput = "";
    let completedList = sprint.completed;

    for (let i = 0; i < completedList.length; i++) {
        completedOutput += `<article><h3>${completedList[i].title}</h3>`;
        completedOutput += `Tag: ${completedList[i].tag}<br>`;
        completedOutput += `Story Point(s): ${completedList[i].storyPoints}<br>`;
        if (sprint.status != "Done") { // should not be able to move tasks if sprint is done
            completedOutput += `<button onclick="moveTask('Done', ${i})">Move Left</button>`;
        }
        completedOutput += `<button onclick="expandTask('Done', ${i})">Expand</button>`;
        completedOutput += `</article>`;
    }

    completedRef.innerHTML = completedOutput;
}

function moveTask(list, index, direction = "") {
    // getting the right sprint
    let board = new SprintBoard;
    board.fromData(retrieve(SPRINT_BOARD_KEY));
    let sprintIndex = retrieve(SPRINT_INDEX_KEY);

    let sprint = board.sprints[sprintIndex];

    let task = new Task;
    if (list == "Done") { // if task is part of the done table
        task = sprint.completed[index];
        sprint.removeTask(list, index);
        task.progress = "In Progress";
        sprint.addTask(task);
    } else if (list == "In Progress") { // if the task is part of the in progress table
        task = sprint.inProgress[index];
        sprint.removeTask(list, index);
        if (direction == "L") { // if want to move to the to do table
            task.progress = "To Do";
        } else { // if want to move to the done table
            task.progress = "Done";
        }
        sprint.addTask(task);
    } else { // if task is part of the to do table
        task = sprint.toDo[index];
        sprint.removeTask(list, index);
        task.progress = "In Progress";
        sprint.addTask(task);
    }

    // saving the new modifications to the sprintboard
    store(SPRINT_BOARD_KEY, board);
    
    display()
}

// View full details of specific task
function expandTask(list, index) {
    // making popup appear
    document.getElementById("modal").style.display = "block";

    // getting data from local storage
    let board = new SprintBoard;
    board.fromData(retrieve(SPRINT_BOARD_KEY));

    // getting the sprint index from storage
    let sprintIndex = retrieve(SPRINT_INDEX_KEY);

    // getting the right sprint
    let sprint = board.sprints[sprintIndex];

    // getting the right task from the right list
    let task = new Task;

    if (list == "To Do") {
        task = sprint.toDo[index];
    } else if (list == "In Progress") {
        task = sprint.inProgress[index];
    } else {
        task = sprint.completed[index];
    }

    // getting the right location in the html file
    let htmlCodeRef = document.getElementById("expanded");
    let htmlCode = "";

    htmlCode += `<h2 style="word-wrap:break-word">${task._title}</h2>`;
    htmlCode += `<p style="word-wrap:break-word">Description: ${task._description}</p>`;
    htmlCode += `<p>Task Type: ${task._taskType}</p>`;
    htmlCode += `<p>Priority: ${task._priority}</p>`;
    htmlCode += `<p>Tag: ${task._tag}</p>`;
    htmlCode += `<p style="word-wrap:break-word">Story Point(s): ${task._storyPoints}</p>`;
    htmlCode += `<p style="word-wrap:break-word">Assignee: ${task._assignee._name}</p>`;

    // finding the total time spent in hrs and minutes
    let hours = Math.floor(task.timeSpent/60);
    if (hours == NaN) {
        hours = 0;
    }
    let minutes = task.timeSpent%60;
    if (minutes == NaN) {
        minutes = 0;
    }
    htmlCode += `<p style="word-wrap:break-word">Total Time Spent: Hrs: ${hours} Minutes: ${minutes}</p>`;

    htmlCode += `<p>Progress: ${task._progress}</p>`;
    htmlCode += `<div class="buttons">`;
    htmlCode += `<a class="lightRedBtn" id="closeButton" onclick="closeModal()">Close</a>`;
    htmlCode += `<a class="darkRedBtn" id="timeTaking" onclick="timeLogOpen('${list}', ${index})">Log Time</a>`
    htmlCode += `</div>`;

    // outputting the code 
    htmlCodeRef.innerHTML = htmlCode;
}

function closeModal() {
    // closing the modal popup
    document.getElementById("modal").style.display = "none";
}

// toggling the popup
function togglePopup(){
    document.getElementById("popup-1").classList.toggle("active");
}

// locally stored keys for the list and task index in the list for sprints
const SPRINT_LIST_KEY = "SPRINT_LIST_KEY";
const SPRINT_LIST_INDEX_KEY = "SPRINT_LIST_INDEX_KEY";

// function for opening the time log popup
function timeLogOpen(list, index) {
    // storing the required data into local storage
    store(SPRINT_LIST_KEY, list);
    store(SPRINT_LIST_INDEX_KEY, index);

    togglePopup();
}

// logging time
function logTime() {
    // getting the required variables from storage
    let sprintBoard = new SprintBoard;
    sprintBoard.fromData(retrieve(SPRINT_BOARD_KEY));

    let sprintIndex = retrieve(SPRINT_INDEX_KEY);
    let sprint = sprintBoard.sprints[sprintIndex];

    // getting the right task
    let sprintList = retrieve(SPRINT_LIST_KEY);
    let sprintListIndex = retrieve(SPRINT_LIST_INDEX_KEY);

    let task = new Task;
    if (sprintList == "To Do") {
        task = sprint.toDo[sprintListIndex];
    } else if (sprintList == "In Progress") {
        task = sprint.inProgress[sprintListIndex];
    } else {
        task = sprint.completed[sprintListIndex];
    }

    // getting the values from the input fields
    let hours = document.getElementById("hours").value;
    let minutes = document.getElementById("minutes").value;
    let date = document.getElementById("logDate").value;

    if ((hours == 0 && minutes == 0) || !date) {
        alert("Please fill in all information");
    } else {
        // getting the total amount of minutes spent on task
        let totalTime = Number(hours)*60 + Number(minutes);
        date = new Date(date);

        // incrementing the time spent to the task
        task.timeSpent += totalTime;

        // getting the UID from the task
        let teamMember = task.assignee;
        let memberUID = teamMember.memberUID;
        
        // updating the team member instance in both the task and the team member list
        // task first
        task.assignee.addTime(date, totalTime);

        // getting the right team member in the team member list
        let teamList = new TeamMemberList;
        teamList.fromData(retrieve(TEAM_MEMBER_LIST_KEY));

        teamMember = new TeamMember;
        for (let i=0; i<teamList.teamMembers.length; i++) {
            if (memberUID == teamList.teamMembers[i].memberUID) {
                teamMember = teamList.teamMembers[i];
                break;
            }
        }

        // updating the team member instance in the team member list
        teamMember.addTime(date, totalTime);

        // storing the changes
        store(SPRINT_BOARD_KEY, sprintBoard);
        store(TEAM_MEMBER_LIST_KEY, teamList);
        alert("Time Logged");

        expandTask(sprintList, sprintIndex);

        togglePopup();

        // returning the values back to their defaults
        document.getElementById("hours").value = 0;
        document.getElementById("minutes").value = 0;
        document.getElementById("logDate").value = "";
    }
}


window.onload = function () {
    // displaying the info required on this page
    display();
}
