var oDoc, sDefTxt;

function initDoc() {
    oDoc = document.getElementById("newContent");
    sDefTxt = oDoc.innerHTML;
    if (document.contentForm.switchMode.checked || document.contentUpdateForm.switchMode.checked)  { setDocMode(true); }
}

function formatDoc(sCmd, sValue) {
    if (validateMode()) { document.execCommand(sCmd, false, sValue); oDoc.focus(); }
}

function validateMode() {
    if (!document.contentForm.switchMode.checked || document.contentUpdateForm.switchMode.checked) { return true ; }
    alert("Uncheck \"Show HTML\".");
    oDoc.focus();
    return false;
}

function setDocMode(bToSource) {
    var oContent;
    if (bToSource) {
        oContent = document.createTextNode(oDoc.innerHTML);
        oDoc.innerHTML = "";
        var oPre = document.createElement("pre");
        oDoc.contentEditable = false;
        oPre.id = "sourceText";
        oPre.contentEditable = true;
        oPre.appendChild(oContent);
        oDoc.appendChild(oPre);
        document.execCommand("defaultParagraphSeparator", false, "div");
    } else {
        if (document.all) {
            oDoc.innerHTML = oDoc.innerText;
        } else {
            oContent = document.createRange();
            oContent.selectNodeContents(oDoc.firstChild);
            oDoc.innerHTML = oContent.toString();
        }
        oDoc.contentEditable = true;
    }
    oDoc.focus();
}

function setUpdateDocMode(bToSource) {
    var oContent;
    var oUpdateDoc = document.getElementById('newUpdateContent');
    if (bToSource) {
        oContent = document.createTextNode(oUpdateDoc.innerHTML);
        oUpdateDoc.innerHTML = "";
        var oPre = document.createElement("pre");
        oUpdateDoc.contentEditable = false;
        oPre.id = "sourceText";
        oPre.contentEditable = true;
        oPre.appendChild(oContent);
        oUpdateDoc.appendChild(oPre);
        document.execCommand("defaultParagraphSeparator", false, "div");
    } else {
        if (document.all) {
            oUpdateDoc.innerHTML = oUpdateDoc.innerText;
        } else {
            oContent = document.createRange();
            oContent.selectNodeContents(oUpdateDoc.firstChild);
            oUpdateDoc.innerHTML = oContent.toString();
        }
        oUpdateDoc.contentEditable = true;
    }
    oUpdateDoc.focus();
}
//
// function printDoc() {
//     if (!validateMode()) { return; }
//     var oPrntWin = window.open("","_blan11111111k","width=450,height=470,left=400,top=100,menubar=yes,toolbar=no,location=no,scrollbars=yes");
//     oPrntWin.document.open();
//     oPrntWin.document.write("<!doctype html><html><head><title>Print<\/title><\/head><body onload=\"print();\">" + oDoc.innerHTML + "<\/body><\/html>");
//     oPrntWin.document.close();
// }

