class Team{
    constructor(teamId, confluenceLink){
        this.teamId = teamId;
        this.confluenceLink = confluenceLink;
    }
    getTeamId(){
        var copyTeamId = this.teamId;
        return copyTeamId
    }

    addTeamToDatabase() {
        $.ajax({
            type: 'POST',
            url: "/add-team",
            data: JSON.stringify(this),
            async: 'asynchronous',
            success: function (response) {
                alert('A new team has been successfully added');
                window.location.href = "/"
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
                alert('A new team has been successfully deleted');
                window.location.href = "/"
            }
        })
    }

}