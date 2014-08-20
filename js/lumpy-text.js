(function($) {
    $.reduce = function(arr, reduce_cb, prev) {
        arr = arr.toArray();
        if (Array.prototype.reduce) {
            return Array.prototype.reduce.call(arr, reduce_cb, prev);
        }
        $.each(arr, function(i, cur) {
            result = reduce_cb.call(null, prev, cur, i, arr);
            prev = cur;
        });
        return result;
    };

    $.fn.reduce = function (cb, prev) {
        return $.reduce(this, function(prev, cur, i, arr) {
            return cb.call(null, prev, cur, i, arr);
        }, prev);
    }

    $.fn.lumpy = function (options) {
        var opts = {
            begin: '#F714C1',
            end: '#1B8A43',
            steps: 50
        };
        opt = $.extend(opts, options);

        var origin_text = this.text();
        var exp_text = origin_text.substr(origin_text_len - opt.steps);
        var origin_text_len = origin_text.length;
        this.text(origin_text.substr(0, origin_text_len - opt.steps));

        for(var i=1, len=opt.steps; i<len; i++) {
            var color = cal_gradient(opt.begin, opt.end, opt.steps, i);
            var span = $('<span></span>').css('color', color).text(exp_text[i]);
            this.append(span)
        }

        function cal_gradient(begin, end, steps, cur_step) {
             return $([{}, {}, {}]).map(function(index, elem) {
                elem.begin = parseInt(begin.substr(index * 2 + 1, 2), 16);
                elem.end = parseInt(end.substr(index * 2 + 1, 2), 16);
                elem.dist = Number(elem.begin - ((elem.begin - elem.end) * cur_step / steps).toFixed(0)).toString(16);
                if(elem.dist.length === 1) {
                    elem.dist = '0' + elem.dist;
                }
                return elem.dist;
            }).reduce(function(prev, cur) {
                return prev + cur;
            }, '#');
        }
    };
})(jQuery);
