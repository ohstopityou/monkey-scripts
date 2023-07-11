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

// Check if current site is supported
for (let part of location.hostname.split('.')) {
    if (SUPPORTED_SITES.some(site => part === site)) {
      currentSite = part;
    }
  }

if (currentSite) {
	console.log(`BetterVideoControl Enabled on ${currentSite}`)

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

    switch(currentSite) {
        case 'linkedin':
            const VIDEO_PLAYER_SELECTOR = '.vjs-play-control'
            const VIDEO_FULLSCREEN_SELECTOR = '.vjs-fullscreen-control'
            
            const videoPlayerQuery = () => document.querySelector(VIDEO_PLAYER_SELECTOR)
            const videoSizeQuery = () => document.querySelector(VIDEO_FULLSCREEN_SELECTOR)
            
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
            
            waitForElement(videoPlayerQuery).then((videoPlayer) => {
                // Starts to observe
                observeVideoStatus(videoPlayer)
            
                const videoSize = videoSizeQuery()
            
                // Replace keyDefaults with nothing
                replaceKeyDefaults('keydown')
                //
                replaceKeyDefaults('keyup', (e) => {
                    if (e.key === ' ') { videoPlayer.click(); console.log('*click*') }
                    if (e.key === 'Enter') { videoSize.click(); console.log('*click*') }
                })
            
            }).catch(error => {console.error(`Error getting video player O.o : ${error}`)})
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

// TODO: If going from youtube.com to /watch, script does not run.
// TODO: Add random emoji or face like O.o
// TODO: When visiting linkedin, script runs 3 times.
// @require      file:///Users/thomassovik/GitHub/monkey-scripts/video-control.js