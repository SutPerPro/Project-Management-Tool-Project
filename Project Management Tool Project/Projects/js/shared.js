/*
Shared file for all HTML files to access classes and for other JavaScript files to access classes and common functions
*/
"use strict";

const PROJECT_BACKLOG_DATA_KEY = "PROJECT_BACKLOG";
const TASK_INDEX_KEY = "TASK_INDEX";
const SPRINT_BOARD_KEY = "SPRINT_BOARD";
const SPRINT_INDEX_KEY = "SPRINT_INDEX";
const TEAM_MEMBER_LIST_KEY = "TEAM_MEMBERS";
const TEAM_MEMBER_INDEX = "TEAM_MEMBER_INDEX";

class Task {
    progressList = ["To Do", "In Progress", "Done"];
    constructor(title = "", priority = "", tag = "", taskType = "", storyPoints = 1, description = "", newUID = -1, progress = "", timeSpent = 0) {
        this._title = title;
        this._priority = priority;
        this._tag = tag;
        this._taskType = taskType;
        this._storyPoints = storyPoints;
        this._description = description;
        if (newUID == -1) {
            this._assignee = new TeamMember;
        } else {
            this.newAssignee(newUID);
        }
        this._progress = progress;
        this._timeSpent = timeSpent; // this is in minutes
    }

    // setters
    set title(newTitle) { this._title = newTitle; }
    set priority(newPriority) { this._priority = newPriority; }
    set tag(newTag) { this._tag = newTag; }
    set taskType(newTaskType) { this._taskType = newTaskType; }
    set storyPoints(newStoryPoints) { this._storyPoints = newStoryPoints; }
    set description(newDescription) { this._description = newDescription; }
    set assignee(newUID) { this.newAssignee(newUID); }
    set progress(newProgress) { this._progress = newProgress; }
    set timeSpent(newTime) { this._timeSpent = newTime; }

    // getters
    get title() { return this._title; }
    get priority() { return this._priority; }
    get tag() { return this._tag; }
    get taskType() { return this._taskType; }
    get storyPoints() { return this._storyPoints; }
    get description() { return this._description; }
    get assignee() { return this._assignee; }
    get progress() { return this._progress; }
    get timeSpent() { return this._timeSpent; }

    // taking the assignee from the team member list
    newAssignee(newUID) {
        // getting the team list from storage
        let teamList = new TeamMemberList;
        teamList.fromData(retrieve(TEAM_MEMBER_LIST_KEY));

        let teamMember = new TeamMember;
        // checking through the whole team member list to find the correct team member
        for (let i=0; i<teamList.teamMembers.length; i++) {
            // found the team member
            if (teamList.teamMembers[i].memberUID == newUID) {
                teamMember = teamList.teamMembers[i];
                break;
            }
        }
        this._assignee = teamMember;
    }

    fromData(dataObject) { // initialises saved dataobject from local storage into an actual task object
        this._title = dataObject._title;
        this._priority = dataObject._priority;
        this._tag = dataObject._tag;
        this._taskType = dataObject._taskType;
        this._storyPoints = dataObject._storyPoints;
        this._description = dataObject._description;
        let assignee = new TeamMember();
        assignee.fromData(dataObject._assignee);
        this._assignee = assignee;
        this._progress = dataObject._progress;
        this._timeSpent = dataObject._timeSpent;
    }
}

// Project backlog holds the list of tasks
class ProjectBacklog {
    constructor() {
        this._tasks = [];
        this._tags = ["UI", "Core", "Testing"];
        this._taskTypes = ["User Story", "Bug"];
    }

    // getters
    get tasks() { return this._tasks; }
    get tags() { return this._tags; }
    get taskTypes() { return this._taskTypes; }

    // pushes a new instance of task into the tasks list
    // for use only when creating new task
    addTask(title, priority, tag, taskType, storypoints, description, assignee, progress) {
        let task = new Task(title, priority, tag, taskType, storypoints, description, assignee, progress);
        this._tasks.push(task);
    }

