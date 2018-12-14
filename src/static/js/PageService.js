class  PageService {
    constructor(){
        this. pages = [];
        this. currentPage;
    }

    getCurrentPage(){
        var copyCurrentPage = this.currentPage;
        return copyCurrentPage;
    }

    setUpPage(index){
        this.currentPage = this.pages[index];
        $('#page-title').text(this.currentPage.projectName + " " + this.currentPage.pageId.replace(/-/g, " "));
        $('#teamName').html(`<a href="http://${this.currentPage.confluenceLink}" target="_blank   ">${this.currentPage.teamName}</a>`);
        $( '#nav-list .nav-item').removeClass('active');
        $( `#nav-list .nav-item:nth-child(${index+1})`).addClass('active');
        this.currentPage.getImage();
        this.currentPage.retrieveButtons();
    }
    getDefaultImagePath(){
        var copyDefaultImagePath = '../static/images/default-image.png';
        return copyDefaultImagePath;
    }
    addPageToDatabase(page){
        $.ajax({
            type: 'POST',
            url: "/add-page",
            data: JSON.stringify(page),
            async: 'asynchronous',
            success: function (response) {
                alert('A new page has been successfully added');
                window.location.href = "/"
            }
        })
    }
    fillUpPageList(page){
        this.pages.push(page)
    }

    deletePage(){
        $.ajax({
            type: 'POST',
            url: "/delete-page",
            data: JSON.stringify(this.currentPage.getPageId()),
            async: 'asynchronous',
            success: function (response) {
                window.location.href = "/"
            }
        })
    }
}
