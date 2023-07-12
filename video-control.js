// ==UserScript==
// @name         BetterVideoControls
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improves video controls by setting 'space' -> play/pause and 'enter' to toggle fullscreen
// @author       Thomas Sovik
// @match        http*://*/*
// @match        http*://*.linkedin.com/learning/*
// @match        http*://youtube.com/watch*
// @match        http*://twitch.tv/*

// @require      file:///C:/github/monkey-scripts/video-control.js
// @require      file:///Users/thomassovik/GitHub/monkey-scripts/video-control.js

// ==/UserScript==

const POLLING_INTERVAL_MS = 100
const SPACE_KEY = ' '
const ENTER_KEY = 'Enter'

// Checks if hostname is supported
const SUPPORTED_SITES = ['youtube', 'linkedin', 'twitch']
let currentSite = window.location.hostname.match(/(?:www\.)?(.*?)\./)[1]

// Replaced with buttons once loaded
let videoControls = {
	[SPACE_KEY]: null,
	[ENTER_KEY]: null
}

const site_selectors = {
	linkedin: {
		playButtonQuery: () => document.querySelector('.vjs-play-control'),
		fullscreenButtonQuery: () => document.querySelector('.vjs-fullscreen-control')
	},
	youtube: {
		playButtonQuery: null,
		theaterButtonQuery: null,
		fullscreenButtonQuery: null
	},
	twitch: {
		playButtonQuery: null,
		theaterButtonQuery: null,
		fullscreenButtonQuery: null
	}
}

// Check if current site is supported
if (SUPPORTED_SITES.includes(currentSite)) {
	console.log(`BetterVideoControl Enabled on ${currentSite}`)

	// TODO: Add timeout
	// Wait for an element to load before returning it
	const waitForElement = elementQuery =>
		new Promise(resolve => {
			const interval = setInterval(() => {
				const element = elementQuery()
				if (element) {
					clearInterval(interval)
					resolve(element)
				}
			}, POLLING_INTERVAL_MS)
		})

	// Replace key action when pressing videoControl keyboard buttons
	// Should react to changes in videoControl dynamically
	const replaceKeyActions = () =>
		['keydown', 'keyup'].forEach(eventType =>
			window.addEventListener(
				eventType,
				e => {
					if (videoControls[e.key]) {
						e.stopPropagation()
						e.preventDefault()
						// Click videoControl button corresponding to key on keyup
						if (eventType === 'keyup') {
							videoControls[e.key].click()
							console.debug(`'${e.key}' pressed, ${videoControls[e.key]} clicked.`)
						}
					}
				},
				true
			)
		)

	const playButtonPromise = waitForElement(site_selectors[currentSite].playButtonQuery)
	const fullScreenButtonPromise = waitForElement(site_selectors[currentSite].fullscreenButtonQuery)

	// Wait for buttons to load, then add event listener
	Promise.all([playButtonPromise, fullScreenButtonPromise])
		.then(([playButton, fullscreenButton]) => {
			// Update videoControls
			videoControls[SPACE_KEY] = playButton
			videoControls[ENTER_KEY] = fullscreenButton
			console.log('videoControl buttons updated')
			console.log(videoControls)
			// Replaces key actions with corresponding button click
			replaceKeyActions()
		})
		.catch(error => console.error(`Error finding play or fullscreen button: ${error}`))
} else {
	console.debug(`'${currentSite} is not supported by BetterVideoControls'`)
}

// TODO: If going from youtube.com to /watch, script does not run.
// TODO: Add random emoji or face like O.o
