/*
Team member javascript file 
*/  
"use strict";

// // Display box to add a new task or edit a task
// function openAddMemberWindow() {
//     // make the popup appear and button disappear
//     document.getElementById("newMember").style.display = "block";
//     document.getElementById("newMemberButton").style.display = "none";
//     document.getElementById("taskHeader").innerText = "New Member";
//     document.getElementById("newMember").scrollIntoView();

//     store(TASK_INDEX_KEY, -1);
// }

function togglePopup() {
    document.getElementById("popup-1").classList.toggle("active");
}

function openAddTeamMemberWindow() {
    togglePopup();

    store(TEAM_MEMBER_INDEX, -1);
}

// Close the box to add a task or edit a task and reset values typed in
function closeAddMemberWindow() {
    // making the popup disappear and the button reappear
    togglePopup();
    // document.getElementById("newMemberButton").style.display = "block";

    // returning the input fields to their defaults
    document.getElementById("teamMemberName").value = "";
    document.getElementById("memberEmailAddress").value = "";

    let index = retrieve(TASK_INDEX_KEY);

    // if (index == -1) {
    //     // changing the window location to the newest task
    //     window.scrollTo(0, document.body.scrollHeight);
    // } else {
    //     document.getElementById(`taskTitle${index}`).scrollIntoView();
    // }
}

// adding a new team member
function addNewMember() {
    // getting the values of inputted
    let index = retrieve(TEAM_MEMBER_INDEX);
    let name = document.getElementById("teamMemberName").value;
    name = name.trim();
    let email = document.getElementById("memberEmailAddress").value;
    email = email.trim();

    if (name == "" || email == "") { // checking for valid inputs
        alert("Please fill in all information")
    } else {
        let teamList = new TeamMemberList;
        teamList.fromData(retrieve(TEAM_MEMBER_LIST_KEY));

        // index of -1 means a new team member to be added
        if (index == -1) {
            teamList.addTeamMember(name, email);
            alert("Team Member Added");
        } else {
            teamList.teamMembers[index].name = name;
            teamList.teamMembers[index].email = email;
        }

        // displaying the team members and storing the team member lit
        displayMembers(teamList.teamMembers);
        store(TEAM_MEMBER_LIST_KEY, teamList);

        // close window
        closeAddMemberWindow();
    }
}

// Display team members on webpage
function displayMembers(listOfMembers) {
    let htmlCodeRef = document.getElementById("members");
    let htmlCode = "";

    // for (let i = 0; i< listOfMembers.length; i++) {
    //     htmlCode += `<article id="memberName${i}" onclick="expandMember(${i})">`;
    //     htmlCode += `<h2 style="overflow:hidden;text-align:center">${listOfMembers[i].name}</h2>`;
    //     htmlCode += `<p>Email: ${listOfMembers[i].email}</p>`;
    //     htmlCode += `<div class="buttons" style="text-align:right">`
    //     htmlCode += `<a class="lightRedBtn" id="editButton${i}" onclick="openEditMemberWindow(event, ${i})">Edit</a>\n`;
    //     htmlCode += `<a class="darkRedBtn" id="deleteButton${i}" onclick="deleteMember(event, ${i})">Delete</a>`;
    //     htmlCode += `</div></article>`
    // }
    for (let i = 0; i < listOfMembers.length; i++) {
        htmlCode += `<tr><td style="overflow:auto">${listOfMembers[i].name}</td>`;
        htmlCode += `<td style="overflow:auto">${listOfMembers[i].email}</td>`;
        htmlCode += `<td class="table__button"><button class="lightPurpleBtn" onclick="viewAnalytics(${i})">`;
        htmlCode += `View Analytics</button></td></tr>`;
    }

    htmlCodeRef.innerHTML = htmlCode;
}

function viewAnalytics(index) {
    store(TEAM_MEMBER_INDEX, index);

    window.location = "./member_analytics.html";
}

function deleteMember(event) {
    let confirmDelete = confirm("Confirm Delete?")
    if (confirmDelete){
        // event.target will be the input element.
        var td = event.target.parentNode; 
        var tr = td.parentNode; // the row to be removed
        tr.parentNode.removeChild(tr);
    }
}

window.onload = function () {
    //make a new user instance
    let teamList = new TeamMemberList;

    // checking to see if a team member list already exists
    if (checkData(TEAM_MEMBER_LIST_KEY)) {
        teamList.fromData(retrieve(TEAM_MEMBER_LIST_KEY));
    }

    // storing the team member list into storage
    store(TEAM_MEMBER_LIST_KEY, teamList);
    displayMembers(teamList.teamMembers);
}