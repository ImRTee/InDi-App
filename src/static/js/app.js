
var teamService = new TeamService();
var pageService = new PageService();

if (teams.length == 0) {
    var teamName= prompt('Welcome to InD App! You seems to be first to arrive here. May I know your team name please? (e.g Credit Product Hosting)');
    var confluenceLink = prompt("What is your team's confluence space link? (start with https:// or http://)");
    var pageTitle = prompt("Thank you! Let's create the first page for you. What do you want to name it? (e.g Architecture Overview)");
    var projectName = prompt("Great! What is the name of the project/application for this page? (e.g Finsprd, AppDynamics,..)").toLowerCase().replace(/ /g, '-'); // because this is will be part of the URL
    var projectDescription = prompt("Fantastic! Describe this project.");
    var pageLink = prompt("Sweet! What is the confluence link for this page? (start with https:// or http://)");
    var imagePath = pageService.getDefaultImagePath();

    if  (isStringInvalid( teamName )  || isStringInvalid( pageTitle ) ){
        alert('Invalid character. ')
    }else if (isLinkInvalid(confluenceLink) || isLinkInvalid(pageLink)) {
        alert('Link needs to start with either http:// or https://')
    } else  {
        var teamId = teamName.toLowerCase().replace(/ /g, '-');  //Because this will be a part of the URL
        var pageTitleWIthDash = pageTitle.toLowerCase().replace(/ /g, '-');  //Because this will be a part of the URL

        var pageId = projectName + "-" + pageTitleWIthDash;
        var newTeam = new Team(teamId, confluenceLink, teamService.getDefaultImagePath());
        var newPage = new Page(pageId, projectName, projectDescription, pageLink, teamId, imagePath);
        newTeam.addTeamToDatabase(newPage);
    }



}

$(document).ready(function () {
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
    });

    //Add team mechanism
    $('#addTeam-btn').click(function (e) {
        e.preventDefault();
        var teamId = $('#newTeam-title').val().toLowerCase().replace(/ /g, '-');  //Because this will be a part of the URL
        var confluenceLink = $('#newTeam-confluenceLink').val() ;
        var pageTitle = $('#newTeam-pageTitle').val().toLowerCase().replace(/ /g, '-');  //Because this will be a part of the URL
        var projectName = $('#newTeam-projectName').val().toLowerCase().replace(/ /g, '-'); //Because this will be a part of the URL
        var projectDescription = $('#newTeam-projectDescription').val();
        var pageLink = $('#newTeam-pageLink').val();
        var imagePath = pageService.getDefaultImagePath();
        if ( teamId == "" || confluenceLink == "" ||  pageId == "" || projectName == "" || projectDescription == "" || pageLink == ""){
            alert('Please fill out all fields')
        } else if (isStringInvalid( $('#newTeam-title').val() )  || isStringInvalid( $('#newTeam-pageTitle').val() ) ){
            alert('Invalid character.')
        } else if (isLinkInvalid(confluenceLink) || isLinkInvalid(pageLink)) {
            alert('Link needs to start with either http:// or https://')
        }else {
            var newTeam = new Team(teamId, confluenceLink, teamService.getDefaultImagePath());
            var pageId = projectName + "-" + pageTitle;
            var newPage = new Page(pageId, projectName, projectDescription, pageLink, teamId, imagePath);
            newTeam.addTeamToDatabase(newPage);
        }
    });

});
