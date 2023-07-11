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

// Checks if hostname is supported
// TODO: Use regex to check pagepath
const DEBUG_ENABLED = true;
const POLLING_INTERVAL_MS = 100;
const SUPPORTED_SITES = ['youtube', 'linkedin', 'twitch'];
let currentSite = 'unsupported'

// Work in progress
let togglePlay = null // Button
let toggleFullscreen = null //Button
const videoControls = {
    ' ':        togglePlay,
    'Enter':    toggleFullscreen
}

// Check if current site is supported
for (let part of location.hostname.split('.')) {
    if (SUPPORTED_SITES.some(site => part === site)) {
      currentSite = part;
    }
  }

if (currentSite) {
	console.log(`BetterVideoControl Enabled on ${currentSite}`)

    // Wait for an element to load before returning it
    const waitForElement = (elementQuery) => new Promise(resolve => {
        const interval = setInterval(() => {
            const element = elementQuery()
            if(element) {
                clearInterval(interval)
                debug(element)
                resolve(element);
            }
        }, POLLING_INTERVAL_MS)
    })

    // Replace key action when pressing videoControl keyboard buttons
    const replaceKeyAction = (key, eventType, newAction) => {
        window.addEventListener(eventType, e => {
            // Only stop default for specific keys
            if (key == e.key) {
                e.stopPropagation()
                e.preventDefault()
                if (newAction) { newAction() }
            } 
        }, true)
        console.debug(`${newAction ? 'Replaced' : 'Removed'} ${eventType} action from '${key}'`)
    }

    // Remove keyAction on keydown for videoControls
    for (const key of Object.keys(videoControls)) {
        replaceKeyAction(key, 'keydown')
    }

    switch(currentSite) {
        case 'linkedin':
            const VIDEO_PLAYER_SELECTOR = '.vjs-play-control'
            const VIDEO_FULLSCREEN_SELECTOR = '.vjs-fullscreen-control'
            
            const playButtonQuery = () => document.querySelector(VIDEO_PLAYER_SELECTOR)
            const fullscreenButtonQuery = () => document.querySelector(VIDEO_FULLSCREEN_SELECTOR)
            
            waitForElement(playButtonQuery).then((playButton) => {
                replaceKeyAction(' ', 'keyup', () => {
                    playButton.click()
                    console.log('*Toggled play*')
                })
            
            }).catch(error => {console.error(`Error finding play O.o : ${error}`)})

            waitForElement(fullscreenButtonQuery).then((fullscreenButton) => {
                replaceKeyAction('Enter', 'keyup', () => {
                    fullscreenButton.click()
                    console.log('*Toggled fullscreen*')
                })
            
            }).catch(error => {console.error(`Error finding fullscreen O.o : ${error}`)})
            break

        case 'youtube':
            console.log('Not Implemented...')
            break

        case 'twitch':            
            console.log('Not Implemented...')
            break

        default:
            console.error(`${location.hostname} not supported`)
    }
}

//Helper functions

function debug(message) {
    if (DEBUG_ENABLED) {
      console.debug(message);
    }
  }

/* Old Code
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
                console.log('Observing... o.o')
            }
/*

// TODO: If going from youtube.com to /watch, script does not run.
// TODO: Add random emoji or face like O.o
// TODO: When visiting linkedin, script runs 3 times.