/* Magic Mirror
 * Module: MMM-BrawlStars
 *
 * By Johan Persson, https://github.com/retroflex
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const rp = require('request-promise');

const baseURL = 'https://api.brawlstars.com/v1/players/%23';

module.exports = NodeHelper.create({
	start: function() {
		//console.log('Starting node_helper for: ' + this.name);
	},

	// Extracts JSON into the relevant stats.
	// @param json - The full JSON for the user.
	// @return Object with stats we want to show.
	extractStats: function(json) {
		let totalVictories = 0;

		if (json.trophies != null)              totalVictories += json.trophies;
		if (json.trophies != null)  totalVictories += json.trophies;
		if (json.trophies != null)   totalVictories += json.trophies;

		const stats = { username: json.name,
		                level: json.expLevel,
		                trophies: json.trophies,
		                totalVictories: totalVictories };
		return stats;
	},

	// Gets Brawl Stars user stats from API and adds them to an array.
	// The array is then sent to the client (to MMM-BrawlStars.js).
	// @param payload - identifier (string), apiToken (string), userTags (array of strings), sortBy (string).
	getStats: function(payload) {
		let identifier = payload.identifier;
		let userTags = payload.userTags;

		let promises = [];
		for (let i = 0; i < userTags.length; ++i) {
			const userURL = baseURL + userTags[i];
			const options = {uri: userURL,
			                 headers: { Authorization: "Bearer " + payload.apiToken }};
			promises.push(rp(options));
		}

		Promise.all(promises).then((contents) => {
			let stats = [];

			for (let i = 0; i < contents.length; ++i) {
				const content = contents[i];
				const json = JSON.parse(content);
				
				const stat = this.extractStats(json);
				stats.push(stat);
			}

			// Always sort by trophies first. Good if e.g. levels are equal.
			stats.sort((a, b) => Number(b.trophies) - Number(a.trophies));

			if ('totalVictories' === payload.sortBy)
				stats.sort((a, b) => Number(b.totalVictories) - Number(a.totalVictories));
			else if ('level' === payload.sortBy)
				stats.sort((a, b) => Number(b.level) - Number(a.level));

			this.sendSocketNotification('STATS_RESULT', {identifier: identifier, stats: stats} );
		}).catch(err => {
			console.error(this.name + ' error when fetching data: ' + err);
		});
	},

	// Listens to notifications from client (from MMM-BrawlStars.js).
	// Client sends a notification when it wants download new stats.
	// @param payload - identifier (string), apiToken (string), userTags (array of strings), sortBy (string).
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'GET_STATS') {
			this.getStats(payload);
		}
	}

});
