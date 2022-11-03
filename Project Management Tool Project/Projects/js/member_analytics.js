/*
Team member analytics Javascript file
*/
"user strict"

// displaying information on page
function displayAnalytics() {
    // getting the information from storage
    let memberList = new TeamMemberList;
    memberList.fromData(retrieve(TEAM_MEMBER_LIST_KEY));
    let memberIndex = retrieve(TEAM_MEMBER_INDEX);

    // getting the right team member
    let member = memberList.teamMembers[memberIndex];

    // displaying the team member name
    let memberNameRef = document.getElementById("memberName");
    let memberNameOutput = `${member.name}`;
    memberNameRef.innerHTML = memberNameOutput;

    // displaying the team member's email
    let memberEmailRef = document.getElementById("email");
    let memberEmailOutput = `${member.email}`;
    memberEmailRef.innerHTML = memberEmailOutput;

    // making a list with dates and a list with their respective times when going through their time tracked
    let dates = [];
    let times = [];
    for (let i=0; i<member.timeTrack.length; i++) {
        let trackedTime = member.timeTrack[i][0];
        let trackedMonth = trackedTime.getMonth();
        let trackedDate = trackedTime.getDate();
        let trackedYear = trackedTime.getFullYear();

        // checking if this already has been found date exists
        let dateIndex = -1;
        for (let j=0; j<dates.length; j++) {
            if (dates[j].getMonth()==trackedMonth && dates[j].getDate()==trackedDate && dates[j].getFullYear()==trackedYear) {
                dateIndex = j;
                break;
            }
        }

        // found a duplicate date
        if (dateIndex>=0) {
            times[dateIndex] += member.timeTrack[i][1];
        } else { // did not find a duplicate date
            dates.push(trackedTime);
            times.push(member.timeTrack[i][1]);
        }
    }

    // outputting the values onto the page
    let tableData = document.getElementById("loggedTime");
    let output = "";

    for (let i=0; i<dates.length; i++) {
        let date = dates[i].getDate();
        let month = dates[i].getMonth();
        let year = dates[i].getFullYear();

        output += `<tr><td>${date}/${month+1}/${year}</td>`;
        output += `<td>${Math.floor(times[i]/60)} hour(s) and ${times[i]%60} minute(s)</td></tr>`;
    }

    tableData.innerHTML = output;
}

window.onload = function () {
    displayAnalytics();

}

