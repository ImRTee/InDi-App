$(document).ready(function(){

    //Retrieve button position from the database
    $.ajax({
        type: 'GET',
                url:"/get-positions",
                async: 'asynchronous',
                success: function(response){
                    //Button types are array of array
                    for (var i = 0; i < response.length; i++){
                        var button = response[i];
                        $("#" + button[0]).css('left', button[1])
                        $("#" + button[0]).css('top', button[2])
                    }
                    console.log('button positions updated')

                }
    });


    //When the edit button is clicked
    $('.mode-btn').click(  ()=>{
        if ($('.mode-btn').text()== 'Edit') {
            //Add class draggable for all children under class main-content
            $('.main-content > div').addClass('draggable');
            // Initialize and configure draggable function After every drag event: the id, positions[top,left] are written to btnPositions table
            $('.draggable').draggable({
                stop: function (event, ui) {

                    var btnObj = {};
                    btnObj['id'] = this.id;
                    btnObj['position'] = ui.position;

                    $.ajax({
                        type: 'POST',
                        url: "/save-positions",
                        data: JSON.stringify(btnObj),
                        async: 'asynchronous',
                        success: function (response) {
                            console.log('Position saved')
                        }
                    })
                }
            });
            $('.draggable').draggable('enable'); //Enable draggable

            $('.mode-btn').text('Display'); //Change mode button to display mode
            $('.mode-btn').removeClass('btn-success').addClass('btn-primary')  //Change mode's button color
        } else if ($('.mode-btn').text()== 'Display'){
            $('.draggable').draggable('disable');

            $('.mode-btn').text('Edit'); //Edit
            $('.mode-btn').removeClass('btn-primary').addClass('btn-success') //Change mode button's color

        }
    });



    $('.github').popover(
        {
            'content': `
                <center><h5>GIT</h5></center>
                <strong>Location: </strong><a href='https://google.com'>link</a>."
                <table style="width:100%">
                <tr>
                    <th>Name</th>
                    <th>Domain</th> 
                </tr>
                <tr>
                    <td>srv-cph-devops</td>
                    <td>AUR/TEST/PROD</td> 
                </tr>
                </table> 
                <p><strong>How to access:  </strong> SSO login managed by NAB, please contact Prakash T Tirumalareddy Prakash.Tirumalared@nab.com.au </p>
                    `
        }
    )
    $('.jenkins').popover(
        {
            'content': `
                <center><h5>Jenkins</h5></center>
                <strong>Location: </strong><a href='https://google.com'>link</a>
                <p><strong>Service account: </strong> srv-cph-devops </p> 
                <table style="width:100%">
                <tr>
                    <th>AD groups</th>
                    <td>AUR\NAB-Environment-SRV CPH-DevOps-Tools-Admin</td> 
                </tr>
                <tr>
                    <td></td>
                    <td>AUR\NAB-Environment-SRV CPH-DevOps-Tools-Logon</td> 
                </tr>
                </table>
                <p><strong>How to set up:</strong> <a target="_blank" href="">link</a></p>
                <p><strong>How to configure:</strong> <a target="_blank" href="">link</a></p>

             `
        }
    )

    $('.artifactory').popover(
        {
            'content': `
                <center><h5>Artifactory</h5></center>
                <p><strong>Location: </strong> <a target="_blank" href="">Link</a></p>
                <p><strong>How to access: </strong> Local user (contact Prakash T Tirumalareddy - Prakash.Tirumalared@nab.com.au )</p>
            `
        }
    )
    $('.base-infra').popover(
        {
            'content': `
                <center><h5>Base Infrastructure</h5></center>
                <p><strong>How to set up:  </strong> <a target="_blank" href="">Link</a></p>
                <p><strong>Environment details: </strong> <a target="_blank" href="">Link</a> </p>
            `
        }
    )

    $('.aws-account-info').popover(
        {
            'content': `
              <center><h5>AWS Account Info</h5></center>
              <table style="width:100%">
              <tr>
                <th>Type</th>
                <th>Document</th>
                <th>Console</th> 
              </tr>
              <tr>
                <td>Nonprod</td>
                <td>View here</td> 
                <td> 
                    <p><strong>App: </strong> <a href="">View here</a></p>
                    <p><strong>SPT: </strong> <a href="">View here</a></p>
                </td> 
              </tr>
              <tr>
                <td>Prod</td>
                <td>View here</td> 
                <td> 
                    <p><strong>App: </strong> <a href="">View here</a></p>
                    <p><strong>SPT: </strong> <a href="">View here</a></p>
                 </td> 
              </tr>
            </table>
            `
        }
    )

    // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AppDynamics
    // https://confluence.dss.ext.national.com.au/display/OCDCPH/FinSprd+Application+Installation+Guide
    $('.appd').popover(
        {
            'content': `\n              <center><h5>AppDynamics</h5></center>\n              <div><strong>AD groups: </strong><a href="">view table here</a></div>\n              <div><strong>Appd agent: </strong><a href="">How to install AppD agent</a></div>\n              <div><p><strong>AppD controller: </strong><a href="">How to request access to AppD controller</a></div>\n              <div><strong>Naming Convention: </strong></div>\n              <ul>\n                <li><strong>App Name</strong> = CPH-[App]-[Env]  for example: “CPH-FinSprd-DEV”</li>\n                \n                <li><strong>Tier Name</strong> = Web/MachineAgent</li>\n                \n                <li><strong>Node Name</strong> = [App Pool]-[Site Name]-[Server Name] for example: "FIS-Optimist8-CBDCWIDA0061"</li>\n              </ul>\n              <div><strong>.NET agent behavior: </strong></div>\n              <ul>\n              <li>.Net agents installed on each host consists of a <strong><em>machine agent</em></strong> and an <strong><em>app agent</em></strong>.</li>\n              <li>They are coordinated to report metrics to the controller by a service called <strong><em>AppDynamics.Agent.Coordinator</em></strong></li>\n              <li>During the installation, <strong><em>machine agent</em></strong> will be registered before the <strong></em>app agent</em></strong>. </li>\n              <li>After the installation, the <strong><em>app agent</em></strong> will go to "sleep" unless there is traffic going to the server.</li>\n              <li> If the <strong><em>app agent</em></strong> is not sending metrics, the monitoring node on the controller will sit below the default tier "Machine Agent" and you will only able to view the metrics of host machine (CPU usage, Memory, Network I/O,...).</li>\n              </ul>\n\n            `
        }
    )

    //Optimist 8
    // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AUR_APRA.CRE
    // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AURDEV_APRA.CRE
    // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AURTEST_APRA.CRE
    // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AUR_Optimist8
    // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AURDEV_Optimist8
    // https://confluence.dss.ext.national.com.au/display/OCDCPH/AD+Groups#ADGroups-AURTEST_Optimist8

    // https://confluence.dss.ext.national.com.au/display/OCDCPH/FinSprd+Application+Installation+Guide
    $('.optimist8').popover(
        {
            'content': `
                <center><h5>Ambit Optimist 8</h5></center>
                <span><strong>AD groups: </strong></span>
                <ul>
                    <li><a href="">AUR_APRA.CRE</a></li>
                    <li><a href="">AURDEV_APRA.CRE</a></li>
                    <li><a href="">AURTEST_APRA.CRE</a></li>
                    <li><a href="">AUR_Optimist8</a></li>
                    <li><a href="">AURDEV_Optimist8</a></li>
                    <li><a href="">AURTEST_Optimist8</a></li>
                </ul>
                <p><strong>Installation Guide: </strong> <a href="">View here</a></p>
            `
        }
    )

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
    })

    $('.popover.popover-body').on('click', function(){
        $(this).css('display','none');
        console.log('yes')
    })

})

