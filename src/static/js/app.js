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
                // Create buttons and add to the UI
                var id = response[i][0];
                var title = id.replace(/-/g, " "); //Replace dash ( - ) with space to format title
                var content = response[i][1];
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
                    //Update content (when update button is clicked)
                    $('#updateContentBtn ').click(function () {
                        var newContentObj = {
                            originId: id,
                            newId:  $('#contentUpdateForm-title').val().replace(/ /g,"-"),
                            newContent:  $('#newUpdateContent').html()
                        };
                        $.ajax({
                            type: 'POST',
                            url:  '/update-content',
                            data:  JSON.stringify(newContentObj),
                            async: 'asynchronous',
                            success: function (response) {
                                window.location.href = "/"
                            }
                        })
                    })
                });

                //When the popover-delete button is clicked:
                $('body').on('click', `.popover > .popover-header >  .${id}.popover-delete`, function() {
                    if(confirm('Are you sure you want to delete this popover button?')){
                        //Since the id of the button was attached as the first class of the edit-button when the popover-btn was created, we get the id back as below
                        var id = this.classList[0];
                        console.log(id);
                        $.ajax({
                            type: 'POST',
                            url: '/delete-button',
                            data: JSON.stringify(id),
                            success: function (response) {
                                window.location.href = "/"
                            }
                        })
                    }
                });

                    //After the buttons is created, get their positions
                var leftPosition = response[i][2];
                var rightPosition = response[i][3];
                $(`#${id}`).css('left', leftPosition);
                $(`#${id}`).css('top', rightPosition);

                //Get size
                var width = response[i][4];
                var height = response[i][5];
                $(`#${id}`).css('width',  `${width}px`);
                $(`#${id}`).css('height', `${height}px`);
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

            //Add content mechanism
            $('#addContentBtn').on('click', function (e){
                e.preventDefault();
                if ( $('#contentForm-title').val() == "" || $('#newContent').text() == ""){
                    alert('Please fill out required field(s)')
                }else {
                    var id = $('#contentForm-title').val().replace(/ /g, "-"); //replace space with dash (-)
                    //Replace double quote with single quote to avoid format issue when constructing html element when generating button
                    var content = $('#newContent').html().replace(/"/g, " ' ");
                    var obj = {
                        id: id,
                        content: content
                    };
                    $.ajax({
                        type: 'POST',
                        url: "/save-content",
                        data: JSON.stringify(obj),
                        async: 'asynchronous',
                        success: function (response) {
                            alert('New button has been added');
                            window.location.href = "/"
                        }
                    })
                }
            });
            //End of adding content mechanism
        }
    });
    // End of retrieving popover buttons with their contents, positions and sizes



    //When the edit mode button is clicked,
    $('.mode-btn').click(  ()=>{
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
                        url: "/update-position",
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
                            url: "/update-size",
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

            //In display mode
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



    // $('.github').popover(
    //     {
    //         'content': `
    //             <center><h5>GIT</h5></center>
    //             <strong>Location: </strong><a href='https://google.com'>link</a>."
    //             <table style="width:100%">
    //             <tr>
    //                 <th>Name</th>
    //                 <th>Domain</th>
    //             </tr>
    //             <tr>
    //                 <td>srv-cph-devops</td>
    //                 <td>AUR/TEST/PROD</td>
    //             </tr>
    //             </table>
    //             <p><strong>How to access:  </strong> SSO login managed by NAB, please contact Prakash T Tirumalareddy Prakash.Tirumalared@nab.com.au </p>
    //                 `
    //     }
    // );
    // $('.jenkins').popover(
    //     {
    //         'content': `
    //             <center><h5>Jenkins</h5></center>
    //             <strong>Location: </strong><a href='https://google.com'>link</a>
    //             <p><strong>Service account: </strong> srv-cph-devops </p>
    //             <table style="width:100%">
    //             <tr>
    //                 <th>AD groups</th>
    //                 <td>AUR\NAB-Environment-SRV CPH-DevOps-Tools-Admin</td>
    //             </tr>
    //             <tr>
    //                 <td></td>
    //                 <td>AUR\NAB-Environment-SRV CPH-DevOps-Tools-Logon</td>
    //             </tr>
    //             </table>
    //             <p><strong>How to set up:</strong> <a target="_blank" href="">link</a></p>
    //             <p><strong>How to configure:</strong> <a target="_blank" href="">link</a></p>
    //          `
    //     }
    // );
    //
    // $('.artifactory').popover(
    //     {
    //         'content': `
    //             <center><h5>Artifactory</h5></center>
    //             <p><strong>Location: </strong> <a target="_blank" href="">Link</a></p>
    //             <p><strong>How to access: </strong> Local user (contact Prakash T Tirumalareddy - Prakash.Tirumalared@nab.com.au )</p>
    //         `
    //     }
    // )
    // $('.base-infra').popover(
    //     {
    //         'title': `                 <div class="popover-tool"><i class="far fa-edit"></i></div>`,
    //         'content': `
    //              <div class="editable-content">
    //                     <center><h5>Base Infrastructure</h5></center>
    //                     <p><strong>How to set up:  </strong> <a target="_blank" href="">Link</a></p>
    //                     <p><strong>Environment details: </strong> <a target="_blank" href="">Link</a> </p>
    //               </div>
    //
    //         `
    //     }
    // );
    //
    // $('.aws-account-info').popover(
    //     {
    //         'content': `
    //           <div class="popover-tool"><i class="far fa-edit"></i></div>
    //           <center><h5>AWS Account Info</h5></center>
    //           <table style="width:100%">
    //           <tr>
    //             <th>Type</th>
    //             <th>Document</th>
    //             <th>Console</th>
    //           </tr>
    //           <tr>
    //             <td>Nonprod</td>
    //             <td>View here</td>
    //             <td>
    //                 <p><strong>App: </strong> <a href="">View here</a></p>
    //                 <p><strong>SPT: </strong> <a href="">View here</a></p>
    //             </td>
    //           </tr>
    //           <tr>
    //             <td>Prod</td>
    //             <td>View here</td>
    //             <td>
    //                 <p><strong>App: </strong> <a href="">View here</a></p>
    //                 <p><strong>SPT: </strong> <a href="">View here</a></p>
    //              </td>
    //           </tr>
    //         </table>
    //         `
    //     }
    // );
    //
    // // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AppDynamics
    // // https://confluence.dss.ext.national.com.au/display/OCDCPH/FinSprd+Application+Installation+Guide
    // $('.appd').popover(
    //     {
    //         'content': `\n              <center><h5>AppDynamics</h5></center>\n              <div><strong>AD groups: </strong><a href="">view table here</a></div>\n              <div><strong>Appd agent: </strong><a href="">How to install AppD agent</a></div>\n              <div><p><strong>AppD controller: </strong><a href="">How to request access to AppD controller</a></div>\n              <div><strong>Naming Convention: </strong></div>\n              <ul>\n                <li><strong>App Name</strong> = CPH-[App]-[Env]  for example: “CPH-FinSprd-DEV”</li>\n                \n                <li><strong>Tier Name</strong> = Web/MachineAgent</li>\n                \n                <li><strong>Node Name</strong> = [App Pool]-[Site Name]-[Server Name] for example: "FIS-Optimist8-CBDCWIDA0061"</li>\n              </ul>\n              <div><strong>.NET agent behavior: </strong></div>\n              <ul>\n              <li>.Net agents installed on each host consists of a <strong><em>machine agent</em></strong> and an <strong><em>app agent</em></strong>.</li>\n              <li>They are coordinated to report metrics to the controller by a service called <strong><em>AppDynamics.Agent.Coordinator</em></strong></li>\n              <li>During the installation, <strong><em>machine agent</em></strong> will be registered before the <strong></em>app agent</em></strong>. </li>\n              <li>After the installation, the <strong><em>app agent</em></strong> will go to "sleep" unless there is traffic going to the server.</li>\n              <li> If the <strong><em>app agent</em></strong> is not sending metrics, the monitoring node on the controller will sit below the default tier "Machine Agent" and you will only able to view the metrics of host machine (CPU usage, Memory, Network I/O,...).</li>\n              </ul>\n\n            `
    //     }
    // );
    //
    // //Optimist 8
    // // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AUR_APRA.CRE
    // // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AURDEV_APRA.CRE
    // // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AURTEST_APRA.CRE
    // // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AUR_Optimist8
    // // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AURDEV_Optimist8
    // // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AURTEST_Optimist8
    //
    // // https://confluence.dss.ext.national.com.au/display/OCDCPH/FinSprd+Application+Installation+Guide
    // $('.optimist8').popover(
    //     {
    //         'content': `
    //             <center><h5>Ambit Optimist 8</h5></center>
    //             <span><strong>AD groups: </strong></span>
    //             <ul>
    //                 <li><a href="">AUR_APRA.CRE</a></li>
    //                 <li><a href="">AURDEV_APRA.CRE</a></li>
    //                 <li><a href="">AURTEST_APRA.CRE</a></li>
    //                 <li><a href="">AUR_Optimist8</a></li>
    //                 <li><a href="">AURDEV_Optimist8</a></li>
    //                 <li><a href="">AURTEST_Optimist8</a></li>
    //             </ul>
    //             <p><strong>Installation Guide: </strong> <a href="">View here</a></p>
    //         `
    //     }
    // );

    $('.popover-btn').on('click', function(){
        if ($(this).hasClass('active')){
            $(this).removeClass('active');
            // Arrow change
            $(this).children().removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
        } else{
            $(this).addClass('active')
            $(this).addClass('');
            // Arrow change
            $(this).children().removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
        }
    });

});

