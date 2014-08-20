(function($) {
    // patch the reduce to jQuery
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

    // lumpy function
    $.fn.lumpy = function (opt) {
        var defaults = {
            begin: '#F714C1',
            end: '#1B8A43',
            steps: 50
        };
        opt = $.extend(defaults, opt);

        var origin_text = this.text();
        var origin_text_len = origin_text.length;
        var lumpy_text = origin_text.substr(origin_text_len - opt.steps);
        var trim_lumpy_text = trim(lumpy_text, true);
        this.text(origin_text.substr(0, origin_text_len - opt.steps));

        for(var i=0, j=1, len=opt.steps; i<len; i++) {
            if(lumpy_text[i] !== ' ') {
                var color = cal_gradient(opt.begin, opt.end, trim_lumpy_text.length, j++);
                var span = $('<span></span>').css('color', color).text(lumpy_text[i]);
            } else {
                var span = $('<span></span>').text(lumpy_text[i]);
            }
            this.append(span);
        }

        // trim string
        function trim(str, is_global) {
            if(is_global) {
                return str.replace(/\s/g, '') || '';
            } else {
                return str.replace(/(^\s+)|(\s+$)/g, '') || '';
            }
        }

        // calculate the gradient of color
        function cal_gradient(begin, end, steps, cur_step) {
             return $([{}, {}, {}]).map(function(index, elem) {
                elem.begin = parseInt(begin.substr(index * 2 + 1, 2), 16);
                elem.end = parseInt(end.substr(index * 2 + 1, 2), 16);
                elem.dist = (elem.begin - Number(((elem.begin - elem.end) * cur_step / steps).toFixed(0))).toString(16);
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
