(function($) {
    // patch the reduce to jQuery
    $.reduce = function(arr, reduce_cb, prev) {
        var result = '';
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
    };

    // lumpy function
    $.fn.lumpy = function (opt) {
        var _self = this;
        (function init(_self, opt) {
            var defaults = {
                color: null,
                opacity: null,
                size: null,
                steps: 50,
                direction: 'end'
            };
            opt = $.extend(defaults, opt);

            opt.origin_text = _self.text();
            opt.steps = check_steps(opt.steps, opt.origin_text.length);
            // lumpy_text.length === opt.steps
            opt.lumpy_text = text_clip(_self, opt.direction, opt.origin_text, opt.steps);
            opt.trim_text = trim(opt.lumpy_text, true);

            if(check_property_existed(opt.color)) {
                // check & set color type
                opt.color.type = check_color_type(opt.color);
                // convert short hex color
                opt.color = convert_hex_color(opt.color);
            }

            if(check_property_existed(opt.size)) {
                // check & set font-size type
                opt.size.type = check_common_type('size', opt.size);
                // divide size to value & unit
                opt.size = divide_size(opt.size);
            }

            if(check_property_existed(opt.opacity)) {
                // check & set opacity type
                opt.opacity.type = check_common_type('opacity', opt.opacity);
            }

            // handle every word in lumpy text and append the result to dom
            generate_lumpy_text(_self, opt);
        })(_self, opt);

        // clip origin text
        function text_clip(lumpy_obj, direction, origin_text, steps) {
            if(direction === 'begin') {
                return origin_text.substr(0, opt.steps);
            } else {
                return origin_text.substr(origin_text.length - steps);
            }
        }

        // trim string
        function trim(str, is_global) {
            if(is_global) {
                return str.replace(/\s/g, '') || '';
            } else {
                return str.replace(/(^\s+)|(\s+$)/g, '') || '';
            }
        }

        // check steps (light check)
        function check_steps(steps, text_length) {
            (steps < text_length) && (steps = text_length);
            return steps;
        }

        // check property existed
        function check_property_existed(property) {
            return (property !== null && Object.keys(property).length > 0) ? true : false;
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
            } else if($.isArray(color.begin) && $.isArray(color.end) &&
                    color.begin.length === 3 && color.end.length === 3 &&
                    color.begin.every(rgb_regex_fn) && color.end.every(rgb_regex_fn)){
                type = 'rgb';
            } else {
                console.error('the begin or end color value is unknown');
            }
            return type;
        }

        // check similar property type (strict check)
        function check_common_type(name, property) {
            var regex = null;
            var type = 'unvalid';
            if(name === 'opacity') {
                regex = /^(1|(0\.\d{1,2}))$/;
            }
            if(name === 'size') {
                regex = /^\d+(\.(\d{1,2}))?[a-zA-Z]{1,3}$/;
            }
            if (regex.test(property.begin) && regex.test(property.end)) {
                type = name;
            } else {
                console.error('the begin or end ' + name + ' value is unknown');
            }
            return type;
        }

        // convert short hex color to real hex color
        function convert_hex_color(color) {
            function _generate_hex(hex_short_obj) {
                var hex_short_arr = [hex_short_obj.substr(1, 1), hex_short_obj.substr(2, 1), hex_short_obj.substr(3, 1)];
                return $.reduce(hex_short_arr, function(prev, cur) {
                    return prev + cur  + cur;
                }, '#');
            }
            if(color.type === 'hex' && color.begin.length === 4) {
                color.begin = _generate_hex(color.begin);
                color.end = _generate_hex(color.end);
            }
            return color;
        }

        // divide size to value & unit
        function divide_size(size) {
            size.unit = size.begin.match(/[a-zA-Z]+/g)[0] || 'px';
            size.begin = size.begin.match(/^\d+(\.\d{1,2})?/g)[0];
            size.end = size.end.match(/^\d+(\.\d{1,2})?/g)[0];
            return size;
        }

        // generate the final lumpy text
        function generate_lumpy_text(lumpy_obj, opt) {
            var changed_arr = [];
            var lumpy_text = opt.lumpy_text;
            var trim_text_length = opt.trim_text.length;
            var origin_text = opt.origin_text;
            var style = null;
            var span = null;

            for(var i=0, j=1, len=opt.steps; i<len; i++) {
                if(lumpy_text[i] !== ' ') {
                    style = cal_gradient(opt, trim_text_length, j++);
                    span = construct_elem($('<span></span>'), style).text(lumpy_text[i]);
                } else {
                    span = $('<span></span>').text(lumpy_text[i]);
                }
                changed_arr.push(span);
            }
            if(opt.direction === 'end') {
                lumpy_obj.text(origin_text.substr(0, origin_text.length - opt.steps));
                lumpy_obj.append(changed_arr);
            } else if (opt.direction === 'begin') {
                lumpy_obj.text(origin_text.substr(opt.steps));
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
            var color = opt.color;
            var size = opt.size;
            var opacity = opt.opacity;

            // construct 'Hex' color
            function _construct_color(type, begin, end, cur_step, steps) {
                return $([{}, {}, {}]).map(function(index, elem) {
                    if(type === 'hex') {
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

            if(opacity !== null && opacity.type !== 'unvalid') {
                opacity.steps = (opacity.steps < steps) ? opacity.steps : steps;

                if(opacity.direction === 'end') {
                    if(cur_step > (steps - opacity.steps)) {
                        style.opacity = (opacity.begin - (opacity.begin - opacity.end) * (cur_step - (steps - opacity.steps)) / opacity.steps).toFixed(2);
                    }
                } else {
                    if(cur_step <= opacity.steps) {
                        style.opacity = (opacity.begin - (opacity.begin - opacity.end) * cur_step / opacity.steps).toFixed(2);
                    }
                }
            }

            if(size !== null && size.type !== 'unvalid') {
                size.steps = (size.steps < steps) ? size.steps : steps;

                if(size.direction === 'end') {
                    if(cur_step > (steps - size.steps)) {
                        style['font-size'] = (size.begin - (size.begin - size.end) * (cur_step - (steps - size.steps)) / size.steps).toFixed(2) + size.unit;
                    }
                } else {
                    if(cur_step <= size.steps) {
                        style['font-size'] = (size.begin - (size.begin - size.end) * cur_step / size.steps).toFixed(2) + size.unit;
                    }
                }
            }

            if(color !== null && color.type !== 'unvalid') {
                color.steps = (color.steps < steps) ? color.steps : steps;

                if(color.direction === 'end') {
                    if(cur_step > (steps - color.steps)) {
                        style.color = _construct_color(color.type, color.begin, color.end, (cur_step - (steps - color.steps)), steps);
                    }
                } else {
                    if(cur_step <= color.steps) {
                        style.color = _construct_color(color.type, color.begin, color.end, cur_step, steps);
                    }
                }
            }
            return style;

        }
    };
})(jQuery);
