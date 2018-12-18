//Things to fix:
//No special character in button's title field ( ', ? )
//Page name needs to be unique
//Adjust classes for popover buttons
//Put classes into a separate folder in js folder
//Test deleting button that has the same title in two pages
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
            var teamId= prompt('Welcome to InDi App, may I ask your team name please?').replace(/ /g, '-');
            var confluenceLink = prompt("What is the confluence link you want to attach to this page?");
            var pageId = prompt("Thank you! Let's create the first page for you. What do you want to name it? ").replace(/ /g, '-');
            var projectName = prompt("Great! What is the name of the project/application you want to use me to document? ");
            var pageLink = prompt('Sweet! What is the link for this page?');
            var imagePath = pageService.getDefaultImagePath();

            var newTeam = new Team(teamId, confluenceLink);
            var newPage = new Page(pageId, projectName, pageLink, teamId, imagePath);
            //add to the page list in PageService.js
            teamService.addTeamToDatabase(newTeam);
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
});
