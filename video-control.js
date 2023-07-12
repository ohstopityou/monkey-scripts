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

// Async function that waits for videobuttons to load, then maps them to new keys
const setupControls = async () => {
	const playButton = await waitForElement(site_selectors[currentSite].playButtonQuery)
	const fullscreenButton = await waitForElement(site_selectors[currentSite].fullscreenButtonQuery)

	videoControls[SPACE_KEY] = playButton
	videoControls[ENTER_KEY] = fullscreenButton

	replaceKeyActions()
}

// Check if current site is supported
if (SUPPORTED_SITES.includes(currentSite)) {
	setupControls().catch(error => console.error(`Failed to setup controls: ${error}`))
	console.log(`BetterVideoControl enabled on ${currentSite}`)
} else {
	console.debug(`'${currentSite} is not supported by BetterVideoControls'`)
}

// TODO: If going from youtube.com to /watch, script does not run.
// TODO: Add random emoji or face like O.o
