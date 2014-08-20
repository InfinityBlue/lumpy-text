(function() {
    $.reduce = function(arr, fnReduce, valueInitial) {
        arr = arr.toArray();
        if (Array.prototype.reduce) {
            return Array.prototype.reduce.call(arr, fnReduce, valueInitial);
        }
        $.each(arr, function(i, value) {
            valueInitial = fnReduce.call(null, valueInitial, value, i, arr);
        });
        return valueInitial;
    };

    $.fn.reduce = function ( callback, valueInitial ) {
        return  jQuery.reduce(this, function( valueInitial, value, i, arr ) {
            return callback.call( null, valueInitial, value, i, arr );
        }, valueInitial);
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
