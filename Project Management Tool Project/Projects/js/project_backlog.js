/*
Product backlog file that codes for the product_backlog.html
*/
"use strict";

// Display tasks on web page
function displayTasks(listOfTasks) {
    let htmlCodeRef = document.getElementById("tasks");
    let htmlCode = "";

    listOfTasks = filterTag(listOfTasks);

    for (let i = 0; i < listOfTasks.length; i++) {
        // Filtered out tasks are set to 0 and added as an entry, due to the nature of the program to access expanding, 
        // editing and deleting functionalities based on index.
        if (listOfTasks[i] != 0) {
            htmlCode += `<article id="taskTitle${i}" class="${listOfTasks[i].priority}" onclick="expandTask(${i})">`;
            htmlCode += `<h2 style="overflow:hidden;text-align:center">${listOfTasks[i].title}</h2>`;
            htmlCode += `<p>Tag: ${listOfTasks[i].tag}</p>`;
            htmlCode += `<p style="overflow:hidden">Story Point(s): ${listOfTasks[i].storyPoints}</p>`;
            htmlCode += `<p>Priority: ${listOfTasks[i].priority}</p>`;
            htmlCode += `<div class="buttons" style="text-align:right">`
            htmlCode += `<a class="lightRedBtn" id="editButton${i}" onclick="openEditTaskWindow(event, ${i})">Edit</a>\n`;
            htmlCode += `<a class="darkRedBtn" id="deleteButton${i}" onclick="deleteTask(event, ${i})">Delete</a>`;
            htmlCode += `</div></article>`
        }
    }

    htmlCodeRef.innerHTML = htmlCode;
}

// Display box to add a new task or edit a task
function openAddTaskWindow() {
    // make the popup appear and button disappear
    document.getElementById("newTask").style.display = "block";
    document.getElementById("newTaskButton").style.display = "none";
    document.getElementById("taskHeader").innerText = "New Task";
    document.getElementById("newTask").scrollIntoView();

    store(TASK_INDEX_KEY, -1);
}

// Close the box to add a task or edit a task and reset values typed in
function closeAddTaskWindow() {
    // making the popup disappear and the button reappear
    document.getElementById("newTask").style.display = "none";
    document.getElementById("newTaskButton").style.display = "block";

    // returning the input fields to their defaults
    document.getElementById("title").value = "";
    document.getElementById("taskDescription").value = "";
    document.getElementById("taskType").value = "Choose an Option";
    document.getElementById("priority").value = "Choose an Option";
    document.getElementById("tag").value = "Choose an Option";
    document.getElementById("storyPoints").value = "1";
    document.getElementById("assigneeName").value = "None";
    document.getElementById("progress").value = "Choose an Option";

    let index = retrieve(TASK_INDEX_KEY);

    if (index == -1) {
        // changing the window location to the newest task
        window.scrollTo(0, document.body.scrollHeight);
    } else {
        document.getElementById(`taskTitle${index}`).scrollIntoView();
    }
}

// Add new task or Save the edit of a task
function addNewTask() {
    // getting the values for the tasks
    let index = retrieve(TASK_INDEX_KEY);
    let title = document.getElementById("title").value;
    let priority = document.getElementById("priority").value;
    let tag = document.getElementById("tag").value;
    let taskType = document.getElementById("taskType").value;
    let storyPoints = document.getElementById("storyPoints").value;
    let description = document.getElementById("taskDescription").value;
    let assignee = document.getElementById("assigneeName").value;
    let progress = document.getElementById("progress").value;

    if (title == "" || description == "" || taskType == "Choose an Option" || priority == "Choose an Option" ||
        tag == "Choose an Option" || storyPoints == "" || storyPoints == NaN || assignee == "None" || progress == "Choose an Option") {
        // seeing that there arent any team members in the team member list
            if (document.getElementById("assigneeName").length == 1) {
            alert("Please fill in all Information! (Also add some team members)");
        } else {
            alert("Please fill in all Information!");
        }
    } else {
        // adding the information found in the html file into a new task
        let projectBacklog = new ProjectBacklog;
        projectBacklog.fromData(retrieve(PROJECT_BACKLOG_DATA_KEY));

        // index of -1 means a new task needs to be added, any other index refers to a certain task to be edited
        if (index == -1) {
            projectBacklog.addTask(title, priority, tag, taskType, storyPoints, description, assignee, progress);
            alert("New Task Added");
        } else {
            projectBacklog.tasks[index].title = title;
            projectBacklog.tasks[index].priority = priority;
            projectBacklog.tasks[index].tag = tag;
            projectBacklog.tasks[index].taskType = taskType;
            projectBacklog.tasks[index].storyPoints = storyPoints;
            projectBacklog.tasks[index].description = description;
            projectBacklog.tasks[index].assignee = assignee;
            projectBacklog.tasks[index].progress = progress;
        }

        // displaying all the tasks and storing the project backlog
        displayTasks(projectBacklog.tasks);
        store(PROJECT_BACKLOG_DATA_KEY, projectBacklog);

        //close window
        closeAddTaskWindow();
    }
}