    removeTask(taskIndex) { // removes a task in the tasks list based on the given task index
        this._tasks.splice(taskIndex, 1);
    }

    addTag(newTag) {
        // pushing new tag into tags list
        this._tags.push(newTag);
    }

    removeTag(tagIndex) {
        // removing tag from tags list
        this._tags.splice(tagIndex, 1);
    }

    fromData(dataObject) {
        // re-initialising the task objects in the tasks list
        for (let i = 0; i < dataObject._tasks.length; i++) {
            let task = new Task();
            task.fromData(dataObject._tasks[i]);
            this._tasks.push(task);
        }

        // re-initialising the tags list
        this._tags = dataObject._tags;

        // re-initialising the taskTypes list
        this._taskTypes = dataObject._taskTypes;
    }
}

// Class for sprint 
class Sprint {
    statuses = ["To Do", "In Progress", "Done"]
    constructor(name = "", status = "", startDate = new Date, endDate = new Date) {
        this._name = name;
        this._status = status;
        this._startDate = startDate;
        this._endDate = endDate;
        this._toDo = [];
        this._inProgress = [];
        this._completed = [];
    }

    // setters
    set name(newName) { this._name = newName; }
    set status(newStatus) { this._status = newStatus; }
    set startDate(newDate) { this._startDate = newDate; }
    set endDate(newDate) { this._endDate = newDate; }

    // getters
    get name() { return this._name; }
    get status() { return this._status; }
    get startDate() { return this._startDate; }
    get endDate() { return this._endDate; }
    get toDo() { return this._toDo; }
    get inProgress() { return this._inProgress; }
    get completed() { return this._completed; }

    // methods 
    addTask(task) { // adds a task to the sprint
        let progress = task.progress;

        // checking the progress on the task and alloting the task to the correct area
        if (progress == "Done") {
            this._completed.push(task);
        } else if (progress == "In Progress") {
            this._inProgress.push(task);
        } else {
            this._toDo.push(task);
        }
    }

    removeTask(progress, index) { // removes a task based on their index and status
        if (progress == "To Do") {
            this._toDo.splice(index, 1);
        } else if (progress == "In Progress") {
            this._inProgress.splice(index, 1);
        } else {
            this._completed.splice(index, 1);
        }
    }

    fromData(dataObject) { // making the data store in local storage into an object 
        // reinitialising name
        this._name = dataObject._name;

        // reinitialising status
        this._status = dataObject._status;

        // reinitialising start date
        let date = dataObject._startDate;
        this._startDate = new Date(date);

        // reinitialising end date
        date = dataObject._endDate;
        this._endDate = new Date(date);

        // reinitialising to do list
        for (let i = 0; i < dataObject._toDo.length; i++) {
            let task = new Task;
            task.fromData(dataObject._toDo[i]);
            this._toDo.push(task);
        }

        // reinitialising in progress list
        for (let i = 0; i < dataObject._inProgress.length; i++) {
            let task = new Task;
            task.fromData(dataObject._inProgress[i]);
            this._inProgress.push(task);
        }

        // reinitialising completed list
        for (let i = 0; i < dataObject._completed.length; i++) {
            let task = new Task;
            task.fromData(dataObject._completed[i]);
            this._completed.push(task);
        }
    }
}

// class for the sprint board
class SprintBoard {
    constructor() {
        this._sprints = []
    }

    // getter
    get sprints() { return this._sprints; }

    // methods
    addSprint(name, status, startDate, endDate) { // adding a new sprint to the sprint board
        let sprint = new Sprint(name, status, startDate, endDate);
        // sprint.addTask()
        this._sprints.push(sprint);
    }

    removeSprint(index) { // removing sprint from sprint board
        this._sprints.splice(index, 1);
    }

