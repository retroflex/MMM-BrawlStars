/* Magic Mirror
 * Module: MMM-BrawlStars
 *
 * By Johan Persson, https://github.com/retroflex
 * MIT Licensed.
 */

Module.register('MMM-BrawlStars', {
	// Default configuration.
	defaults: {
		apiToken: 'YOURAPITOKEN',
		userTags: [ '209CL28' ],  // Upperw.
		showLevel: true,
		showTrophies: true,
		showTotalVictories: true,
		sortBy: 'trophies',  // 'trophies', 'totalVictories' or 'level'.
		fetchInterval: 10 * 60 * 1000  // In millisecs. Default every ten minutes.
	},

	getStyles: function() {
		return [ 'modules/MMM-BrawlStars/MMM-BrawlStars.css', 'font-awesome.css' ];
	},

	getTranslations: function () {
		return {
			en: 'translations/en.json',
			sv: 'translations/sv.json'
		}
	},

	// Notification from node_helper.js.
	// The stats is received here. Then module is redrawn.
	// @param notification - Notification type.
	// @param payload - Contains module instance identifier + an array of user stats.
	//                  Each item in the array contains username / level / trophies / totalVictories.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'STATS_RESULT') {
			if (null == payload)
				return;

			if (null == payload.identifier)
				return;

			if (payload.identifier !== this.identifier)  // To make sure the correct instance is updated, since they share node_helper.
				return;

			if (null == payload.stats)
				return;

			if (0 === payload.stats.length)
				return;

			this.stats = payload.stats;
			this.updateDom(0);
		}
	},

	// Override dom generator.
	getDom: function () {
		let wrapper = document.createElement('table');
		if (null == this.stats) {
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.className = 'loading dimmed xsmall';
			return wrapper;
		}

		wrapper.className = 'bright xsmall';

		let headerRow = document.createElement('tr');
		headerRow.className = 'normal header-row';
		this.createTableCell(headerRow, this.translate('USERNAME'), true, 'username-header', 'center');
		this.createTableCell(headerRow, this.translate('LEVEL'), this.config.showLevel, 'level-header', 'center');
		this.createTableCell(headerRow, this.translate('TROPHIES'), this.config.showTrophies, 'trophies-header', 'center');
		this.createTableCell(headerRow, this.translate('TOTAL_VICTORIES'), this.config.showTotalVictories, 'total-victories-header', 'center');
		wrapper.appendChild(headerRow);

		for (let i = 0; i < this.stats.length; ++i) {
			let row = document.createElement('tr');
			row.className = 'normal bright stats-row';

			const stat = this.stats[i];
			this.createTableCell(row, stat.username, true, 'username', 'left');
			this.createNumberTableCell(row, stat.level, this.config.showLevel, 'level');
			this.createNumberTableCell(row, stat.trophies, this.config.showTrophies, 'trophies');
			this.createNumberTableCell(row, stat.totalVictories, this.config.showTotalVictories, 'total-victories');

			wrapper.appendChild(row);
		}

		return wrapper;
	},

	// Override start to init stuff.
	start: function() {
		this.stats = null;

		// Tell node_helper to load stats at startup.
		this.sendSocketNotification('GET_STATS', { identifier: this.identifier,
		                                           apiToken: this.config.apiToken,
		                                           userTags: this.config.userTags,
												   sortBy: this.config.sortBy} );

		// Make sure stats are reloaded at user specified interval.
		let interval = Math.max(this.config.fetchInterval, 1000);  // In millisecs. < 1 min not allowed.
		let self = this;
		setInterval(function() {
			self.sendSocketNotification('GET_STATS', { identifier: self.identifier,
			                                           apiToken: self.config.apiToken,
			                                           userTags: self.config.userTags,
			                                           sortBy: self.config.sortBy });
		}, interval); // In millisecs.
	},

	// Creates a table row cell.
	// @param row - The table row to add cell to.
	// @param number - The number to show.
	// @param show - Whether to actually show.
	createNumberTableCell: function(row, number, show, className)
	{
		if (!show)
			return;

		const text = new Intl.NumberFormat().format(number);
		this.createTableCell(row, text, show, className);
	},

	// Creates a table row cell.
	// @param row - The table row to add cell to.
	// @param text - The text to show.
	// @param show - Whether to actually show.
	// @param align - Text align: 'left', 'center' or 'right'.
	createTableCell: function(row, text, show, className, align = 'right')
	{
		if (!show)
			return;

		let cell = document.createElement('td');
		cell.innerHTML = text;
		cell.className = className;

		cell.style.cssText = 'text-align: ' + align + ';';

		row.appendChild(cell);
	}
});
