
var teamService = new TeamService();
var pageService = new PageService();
// $.ajax({
//     type: 'GET',
//     url: "/get-teams",
//     async: 'synchronous',
//     success: function(response) {
//         //response format
//         // [
//         //     [
//         //         pageId, projectName, teamName, confluenceLink, imagePath
//         //     ]
//         // ]
//         //If there is no team
        if (teams.length == 0) {
            var teamId= prompt('Welcome to InD App! You seems to be first to arrive here. May I know your team name please?').toLowerCase().replace(/ /g, '-');
            var confluenceLink = prompt("What is your team's confluence space link? (start with 'https://')");
            var pageId = prompt("Thank you! Let's create the first page for you. What do you want to name it? ").toLowerCase().replace(/ /g, '-');
            var projectName = prompt("Great! What is the name of the project/application for this page?");
            var projectDescription = prompt("Fantastic! Describe this project.");
            var pageLink = prompt('Sweet! What is the confluence link for this page?');
            var imagePath = pageService.getDefaultImagePath();

            var newTeam = new Team(teamId, confluenceLink);
            var newPage = new Page(pageId, projectName, projectDescription, pageLink, teamId, imagePath);
            //add to the page list in PageService.js
            newTeam.addTeamToDatabase();
            pageService.addPageToDatabase(newPage);
            //If there is at least one page, get the first one to display
        } else {
//             // for (var i = 0; i < response.length; i++){
//             //     var currentPageId = response[i][0];
//             //     var currentPagePN= response[i][1];
//             //     var currentPageTN= response[i][2];
//             //     var currentPageCL = response[i][3];
//             //     var currentPageIP= response[i][4];
//             //     var page = new Page(currentPageId, currentPagePN, currentPageTN, currentPageCL, currentPageIP);
//             //     //add to the page list in PageService.js
//             //     pageService.fillUpPageList(page);
//             //     //set up navigation bar
//             //     var navItemHTML = `
//             //             <li class="${i} nav-item">
//             //                 <a   class=" nav-link" style="font-weight: bold">${currentPageId.replace(/-/g, " ")}<span class="sr-only">(current)</span></a>
//             //             </li>
//             //         `;
//             //     $('#nav-list').append(navItemHTML);
//             // }
//             // pageService.setUpPage(0);
//             // currentPage = pageService.getCurrentPage();
//
//
//         }
    }
// });
$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    //Add team mechanism
    $('#addTeam-btn').click(function (e) {
        e.preventDefault();
        var teamId = $('#newTeam-title').val().toLowerCase().replace(/ /g, '-');
        var confluenceLink = $('#newTeam-confluenceLink').val() ;
        var pageId = $('#newTeam-pageTitle').val().toLowerCase().replace(/ /g, '-');
        var projectName = $('#newTeam-projectName').val();
        var projectDescription = $('#newTeam-projectDescription').val();
        var pageLink = $('#newTeam-pageLink').val();
        var imagePath = pageService.getDefaultImagePath();
        if ( teamId == "" || confluenceLink == "" ||  pageId == "" || projectName == "" || projectDescription == "" || pageLink == ""){
            alert('Please fill out all fields')
        } else {
            var newTeam = new Team(teamId, confluenceLink);
            var newPage = new Page(pageId, projectName, projectDescription, pageLink, teamId, imagePath);
            newTeam.addTeamToDatabase();
            pageService.addPageToDatabase(newPage);

        }
    });

});
