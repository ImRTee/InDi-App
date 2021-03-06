$(document).ready(function () {
    //Active nav item effect
    var fullpath =  window.location.pathname.split('/');
    var lastPath = fullpath[fullpath.length -1];
    $(`.${lastPath}`).addClass('active');

    //Adding page mechanism
    $('#addPage-tool-btn').click(function () {
        $('.popover-btn').popover('hide');
        $("#addPageForm-container").css('display', 'block')
    });
    $('#addPage-btn').click( (e) => {
        e.preventDefault();
        var newPageTitle = $('#newPage-title').val().toLowerCase().replace(/ /g, '-');  //Because this will be a part of the URL
        var newPagePN = $('#newPage-projectName').val().toLowerCase().replace(/ /g, '-'); //Because this will be a part of the URL
        var newPagePD = $('#newPage-projectDescription').val();
        var newPageLink = $('#newPage-link').val();
        var newPageTeamId = currentTeam.getTeamId();
        if ( newPageTitle ==""|| newPagePN =="" || newPagePD == " "||newPageLink == ""){
            alert('Please fill out all fields')
        }else if (isStringInvalid( $('#newPage-title').val())){
            alert('Invalid character. ')
        } else if ( isLinkInvalid(newPageLink)) {
                alert('Link needs to start with either http:// or https://')
        }else {
            var newPageId = newPagePN + "-" + newPageTitle;
            var newPage = new Page(newPageId, newPagePN, newPagePD,  newPageLink, newPageTeamId, pageService.getDefaultImagePath());
            newPage.addPageToDatabase()
        }
    });

    //This let the backend know which page this picture belongs to
    $('#upload-team-img-form').submit(function(){
        var teamId = currentTeam. getTeamId();
        this.action = `/upload-team-image?teamId=${teamId}`;
        this.method = 'post'
    });
    //End of Upload form mechanism

    //Delete page mechanism
    $('#deleteTeam-btn').click(function () {
        if (confirm('Are you sure you want to delete this team?')){
            currentTeam.deleteTeam()
        }
    })
});