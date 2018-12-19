class Page{
    constructor(pageId, projectName, projectDescription, pageLink,teamId, imagePath){
        this.pageId = pageId;
        this.projectName = projectName;
        this.projectDescription = projectDescription;
        this.pageLink = pageLink;
        this.teamId= teamId;
        this.imagePath = imagePath;
        this.popoverBtns = [];
    };
    getPageId(){
        var copyPageId = this.pageId;
        return copyPageId;
    }
    getTeamId(){
        var copyTeamId = this.teamId;
        return copyTeamId;
    }

    getConfluenceLink() {
        var copyConfluenceLink = this.confluenceLink;
        return copyConfluenceLink;
    }

    getButtons(){
        var copyPageButtons = this.popoverBtns;
        return copyPageButtons
    }
    getImage(){
        $.ajax({
            type: 'GET',
            url: "/get-image",
            data: {'pageId': this.getPageId()},
            async: 'asynchronous',
            success: function(response){
                this.imagePath =  response[0][0];
                $('#diagram-img').attr('src', this.imagePath)
            }
        });
    }

    deletePage(){
        $.ajax({
            type: 'POST',
            url: "/delete-page",
            data: JSON.stringify({pageId: this.pageId, teamId: this.teamId}),
            dataType: 'json',
            async: 'asynchronous',
            complete: (response) => {
                window.location.href = `/${this.teamId}`
            }
        })
    }

    addButtonToList(newPopoverBtn){
        this.popoverBtns.push(newPopoverBtn);

    }
    retrieveButtons(){
        //Make sure the list is empty before retrieving buttons into
        this.popoverBtns = [];
        // Retrieve popover buttons with their contents, positions and sizes
        $.ajax({
            type: 'GET',
            url: "/get-popover-buttons",
            data:  {pageId: this.pageId, teamId: this.teamId},
            dataType: 'json',
            async: 'asynchronous',
            success: (response) => {
                // Response format
                // [
                //     0: [
                //         0: "id" (string)
                //         1: "content"(string)
                //         2: left (real)
                //         3: top( real)
                //         4: width ( real )
                //         5: height ( real )
                //     ]
                // ]
                // Start a loop to get popover-btn details
                for ( var i = 0; i < response.length; i++) {
                    //Provision attributes
                    var id = response[i][0];
                    var content = response[i][1];
                    var leftPosition = response[i][2];
                    var topPosition = response[i][3];
                    var width = response[i][4];
                    var height = response[i][5];
                    // Create buttons and add to the UI
                    var popoverBtn = new PopoverBtn(id, content, leftPosition, topPosition, width, height, this.pageId, this.teamId);
                    this.popoverBtns.push(popoverBtn);
                }
                console.log('button in the list', this.popoverBtns);
                this.updateUI();
            }
        });
        // End of retrieving popover buttons with their contents, positions and sizes
    }
    updateBtnContent(originId, newId, newContent){
        var updatingBtn = this.popoverBtns.find((button)=>{ return button['btnId']== originId });
        var indexOfUpdatingBtn = this.popoverBtns.indexOf(updatingBtn);
        var updatedBtn = updatingBtn.updateContent(newId , newContent, this.pageId, this.teamId);
        this.updateButton(updatedBtn, indexOfUpdatingBtn);
    }
    updateButton(updatedBtn, index){
        this.popoverBtns[index] = updatedBtn;
        console.log('button list  after updated ', this.popoverBtns);
        this.updateUI();
        $('.popover-btn').css('opacity', '0.5');
        this.draggableInitialize();
    }
    deleteBtn(btnId){
        var deletingBtn = this.popoverBtns.find((button)=>{ return button['btnId']== btnId && button['pageId'] == this.pageId && button['teamId'] == this.teamId });
        var index = this.popoverBtns.indexOf(deletingBtn);
        deletingBtn.deleteBtn();
        this.popoverBtns.splice(index, 1);
    }
    updateUI() {
        $('.popover-btn').remove();
        for (var i = 0; i < this.popoverBtns.length; i++) {
            var btnId = this.popoverBtns[i]['btnId'];
            var content = this.popoverBtns[i]['content'];
            var left = this.popoverBtns[i]['left'];
            var top = this.popoverBtns[i]['top'];
            var width = this.popoverBtns[i]['width'];
            var height = this.popoverBtns[i]['height'];
            var title = btnId.replace(/-/g, " "); //Replace dash ( - ) with space to format title
            var htmlButton = `
                            <div id=${btnId} class="popover-btn p-l-1" data-container="body" data-toggle="popover" data-placement="right" data-html="true"
                                title="<div class='pop-up-title text-center' >
                                                <h4><strong>${title}</strong></h4>
                                           </div>
                                           <div  class='${btnId} popover-edit popover-tool' style='margin-right: 15px' data-toggle='modal' data-target='#updateContentModal'>
                                                <i class=' far fa-edit' style='color: #00b8d4'></i>
                                            </div>
                                             <div class='${btnId} popover-delete popover-tool'>
                                                 <i class='far fa-trash-alt' style='color: red'></i>
                                             </div>"
                                data-content= "${content}">
                                <i class="popover-icon fas fa-angle-double-down"></i>
                             </div>`;
            //Add button to the screen
            $('.main-content').append(htmlButton);
            //Add pop-over effect to the created button
            $(`#${btnId}`).popover();
            //After the buttons is created, get their positions
            $(`#${btnId}`).css('left', left);
            $(`#${btnId}`).css('top', top);
            //Get size
            $(`#${btnId}`).css('width',  `${width}px`);
            $(`#${btnId}`).css('height', `${height}px`);
        }
        //If in edit mode, show buttons
        if ($('#mode-btn').text() == 'Display'){
            console.log('what?')
            $('.popover-btn').css('opacity', '0.5');
            this.draggableInitialize();
        }
    }
    draggableInitialize(){
        //Add class draggable for all children under class main-content
        $('.main-content > div').addClass('draggable');
        // Initialize and configure draggable function After every drag event: the id, positions[top,left] are written to btnPositions table
        $('.draggable').draggable({
            stop: (event, ui) => {
                var btnObj = {
                    'btnId':  ui.helper[0].id,
                    'position': ui.position,
                    'pageId': this.pageId,
                    'teamId': this.teamId
                };
                $.ajax({
                    type: 'POST',
                    url: "/updateContent-position",
                    data: JSON.stringify(btnObj),
                    async: 'asynchronous',
                    success: (response) => {
                        var updatingBtn = this.popoverBtns.find((button)=> {return button.getBtnId() == btnObj['btnId']});
                        var newLeft = btnObj['position']['left'];
                        var newTop = btnObj['position']['top'];
                        updatingBtn.updatePos(newLeft, newTop);
                        var index = this.popoverBtns.indexOf(updatingBtn);
                        this.popoverBtns[index] = updatingBtn;

                    }
                })
            }
        }).resizable({
            animate: true,
            animateDuration: "500",
            animateEasing: "easeOutBounce",
            ghost: true,
            stop: (event, ui)=>{
                setTimeout(() => {
                    var sizeObj = {
                        'btnId': ui.element[0].id,
                        'size': ui.size,
                        'pageId': this.pageId,
                        'teamId': this.teamId
                    };
                    $.ajax({
                        type: 'POST',
                        url: "/updateContent-size",
                        data: JSON.stringify(sizeObj),
                        async: 'asynchronous',
                        success:  (response) => {
                            var updatingBtn = this.popoverBtns.find((button)=> {
                                return button.getBtnId() == sizeObj['btnId']
                            });
                            var newWidth = sizeObj['size']['width'];
                            var newHeight = sizeObj['size']['height'];
                            updatingBtn.updateSize(newWidth, newHeight);
                            var index = this.popoverBtns.indexOf(updatingBtn);
                            this.popoverBtns[index] = updatingBtn;
                        }
                    })
                }, 700);
            }
        });
    }


}