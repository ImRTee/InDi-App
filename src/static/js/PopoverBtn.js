class PopoverBtn {
    constructor(btnId,  content, left, top, width, height, pageId) {
        this.btnId =  btnId;
        this.content = content;
        this.left = left;
        this.top = top;
        this.width = width;
        this.height = height;
        this.pageId = pageId;
    }
    getBtnId(){
        var copyBtnId = this.btnId;
        return copyBtnId
    }
    deleteBtn (id){
        $.ajax({
            type: 'POST',
            url: '/delete-button',
            data: JSON.stringify(id),
            success: function (response) {
                // window.location.href = "/"
                $('.popover-btn').popover('hide');
                $(`#${id}`).remove();
            }
        })
    };

    updateContent(newId, newContent, pageId){
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
                console.log('Button updated in the database');
                $('#contentUpdateForm').css('display', 'none')
                $('#contentUpdateForm-title').val('');
                $('#newUpdateContent').text('');
                $("body").off('click', '#updateContentBtn')
            }
        });
        return  new PopoverBtn(newId, newContent, this.left, this.top, this.width, this.height, pageId)
    }

    updatePos(newLeft, newTop){
        this.left = newLeft;
        this.top = newTop
    }
    updateSize(newWidth, newHeight){
        this.width = newWidth;
        this.height = newHeight;
    }


    addToDatabase (){
        var obj = {
            id: this.btnId,
            content: this.content,
            left: this.left,
            top: this.top,
            width: this.width,
            height: this.height,
            pageId: this.pageId
        };
        $.ajax({
            type: 'POST',
            url: "/add-button",
            data: JSON.stringify(obj),
            async: 'asynchronous',
            success: function (response) {
                alert('New button has been added');
                $('#contentForm').css('display','none');
                $('#contentForm-title').val('');
                $('#newContent').text('');
                $("body").off('click', '#addContentBtn');
                // window.location.href = "/"
            }
        })
    }



}