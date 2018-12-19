class PopoverBtn {
    constructor(btnId,  content, left, top, width, height, pageId, teamId) {
        this.btnId =  btnId;
        this.content = content;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.pageId = pageId;
        this.teamId = teamId;
    }
    getBtnId(){
        var copyBtnId = this.btnId;
        return copyBtnId
    }
    deleteBtn (){
        $.ajax({
            type: 'POST',
            url: '/delete-button',
            data: JSON.stringify({btnId: this.btnId, pageId: this.pageId, teamId: this.teamId}),
            async: 'asynchronous',
            success: (response) =>{
                $.snackbar({content: "Button deleted successfully", style:"snackbar-style"});
                $('.popover-btn').popover('hide');
                $(`#${this.btnId}`).remove();
            }
        })
    };

    updateContent(newId, newContent, index, currentPage){
        var newContentObj = {
            originId:  this.btnId,
            newId: newId,
            newContent:  newContent,
            pageId: this.pageId,
            teamId: this.teamId
        };
        $.ajax({
            type: 'POST',
            url:  '/updateContent-content',
            data:  JSON.stringify(newContentObj),
            async: 'asynchronous',
            success: (response) => {
                if (response == 'existed'){
                    $.snackbar({content: "Button failed to update", style: "snackbar-style"});
                    alert('There is another button that has the same title')
                }else {
                    var updatedBtn = new PopoverBtn(newId, newContent, this.left, this.top, this.width, this.height, this.pageId, this.teamId);
                    currentPage.updateButtonInList(updatedBtn, index);
                    currentPage.updateUI();
                    $('.popover-btn').css('opacity', '0.5');
                    currentPage.draggableInitialize();

                    $.snackbar({content: "Button was updated successfully", style: "snackbar-style"});
                    $('#contentUpdateForm-title').val('');
                    $('#newUpdateContent').text('');
                    $("body").off('click', '#updateContentBtn');

                }
            }
        });
    }

    updatePos(newLeft, newTop){
        this.left = newLeft;
        this.top = newTop
    }
    updateSize(newWidth, newHeight){
        this.width = newWidth;
        this.height = newHeight;
    }

    addToDatabase (currentPage){
        $.ajax({
            type: 'POST',
            url: "/add-button",
            data: JSON.stringify(this),
            async: 'asynchronous',
            success:  (response) => {
                if ( response == 'existed'){
                    alert("Adding button's title  is exited. ")
                }else {
                    //Update the UI
                    currentPage.addButtonToList(this);
                    currentPage.updateUI();
                    $('.popover-btn').css('opacity', '0.5');
                    currentPage.draggableInitialize();
                    $('.draggable').draggable('enable'); //Enable
                    $('.draggable').resizable('enable');
                    //Notification
                    $.snackbar({content: "New button has been successfully added", style: "snackbar-style"});
                    $('#contentForm').css('display', 'none');
                    $('#contentForm-title').val('');
                    $('#newContent').text('');
                    $("body").off('click', '#addContentBtn');


                }
            }
        })
    }



}