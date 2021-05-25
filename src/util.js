import XLSX from 'xlsx';

export function lettersToNumber(letters){
    var chrs = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ', mode = chrs.length - 1, number = 0;
    for(var p = 0; p < letters.length; p++){
        number = number * mode + chrs.indexOf(letters[p]);
    }
    return number;
}

export function parsePosition(name){
    let numberIndex = name.search(/\d+/g);

    return [
        name.slice(0, numberIndex),
        name.slice(numberIndex),
    ];
}

export function numberToLetters(n) {
    var ordA = 'a'.charCodeAt(0);
    var ordZ = 'z'.charCodeAt(0);
    var len = ordZ - ordA + 1;
  
    var s = "";
    while(n >= 0) {
        s = String.fromCharCode(n % len + ordA) + s;
        n = Math.floor(n / len) - 1;
    }
    return s.toUpperCase();
}

export function mnk(x, y){
    var _x_;
    var _y_;
    var xy = [];
    var x_2 = [];
    var y_2 = [];
    var y_apprx = [];
    var d_i = [];
    var d_i_2 = [];

    var x_i_x = [];
    var x_i_x_2 = [];

    var a;
    var b;

    var D;
    var S_b_2;
    var S_a_2;


    x.forEach((itemX, index) => {
        xy.push(itemX*y[index])
        x_2.push(itemX**2);
        y_2.push(y[index]**2);
    });

    _x_ = x.reduce((a, b) => (a + b))/x.length;
    _y_ = y.reduce((a, b) => (a + b))/y.length;


    b = (x.length*xy.reduce((a, b) => (a + b))-x.reduce((a, b) => (a + b))*y.reduce((a, b) => (a + b)))/(x.length*x_2.reduce((a, b) => (a + b))-x.reduce((a, b) => (a + b))**2);
    a = _y_-b*_x_;

    x.forEach((itemX, index) => {
        y_apprx.push(b*itemX+a);
    });

    x.forEach((itemX, index) => {
        d_i.push(y[index]-(a+b*itemX));
        d_i_2.push(d_i[index]**2);
    });

    x.forEach((itemX, index) => {
        x_i_x.push(itemX-_x_);
        x_i_x_2.push(x_i_x[index]**2);
    });


    D = x_i_x_2.reduce((a, b) => (a + b));
    S_b_2 = (1/D)*((d_i_2.reduce((a, b) => (a + b)))/(d_i_2.length-2));
    S_a_2 = ((1/x.length)+(_x_**2)/D)*(d_i_2.reduce((a, b) => (a + b))/(d_i_2.length-2));

    let headers = ['X', 'Y', 'XY', 'X2', 'Y2', 'Y_apprx', 'd_i', 'x_i_x', 'x_i_x_2', 'd_i_2'];

    let data = [];

    x.forEach((item, index) => {
        data.push({
            X: x[index],
            Y: y[index],
            XY: xy[index],
            X2: x_2[index],
            Y2: y_2[index],
            Y_apprx: y_apprx[index],
            d_i: d_i[index],
            x_i_x: x_i_x[index],
            x_i_x_2: x_i_x_2[index],
            d_i_2: d_i_2[index]
        });
    })

    data.push({
        X: x.reduce((a, b) => (a + b)),
        Y: y.reduce((a, b) => (a + b)),
        XY: xy.reduce((a, b) => (a + b)),
        X2: x_2.reduce((a, b) => (a + b)),
        Y2: y_2.reduce((a, b) => (a + b)),
    });

    let ws = XLSX.utils.json_to_sheet(data, {header: headers});
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "result")
    
    return {
        a,b,
        d_a: 2*Math.sqrt(S_a_2),
        d_b: 2*Math.sqrt(S_b_2),
        S_b_2,
        S_a_2,
        wb: wb
    }
}