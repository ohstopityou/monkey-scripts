// ==UserScript==
// @name         BetterVideoControls
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Improves video controls by setting 'space' -> play/pause and 'enter' to toggle fullscreen
// @author       Thomas Sovik
// @match        *://*.youtube.com/watch*
// @match        *://*.twitch.tv/*
// @match        *://*.linkedin.com/*
// @require      file:///Users/thomassovik/GitHub/monkey-scripts/video-control.js

// ==/UserScript==

let domain = window.location.hostname.split('.')[1]
if (domain) {
	console.log(`BetterVideoControl Enabled on ${domain}`)
}

// TODO: If going from youtube.com to /watch, script does not run.
// TODO: When visiting linkedin, script runs 3 times.
