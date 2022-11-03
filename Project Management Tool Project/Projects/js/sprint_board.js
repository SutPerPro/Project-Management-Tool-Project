/*
Sprint board file that codes for the sprint_board.html
*/
"use strict";

function togglePopup(){
    document.getElementById("popup-1").classList.toggle("active");
}

function displaySprints(sprintBoard) { // displaying all the sprints onto the sprintboard
    let htmlRef = document.getElementById("sprints");
    let output = "";

    for (let i = 0; i < sprintBoard.sprints.length; i++) {
        let sprint = sprintBoard.sprints[i]

        // dates
        let start = sprint.startDate;
        let end = sprint.endDate;

        let sprint_status = sprint.status;

        output += `<tr><td>${sprint.name}</td>`;
        // creating drop down menu to change the status of the sprints
        output += `<td>`;
        if (sprint_status == "To Do") {
            output += `<select id="status${i}" onchange="changeStatus(${i})">`;
            output += `<option value="To Do">To Start</option>`;
            output += `<option value="In Progress">In Progress</option>`;
            output += `<option value="Done">Completed</option>`;
            output += `</select>`;
        } else if (sprint_status == "In Progress") {
            output += `<select id="status${i}" onchange="changeStatus(${i})">`;
            output += `<option value="In Progress">In Progress</option>`;
            output += `<option value="Done">Completed</option>`;
            output += `</select>`;
        } else {
            output += `Completed`;
        }
        output += `</td>`;
        // duration of sprint
        output += `<td>${start.getDate()}/${start.getMonth()+1}/${start.getFullYear()} `;
        output += `- ${end.getDate()}/${end.getMonth()+1}/${end.getFullYear()}</td>`;
        //start sprint button
        output += `<td class="table__button"><button class="lightPurpleBtn" onclick="viewDetails(${i})">`;
        output += `Start Sprint</button></td>`;
        // view details button
        output += `<td class="table__button"><button class="lightPurpleBtn" onclick="viewDetails(${i})">`;
        output += `View Details</button></td>`;
        //remove button
        output += `<td class="table__button"><button class="darkRedBtn" onclick="SomeDeleteRowFunction(${i})">`;
        output += `Remove</button></td></tr>`
    }

    htmlRef.innerHTML = output;
}


// Delete Row

function SomeDeleteRowFunction() {
    // event.target will be the input element.
    var td = event.target.parentNode; 
    var tr = td.parentNode; // the row to be removed
    tr.parentNode.removeChild(tr);
}

// changing the status of the sprint
function changeStatus(index) {
    // confirming with user about change
    let confirmChange = confirm("Do you want to change this sprint's status? (Irreversible)")

    // getting the sprint from local storage
    let board = new SprintBoard;
    board.fromData(retrieve(SPRINT_BOARD_KEY));

    if (confirmChange) {
        // getting the value of that the sprint has been changed to
        let newStatus = document.getElementById(`status${index}`).value;

        // change the status of the correct sprint
        board.sprints[index].status = newStatus;

        // saving the change
        store(SPRINT_BOARD_KEY, board);

        displaySprints(board);
    } else {
        // returning the options selected back to its initial value
        document.getElementById(`status${index}`).value = board.sprints[index].status;
    }
}

function addSprint() { // adding a new sprint into the sprint board
    let name = document.getElementById("sprintName").value;
    let status = document.getElementById("sprintStatus").value;
    let start = document.getElementById("startDate").value;
    let end = document.getElementById("endDate").value;

    name = name.trim();

    if (name == "" || status == "Choose an Option" || !start || !end) {
        alert("Please fill in all information!");
    } else {
        // getting the data stored in local storage 
        let sprintBoard = new SprintBoard;
        sprintBoard.fromData(retrieve(SPRINT_BOARD_KEY));

        // adding the data from the html file into a new sprint instance
        sprintBoard.addSprint(name, status, new Date(start), new Date(end));

        // refreshing the sprint board and storing the sprintboard
        displaySprints(sprintBoard);
        store(SPRINT_BOARD_KEY, sprintBoard);

        togglePopup();

        // returning the input fields to their defaults;
        document.getElementById("sprintName").value = "";
        document.getElementById("sprintStatus").value = "Choose an Option";
        document.getElementById("startDate").value = "";
        document.getElementById("endDate").value = "";
    }
}

function viewDetails(index) {
    // store the index somewhere
    store(SPRINT_INDEX_KEY, index);

    window.location = "./sprint.html";
}

// making a display
window.onload = function () {
    //make a new user instance
    let sprintBoard = new SprintBoard;

    // checking to see if a sprint board already exists
    if (checkData(SPRINT_BOARD_KEY)) {
        sprintBoard.fromData(retrieve(SPRINT_BOARD_KEY));
    }

    // storing the sprint board into storage
    store(SPRINT_BOARD_KEY, sprintBoard);
    displaySprints(sprintBoard);
}
