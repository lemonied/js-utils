(function() {
	// 跑马灯
	$.fn.xfLamp = function(options) {
		var index = 2,
		div = $('<div></div>'),
		speed = options.speed || 0.5,
		height = this.height(),
		arr = options.data,
		item = $('<div style="height: ' + height + 'px"></div>');
		this.empty().append(div);
		for (var i = 0; i < arr.length; i++) {
			div.append(item.clone().append(arr[i]));
		}
		div.prepend(item.clone().append(arr[arr.length - 1])).css('transform', 'translate(0, ' + -height * 1 + 'px)');
		var timer = setInterval(function() {
			if (!div.parent().length) {
				clearInterval(timer);
				return;
			}
			div.css('transition', 'all ' + speed + 's ease');
			div.css('transform', 'translate(0, ' + -height * index + 'px)');
			if (index === arr.length) {
				div.off('transitionend').on('transitionend', function() {
					div.css({
						'transition': '',
						'transform': 'translate(0, 0)'
					}).off('transitionend');
				});
				index = 1;
			} else {
				index++;
			}
		}, options.delay || 3000);
		return this;
	}
}());