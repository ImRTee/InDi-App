class Team{
    constructor(teamId, confluenceLink, imagePath){
        this.teamId = teamId;
        this.confluenceLink = confluenceLink;
        this.imagePath = imagePath;
    }
    getTeamId(){
        var copyTeamId = this.teamId;
        return copyTeamId
    }

    addTeamToDatabase(newPage) {
        $.ajax({
            type: 'POST',
            url: "/add-team",
            data: JSON.stringify(this),
            async: 'asynchronous',
            success: function (response) {
                if (response == 'existed'){
                    alert('Not successful. This team already exists.');
                }else{
                    alert('A new team has been successfully added');
                    newPage.addPageToDatabase();
                }
            }
        })
    }

    deleteTeam(){
        $.ajax({
            type: 'POST',
            url: "/delete-team",
            data: JSON.stringify(this.teamId),
            async: 'asynchronous',
            success: function (response) {
                alert('Team has been successfully deleted');
                window.location.href = "/"
            }
        })
    }

}