// Opens and modifies new task window for editing specific task
function openEditTaskWindow(event, index) {
    // Store index into constant for later use
    store(TASK_INDEX_KEY, index);

    // Set box for editing
    document.getElementById("newTask").style.display = "block";
    document.getElementById("newTaskButton").style.display = "none";
    document.getElementById("taskHeader").innerText = "Edit Task";
    document.getElementById("newTask").scrollIntoView();

    // Load specific task to fill in data
    let projectBacklog = new ProjectBacklog;
    projectBacklog.fromData(retrieve(PROJECT_BACKLOG_DATA_KEY));

    // Load existing data
    document.getElementById("title").value = projectBacklog._tasks[index].title;
    document.getElementById("taskDescription").value = projectBacklog._tasks[index].description;
    document.getElementById("taskType").value = projectBacklog._tasks[index].taskType;
    document.getElementById("priority").value = projectBacklog._tasks[index].priority;
    document.getElementById("tag").value = projectBacklog._tasks[index].tag;
    document.getElementById("storyPoints").value = projectBacklog._tasks[index].storyPoints;
    // for the correct member
    document.getElementById("assigneeName").value = projectBacklog._tasks[index].assignee.memberUID;
    document.getElementById("progress").value = projectBacklog._tasks[index].progress;

    // Prevents the article below (clicking on task below opens expanded information) from being clicked
    event.stopPropagation();
}

// Delete task from project backlog
function deleteTask(event, index) {
    let confirmDelete = confirm("Confirm Delete?")

    if (confirmDelete) {
        // getting project backlop from storage
        let projectBacklog = new ProjectBacklog;
        projectBacklog.fromData(retrieve(PROJECT_BACKLOG_DATA_KEY));

        // removing task
        projectBacklog.removeTask(index);

        // storing the changed project backlog
        store(PROJECT_BACKLOG_DATA_KEY, projectBacklog);
        displayTasks(projectBacklog._tasks);
    }

    // Prevents the article below (clicking on task below opens expanded information) from being clicked
    event.stopPropagation();
}

// View full details of specific task
function expandTask(index) {
    // making popup appear
    document.getElementById("modal").style.display = "block";

    // getting data from local storage
    let projectBacklog = new ProjectBacklog;
    projectBacklog.fromData(retrieve(PROJECT_BACKLOG_DATA_KEY));

    // getting the right location in the html file
    let htmlCodeRef = document.getElementById("expanded");
    let htmlCode = "";
    let task = projectBacklog._tasks[index];

    htmlCode += `<h2 style="word-wrap:break-word">${task._title}</h2>`;
    htmlCode += `<p style="word-wrap:break-word">Description: ${task._description}</p>`;
    htmlCode += `<p>Task Type: ${task._taskType}</p>`;
    htmlCode += `<p>Priority: ${task._priority}</p>`;
    htmlCode += `<p>Tag: ${task._tag}</p>`;
    htmlCode += `<p style="word-wrap:break-word">Story Point(s): ${task._storyPoints}</p>`;
    htmlCode += `<p style="word-wrap:break-word">Assignee: ${task._assignee.name}</p>`;
    htmlCode += `<p>Progress: ${task._progress}</p>`;
    htmlCode += `<div class="buttons">`
    htmlCode += `<a class="lightRedBtn" id="closeButton" onclick="closeModal()">Close</a>`
    htmlCode += `</div>`;

    // outputting the code 
    htmlCodeRef.innerHTML = htmlCode;
}

function closeModal() {
    // closing the modal popup
    document.getElementById("modal").style.display = "none";
}

// Add tags at the top of page for filtering tasks
function populateTagFilter() {
    let dropDownRef = document.getElementById("tagFilter");
    let dropDownCode = `<option value="None" selected>None</option>`;

    document.getElementsByName("tag").forEach(element => {
        dropDownCode += `<option value="${element.value}">${element.value}</option>`;
    });

    dropDownRef.innerHTML = dropDownCode;
}

// Filter tasks based on tags checked
function filterTag(listOfTasks) {
    let filteredList = [];

    for (let i = 0; i < listOfTasks.length; i++) {
        let tag = document.getElementById("tagFilter").value;
        let addTask = false;

        // If selected task is "None" then nothing needs to be filtered
        if (tag == "None") {
            addTask = true;
        } else {
            if (tag == listOfTasks[i].tag) {
                addTask = true;
            }
        }

        if (addTask == true) {
            filteredList.push(listOfTasks[i]);
        } else {
            filteredList.push(0);
        }
    }

    return filteredList;
}

// Disallow characters other than integers
function isNumber(event) {
    event = (event) ? event : window.event;
    var charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }

    return true;
}

// Update page every time a checkbox is pressed
function filterDropdownPressed() {
    let projectBacklog = new ProjectBacklog;

    if (checkData(PROJECT_BACKLOG_DATA_KEY)) {
        projectBacklog.fromData(retrieve(PROJECT_BACKLOG_DATA_KEY));
    }

    store(PROJECT_BACKLOG_DATA_KEY, projectBacklog);
    displayTasks(projectBacklog.tasks);
}

// adding the team members into the add task function to make sure we have the right team members
function populateMemberDropDown() {
    let htmlRef = document.getElementById("assigneeName");
    let htmlOutput = "";

    // getting the team members
    let memberList = new TeamMemberList;
    memberList.fromData(retrieve(TEAM_MEMBER_LIST_KEY));
    let list = memberList.teamMembers;

    htmlOutput += `<option value="None" selected>None</option>`;
    for (let i=0; i<list.length; i++) {
        htmlOutput += `<option value="${list[i].memberUID}">${list[i].name}</option>`;
    }

    htmlRef.innerHTML = htmlOutput;
}

window.onload = function () {
    //make a new user instance
    let projectBacklog = new ProjectBacklog;

    // checking to see if a project backlog already exists
    if (checkData(PROJECT_BACKLOG_DATA_KEY)) {
        projectBacklog.fromData(retrieve(PROJECT_BACKLOG_DATA_KEY));
    }

    // storing the project backlog into storage
    store(PROJECT_BACKLOG_DATA_KEY, projectBacklog);
    populateTagFilter();
    displayTasks(projectBacklog.tasks);
    populateMemberDropDown();
}