    fromData(dataObject) {
        // reinitialising sprints
        for (let i = 0; i < dataObject._sprints.length; i++) {
            let sprint = new Sprint;
            sprint.fromData(dataObject._sprints[i]);
            this._sprints.push(sprint);
        }

        // // reinitialising future sprints
        // for (i = 0; i < dataObject._futureSprints.length; i++) {
        //     sprint = new Sprint;
        //     sprint.fromData(dataObject._futureSprints[i]);
        // }

        // // reintialising in progress sprints
        // for (i = 0; i < dataObject._inProgressSprints.length; i++) {
        //     sprint = new Sprint;
        //     sprint.fromData(dataObject._inProgressSprints[i]);
        // }

        // // reinitialising completed sprints
        // for (i = 0; i < dataObject._completedSprints.length; i++) {
        //     sprint = new Sprint;
        //     sprint.fromData(dataObject._completedSprints[i]);
        // }
    }
}

// Class for assignee of the task
class TeamMember {
    constructor(name = "", email = "", newUID = -1) {
        this._name = name;
        this._email = email;
        this._timeTrack = [] // the time is in minutes
        this._memberUID = newUID;
    }

    // setters
    set name(newName) { this._name = newName; }
    set email(newEmail) { this._email = newEmail; }
    set memberUID(newUID) { this._memberUID = newUID; }

    // getters
    get name() { return this._name; }
    get email() { return this._email; }
    get memberUID() { return this._memberUID; }
    get timeTrack() { return this._timeTrack; }

    // methods
    addTime(date = new Date, time = 0) {
        this._timeTrack.push([date, time]);
    }

    fromData(dataObject) {
        this._name = dataObject._name;
        this._email = dataObject._email;

        // reinitialising time tracking list
        for (let i = 0; i < dataObject._timeTrack.length; i++) {
            let date = new Date(dataObject._timeTrack[i][0]);

            let time = dataObject._timeTrack[i][1];

            this.addTime(date, time);
        }

        this._memberUID = dataObject._memberUID;
    }
}

// Class for team member list
class TeamMemberList {
    constructor() {
        this._teamMembers = [];
        this._memberUID = 0;
    }

    // setters
    set memberUID(newUID) {
        this._memberUID = newUID;
    }

    // getters
    get teamMembers() {
        return this._teamMembers;
    }

    get memberUID() {
        return this._memberUID;
    }

    // adding team member to team member list
    addTeamMember(name, email) {
        let member = new TeamMember(name, email, this._memberUID);

        this._memberUID++;

        this._teamMembers.push(member);
    }

    fromData(dataObject) {
        // reinitialising teamMembers list
        for (let i = 0; i < dataObject._teamMembers.length; i++) {
            let member = new TeamMember;

            // reinitialising the instance of team member
            member.fromData(dataObject._teamMembers[i]);

            // pushing this instance of team member into this class's list
            this._teamMembers.push(member);
        }

        // reinitialising the UID counter
        this._memberUID = dataObject._memberUID;
    }
}

// GENERAL FUNCTIONS FOR NORMAL USAGE
function pageRefresh() {
    //refresh page
    location.reload();
}

//function checks if data exists in local storage
function checkData(key) {
    if (localStorage.getItem(key) === null) {
        return false;
    } else {
        return true;
    }
}

//storing data locally
function store(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

//retrieving data stored locally
function retrieve(key) {
    let object = localStorage.getItem(key);
    return JSON.parse(object);
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

    let sprintBoard = new SprintBoard;
    // checking to see if a sprint board already exists
    if (checkData(SPRINT_BOARD_KEY)) {
        sprintBoard.fromData(retrieve(SPRINT_BOARD_KEY));
    }
    // storing the sprint board into storage
    store(SPRINT_BOARD_KEY, sprintBoard);

    let teamMembers = new TeamMemberList;
    // checking to see if a team member list already exists
    if (checkData(TEAM_MEMBER_LIST_KEY)) {
        teamMembers.fromData(retrieve(TEAM_MEMBER_LIST_KEY));
    }
    // storing the team member list to storage
    store(TEAM_MEMBER_LIST_KEY, teamMembers);
}
