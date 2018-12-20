class TeamService {
    constructor(){
        this.teams = [];
    }
    getTeams(){
        var copyTeams = this.teams;
        return copyTeams
    }
    getDefaultImagePath(){
        return '../static/images/nab-logo.png'
    }
}
