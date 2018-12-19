$(document).ready(function(){
    //Active nav item effect
    var fullpath =  window.location.pathname.split('/');
    var lastPath = fullpath[fullpath.length -1];
    $(`.${lastPath}`).addClass('active');

    var pageService = new PageService();
    currentPage.getImage();
    currentPage.retrieveButtons();

    // //Switch page mechanism
    // $('#nav-list').on('click', '.nav-item', function(){
    //     //Clear the DOM
    //     $('.popover-btn').popover('hide');
    //     //Hide all popover
    //     var index = Number($(this).attr('class')[0]);
    //     pageService.setUpPage(index);
    //     currentPage = pageService.getCurrentPage();
    // });



    //When the edit mode button is clicked,
    $('#mode-btn').click(  ()=>{
        //If in 'Edit' mode
        if ($('#mode-btn').text()== 'Edit') {
            // $('.main-content > div').addClass('draggable');
            //Change mode button to display mode
            $('#mode-btn').text('Display');
            //Change mode's button color
            $('#mode-btn').removeClass('btn-success').addClass('btn-primary') ;
            //Change mode text to 'Edit mode'
            $('.mode-text').text('Edit mode');
            //Show tool buttons
            $('.tool-btns').css('display', 'block');
            //Make popover buttons  visible
            $('.popover-btn').css('opacity', '0.5');
            currentPage.draggableInitialize();
            $('.draggable').draggable('enable'); //Enable
            $('.draggable').resizable('enable');

            //Switch to 'Display' mode
        } else if ($('#mode-btn').text()== 'Display'){
            $('.draggable').draggable('disable');
            //Make popover-body to be editable
            $('.popover-body').attr('contentEditable', 'false');
            //Change mode button's text to 'Edit'
            $('#mode-btn').text('Edit');
            //Change mode button's color
            $('#mode-btn').removeClass('btn-primary').addClass('btn-success');
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

    //Upload diagram mechanism
    //intercept upload-form submission to overwrite the action to include pageId in the request
    //This let the backend know which page this picture belongs to
    $('#upload-form').submit(function(){
        var currentPageId = currentPage.getPageId() ;
        var teamId = currentPage. getTeamId();
        this.action = `/upload?pageId=${currentPageId}&teamId=${teamId}`;
        this.method = 'post'
    });
    //End of Upload form mechanism

    //Add button mechanism
    $('#addContentBtn').on('click', function (e){
        e.preventDefault();
        if ( $('#contentForm-title').val() == "" || $('#newContent').text() == ""){
            alert('Please fill out required field(s)')
        } else if (isStringInvalid($('#contentForm-title').val() )){
            alert('Invalid character. ')
        } else {
            var btnId = $('#contentForm-title').val().replace(/ /g, "-").replace(/'/g, ''); //replace space with dash (-)
            //Replace double quote with single quote to avoid format issue when constructing html element when generating button
            var content = $('#newContent').html().replace(/"/g, " ' ");
            var newPopoverBtn = new PopoverBtn(btnId, content, 0, 0, 60, 60, currentPage.getPageId(), currentPage.getTeamId() );
            newPopoverBtn.addToDatabase(currentPage);
        }
    });
    //End of adding buttons mechanism

    //Delete page mechanism
    $('#deletePageBtn').click(function () {
        if ( confirm('Are you sure that you want to delete this page?')){
            // pageId = currentPage.getPageId();
            // teamId = currentPage.getTeamId();
            currentPage.deletePage();
        }
    });
    //End of deleting page mechanism

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
    //End of popover buttons's click effect

    //Popover-tool: Show and Hide Logic
    //When showing the popover
    $('.main-content').on('shown.bs.popover', '.popover-btn', function (){
        // When in edit mode
        if ($('#mode-btn').text() == 'Display'){
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

    //When edit-content button on each popover is clicked, show up the contentUpdateForm
    $('body').on('click', `.popover > .popover-header >  .popover-edit`, function() {
        //Since the id of the button was attached as the first class of the edit-button when the popover-btn was created, we get the id back as
        const btnId = $(this).attr('class').split(/\s+/)[0];
        //Use this id to get the  title and data-content of the popover-btn
        var originTitle = btnId.replace(/-/g, " ");
        var originContent = $(`#${btnId}`).attr('data-content');
        //Popup the contentUpdateForm and load up the original details
        $('#contentUpdateForm-oldBtnId').val(btnId);
        // $('#contentUpdateForm').css('display', 'block');
        $('#contentUpdateForm-title').val(originTitle);
        $('#newUpdateContent').html(originContent);
        //Hide all popovers
        $('.popover-btn').popover('hide');
        //Update content (when updateContent button is clicked)
        $('body').on('click', '#updateContentBtn', (e) => {
            e.preventDefault();
            var originId =$('#contentUpdateForm-oldBtnId').val()  ;
            var newId = $('#contentUpdateForm-title').val().replace(/ /g,"-").replace(/'/g, '');
            var newContent = $('#newUpdateContent').html().replace(/"/g, " ' ");

            currentPage.updateBtnContent(originId, newId, newContent);
        })
    });

    //When the popover-delete button is clicked:
    $('body').on('click', `.popover > .popover-header >  .popover-delete`, function () {
        const btnId = $(this).attr('class').split(/\s+/)[0];
        if(confirm('Are you sure you want to delete this popover button?')){
            currentPage.deleteBtn(btnId);
        }
    });


    // Buttons' effect
    $('.upload-btn-tool').on('click', function(){
        displayEffect('.upload-form-container', 'block')
    });

    $('.close-upload').on('click', function () {
        displayEffect('.upload-form-container', 'none')
    });

    $('.add-btn-tool').on('click', function(){
        displayEffect('#contentForm', 'block');
        $('.popover-btn').popover('hide');
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
