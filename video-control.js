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

let domain = window.location.hostname.split('.')[1]
if (domain) {
	console.log(`BetterVideoControl Enabled on ${domain}`)
}

const VIDEO_PLAYER_SELECTOR = '.vjs-play-control'
const VIDEO_FULLSCREEN_SELECTOR = '.vjs-fullscreen-control'
const POLLING_INTERVAL_MS = 100;
const queryVideoPlayer = () => document.querySelector(VIDEO_PLAYER_SELECTOR)
const queryVideoSize = () => document.querySelector(VIDEO_FULLSCREEN_SELECTOR)

const getVideoPlayer = () => new Promise(resolve => {
    const interval = setInterval(() => {
        const videoPlayer = queryVideoPlayer()
        if(videoPlayer) {
            clearInterval(interval)
            console.log('VideoPlayer found')
            resolve(videoPlayer);
        }
    }, POLLING_INTERVAL_MS)
})

// Observer that logs changes in videoPlayer status.
const observeVideoStatus = (videoPlayer) => {
    let lastStatus = null;
    const observer = new MutationObserver(() => {
        const status = videoPlayer.classList.contains('vjs-playing') ? 'playing' : 'paused';
        if (status !== lastStatus) {
            console.log(`Video changed to ${status}`)
            lastStatus = status;
        }
    })

    observer.observe(videoPlayer, { attributes: true, attributeFilter: ['class'] });
    console.log('observing...')
}

// Changes action for pressing Space and Enter to nothing
const replaceKeyDefaults = (eType, action) => {
    window.addEventListener(eType, e => {
        if ([' ', 'Enter'].includes(e.key)) {
            e.stopPropagation()
            e.preventDefault()
        }

        if (action) {action(e)}
    }, true)
}

getVideoPlayer().then((videoPlayer) => {
    // Starts to observe
    observeVideoStatus(videoPlayer)

    const videoSize = queryVideoSize()

    // Replace keyDefaults with nothing
    replaceKeyDefaults('keydown')
    //
    replaceKeyDefaults('keyup', (e) => {
        if (e.key === ' ') { videoPlayer.click(); console.log('*click*') }
        if (e.key === 'Enter') { videoSize.click(); console.log('*click*') }
    })

}).catch(error => {console.error('Error getting video player: ', error)})

// TODO: If going from youtube.com to /watch, script does not run.
// TODO: When visiting linkedin, script runs 3 times.
// @require      file:///Users/thomassovik/GitHub/monkey-scripts/video-control.js