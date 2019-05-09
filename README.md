# MMM-BrawlStars
A [MagicMirror²](https://github.com/MichMich/MagicMirror) module that shows player stats (level, trophies and victories) for Supercell's mobile game [Brawl Stars](https://supercell.com/en/games/brawlstars/). The victories shows are from all different game modes.

# Installation
1. Clone repo:
```
	cd MagicMirror/modules/
	git clone https://github.com/retroflex/MMM-BrawlStars
```
2. Install dependencies:
```
	cd MMM-BrawlStars/
	npm install
```
3. Add the module to the ../MagicMirror/config/config.js, example:
```
		{
			module: 'MMM-BrawlStars',
			header: 'Brawl Stars',
			position: 'bottom_right',
			config: {
				apiToken: 'YOUR-API-TOKEN',  // This should be a very long "random" string.
				userTags: [ '209CL28', 'J089RQ' ],
				sortBy: 'totalVictories'
			}
		},
```
# Configuration
| Option                        | Description
| ------------------------------| -----------
| `apiToken`                    | Your personal API token.<br />**Default value:** YOURAPITOKEN (does not work obviously)
| `showLevel`                   | Whether to show column with the user's level.<br />**Default value:** true
| `showTrophies`                | Whether to show column with the user's current number of trophies.<br />**Default value:** true
| `showTotalVictories`          | Whether to show column with the user's total number of victories.<br />**Default value:** true
| `sortBy`                      | Which column to sort by. Possible values: 'trophies', 'totalVictories' or 'level'.<br />**Default value:** trophies
| `fetchInterval`               | How often to fetch stats (milliseconds).<br />**Default value:** 10 * 60 * 1000 (every ten minutes)
| `userTags`                    | Array of Brawl Star user tags.<br />Can be found inside the game.<br />**Default value:** 209CL28 (Upperw)

# Customize Looks
The following class names can be used in 'MagicMirror/css/custom.css' to customize looks (see [MMM-BrawlStars.css](https://github.com/retroflex/MMM-BrawlStars/blob/master/MMM-BrawlStars.css) for example):

| CSS name                      | Description
| ------------------------------| -----------
| header-row                    | Header (whole row).
| stats-row                     | The players' stats (whole rows).
| username-header               | Username header.
| level-header                  | Level header.
| trophies-header               | Trophies header.
| victories-header              | Victories header.
| level                         | Level.
| trophies                      | Number of current trophies.
| victories                     | Total number of victories.
