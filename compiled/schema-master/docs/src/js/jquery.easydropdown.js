'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/*
* EASYDROPDOWN - A Drop-down Builder for Styleable Inputs and Menus
* Version: 2.0.4
* License: Creative Commons Attribution 3.0 Unported - CC BY 3.0
* http://creativecommons.org/licenses/by/3.0/
* This software may be used freely on commercial and non-commercial projects with attribution to the author/copyright holder.
* Author: Patrick Kunka
* Copyright 2013 Patrick Kunka, All Rights Reserved
*/

(function ($) {

	function EasyDropDown() {
		this.isField = true, this.down = false, this.inFocus = false, this.cutOff = false, this.hasLabel = false, this.keyboardMode = false, this.nativeTouch = true, this.wrapperClass = 'dropdown', this.onSelect = null;
	};

	EasyDropDown.prototype = {
		constructor: EasyDropDown,
		instances: [],
		init: function init(domNode, settings) {
			var self = this;

			$.extend(self, settings);
			self.$select = $(domNode);
			self.options = [];
			self.$options = self.$select.find('option');
			self.isTouch = 'ontouchend' in document;
			self.$select.removeClass(self.wrapperClass + ' dropdown');
			if (self.$options.length) {
				self.$options.each(function (i) {
					var $option = $(this);
					if ($option.is(':selected')) {
						self.selected = {
							index: i,
							title: $option.text()
						};
						self.focusIndex = i;
					};
					if ($option.hasClass('label') && i == 0) {
						self.hasLabel = true;
						self.label = $option.text();
						$option.attr('value', '');
					} else {
						self.options.push({
							domNode: $option[0],
							title: $option.text(),
							value: $option.val(),
							selected: $option.is(':selected')
						});
					};
				});
				if (!self.selected) {
					self.selected = {
						index: 0,
						title: self.$options.eq(0).text()
					};
					self.focusIndex = 0;
				};
				self.render();
			};
		},

		render: function render() {
			var self = this,
			    touchClass = self.isTouch && self.nativeTouch ? ' touch' : '';

			self.$container = self.$select.wrap('<div class="' + self.wrapperClass + touchClass + '"><span class="old"/></div>').parent().parent();
			self.$active = $('<span class="selected">' + self.selected.title + '</span>').appendTo(self.$container);
			self.$carat = $('<span class="carat"/>').appendTo(self.$container);
			self.$scrollWrapper = $('<div><ul/></div>').appendTo(self.$container);
			self.$dropDown = self.$scrollWrapper.find('ul');
			self.$form = self.$container.closest('form');
			$.each(self.options, function () {
				var option = this,
				    active = option.selected ? ' class="active"' : '';
				self.$dropDown.append('<li' + active + '>' + option.title + '</li>');
			});
			self.$items = self.$dropDown.find('li');
			self.maxHeight = 0;
			if (self.cutOff && self.$items.length > self.cutOff) self.$container.addClass('scrollable');
			for (i = 0; i < self.$items.length; i++) {
				var $item = self.$items.eq(i);
				self.maxHeight += $item.outerHeight();
				if (self.cutOff == i + 1) {
					break;
				};
			};

			if (self.isTouch && self.nativeTouch) {
				self.bindTouchHandlers();
			} else {
				self.bindHandlers();
			};
		},

		bindTouchHandlers: function bindTouchHandlers() {
			var self = this;
			self.$container.on('click', function () {
				self.$select.focus();
			});
			self.$select.on({
				change: function change() {
					var $selected = $(this).find('option:selected'),
					    title = $selected.text(),
					    value = $selected.val();

					self.$active.text(title);
					if (typeof self.onSelect == 'function') {
						self.onSelect.call(self, {
							title: title,
							value: value
						});
					};
				},
				focus: function focus() {
					self.$container.addClass('focus');
				},
				blur: function blur() {
					self.$container.removeClass('focus');
				}
			});
		},

		bindHandlers: function bindHandlers() {
			var self = this;
			self.query = '';
			self.$container.on({
				click: function click() {
					if (!self.down) {
						self.open();
					} else {
						self.close();
					};
				},
				mousemove: function mousemove() {
					if (self.keyboardMode) {
						self.keyboardMode = false;
					};
				}
			});

			$('body').on('click', function (e) {
				var $target = $(e.target),
				    classNames = self.wrapperClass.split(' ').join('.');

				if (!$target.closest('.' + classNames).length && self.down) {
					self.close();
				};
			});

			self.$items.on({
				click: function click() {
					var index = $(this).index();
					self.select(index);
					self.$select.focus();
				},
				mouseover: function mouseover() {
					if (!self.keyboardMode) {
						var $t = $(this);
						$t.addClass('focus').siblings().removeClass('focus');
						self.focusIndex = $t.index();
					};
				},
				mouseout: function mouseout() {
					if (!self.keyboardMode) {
						$(this).removeClass('focus');
					};
				}
			});

			self.$select.on({
				focus: function focus() {
					self.$container.addClass('focus');
					self.inFocus = true;
				},
				blur: function blur() {
					self.$container.removeClass('focus');
					self.inFocus = false;
				}
			});

			self.$dropDown.on('scroll', function (e) {
				if (self.$dropDown[0].scrollTop == self.$dropDown[0].scrollHeight - self.maxHeight) {
					self.$container.addClass('bottom');
				} else {
					self.$container.removeClass('bottom');
				};
			});

			self.$select.on('keydown', function (e) {
				if (self.inFocus) {
					self.keyboardMode = true;
					var key = e.keyCode;

					if (key == 38 || key == 40 || key == 32) {
						e.preventDefault();
						if (key == 38) {
							self.focusIndex--;
							self.focusIndex = self.focusIndex < 0 ? self.$items.length - 1 : self.focusIndex;
						} else if (key == 40) {
							self.focusIndex++;
							self.focusIndex = self.focusIndex > self.$items.length - 1 ? 0 : self.focusIndex;
						};
						if (!self.down) {
							self.open();
						};
						self.$items.removeClass('focus').eq(self.focusIndex).addClass('focus');
						if (self.cutOff) {
							self.scrollToView();
						};
						self.query = '';
					};
					if (self.down) {
						if (key == 9 || key == 27) {
							self.close();
						} else if (key == 13) {
							e.preventDefault();
							self.select(self.focusIndex);
							self.close();
							return false;
						} else if (key == 8) {
							e.preventDefault();
							self.query = self.query.slice(0, -1);
							self.search();
							return false;
						} else if (key != 38 && key != 40) {
							var letter = String.fromCharCode(key);
							self.query += letter;
							self.search();
						};
					};
				};
			});

			if (self.$form.length) {
				self.$form.on('reset', function () {
					var active = self.hasLabel ? self.label : '';
					self.$active.text(active);
				});
			};
		},

		open: function open() {
			var self = this,
			    scrollTop = window.scrollY || document.documentElement.scrollTop,
			    scrollLeft = window.scrollX || document.documentElement.scrollLeft,
			    scrollOffset = self.notInViewport(scrollTop);

			self.closeAll();
			self.$select.focus();
			window.scrollTo(scrollLeft, scrollTop + scrollOffset);
			self.$container.addClass('open');
			self.$scrollWrapper.css('height', self.maxHeight + 'px');
			self.down = true;
		},

		close: function close() {
			var self = this;
			self.$container.removeClass('open');
			self.$scrollWrapper.css('height', '0px');
			self.focusIndex = self.selected.index;
			self.query = '';
			self.down = false;
		},

		closeAll: function closeAll() {
			var self = this,
			    instances = Object.getPrototypeOf(self).instances;
			for (i = 0; i < instances.length; i++) {
				instances[i].close();
			};
		},

		select: function select(index) {
			var self = this,
			    option = self.options[index],
			    selectIndex = self.hasLabel ? index + 1 : index;
			self.$items.removeClass('active').eq(index).addClass('active');
			self.$active.text(option.title);
			self.$select.find('option').prop('selected', false).eq(selectIndex).prop('selected', 'selected');
			self.selected = {
				index: index,
				title: option.title
			};
			self.focusIndex = i;
			if (typeof self.onSelect == 'function') {
				self.onSelect.call(self, {
					title: option.title,
					value: option.value
				});
			};
		},

		search: function search() {
			var self = this;
			for (i = 0; i < self.options.length; i++) {
				var title = self.options[i].title.toUpperCase();
				if (title.indexOf(self.query) != -1) {
					self.focusIndex = i;
					self.$items.removeClass('focus').eq(self.focusIndex).addClass('focus');
					self.scrollToView();
					break;
				};
			};
		},

		scrollToView: function scrollToView() {
			var self = this;
			if (self.focusIndex >= self.cutOff) {
				var $focusItem = self.$items.eq(self.focusIndex),
				    scroll = $focusItem.outerHeight() * (self.focusIndex + 1) - self.maxHeight;

				self.$dropDown.scrollTop(scroll);
			};
		},

		notInViewport: function notInViewport(scrollTop) {
			var self = this,
			    range = {
				min: scrollTop,
				max: scrollTop + (window.innerHeight || document.documentElement.clientHeight)
			},
			    menuBottom = self.$dropDown.offset().top + self.maxHeight;

			if (menuBottom >= range.min && menuBottom <= range.max) {
				return 0;
			} else {
				return menuBottom - range.max + 5;
			};
		}
	};

	function instantiate(domNode, settings) {
		var instance = new EasyDropDown();
		instance.init(domNode, settings);
		instance.instances.push(instance);
	};

	$.fn.easyDropDown = function (settings) {
		return this.each(function () {
			instantiate(this, settings);
		});
	};

	$(function () {
		if (typeof Object.getPrototypeOf !== "function") {
			if (_typeof("test".__proto__) === "object") {
				Object.getPrototypeOf = function (object) {
					return object.__proto__;
				};
			} else {
				Object.getPrototypeOf = function (object) {
					return object.constructor.prototype;
				};
			};
		};

		$('.dropdown').each(function () {
			var json = $(this).attr('data-settings');
			settings = json ? $.parseJSON(json) : {};
			instantiate(this, settings);
		});
	});
})(jQuery);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NjaGVtYS1tYXN0ZXIvZG9jcy9zcmMvanMvanF1ZXJ5LmVhc3lkcm9wZG93bi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQVdBLENBQUMsVUFBUyxDQUFULEVBQVc7O0FBRVgsVUFBUyxZQUFULEdBQXVCO0FBQ3RCLE9BQUssT0FBTCxHQUFlLElBQWYsRUFDQSxLQUFLLElBQUwsR0FBWSxLQURaLEVBRUEsS0FBSyxPQUFMLEdBQWUsS0FGZixFQUdBLEtBQUssTUFBTCxHQUFjLEtBSGQsRUFJQSxLQUFLLFFBQUwsR0FBZ0IsS0FKaEIsRUFLQSxLQUFLLFlBQUwsR0FBb0IsS0FMcEIsRUFNQSxLQUFLLFdBQUwsR0FBbUIsSUFObkIsRUFPQSxLQUFLLFlBQUwsR0FBb0IsVUFQcEIsRUFRQSxLQUFLLFFBQUwsR0FBZ0IsSUFSaEI7QUFTQTs7QUFFRCxjQUFhLFNBQWIsR0FBeUI7QUFDeEIsZUFBYSxZQURXO0FBRXhCLGFBQVcsRUFGYTtBQUd4QixRQUFNLGNBQVMsT0FBVCxFQUFrQixRQUFsQixFQUEyQjtBQUNoQyxPQUFJLE9BQU8sSUFBWDs7QUFFQSxLQUFFLE1BQUYsQ0FBUyxJQUFULEVBQWUsUUFBZjtBQUNBLFFBQUssT0FBTCxHQUFlLEVBQUUsT0FBRixDQUFmO0FBQ0EsUUFBSyxPQUFMLEdBQWUsRUFBZjtBQUNBLFFBQUssUUFBTCxHQUFnQixLQUFLLE9BQUwsQ0FBYSxJQUFiLENBQWtCLFFBQWxCLENBQWhCO0FBQ0EsUUFBSyxPQUFMLEdBQWUsZ0JBQWdCLFFBQS9CO0FBQ0EsUUFBSyxPQUFMLENBQWEsV0FBYixDQUF5QixLQUFLLFlBQUwsR0FBa0IsV0FBM0M7QUFDQSxPQUFHLEtBQUssUUFBTCxDQUFjLE1BQWpCLEVBQXdCO0FBQ3ZCLFNBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsVUFBUyxDQUFULEVBQVc7QUFDN0IsU0FBSSxVQUFVLEVBQUUsSUFBRixDQUFkO0FBQ0EsU0FBRyxRQUFR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SUFBSSxZQUFKLEVBQWY7QUFDQSxXQUFTLElBQVQsQ0FBYyxPQUFkLEVBQXVCLFFBQXZCO0FBQ0EsV0FBUyxTQUFULENBQW1CLElBQW5CLENBQXdCLFFBQXhCO0FBQ0E7O0FBRUQsR0FBRSxFQUFGLENBQUssWUFBTCxHQUFvQixVQUFTLFFBQVQsRUFBa0I7QUFDckMsU0FBTyxLQUFLLElBQUwsQ0FBVSxZQUFVO0FBQzFCLGVBQVksSUFBWixFQUFrQixRQUFsQjtBQUNBLEdBRk0sQ0FBUDtBQUdBLEVBSkQ7O0FBTUEsR0FBRSxZQUFVO0FBQ1gsTUFBSSxPQUFPLE9BQU8sY0FBZCxLQUFpQyxVQUFyQyxFQUFnRDtBQUMvQyxPQUFJLFFBQU8sT0FBTyxTQUFkLE1BQTRCLFFBQWhDLEVBQXlDO0FBQ3hDLFdBQU8sY0FBUCxHQUF3QixVQUFTLE1BQVQsRUFBZ0I7QUFDdkMsWUFBTyxPQUFPLFNBQWQ7QUFDQSxLQUZEO0FBR0EsSUFKRCxNQUlPO0FBQ04sV0FBTyxjQUFQLEdBQXdCLFVBQVMsTUFBVCxFQUFnQjtBQUN2QyxZQUFPLE9BQU8sV0FBUCxDQUFtQixTQUExQjtBQUNBLEtBRkQ7QUFHQTtBQUNEOztBQUVELElBQUUsV0FBRixFQUFlLElBQWYsQ0FBb0IsWUFBVTtBQUM3QixPQUFJLE9BQU8sRUFBRSxJQUFGLEVBQVEsSUFBUixDQUFhLGVBQWIsQ0FBWDtBQUNDLGNBQVcsT0FBTyxFQUFFLFNBQUYsQ0FBWSxJQUFaLENBQVAsR0FBMkIsRUFBdEM7QUFDRCxlQUFZLElBQVosRUFBa0IsUUFBbEI7QUFDQSxHQUpEO0FBS0EsRUFsQkQ7QUFtQkEsQ0F6V0QsRUF5V0csTUF6V0giLCJmaWxlIjoianF1ZXJ5LmVhc3lkcm9wZG93bi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4qIEVBU1lEUk9QRE9XTiAtIEEgRHJvcC1kb3duIEJ1aWxkZXIgZm9yIFN0eWxlYWJsZSBJbnB1dHMgYW5kIE1lbnVzXG4qIFZlcnNpb246IDIuMC40XG4qIExpY2Vuc2U6IENyZWF0aXZlIENvbW1vbnMgQXR0cmlidXRpb24gMy4wIFVucG9ydGVkIC0gQ0MgQlkgMy4wXG4qIGh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL2xpY2Vuc2VzL2J5LzMuMC9cbiogVGhpcyBzb2Z0d2FyZSBtYXkgYmUgdXNlZCBmcmVlbHkgb24gY29tbWVyY2lhbCBhbmQgbm9uLWNvbW1lcmNpYWwgcHJvamVjdHMgd2l0aCBhdHRyaWJ1dGlvbiB0byB0aGUgYXV0aG9yL2NvcHlyaWdodCBob2xkZXIuXG4qIEF1dGhvcjogUGF0cmljayBLdW5rYVxuKiBDb3B5cmlnaHQgMjAxMyBQYXRyaWNrIEt1bmthLCBBbGwgUmlnaHRzIFJlc2VydmVkXG4qL1xuXG5cbihmdW5jdGlvbigkKXtcblx0XG5cdGZ1bmN0aW9uIEVhc3lEcm9wRG93bigpe1xuXHRcdHRoaXMuaXNGaWVsZCA9IHRydWUsXG5cdFx0dGhpcy5kb3duID0gZmFsc2UsXG5cdFx0dGhpcy5pbkZvY3VzID0gZmFsc2UsXG5cdFx0dGhpcy5jdXRPZmYgPSBmYWxzZSxcblx0XHR0aGlzLmhhc0xhYmVsID0gZmFsc2UsXG5cdFx0dGhpcy5rZXlib2FyZE1vZGUgPSBmYWxzZSxcblx0XHR0aGlzLm5hdGl2ZVRvdWNoID0gdHJ1ZSxcblx0XHR0aGlzLndyYXBwZXJDbGFzcyA9ICdkcm9wZG93bicsXG5cdFx0dGhpcy5vblNlbGVjdCA9IG51bGw7XG5cdH07XG5cdFxuXHRFYXN5RHJvcERvd24ucHJvdG90eXBlID0ge1xuXHRcdGNvbnN0cnVjdG9yOiBFYXN5RHJvcERvd24sXG5cdFx0aW5zdGFuY2VzOiBbXSxcblx0XHRpbml0OiBmdW5jdGlvbihkb21Ob2RlLCBzZXR0aW5ncyl7XG5cdFx0XHR2YXJcdHNlbGYgPSB0aGlzO1xuXHRcdFx0XG5cdFx0XHQkLmV4dGVuZChzZWxmLCBzZXR0aW5ncyk7XG5cdFx0XHRzZWxmLiRzZWxlY3QgPSAkKGRvbU5vZGUpO1xuXHRcdFx0c2VsZi5vcHRpb25zID0gW107XG5cdFx0XHRzZWxmLiRvcHRpb25zID0gc2VsZi4kc2VsZWN0LmZpbmQoJ29wdGlvbicpO1xuXHRcdFx0c2VsZi5pc1RvdWNoID0gJ29udG91Y2hlbmQnIGluIGRvY3VtZW50O1xuXHRcdFx0c2VsZi4kc2VsZWN0LnJlbW92ZUNsYXNzKHNlbGYud3JhcHBlckNsYXNzKycgZHJvcGRvd24nKTtcblx0XHRcdGlmKHNlbGYuJG9wdGlvbnMubGVuZ3RoKXtcblx0XHRcdFx0c2VsZi4kb3B0aW9ucy5lYWNoKGZ1bmN0aW9uKGkpe1xuXHRcdFx0XHRcdHZhciAkb3B0aW9uID0gJCh0aGlzKTtcblx0XHRcdFx0XHRpZigkb3B0aW9uLmlzKCc6c2VsZWN0ZWQnKSl7XG5cdFx0XHRcdFx0XHRzZWxmLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRcdFx0XHRpbmRleDogaSxcblx0XHRcdFx0XHRcdFx0dGl0bGU6ICRvcHRpb24udGV4dCgpXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRzZWxmLmZvY3VzSW5kZXggPSBpO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0aWYoJG9wdGlvbi5oYXNDbGFzcygnbGFiZWwnKSAmJiBpID09IDApe1xuXHRcdFx0XHRcdFx0c2VsZi5oYXNMYWJlbCA9IHRydWU7XG5cdFx0XHRcdFx0XHRzZWxmLmxhYmVsID0gJG9wdGlvbi50ZXh0KCk7XG5cdFx0XHRcdFx0XHQkb3B0aW9uLmF0dHIoJ3ZhbHVlJywnJyk7XG5cdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdHNlbGYub3B0aW9ucy5wdXNoKHtcblx0XHRcdFx0XHRcdFx0ZG9tTm9kZTogJG9wdGlvblswXSxcblx0XHRcdFx0XHRcdFx0dGl0bGU6ICRvcHRpb24udGV4dCgpLFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogJG9wdGlvbi52YWwoKSxcblx0XHRcdFx0XHRcdFx0c2VsZWN0ZWQ6ICRvcHRpb24uaXMoJzpzZWxlY3RlZCcpXG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0aWYoIXNlbGYuc2VsZWN0ZWQpe1xuXHRcdFx0XHRcdHNlbGYuc2VsZWN0ZWQgPSB7XG5cdFx0XHRcdFx0XHRpbmRleDogMCxcblx0XHRcdFx0XHRcdHRpdGxlOiBzZWxmLiRvcHRpb25zLmVxKDApLnRleHQoKVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRzZWxmLmZvY3VzSW5kZXggPSAwO1xuXHRcdFx0XHR9O1xuXHRcdFx0XHRzZWxmLnJlbmRlcigpO1xuXHRcdFx0fTtcblx0XHR9LFxuXHRcblx0XHRyZW5kZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXJcdHNlbGYgPSB0aGlzLFxuXHRcdFx0XHR0b3VjaENsYXNzID0gc2VsZi5pc1RvdWNoICYmIHNlbGYubmF0aXZlVG91Y2ggPyAnIHRvdWNoJyA6ICcnO1xuXHRcdFx0XG5cdFx0XHRzZWxmLiRjb250YWluZXIgPSBzZWxmLiRzZWxlY3Qud3JhcCgnPGRpdiBjbGFzcz1cIicrc2VsZi53cmFwcGVyQ2xhc3MrdG91Y2hDbGFzcysnXCI+PHNwYW4gY2xhc3M9XCJvbGRcIi8+PC9kaXY+JykucGFyZW50KCkucGFyZW50KCk7XG5cdFx0XHRzZWxmLiRhY3RpdmUgPSAkKCc8c3BhbiBjbGFzcz1cInNlbGVjdGVkXCI+JytzZWxmLnNlbGVjdGVkLnRpdGxlKyc8L3NwYW4+JykuYXBwZW5kVG8oc2VsZi4kY29udGFpbmVyKTtcblx0XHRcdHNlbGYuJGNhcmF0ID0gJCgnPHNwYW4gY2xhc3M9XCJjYXJhdFwiLz4nKS5hcHBlbmRUbyhzZWxmLiRjb250YWluZXIpO1xuXHRcdFx0c2VsZi4kc2Nyb2xsV3JhcHBlciA9ICQoJzxkaXY+PHVsLz48L2Rpdj4nKS5hcHBlbmRUbyhzZWxmLiRjb250YWluZXIpO1xuXHRcdFx0c2VsZi4kZHJvcERvd24gPSBzZWxmLiRzY3JvbGxXcmFwcGVyLmZpbmQoJ3VsJyk7XG5cdFx0XHRzZWxmLiRmb3JtID0gc2VsZi4kY29udGFpbmVyLmNsb3Nlc3QoJ2Zvcm0nKTtcblx0XHRcdCQuZWFjaChzZWxmLm9wdGlvbnMsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHZhclx0b3B0aW9uID0gdGhpcyxcblx0XHRcdFx0XHRhY3RpdmUgPSBvcHRpb24uc2VsZWN0ZWQgPyAnIGNsYXNzPVwiYWN0aXZlXCInOicnO1xuXHRcdFx0XHRzZWxmLiRkcm9wRG93bi5hcHBlbmQoJzxsaScrYWN0aXZlKyc+JytvcHRpb24udGl0bGUrJzwvbGk+Jyk7XG5cdFx0XHR9KTtcblx0XHRcdHNlbGYuJGl0ZW1zID0gc2VsZi4kZHJvcERvd24uZmluZCgnbGknKTtcblx0XHRcdHNlbGYubWF4SGVpZ2h0ID0gMDtcblx0XHRcdGlmKHNlbGYuY3V0T2ZmICYmIHNlbGYuJGl0ZW1zLmxlbmd0aCA+IHNlbGYuY3V0T2ZmKXNlbGYuJGNvbnRhaW5lci5hZGRDbGFzcygnc2Nyb2xsYWJsZScpO1xuXHRcdFx0Zm9yKGkgPSAwOyBpIDwgc2VsZi4kaXRlbXMubGVuZ3RoOyBpKyspe1xuXHRcdFx0XHR2YXIgJGl0ZW0gPSBzZWxmLiRpdGVtcy5lcShpKTtcblx0XHRcdFx0c2VsZi5tYXhIZWlnaHQgKz0gJGl0ZW0ub3V0ZXJIZWlnaHQoKTtcblx0XHRcdFx0aWYoc2VsZi5jdXRPZmYgPT0gaSsxKXtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fTtcblx0XHRcdH07XG5cblx0XHRcdGlmKHNlbGYuaXNUb3VjaCAmJiBzZWxmLm5hdGl2ZVRvdWNoKXtcblx0XHRcdFx0c2VsZi5iaW5kVG91Y2hIYW5kbGVycygpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2VsZi5iaW5kSGFuZGxlcnMoKTtcblx0XHRcdH07XG5cdFx0fSxcblx0XHRcblx0XHRiaW5kVG91Y2hIYW5kbGVyczogZnVuY3Rpb24oKXtcblx0XHRcdHZhclx0c2VsZiA9IHRoaXM7XG5cdFx0XHRzZWxmLiRjb250YWluZXIub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuXHRcdFx0XHRzZWxmLiRzZWxlY3QuZm9jdXMoKTtcblx0XHRcdH0pO1xuXHRcdFx0c2VsZi4kc2VsZWN0Lm9uKHtcblx0XHRcdFx0Y2hhbmdlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHZhclx0JHNlbGVjdGVkID0gJCh0aGlzKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKSxcblx0XHRcdFx0XHRcdHRpdGxlID0gJHNlbGVjdGVkLnRleHQoKSxcblx0XHRcdFx0XHRcdHZhbHVlID0gJHNlbGVjdGVkLnZhbCgpO1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0c2VsZi4kYWN0aXZlLnRleHQodGl0bGUpO1xuXHRcdFx0XHRcdGlmKHR5cGVvZiBzZWxmLm9uU2VsZWN0ID09ICdmdW5jdGlvbicpe1xuXHRcdFx0XHRcdFx0c2VsZi5vblNlbGVjdC5jYWxsKHNlbGYse1xuXHRcdFx0XHRcdFx0XHR0aXRsZTogdGl0bGUsIFxuXHRcdFx0XHRcdFx0XHR2YWx1ZTogdmFsdWVcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGZvY3VzOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHNlbGYuJGNvbnRhaW5lci5hZGRDbGFzcygnZm9jdXMnKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Ymx1cjogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2ZvY3VzJyk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH0sXG5cdFxuXHRcdGJpbmRIYW5kbGVyczogZnVuY3Rpb24oKXtcblx0XHRcdHZhclx0c2VsZiA9IHRoaXM7XG5cdFx0XHRzZWxmLnF1ZXJ5ID0gJyc7XG5cdFx0XHRzZWxmLiRjb250YWluZXIub24oe1xuXHRcdFx0XHRjbGljazogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRpZighc2VsZi5kb3duKXtcblx0XHRcdFx0XHRcdHNlbGYub3BlbigpO1xuXHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRzZWxmLmNsb3NlKCk7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSxcblx0XHRcdFx0bW91c2Vtb3ZlOiBmdW5jdGlvbigpe1xuXHRcdFx0XHRcdGlmKHNlbGYua2V5Ym9hcmRNb2RlKXtcblx0XHRcdFx0XHRcdHNlbGYua2V5Ym9hcmRNb2RlID0gZmFsc2U7XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdCQoJ2JvZHknKS5vbignY2xpY2snLGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHR2YXIgJHRhcmdldCA9ICQoZS50YXJnZXQpLFxuXHRcdFx0XHRcdGNsYXNzTmFtZXMgPSBzZWxmLndyYXBwZXJDbGFzcy5zcGxpdCgnICcpLmpvaW4oJy4nKTtcblxuXHRcdFx0XHRpZighJHRhcmdldC5jbG9zZXN0KCcuJytjbGFzc05hbWVzKS5sZW5ndGggJiYgc2VsZi5kb3duKXtcblx0XHRcdFx0XHRzZWxmLmNsb3NlKCk7XG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblxuXHRcdFx0c2VsZi4kaXRlbXMub24oe1xuXHRcdFx0XHRjbGljazogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgaW5kZXggPSAkKHRoaXMpLmluZGV4KCk7XG5cdFx0XHRcdFx0c2VsZi5zZWxlY3QoaW5kZXgpO1xuXHRcdFx0XHRcdHNlbGYuJHNlbGVjdC5mb2N1cygpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtb3VzZW92ZXI6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0aWYoIXNlbGYua2V5Ym9hcmRNb2RlKXtcblx0XHRcdFx0XHRcdHZhciAkdCA9ICQodGhpcyk7XG5cdFx0XHRcdFx0XHQkdC5hZGRDbGFzcygnZm9jdXMnKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdmb2N1cycpO1xuXHRcdFx0XHRcdFx0c2VsZi5mb2N1c0luZGV4ID0gJHQuaW5kZXgoKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRtb3VzZW91dDogZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRpZighc2VsZi5rZXlib2FyZE1vZGUpe1xuXHRcdFx0XHRcdFx0JCh0aGlzKS5yZW1vdmVDbGFzcygnZm9jdXMnKTtcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0c2VsZi4kc2VsZWN0Lm9uKHtcblx0XHRcdFx0Zm9jdXM6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0c2VsZi4kY29udGFpbmVyLmFkZENsYXNzKCdmb2N1cycpO1xuXHRcdFx0XHRcdHNlbGYuaW5Gb2N1cyA9IHRydWU7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGJsdXI6IGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0c2VsZi4kY29udGFpbmVyLnJlbW92ZUNsYXNzKCdmb2N1cycpO1xuXHRcdFx0XHRcdHNlbGYuaW5Gb2N1cyA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0c2VsZi4kZHJvcERvd24ub24oJ3Njcm9sbCcsZnVuY3Rpb24oZSl7XG5cdFx0XHRcdGlmKHNlbGYuJGRyb3BEb3duWzBdLnNjcm9sbFRvcCA9PSBzZWxmLiRkcm9wRG93blswXS5zY3JvbGxIZWlnaHQgLSBzZWxmLm1heEhlaWdodCl7XG5cdFx0XHRcdFx0c2VsZi4kY29udGFpbmVyLmFkZENsYXNzKCdib3R0b20nKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ2JvdHRvbScpO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0XHRcblx0XHRcdHNlbGYuJHNlbGVjdC5vbigna2V5ZG93bicsIGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRpZihzZWxmLmluRm9jdXMpe1xuXHRcdFx0XHRcdHNlbGYua2V5Ym9hcmRNb2RlID0gdHJ1ZTtcblx0XHRcdFx0XHR2YXIga2V5ID0gZS5rZXlDb2RlO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdGlmKGtleSA9PSAzOCB8fCBrZXkgPT0gNDAgfHwga2V5ID09IDMyKXtcblx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdGlmKGtleSA9PSAzOCl7XG5cdFx0XHRcdFx0XHRcdHNlbGYuZm9jdXNJbmRleC0tXG5cdFx0XHRcdFx0XHRcdHNlbGYuZm9jdXNJbmRleCA9IHNlbGYuZm9jdXNJbmRleCA8IDAgPyBzZWxmLiRpdGVtcy5sZW5ndGggLSAxIDogc2VsZi5mb2N1c0luZGV4O1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmKGtleSA9PSA0MCl7XG5cdFx0XHRcdFx0XHRcdHNlbGYuZm9jdXNJbmRleCsrXG5cdFx0XHRcdFx0XHRcdHNlbGYuZm9jdXNJbmRleCA9IHNlbGYuZm9jdXNJbmRleCA+IHNlbGYuJGl0ZW1zLmxlbmd0aCAtIDEgPyAwIDogc2VsZi5mb2N1c0luZGV4O1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdGlmKCFzZWxmLmRvd24pe1xuXHRcdFx0XHRcdFx0XHRzZWxmLm9wZW4oKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0XHRzZWxmLiRpdGVtcy5yZW1vdmVDbGFzcygnZm9jdXMnKS5lcShzZWxmLmZvY3VzSW5kZXgpLmFkZENsYXNzKCdmb2N1cycpO1xuXHRcdFx0XHRcdFx0aWYoc2VsZi5jdXRPZmYpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLnNjcm9sbFRvVmlldygpO1xuXHRcdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRcdHNlbGYucXVlcnkgPSAnJztcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGlmKHNlbGYuZG93bil7XG5cdFx0XHRcdFx0XHRpZihrZXkgPT0gOSB8fCBrZXkgPT0gMjcpe1xuXHRcdFx0XHRcdFx0XHRzZWxmLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYoa2V5ID09IDEzKXtcblx0XHRcdFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnNlbGVjdChzZWxmLmZvY3VzSW5kZXgpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0XHRcdH0gZWxzZSBpZihrZXkgPT0gOCl7XG5cdFx0XHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHRcdFx0c2VsZi5xdWVyeSA9IHNlbGYucXVlcnkuc2xpY2UoMCwtMSlcblx0XHRcdFx0XHRcdFx0c2VsZi5zZWFyY2goKTtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRcdFx0fSBlbHNlIGlmKGtleSAhPSAzOCAmJiBrZXkgIT0gNDApe1xuXHRcdFx0XHRcdFx0XHR2YXIgbGV0dGVyID0gU3RyaW5nLmZyb21DaGFyQ29kZShrZXkpO1xuXHRcdFx0XHRcdFx0XHRzZWxmLnF1ZXJ5ICs9IGxldHRlcjtcblx0XHRcdFx0XHRcdFx0c2VsZi5zZWFyY2goKTtcblx0XHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fTtcblx0XHRcdH0pO1xuXHRcdFx0XG5cdFx0XHRpZihzZWxmLiRmb3JtLmxlbmd0aCl7XG5cdFx0XHRcdHNlbGYuJGZvcm0ub24oJ3Jlc2V0JywgZnVuY3Rpb24oKXtcblx0XHRcdFx0XHR2YXIgYWN0aXZlID0gc2VsZi5oYXNMYWJlbCA/IHNlbGYubGFiZWwgOiAnJztcblx0XHRcdFx0XHRzZWxmLiRhY3RpdmUudGV4dChhY3RpdmUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0fSxcblx0XHRcblx0XHRvcGVuOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRzY3JvbGxUb3AgPSB3aW5kb3cuc2Nyb2xsWSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLFxuXHRcdFx0XHRzY3JvbGxMZWZ0ID0gd2luZG93LnNjcm9sbFggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQsXG5cdFx0XHRcdHNjcm9sbE9mZnNldCA9IHNlbGYubm90SW5WaWV3cG9ydChzY3JvbGxUb3ApO1xuXG5cdFx0XHRzZWxmLmNsb3NlQWxsKCk7XG5cdFx0XHRzZWxmLiRzZWxlY3QuZm9jdXMoKTtcblx0XHRcdHdpbmRvdy5zY3JvbGxUbyhzY3JvbGxMZWZ0LCBzY3JvbGxUb3Arc2Nyb2xsT2Zmc2V0KTtcblx0XHRcdHNlbGYuJGNvbnRhaW5lci5hZGRDbGFzcygnb3BlbicpO1xuXHRcdFx0c2VsZi4kc2Nyb2xsV3JhcHBlci5jc3MoJ2hlaWdodCcsc2VsZi5tYXhIZWlnaHQrJ3B4Jyk7XG5cdFx0XHRzZWxmLmRvd24gPSB0cnVlO1xuXHRcdH0sXG5cdFx0XG5cdFx0Y2xvc2U6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRzZWxmLiRjb250YWluZXIucmVtb3ZlQ2xhc3MoJ29wZW4nKTtcblx0XHRcdHNlbGYuJHNjcm9sbFdyYXBwZXIuY3NzKCdoZWlnaHQnLCcwcHgnKTtcblx0XHRcdHNlbGYuZm9jdXNJbmRleCA9IHNlbGYuc2VsZWN0ZWQuaW5kZXg7XG5cdFx0XHRzZWxmLnF1ZXJ5ID0gJyc7XG5cdFx0XHRzZWxmLmRvd24gPSBmYWxzZTtcblx0XHR9LFxuXHRcdFxuXHRcdGNsb3NlQWxsOiBmdW5jdGlvbigpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRpbnN0YW5jZXMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yoc2VsZikuaW5zdGFuY2VzO1xuXHRcdFx0Zm9yKGkgPSAwOyBpIDwgaW5zdGFuY2VzLmxlbmd0aDsgaSsrKXtcblx0XHRcdFx0aW5zdGFuY2VzW2ldLmNsb3NlKCk7XG5cdFx0XHR9O1xuXHRcdH0sXG5cdFxuXHRcdHNlbGVjdDogZnVuY3Rpb24oaW5kZXgpe1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRvcHRpb24gPSBzZWxmLm9wdGlvbnNbaW5kZXhdLFxuXHRcdFx0XHRzZWxlY3RJbmRleCA9IHNlbGYuaGFzTGFiZWwgPyBpbmRleCArIDEgOiBpbmRleDtcblx0XHRcdHNlbGYuJGl0ZW1zLnJlbW92ZUNsYXNzKCdhY3RpdmUnKS5lcShpbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0c2VsZi4kYWN0aXZlLnRleHQob3B0aW9uLnRpdGxlKTtcblx0XHRcdHNlbGYuJHNlbGVjdC5maW5kKCdvcHRpb24nKS5wcm9wKCdzZWxlY3RlZCcsZmFsc2UpLmVxKHNlbGVjdEluZGV4KS5wcm9wKCdzZWxlY3RlZCcsJ3NlbGVjdGVkJyk7XG5cdFx0XHRzZWxmLnNlbGVjdGVkID0ge1xuXHRcdFx0XHRpbmRleDogaW5kZXgsXG5cdFx0XHRcdHRpdGxlOiBvcHRpb24udGl0bGVcblx0XHRcdH07XG5cdFx0XHRzZWxmLmZvY3VzSW5kZXggPSBpO1xuXHRcdFx0aWYodHlwZW9mIHNlbGYub25TZWxlY3QgPT0gJ2Z1bmN0aW9uJyl7XG5cdFx0XHRcdHNlbGYub25TZWxlY3QuY2FsbChzZWxmLHtcblx0XHRcdFx0XHR0aXRsZTogb3B0aW9uLnRpdGxlLCBcblx0XHRcdFx0XHR2YWx1ZTogb3B0aW9uLnZhbHVlXG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHR9LFxuXHRcdFxuXHRcdHNlYXJjaDogZnVuY3Rpb24oKXtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdGZvcihpID0gMDsgaSA8IHNlbGYub3B0aW9ucy5sZW5ndGg7IGkrKyl7XG5cdFx0XHRcdHZhciB0aXRsZSA9IHNlbGYub3B0aW9uc1tpXS50aXRsZS50b1VwcGVyQ2FzZSgpO1xuXHRcdFx0XHRpZih0aXRsZS5pbmRleE9mKHNlbGYucXVlcnkpICE9IC0xKXtcblx0XHRcdFx0XHRzZWxmLmZvY3VzSW5kZXggPSBpO1xuXHRcdFx0XHRcdHNlbGYuJGl0ZW1zLnJlbW92ZUNsYXNzKCdmb2N1cycpLmVxKHNlbGYuZm9jdXNJbmRleCkuYWRkQ2xhc3MoJ2ZvY3VzJyk7XG5cdFx0XHRcdFx0c2VsZi5zY3JvbGxUb1ZpZXcoKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fTtcblx0XHRcdH07XG5cdFx0fSxcblx0XHRcblx0XHRzY3JvbGxUb1ZpZXc6IGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XG5cdFx0XHRpZihzZWxmLmZvY3VzSW5kZXggPj0gc2VsZi5jdXRPZmYpe1xuXHRcdFx0XHR2YXIgJGZvY3VzSXRlbSA9IHNlbGYuJGl0ZW1zLmVxKHNlbGYuZm9jdXNJbmRleCksXG5cdFx0XHRcdFx0c2Nyb2xsID0gKCRmb2N1c0l0ZW0ub3V0ZXJIZWlnaHQoKSAqIChzZWxmLmZvY3VzSW5kZXggKyAxKSkgLSBzZWxmLm1heEhlaWdodDtcblx0XHRcdFxuXHRcdFx0XHRzZWxmLiRkcm9wRG93bi5zY3JvbGxUb3Aoc2Nyb2xsKTtcblx0XHRcdH07XG5cdFx0fSxcblx0XHRcblx0XHRub3RJblZpZXdwb3J0OiBmdW5jdGlvbihzY3JvbGxUb3Ape1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxuXHRcdFx0XHRyYW5nZSA9IHtcblx0XHRcdFx0XHRtaW46IHNjcm9sbFRvcCxcblx0XHRcdFx0XHRtYXg6IHNjcm9sbFRvcCArICh3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodClcblx0XHRcdFx0fSxcblx0XHRcdFx0bWVudUJvdHRvbSA9IHNlbGYuJGRyb3BEb3duLm9mZnNldCgpLnRvcCArIHNlbGYubWF4SGVpZ2h0O1xuXHRcdFx0XHRcblx0XHRcdGlmKG1lbnVCb3R0b20gPj0gcmFuZ2UubWluICYmIG1lbnVCb3R0b20gPD0gcmFuZ2UubWF4KXtcblx0XHRcdFx0cmV0dXJuIDA7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gKG1lbnVCb3R0b20gLSByYW5nZS5tYXgpICsgNTtcblx0XHRcdH07XG5cdFx0fVxuXHR9O1xuXHRcblx0ZnVuY3Rpb24gaW5zdGFudGlhdGUoZG9tTm9kZSwgc2V0dGluZ3Mpe1xuXHRcdHZhciBpbnN0YW5jZSA9IG5ldyBFYXN5RHJvcERvd24oKTtcblx0XHRpbnN0YW5jZS5pbml0KGRvbU5vZGUsIHNldHRpbmdzKTtcblx0XHRpbnN0YW5jZS5pbnN0YW5jZXMucHVzaChpbnN0YW5jZSk7XG5cdH07XG5cdFxuXHQkLmZuLmVhc3lEcm9wRG93biA9IGZ1bmN0aW9uKHNldHRpbmdzKXtcblx0XHRyZXR1cm4gdGhpcy5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRpbnN0YW50aWF0ZSh0aGlzLCBzZXR0aW5ncyk7XG5cdFx0fSk7XG5cdH07XG5cdFxuXHQkKGZ1bmN0aW9uKCl7XG5cdFx0aWYgKHR5cGVvZiBPYmplY3QuZ2V0UHJvdG90eXBlT2YgIT09IFwiZnVuY3Rpb25cIil7XG5cdFx0XHRpZiAodHlwZW9mIFwidGVzdFwiLl9fcHJvdG9fXyA9PT0gXCJvYmplY3RcIil7XG5cdFx0XHRcdE9iamVjdC5nZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uKG9iamVjdCl7XG5cdFx0XHRcdFx0cmV0dXJuIG9iamVjdC5fX3Byb3RvX187XG5cdFx0XHRcdH07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRPYmplY3QuZ2V0UHJvdG90eXBlT2YgPSBmdW5jdGlvbihvYmplY3Qpe1xuXHRcdFx0XHRcdHJldHVybiBvYmplY3QuY29uc3RydWN0b3IucHJvdG90eXBlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fTtcblx0XHR9O1xuXHRcdFxuXHRcdCQoJy5kcm9wZG93bicpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdHZhciBqc29uID0gJCh0aGlzKS5hdHRyKCdkYXRhLXNldHRpbmdzJyk7XG5cdFx0XHRcdHNldHRpbmdzID0ganNvbiA/ICQucGFyc2VKU09OKGpzb24pIDoge307IFxuXHRcdFx0aW5zdGFudGlhdGUodGhpcywgc2V0dGluZ3MpO1xuXHRcdH0pO1xuXHR9KTtcbn0pKGpRdWVyeSk7Il19