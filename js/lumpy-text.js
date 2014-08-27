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
                color: null,
                opacity: null,
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

            if(check_property_existed(opt.color)) {
                // check & set color type
                opt.color.type = check_color_type(opt.color);

                // convert short hex color
                opt.color = convert_hex_color(opt.color);
            }

            if(check_property_existed(opt.opacity)) {
                // check & set opacity type
                opt.opacity.type = check_opacity_type(opt.opacity);
            }

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

        // check property existed
        function check_property_existed(property) {
            if(property !== null && property.begin && property.end) {
                return true;
            }
            return false;
        }

        // check color type (strict check)
        function check_color_type(color) {
            var hex_regex = /^#((((\d|[a-fA-F])){3})|(((\d|[a-fA-F])){6}))$/;
            var rgb_regex = /^((\d{1,2})|(1\d{2})|(2[0-4]\d)|(25[0-5]))$/;
            var type = 'unvalid';
            var rgb_regex_fn = function(val) {
                return rgb_regex.test(val);
            }

            if (hex_regex.test(color.begin) && hex_regex.test(color.end)) {
                type = 'hex';
            } else if($.isArray(color.begin) && $.isArray(color.end)
                    && color.begin.length === 3 && color.end.length === 3
                    && color.begin.every(rgb_regex_fn) && color.end.every(rgb_regex_fn)){
                type = 'rgb';
            } else {
                console.error('the begin or end color value is unknown');
            }
            return type;
        }

        // check opacity type (strict check)
        function check_opacity_type(opacity) {
            var regex = /^(1|(0\.\d{1,2}))$/;
            var type = 'unvalid';
            if (regex.test(opacity.begin) && regex.test(opacity.end)) {
                type = 'opacity';
            } else {
                console.error('the begin or end opacity value is unknown');
            }
            return type;
        }

        // convert short hex color to real hex color
        function convert_hex_color(color) {
            if(color.type === 'hex' && color.begin.length === 4) {
                color.begin = generate_hex(color.begin);
                color.end = generate_hex(color.end);

                function generate_hex(hex_short_obj) {
                    var hex_short_arr = [hex_short_obj.substr(1, 1), hex_short_obj.substr(2, 1), hex_short_obj.substr(3, 1)];
                    return $.reduce(hex_short_arr, function(prev, cur) {
                        return prev + cur  + cur;
                    }, '#');
                }
            }
            return color;
        }

        // generate the final lumpy text
        function generate_lumpy_text(lumpy_obj, opt, lumpy_text, trim_lumpy_text) {
            var changed_arr = [];
            for(var i=0, j=1, len=opt.steps; i<len; i++) {
                if(lumpy_text[i] !== ' ') {
                    var style = cal_gradient(opt, trim_lumpy_text.length, j++);
                    var span = construct_elem($('<span></span>'), style);
                    var span = span.text(lumpy_text[i]);
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

        // construct span element with new styles
        function construct_elem(elem, style) {
            if(Object.keys(style).length > 0) {
                elem.css(style);
            }
            return elem;
        }

        // calculate the gradient of color
        function cal_gradient(opt, steps, cur_step) {
            var style = {};
            if(opt.opacity !== null && opt.opacity.type !== 'unvalid') {
                opt.opacity.steps = (opt.opacity.steps < steps) ? opt.opacity.steps : steps;
                if(opt.opacity.direction === 'end') {
                    if(cur_step > (steps - opt.opacity.steps)) {
                        style.opacity = (Math.abs((opt.opacity.begin - opt.opacity.end) * (cur_step - (steps - opt.opacity.steps)) / opt.opacity.steps)).toFixed(2);
                    }
                } else {
                    if(cur_step <= opt.opacity.steps) {
                        style.opacity = (Math.abs((opt.opacity.begin - opt.opacity.end) * cur_step / opt.opacity.steps)).toFixed(2);
                    }
                }
            }

            if(opt.color !== null && opt.color.type !== 'unvalid') {
                style.color = $([{}, {}, {}]).map(function(index, elem) {
                    if(opt.color.type === 'hex') {
                        elem.begin = parseInt(opt.color.begin.substr(index * 2 + 1, 2), 16);
                        elem.end = parseInt(opt.color.end.substr(index * 2 + 1, 2), 16);
                        elem.dist = (elem.begin - Number(((elem.begin - elem.end) * cur_step / steps).toFixed(0))).toString(16);
                    } else {
                        elem.dist = (opt.color.begin[index] - Number(((opt.color.begin[index] - opt.color.end[index]) * cur_step / steps).toFixed(0))).toString(16);
                    }

                    if(elem.dist.length === 1) {
                        elem.dist = '0' + elem.dist;
                    }
                    return elem.dist;
                }).reduce(function(prev, cur) {
                    return prev + cur;
                }, '#');
            }
            return style;
        }
    };
})(jQuery);
