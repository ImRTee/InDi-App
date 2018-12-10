$(document).ready(function(){
    //Retrieve  image url
    $.ajax({
        type: 'GET',
        url: "/get-image",
        async: 'asynchronous',
        success: function(response){
            var imagePath = response[0][0];
            $('#diagram-img').attr('src', imagePath)
        }
    });

    // Retrieve popover buttons with their contents, positions and sizes
    $.ajax({
        type: 'GET',
        url: "/get-popover-buttons",
        sync: 'synchronous',
        success: function(response){
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
            for ( var i = 0; i < response.length; i++){
                //Provision attributes
                var id = response[i][0];
                var content = response[i][1];
                var leftPosition = response[i][2];
                var topPosition = response[i][3];
                var width = response[i][4];
                var height = response[i][5];

                // Create buttons and add to the UI
                var popoverBtn = new PopoverBtn(id, content, leftPosition, topPosition, width, height);
                popoverBtn.retrieve();

                  //When edit-content button on each popover is clicked, show up the contentUpdateForm
                $('body').on('click', `.popover > .popover-header >  .${id}.popover-edit`, function(){
                    //Since the id of the button was attached as the first class of the edit-button when the popover-btn was created, we get the id back as below
                    var id = this.classList[0];
                    //Use this id to get the  title and data-content of the popover-btn
                    var originTitle = id.replace(/-/g, " ");
                    var originContent = $(`#${id}`).attr('data-content');
                    //Popup the contentUpdateForm and load up the original details
                    displayEffect('#contentUpdateForm','block');
                    $('#contentUpdateForm-title').val(originTitle);
                    $('#newUpdateContent').html(originContent);
                    //Hide all popovers
                    $('.popover-btn').popover('hide');

                    //Update content (when updateContent button is clicked)
                    $('#updateContentBtn ').click(function () {
                        var newId = $('#contentUpdateForm-title').val().replace(/ /g,"-");
                        var newContent = $('#newUpdateContent').html();
                        popoverBtn.updateContent(newId, newContent);
                    })
                });

                //When the popover-delete button is clicked:
                $('body').on('click', `.popover > .popover-header >  .${id}.popover-delete`, function() {
                    if(confirm('Are you sure you want to delete this popover button?')){
                        //Since the id of the button was attached as the first class of the edit-button when the popover-btn was created, we get the id back as below
                        var id = this.classList[0];
                        popoverBtn.delete(id);
                    }
                });
            }
            //End of getting popover-btn details loop

            //Popover buttons' clicking effect
            $('.popover-btn').on('click', function(){
                if ($(this).hasClass('active')){
                    $(this).removeClass('active');
                    // Arrow change
                    $(this).children().removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
                } else{
                    $(this).addClass('active');
                    $(this).addClass('');
                    // Arrow change
                    $(this).children().removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
                }
            });
            //End of retrieving contents and creating popover buttons

            //Add button mechanism
            $('#addContentBtn').on('click', function (e){
                e.preventDefault();
                if ( $('#contentForm-title').val() == "" || $('#newContent').text() == ""){
                    alert('Please fill out required field(s)')
                }else {
                    var id = $('#contentForm-title').val().replace(/ /g, "-"); //replace space with dash (-)
                    //Replace double quote with single quote to avoid format issue when constructing html element when generating button
                    var content = $('#newContent').html().replace(/"/g, " ' ");
                    var newPopoverBtn = new PopoverBtn(id, content, 0, 0, 40, 40);
                    newPopoverBtn.addToDatabase();
                }
            });
            //End of adding content mechanism
        }
    });
    // End of retrieving popover buttons with their contents, positions and sizes



    //When the edit mode button is clicked,
    $('.mode-btn').click(  ()=>{
        //If in 'Edit' mode
        if ($('.mode-btn').text()== 'Edit') {
            //Add class draggable for all children under class main-content
            $('.main-content > div').addClass('draggable');
            //Change mode button to display mode
            $('.mode-btn').text('Display');
            //Change mode's button color
            $('.mode-btn').removeClass('btn-success').addClass('btn-primary') ;
            //Change mode text to 'Edit mode'
            $('.mode-text').text('Edit mode');
            //Show tool buttons
            $('.tool-btns').css('display', 'block');
            //Make popover buttons  visible
            $('.popover-btn').css('opacity', '1');

            // Initialize and configure draggable function After every drag event: the id, positions[top,left] are written to btnPositions table
            $('.draggable').draggable({
                stop: function (event, ui) {
                    var btnObj = {};
                    btnObj['id'] = this.id;
                    btnObj['position'] = ui.position;
                    $.ajax({
                        type: 'POST',
                        url: "/updateContent-position",
                        data: JSON.stringify(btnObj),
                        async: 'asynchronous',
                        success: function (response) {
                            console.log(response)
                        }
                    })
                }
            }).resizable({
                animate: true,
                animateDuration: "500",
                animateEasing: "easeOutBounce",
                ghost: true,
                stop: function(event, ui){
                    var id = this.id;
                    //Wait for the animation to be finished before sending the size to database
                    setTimeout(function(){
                        var sizeObj = {};
                        sizeObj['id'] = id;
                        sizeObj['size'] = ui.size;
                        console.log(sizeObj);
                        $.ajax({
                            type: 'POST',
                            url: "/updateContent-size",
                            data: JSON.stringify(sizeObj),
                            async: 'asynchronous',
                            success: function (response) {
                                console.log(response)
                            }
                        })
                    }, 700);
                }
            });
            $('.draggable').draggable('enable'); //Enable
            $('.draggable').resizable('enable');

            //Switch to 'Display' mode
        } else if ($('.mode-btn').text()== 'Display'){
            $('.draggable').draggable('disable');
            //Make popover-body to be editable
            $('.popover-body').attr('contentEditable', 'false');
            //Change mode button's text to 'Edit'
            $('.mode-btn').text('Edit');
            //Change mode button's color
            $('.mode-btn').removeClass('btn-primary').addClass('btn-success');
            //Update the mode status
            $('.mode-text').text('Display mode');
            //Hide all popovers
            $('.popover-btn').popover('hide');
            //Hide all tool buttons
            $('.tool-btns').css('display', 'none');
            //Make popover buttons  invisible
            $('.popover-btn').css('opacity', '0');

        }
    });
    // End  of mode-btn clicking effect


    //Popover-tool: Show and Hide Logic
    //When showing the popover
    $('.main-content').on('shown.bs.popover', '.popover-btn', function (){
        // When in edit mode
        if ($('.mode-btn').text() == 'Display'){
            //Show popover-tools
            $('.popover-tool').css('display', 'block');
         //When in display mode
        }else{
            //Hide popover-tools
            $('.popover-tool').css('display', 'none');
        }
        $(this).addClass('active');
        // Arrow change
        $(this).children().removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
    });
    $('.main-content').on('hidden.bs.popover', '.popover-btn', function () {
        $(this).removeClass('active');
        // Arrow change
        $(this).children().removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
    });


    // Upload button effect
    $('.upload-btn-tool').on('click', function(){
        displayEffect('.upload-form-container', 'block')
    });

    $('.close-upload').on('click', function () {
        displayEffect('.upload-form-container', 'none')
    });

    $('.add-btn-tool').on('click', function(){
        displayEffect('#contentForm', 'block')
    });

    $('.close-add').on('click', function () {
        displayEffect('#contentForm', 'none')
    });
    $('.close-update').on('click', function () {
        displayEffect('#contentUpdateForm', 'none')
    });




    // Use to diplay or hide an element
    // Input element: String (e.g .class, #id)
    //             type: String (block or none)
    function displayEffect(element, type){
        $(element).css('display',type)
    }




});

