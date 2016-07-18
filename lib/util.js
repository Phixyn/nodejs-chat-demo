exports.timestamp = function () {
	// Return a pretty timestamp
	var now = new Date();
	var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

	// If hours, minutes or seconds are less than 10, add a zero in front
	for (var i = 0; i < 3; i++) {
		if (time[i] < 10) {
			time[i] = "0" + time[i];
		}
	}

	// Return the formatted string
	return '[' + time.join(":") + "]";
}

