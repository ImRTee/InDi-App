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
        var newPageId = $('#newPage-title').val().toLowerCase().replace(/ /g, '-');
        var newPagePN = $('#newPage-projectName').val();
        var newPagePD = $('#newPage-projectDescription').val();
        var newPageLink = $('#newPage-link').val();
        var newPageTeamId = currentTeam.getTeamId();
        if ( newPageId ==""|| newPagePN =="" || newPagePD == " "||newPageLink == ""){
            alert('Please fill out all fields')
        }else {
            var newPage = new Page(newPageId, newPagePN, newPagePD,  newPageLink, newPageTeamId, pageService.getDefaultImagePath());
            pageService.addPageToDatabase(newPage)
        }
    });

    //Delete page mechanism
    $('#deleteTeam-btn').click(function () {
        if (confirm('Are you sure you want to delete this team?')){
            currentTeam.deleteTeam()
        }
    })
});