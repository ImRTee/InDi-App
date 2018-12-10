class PopoverBtn {
    constructor(btnId,  content, left, top, width, height) {
        this.btnId =  btnId;
        this.content = content;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
    }

    retrieve(){
        var id = this.btnId;
        var content = this.content;
        var title = id.replace(/-/g, " "); //Replace dash ( - ) with space to format title
        var htmlButton = `
                            <div id=${id} class="popover-btn p-l-1" data-container="body" data-toggle="popover" data-placement="right" data-html="true"
                                title="<div class='pop-up-title text-center' >
                                                <h4><strong>${title}</strong></h4>
                                           </div>
                                           <div  class='${id} popover-edit popover-tool' style='margin-right: 15px'>
                                                <i class=' far fa-edit '></i>
                                            </div>
                                             <div class='${id} popover-delete popover-tool'>
                                                 <i class='far fa-trash-alt' style='color: red'></i>
                                             </div>"
                                data-content= "${content}">
                                <i class="popover-icon fas fa-angle-double-down"></i>
                             </div>`;
        //Add button to the screen
        $('.main-content').append(htmlButton);
        //Add pop-over effect to the created button
        $(`#${id}`).popover();
        //After the buttons is created, get their positions
        this.retrievePosition();
        //Get size
        this.retriveSize();
    }

    addToDatabase(i){
        var obj = {
            id: this.btnId,
            content: this.content,
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height
        };
        $.ajax({
            type: 'POST',
            url: "/add-button",
            data: JSON.stringify(obj),
            async: 'asynchronous',
            success: function (response) {
                alert('New button has been added');
                window.location.href = "/"
            }
        })
    }

    updateContent(newId, newContent){
        var newContentObj = {
            originId:  this.btnId,
            newId: newId,
            newContent:  newContent
        };
        $.ajax({
            type: 'POST',
            url:  '/updateContent-content',
            data:  JSON.stringify(newContentObj),
            async: 'asynchronous',
            success: function (response) {
                window.location.href = "/"
            }
        })
    }
    delete (id){
        $.ajax({
            type: 'POST',
            url: '/delete-button',
            data: JSON.stringify(id),
            success: function (response) {
                window.location.href = "/"
            }
        })
    }




    retrievePosition(){
        $(`#${this.btnId}`).css('left', this.left);
        $(`#${this.btnId}`).css('top', this.top);
    }
    retriveSize(){
        $(`#${this.btnId}`).css('width',  `${this.width}px`);
        $(`#${this.btnId}`).css('height', `${this.height}px`);
    }



}