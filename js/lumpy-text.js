$.fn.lumpy = function (options) {
    var opt = {
        begin: '#F714C1',
        end: '#1B8A43',
        steps: 50
    };

    var origin_text = this.text();
    var origin_text_len = origin_text.length;
    this.text(origin_text.substr(0, origin_text_len - 5));

    for(var i=origin_text.length-1, len=origin_text.length - opt.steps; i>len; i--) {
        var span = $('<span></span>');
        span.text(origin_text[i]);
        var color = cal_gradient(opt.begin, opt.end, opt.steps, origin_text_len-i);
        console.log(color);
        span.css('color', color);
        this.append(span)
    }

    function cal_gradient(begin, end, steps, cur_step) {
        var r = parseInt(begin.substr(1, 2), 16);
        var g = parseInt(begin.substr(3, 2), 16);
        var b = parseInt(begin.substr(5, 2), 16);
        var re = parseInt(end.substr(1, 2), 16);
        var ge = parseInt(end.substr(3, 2), 16);
        var be = parseInt(end.substr(5, 2), 16);
        var rf = Number(Math.abs(((r - re) * cur_step / steps).toFixed(0))).toString(16);
        var gf = Number(Math.abs(((g - ge) * cur_step / steps).toFixed(0))).toString(16);
        var bf = Number(Math.abs(((b - be) * cur_step / steps).toFixed(0))).toString(16);

        if ((''+rf).length === 1) {
            rf = '0' + rf;
        }
        if ((''+rf).length === 0) {
            rf = '00';
        }
        if ((''+gf).length === 1) {
            gf = '0' + gf;
        }
        if ((''+gf).length === 0) {
            gf = '00';
        }
        if ((''+bf).length === 1) {
            bf = '0' + bf;
        }
        if ((''+bf).length === 0) {
            bf = '00';
        }
        return '#'+rf+gf+bf;
    }
}
