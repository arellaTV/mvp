"use strict";

/*! UIkit 2.26.3 | http://www.getuikit.com | (c) 2014 YOOtheme | MIT License */
(function (addon) {

    var component;

    if (window.UIkit) {
        component = addon(UIkit);
    }

    if (typeof define == "function" && define.amd) {
        define("uikit-timepicker", ["uikit"], function () {
            return component || addon(UIkit);
        });
    }
})(function (UI) {

    "use strict";

    UI.component('timepicker', {

        defaults: {
            format: '24h',
            delay: 0,
            start: 0,
            end: 24
        },

        boot: function boot() {

            // init code
            UI.$html.on("focus.timepicker.uikit", "[data-uk-timepicker]", function (e) {

                var ele = UI.$(this);

                if (!ele.data("timepicker")) {
                    var obj = UI.timepicker(ele, UI.Utils.options(ele.attr("data-uk-timepicker")));

                    setTimeout(function () {
                        obj.autocomplete.input.focus();
                    }, 40);
                }
            });
        },

        init: function init() {

            var $this = this,
                times = getTimeRange(this.options.start, this.options.end),
                container;

            this.options.minLength = 0;
            this.options.template = '<ul class="uk-nav uk-nav-autocomplete uk-autocomplete-results">{{~items}}<li data-value="{{$item.value}}"><a>{{$item.value}}</a></li>{{/items}}</ul>';

            this.options.source = function (release) {
                release(times[$this.options.format] || times['12h']);
            };

            if (this.element.is('input')) {
                this.element.wrap('<div class="uk-autocomplete"></div>');
                container = this.element.parent();
            } else {
                container = this.element.addClass('uk-autocomplete');
            }

            this.autocomplete = UI.autocomplete(container, this.options);
            this.autocomplete.dropdown.addClass('uk-dropdown-small uk-dropdown-scrollable');

            this.autocomplete.on('show.uk.autocomplete', function () {

                var selected = $this.autocomplete.dropdown.find('[data-value="' + $this.autocomplete.input.val() + '"]');

                setTimeout(function () {
                    $this.autocomplete.pick(selected, true);
                }, 10);
            });

            this.autocomplete.input.on('focus', function () {

                $this.autocomplete.value = Math.random();
                $this.autocomplete.triggercomplete();
            }).on('blur', UI.Utils.debounce(function () {
                $this.checkTime();
            }, 100));

            this.element.data("timepicker", this);
        },

        checkTime: function checkTime() {

            var arr,
                timeArray,
                meridian = 'AM',
                hour,
                minute,
                time = this.autocomplete.input.val();

            if (this.options.format == '12h') {
                arr = time.split(' ');
                timeArray = arr[0].split(':');
                meridian = arr[1];
            } else {
                timeArray = time.split(':');
            }

            hour = parseInt(timeArray[0], 10);
            minute = parseInt(timeArray[1], 10);

            if (isNaN(hour)) hour = 0;
            if (isNaN(minute)) minute = 0;

            if (this.options.format == '12h') {
                if (hour > 12) {
                    hour = 12;
                } else if (hour < 0) {
                    hour = 12;
                }

                if (meridian === 'am' || meridian === 'a') {
                    meridian = 'AM';
                } else if (meridian === 'pm' || meridian === 'p') {
                    meridian = 'PM';
                }

                if (meridian !== 'AM' && meridian !== 'PM') {
                    meridian = 'AM';
                }
            } else {

                if (hour >= 24) {
                    hour = 23;
                } else if (hour < 0) {
                    hour = 0;
                }
            }

            if (minute < 0) {
                minute = 0;
            } else if (minute >= 60) {
                minute = 0;
            }

            this.autocomplete.input.val(this.formatTime(hour, minute, meridian)).trigger('change');
        },

        formatTime: function formatTime(hour, minute, meridian) {
            hour = hour < 10 ? '0' + hour : hour;
            minute = minute < 10 ? '0' + minute : minute;
            return hour + ':' + minute + (this.options.format == '12h' ? ' ' + meridian : '');
        }
    });

    // helper

    function getTimeRange(start, end) {

        start = start || 0;
        end = end || 24;

        var times = { '12h': [], '24h': [] },
            i,
            h;

        for (i = start, h = ''; i < end; i++) {

            h = '' + i;

            if (i < 10) h = '0' + h;

            times['24h'].push({ value: h + ':00' });
            times['24h'].push({ value: h + ':30' });

            if (i === 0) {
                h = 12;
                times['12h'].push({ value: h + ':00 AM' });
                times['12h'].push({ value: h + ':30 AM' });
            }

            if (i > 0 && i < 13 && i !== 12) {
                times['12h'].push({ value: h + ':00 AM' });
                times['12h'].push({ value: h + ':30 AM' });
            }

            if (i >= 12) {

                h = h - 12;
                if (h === 0) h = 12;
                if (h < 10) h = '0' + String(h);

                times['12h'].push({ value: h + ':00 PM' });
                times['12h'].push({ value: h + ':30 PM' });
            }
        }

        return times;
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vpa2l0LTIuMjYuMy9qcy9jb21wb25lbnRzL3RpbWVwaWNrZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsQ0FBQyxVQUFTLEtBQVQsRUFBZ0I7O0FBRWIsUUFBSSxTQUFKOztBQUVBLFFBQUksT0FBTyxLQUFYLEVBQWtCO0FBQ2Qsb0JBQVksTUFBTSxLQUFOLENBQVo7QUFDSDs7QUFFRCxRQUFJLE9BQU8sTUFBUCxJQUFpQixVQUFqQixJQUErQixPQUFPLEdBQTFDLEVBQStDO0FBQzNDLGVBQU8sa0JBQVAsRUFBMkIsQ0FBQyxPQUFELENBQTNCLEVBQXNDLFlBQVU7QUFDNUMsbUJBQU8sYUFBYSxNQUFNLEtBQU4sQ0FBcEI7QUFDSCxTQUZEO0FBR0g7QUFFSixDQWRELEVBY0csVUFBUyxFQUFULEVBQVk7O0FBRVg7O0FBR0EsT0FBRyxTQUFILENBQWEsWUFBYixFQUEyQjs7QUFFdkIsa0JBQVU7QUFDTixvQkFBUyxLQURIO0FBRU4sbUJBQVMsQ0FGSDtBQUdOLG1CQUFTLENBSEg7QUFJTixpQkFBUztBQUpILFNBRmE7O0FBU3ZCLGNBQU0sZ0JBQVc7OztBQUdiLGVBQUcsS0FBSCxDQUFTLEVBQVQsQ0FBWSx3QkFBWixFQUFzQyxzQkFBdEMsRUFBOEQsVUFBUyxDQUFULEVBQVk7O0FBRXRFLG9CQUFJLE1BQU0sR0FBRyxDQUFILENBQUssSUFBTCxDQUFWOztBQUVBLG9CQUFJLENBQUMsSUFBSSxJQUFKLENBQVMsWUFBVCxDQUFMLEVBQTZCO0FBQ3pCLHdCQUFJLE1BQU0sR0FBRyxVQUFILENBQWMsR0FBZCxFQUFtQixHQUFHLEtBQUgsQ0FBUyxPQUFULENBQWlCLElBQUksSUFBSixDQUFTLG9CQUFULENBQWpCLENBQW5CLENBQVY7O0FBRUEsK0JBQVcsWUFBVTtBQUNqQiw0QkFBSSxZQUFKLENBQWlCLEtBQWpCLENBQXVCLEtBQXZCO0FBQ0gscUJBRkQsRUFFRyxFQUZIO0FBR0g7QUFDSixhQVhEO0FBWUgsU0F4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QUssRUFBVCxFQUFhOztBQUVULG9CQUFJLElBQUUsRUFBTjtBQUNBLG9CQUFJLE1BQU0sQ0FBVixFQUFhLElBQUksRUFBSjtBQUNiLG9CQUFJLElBQUksRUFBUixFQUFZLElBQUksTUFBSSxPQUFPLENBQVAsQ0FBUjs7QUFFWixzQkFBTSxLQUFOLEVBQWEsSUFBYixDQUFrQixFQUFDLE9BQVEsSUFBRSxRQUFYLEVBQWxCO0FBQ0Esc0JBQU0sS0FBTixFQUFhLElBQWIsQ0FBa0IsRUFBQyxPQUFRLElBQUUsUUFBWCxFQUFsQjtBQUNIO0FBQ0o7O0FBRUQsZUFBTyxLQUFQO0FBQ0g7QUFFSixDQTlMRCIsImZpbGUiOiJ0aW1lcGlja2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIFVJa2l0IDIuMjYuMyB8IGh0dHA6Ly93d3cuZ2V0dWlraXQuY29tIHwgKGMpIDIwMTQgWU9PdGhlbWUgfCBNSVQgTGljZW5zZSAqL1xuKGZ1bmN0aW9uKGFkZG9uKSB7XG5cbiAgICB2YXIgY29tcG9uZW50O1xuXG4gICAgaWYgKHdpbmRvdy5VSWtpdCkge1xuICAgICAgICBjb21wb25lbnQgPSBhZGRvbihVSWtpdCk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKFwidWlraXQtdGltZXBpY2tlclwiLCBbXCJ1aWtpdFwiXSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHJldHVybiBjb21wb25lbnQgfHwgYWRkb24oVUlraXQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pKGZ1bmN0aW9uKFVJKXtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG5cbiAgICBVSS5jb21wb25lbnQoJ3RpbWVwaWNrZXInLCB7XG5cbiAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgIGZvcm1hdCA6ICcyNGgnLFxuICAgICAgICAgICAgZGVsYXkgIDogMCxcbiAgICAgICAgICAgIHN0YXJ0ICA6IDAsXG4gICAgICAgICAgICBlbmQgICAgOiAyNFxuICAgICAgICB9LFxuXG4gICAgICAgIGJvb3Q6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAvLyBpbml0IGNvZGVcbiAgICAgICAgICAgIFVJLiRodG1sLm9uKFwiZm9jdXMudGltZXBpY2tlci51aWtpdFwiLCBcIltkYXRhLXVrLXRpbWVwaWNrZXJdXCIsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgICAgIHZhciBlbGUgPSBVSS4kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCFlbGUuZGF0YShcInRpbWVwaWNrZXJcIikpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9iaiA9IFVJLnRpbWVwaWNrZXIoZWxlLCBVSS5VdGlscy5vcHRpb25zKGVsZS5hdHRyKFwiZGF0YS11ay10aW1lcGlja2VyXCIpKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLmF1dG9jb21wbGV0ZS5pbnB1dC5mb2N1cygpO1xuICAgICAgICAgICAgICAgICAgICB9LCA0MCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgIHZhciAkdGhpcyAgPSB0aGlzLCB0aW1lcyA9IGdldFRpbWVSYW5nZSh0aGlzLm9wdGlvbnMuc3RhcnQsIHRoaXMub3B0aW9ucy5lbmQpLCBjb250YWluZXI7XG5cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5taW5MZW5ndGggPSAwO1xuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnRlbXBsYXRlICA9ICc8dWwgY2xhc3M9XCJ1ay1uYXYgdWstbmF2LWF1dG9jb21wbGV0ZSB1ay1hdXRvY29tcGxldGUtcmVzdWx0c1wiPnt7fml0ZW1zfX08bGkgZGF0YS12YWx1ZT1cInt7JGl0ZW0udmFsdWV9fVwiPjxhPnt7JGl0ZW0udmFsdWV9fTwvYT48L2xpPnt7L2l0ZW1zfX08L3VsPic7XG5cbiAgICAgICAgICAgIHRoaXMub3B0aW9ucy5zb3VyY2UgPSBmdW5jdGlvbihyZWxlYXNlKSB7XG4gICAgICAgICAgICAgICAgcmVsZWFzZSh0aW1lc1skdGhpcy5vcHRpb25zLmZvcm1hdF0gfHwgdGltZXNbJzEyaCddKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmVsZW1lbnQuaXMoJ2lucHV0JykpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQud3JhcCgnPGRpdiBjbGFzcz1cInVrLWF1dG9jb21wbGV0ZVwiPjwvZGl2PicpO1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lciA9IHRoaXMuZWxlbWVudC5wYXJlbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyID0gdGhpcy5lbGVtZW50LmFkZENsYXNzKCd1ay1hdXRvY29tcGxldGUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5hdXRvY29tcGxldGUgPSBVSS5hdXRvY29tcGxldGUoY29udGFpbmVyLCB0aGlzLm9wdGlvbnMpO1xuICAgICAgICAgICAgdGhpcy5hdXRvY29tcGxldGUuZHJvcGRvd24uYWRkQ2xhc3MoJ3VrLWRyb3Bkb3duLXNtYWxsIHVrLWRyb3Bkb3duLXNjcm9sbGFibGUnKTtcblxuICAgICAgICAgICAgdGhpcy5hdXRvY29tcGxldGUub24oJ3Nob3cudWsuYXV0b2NvbXBsZXRlJywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWQgPSAkdGhpcy5hdXRvY29tcGxldGUuZHJvcGRvd24uZmluZCgnW2RhdGEtdmFsdWU9XCInKyR0aGlzLmF1dG9jb21wbGV0ZS5pbnB1dC52YWwoKSsnXCJdJyk7XG5cbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICR0aGlzLmF1dG9jb21wbGV0ZS5waWNrKHNlbGVjdGVkLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5hdXRvY29tcGxldGUuaW5wdXQub24oJ2ZvY3VzJywgZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICR0aGlzLmF1dG9jb21wbGV0ZS52YWx1ZSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgJHRoaXMuYXV0b2NvbXBsZXRlLnRyaWdnZXJjb21wbGV0ZSgpO1xuXG4gICAgICAgICAgICB9KS5vbignYmx1cicsIFVJLlV0aWxzLmRlYm91bmNlKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICR0aGlzLmNoZWNrVGltZSgpO1xuICAgICAgICAgICAgfSwgMTAwKSk7XG5cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5kYXRhKFwidGltZXBpY2tlclwiLCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBjaGVja1RpbWU6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICB2YXIgYXJyLCB0aW1lQXJyYXksIG1lcmlkaWFuID0gJ0FNJywgaG91ciwgbWludXRlLCB0aW1lID0gdGhpcy5hdXRvY29tcGxldGUuaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm9wdGlvbnMuZm9ybWF0ID09ICcxMmgnKSB7XG4gICAgICAgICAgICAgICAgYXJyID0gdGltZS5zcGxpdCgnICcpO1xuICAgICAgICAgICAgICAgIHRpbWVBcnJheSA9IGFyclswXS5zcGxpdCgnOicpO1xuICAgICAgICAgICAgICAgIG1lcmlkaWFuID0gYXJyWzFdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aW1lQXJyYXkgPSB0aW1lLnNwbGl0KCc6Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGhvdXIgICA9IHBhcnNlSW50KHRpbWVBcnJheVswXSwgMTApO1xuICAgICAgICAgICAgbWludXRlID0gcGFyc2VJbnQodGltZUFycmF5WzFdLCAxMCk7XG5cbiAgICAgICAgICAgIGlmIChpc05hTihob3VyKSkgICBob3VyID0gMDtcbiAgICAgICAgICAgIGlmIChpc05hTihtaW51dGUpKSBtaW51dGUgPSAwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5vcHRpb25zLmZvcm1hdCA9PSAnMTJoJykge1xuICAgICAgICAgICAgICAgIGlmIChob3VyID4gMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgaG91ciA9IDEyO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaG91ciA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaG91ciA9IDEyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtZXJpZGlhbiA9PT0gJ2FtJyB8fCBtZXJpZGlhbiA9PT0gJ2EnKSB7XG4gICAgICAgICAgICAgICAgICAgIG1lcmlkaWFuID0gJ0FNJztcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKG1lcmlkaWFuID09PSAncG0nIHx8IG1lcmlkaWFuID09PSAncCcpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyaWRpYW4gPSAnUE0nO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChtZXJpZGlhbiAhPT0gJ0FNJyAmJiBtZXJpZGlhbiAhPT0gJ1BNJykge1xuICAgICAgICAgICAgICAgICAgICBtZXJpZGlhbiA9ICdBTSc7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYgKGhvdXIgPj0gMjQpIHtcbiAgICAgICAgICAgICAgICAgICAgaG91ciA9IDIzO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaG91ciA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaG91ciA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobWludXRlIDwgMCkge1xuICAgICAgICAgICAgICAgIG1pbnV0ZSA9IDA7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKG1pbnV0ZSA+PSA2MCkge1xuICAgICAgICAgICAgICAgIG1pbnV0ZSA9IDA7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuYXV0b2NvbXBsZXRlLmlucHV0LnZhbCh0aGlzLmZvcm1hdFRpbWUoaG91ciwgbWludXRlLCBtZXJpZGlhbikpLnRyaWdnZXIoJ2NoYW5nZScpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGZvcm1hdFRpbWU6IGZ1bmN0aW9uKGhvdXIsIG1pbnV0ZSwgbWVyaWRpYW4pIHtcbiAgICAgICAgICAgIGhvdXIgPSBob3VyIDwgMTAgPyAnMCcgKyBob3VyIDogaG91cjtcbiAgICAgICAgICAgIG1pbnV0ZSA9IG1pbnV0ZSA8IDEwID8gJzAnICsgbWludXRlIDogbWludXRlO1xuICAgICAgICAgICAgcmV0dXJuIGhvdXIgKyAnOicgKyBtaW51dGUgKyAodGhpcy5vcHRpb25zLmZvcm1hdCA9PSAnMTJoJyA/ICcgJyArIG1lcmlkaWFuIDogJycpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBoZWxwZXJcblxuICAgIGZ1bmN0aW9uIGdldFRpbWVSYW5nZShzdGFydCwgZW5kKSB7XG5cbiAgICAgICAgc3RhcnQgPSBzdGFydCB8fCAwO1xuICAgICAgICBlbmQgICA9IGVuZCB8fCAyNDtcblxuICAgICAgICB2YXIgdGltZXMgPSB7JzEyaCc6W10sICcyNGgnOltdfSwgaSwgaDtcblxuICAgICAgICBmb3IgKGkgPSBzdGFydCwgaD0nJzsgaTxlbmQ7IGkrKykge1xuXG4gICAgICAgICAgICBoID0gJycraTtcblxuICAgICAgICAgICAgaWYgKGk8MTApICBoID0gJzAnK2g7XG5cbiAgICAgICAgICAgIHRpbWVzWycyNGgnXS5wdXNoKHt2YWx1ZTogKGgrJzowMCcpfSk7XG4gICAgICAgICAgICB0aW1lc1snMjRoJ10ucHVzaCh7dmFsdWU6IChoKyc6MzAnKX0pO1xuXG4gICAgICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGggPSAxMjtcbiAgICAgICAgICAgICAgICB0aW1lc1snMTJoJ10ucHVzaCh7dmFsdWU6IChoKyc6MDAgQU0nKX0pO1xuICAgICAgICAgICAgICAgIHRpbWVzWycxMmgnXS5wdXNoKHt2YWx1ZTogKGgrJzozMCBBTScpfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpID4gMCAmJiBpPDEzICYmIGkhPT0xMikge1xuICAgICAgICAgICAgICAgIHRpbWVzWycxMmgnXS5wdXNoKHt2YWx1ZTogKGgrJzowMCBBTScpfSk7XG4gICAgICAgICAgICAgICAgdGltZXNbJzEyaCddLnB1c2goe3ZhbHVlOiAoaCsnOjMwIEFNJyl9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGkgPj0gMTIpIHtcblxuICAgICAgICAgICAgICAgIGggPSBoLTEyO1xuICAgICAgICAgICAgICAgIGlmIChoID09PSAwKSBoID0gMTI7XG4gICAgICAgICAgICAgICAgaWYgKGggPCAxMCkgaCA9ICcwJytTdHJpbmcoaCk7XG5cbiAgICAgICAgICAgICAgICB0aW1lc1snMTJoJ10ucHVzaCh7dmFsdWU6IChoKyc6MDAgUE0nKX0pO1xuICAgICAgICAgICAgICAgIHRpbWVzWycxMmgnXS5wdXNoKHt2YWx1ZTogKGgrJzozMCBQTScpfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGltZXM7XG4gICAgfVxuXG59KTtcbiJdfQ==