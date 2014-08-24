(function($) {
    // patch the reduce to jQuery
    $.reduce = function(arr, reduce_cb, prev) {
        if(arr.toArray !== undefined) {
            arr = arr.toArray();
        }
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
        var _self = this;
        (function init(_self, opt) {
            var defaults = {
                begin: '#000',
                end: '#eee',
                steps: 50,
                direction: 'end'
            };
            opt = $.extend(defaults, opt);

            var origin_text = _self.text();
            var origin_text_len = origin_text.length;

            if(opt.steps > origin_text_len) opt.steps = origin_text_len;

            if(opt.direction === 'end') {
                var lumpy_text = origin_text.substr(origin_text_len - opt.steps);
                var trim_lumpy_text = trim(lumpy_text, true);
                _self.text(origin_text.substr(0, origin_text_len - opt.steps));
            } else if (opt.direction === 'begin') {
                var lumpy_text = origin_text.substr(0, opt.steps);
                var trim_lumpy_text = trim(lumpy_text, true);
                _self.text(origin_text.substr(opt.steps));
            }

            // check the steps length
            opt = check_steps(opt, trim_lumpy_text);

            // check color type
            opt = check_color_type(opt);

            // error handler
            validate_options(opt);

            // convert short hex color
            opt = convert_hex_color(opt);

            // handle every word in lumpy text and append the result to dom
            generate_lumpy_text(_self, opt, lumpy_text, trim_lumpy_text);
        })(_self, opt);

        // trim string
        function trim(str, is_global) {
            if(is_global) {
                return str.replace(/\s/g, '') || '';
            } else {
                return str.replace(/(^\s+)|(\s+$)/g, '') || '';
            }
        }

        // check steps (light check)
        function check_steps(opt, text) {
            if(opt.steps < text.length) {
                opt.steps = text.length;
            }
            return opt;
        }

        // check color type (strict check)
        function check_color_type(opt) {
            var hex_regex = /^#((((\d|[a-fA-F])){3})|(((\d|[a-fA-F])){6}))$/;
            var rgb_regex = /^((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))$/;
            var rgb_regex_fn = function(val) {
                return rgb_regex.test(val);
            }

            if (hex_regex.test(opt.begin) && hex_regex.test(opt.end)) {
                opt.color_type = 'hex';
                return opt;
            } else if($.isArray(opt.begin) && $.isArray(opt.end)
                    && opt.begin.length === 3 && opt.end.length === 3
                    && opt.begin.every(rgb_regex_fn) && opt.end.every(rgb_regex_fn)){
                opt.color_type = 'rgb';
            } else {
                opt.color_type = 'unknown';
            }
            return opt;
        }

        // error handler
        function validate_options(opt) {
            if(opt.color_type === 'unknown') {
                throw new Error('the begin or end color value is unknown');
            }
        }

        // convert short hex color to real hex color
        function convert_hex_color(opt) {
            if(opt.begin.length === 4) {
                opt.begin = generate_hex(opt.begin);
                opt.end = generate_hex(opt.end);

                function generate_hex(hex_short_obj) {
                    var hex_short_arr = [hex_short_obj.substr(1, 1), hex_short_obj.substr(2, 1), hex_short_obj.substr(3, 1)];
                    return $.reduce(hex_short_arr, function(prev, cur) {
                        return prev + cur  + cur;
                    }, '#');
                }
            }
            return opt;
        }

        // generate the final lumpy text
        function generate_lumpy_text(lumpy_obj, opt, lumpy_text, trim_lumpy_text) {
            var changed_arr = [];
            for(var i=0, j=1, len=opt.steps; i<len; i++) {
                if(lumpy_text[i] !== ' ') {
                    var color = cal_gradient(opt.color_type, opt.begin, opt.end, trim_lumpy_text.length, j++);
                    var span = $('<span></span>').css('color', color).text(lumpy_text[i]);
                } else {
                    var span = $('<span></span>').text(lumpy_text[i]);
                }
                changed_arr.push(span);
            }
            if(opt.direction === 'end') {
                lumpy_obj.append(changed_arr);
            } else if (opt.direction === 'begin') {
                lumpy_obj.prepend(changed_arr);
            }
        }

        // calculate the gradient of color
        function cal_gradient(color_type, begin, end, steps, cur_step) {
            return $([{}, {}, {}]).map(function(index, elem) {
                if(color_type === 'hex') {
                    elem.begin = parseInt(begin.substr(index * 2 + 1, 2), 16);
                    elem.end = parseInt(end.substr(index * 2 + 1, 2), 16);
                    elem.dist = (elem.begin - Number(((elem.begin - elem.end) * cur_step / steps).toFixed(0))).toString(16);
                } else {
                    elem.dist = (begin[index] - Number(((begin[index] - end[index]) * cur_step / steps).toFixed(0))).toString(16);
                }

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
