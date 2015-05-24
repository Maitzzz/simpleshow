function convertMS(ms) {
    var d, h, m, s, ret;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    if (h > 12) {
        ret = d + 1;;
    } else {
        ret = d;
    }

    if (ret < 1) {
        ret = h + 'hours';
    } else {
        ret = ret + ' days'
    }

    return ret;

};


function notify(type, message) {
    $.notify({
        message: message
    }, {
        type: type,
        placement: {
            from: "top"
        }
    });
}
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

var sort_by = function (field, reverse, primer) {

    var key = primer ?
        function (x) {
            return primer(x[field])
        } :
        function (x) {
            return x[field]
        };

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    }
};
function logout() {
    localStorage.removeItem('uid');
    localStorage.removeItem('userName');
    localStorage.removeItem('access_token');
}

function imgError(image){
    image.onerror = "";
    image.src = NO_IMAGE_EP;
    return true;
}
