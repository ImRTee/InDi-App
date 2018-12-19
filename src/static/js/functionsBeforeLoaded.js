function isStringInvalid(string){
     var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
     if (format.test(string)){
         return true
     }else {
         return false
     }
}

function  isLinkInvalid(string) {
    var httpsFormat = 'https://';
    var httpFormat = 'http://';

    if (string.match(httpFormat) || string.match(httpsFormat)){
        return false
    } else {
        return true
    }
    
}