/*
Team analytics Javascript file
*/

function displayTimeSpentMember() {
    // getting all the data from storage
    let teamList = new TeamMemberList;
    teamList.fromData(retrieve(TEAM_MEMBER_LIST_KEY));

    // adding all the times together
    let times = [];
    for (let i=0; i<teamList.teamMembers.length; i++) {
        let teamMember = teamList.teamMembers[i];

        let memberTime = 0;
        for (let j=0; j<teamMember.timeTrack.length; j++) {
            memberTime += teamMember.timeTrack[j][1];
        }

        times.push(memberTime);
    }

    // putting all the data into the html
    let timeTable = document.getElementById("timeTrack");
    let timeOutput = "";

    for (let i=0; i<times.length; i++) {
        timeOutput += `<tr><td style="overflow:auto">${teamList.teamMembers[i].name}</td>`;
        timeOutput += `<td style="overflow:auto">${teamList.teamMembers[i].email}</td>`;
        timeOutput += `<td>${Math.floor(times[i]/60)} hour(s) and ${times[i]%60} minute(s)</td></tr>`;
    }

    timeTable.innerHTML = timeOutput;
}

function displayProductiveDates() {
    // getting the data from storage
    let teamList = new TeamMemberList;
    teamList.fromData(retrieve(TEAM_MEMBER_LIST_KEY));

    // making a list with dates and a list with their respective times when going through the team
    let dates = [];
    let times = [];
    for (let i=0; i<teamList.teamMembers.length; i++) {
        let member = teamList.teamMembers[i];
        for (let j=0; j<member.timeTrack.length; j++) {
            let trackedTime = member.timeTrack[j][0];
            let trackedMonth = trackedTime.getMonth();
            let trackedDate = trackedTime.getDate();
            let trackedYear = trackedTime.getFullYear();

            // checking if this already has been found date exists
            let dateIndex = -1;
            for (let k=0; k<dates.length; k++) {
                if (dates[k].getMonth()==trackedMonth && dates[k].getDate()==trackedDate && dates[k].getFullYear()==trackedYear) {
                    dateIndex = k;
                    break;
                }
            }

            // found a duplicate date
            if (dateIndex>=0) {
                times[dateIndex] += member.timeTrack[j][1];
            } else { // did not find a duplicate date
                dates.push(trackedTime);
                times.push(member.timeTrack[j][1]);
            }
        }
    }

    // outputting the data values onto the page
    let tableData = document.getElementById("timeTrackDates");
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
    displayTimeSpentMember();
    displayProductiveDates();
}