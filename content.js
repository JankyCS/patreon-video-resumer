
console.log("BRUH!!!");
// blob:https://www.patreon.com/3f418f3a-328f-40c0-8cec-501b9aecfcbb
// blob:https://www.patreon.com/ac634c6c-1adf-48c4-a7ff-9751e2ab27d4
const added = new Set([]);
function myLoop() {         //  create a loop function
  setTimeout(function() {   //  call a 3s setTimeout when the loop is called
    document.querySelectorAll('div[data-tag="post-card"]').forEach(postcard => {

        let video = postcard.querySelector('video');
        
        let titleElement = postcard.querySelector('span[data-tag="post-title"]')
        let title = titleElement.textContent;
        
        let aTag = titleElement.querySelector('a') 
        let url = "";
        if(aTag == null){
            // let t = await getCurrentTab();
            url = location.href;
            // url = t.url;
        } else {
            url = aTag.href;
        }
        // console.log(title.textContent);
        
        if(!added.has(title) && video != null){
            added.add(title);
            const isVideoPlaying = video => !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);

            var onPlay = () => {
                // When a video starts playing, check if there is a saved playback position for this video
                console.log("PLAY!!");
                // const videoUrl = event.target.currentSrc;
                console.log(String("video:"+title));
                chrome.storage.sync.get(String("video:"+title), function(items){
                    console.log(items);
                    //  A data saved callback omg so fancy
                    let savedPosition = items[String("video:"+title)]

                    if (savedPosition != null) {
                        // If there is a saved position, ask the user if they want to resume playback

                        console.log(savedPosition);
                        var timeDisplay = secondsToHms(savedPosition);
                        if (confirm('Resume playback from at '+timeDisplay+'?')) {
                            // If the user clicks "OK", set the video's current time to the saved position
                            video.currentTime = savedPosition;
                        } else {
                            // If the user clicks "Cancel", delete the saved position from localStorage
                            chrome.storage.sync.remove(String("video:"+title));
                        }
                    }
                });
            }
            // console.log(isVideoPlaying);
            if(isVideoPlaying(video)){
                onPlay();
            } else {
                video.addEventListener('play', function namedListener(event) {
                    onPlay();
                    video.removeEventListener('play', namedListener);
                });
            }

            video.addEventListener('play', function bruh(event) {
                chrome.storage.sync.set({ "last-video-url": url });
            });

            video.addEventListener('pause', event => {
                console.log("PAUSE!!!");
        
                // When a video pauses, save its current playback position to localStorage
                // const videoUrl = event.target.currentSrc;
                const currentPosition = Math.max(Number(event.target.currentTime) - 60, 0);

                console.log(currentPosition);
                if(currentPosition>0){
                    let key = String("video:"+title);
                    let dic = {};
                    dic[key] = currentPosition;

                    chrome.storage.sync.set(dic, function(){
                        console.log(key);
                        console.log(currentPosition);
                    });
                    // localStorage.setItem(String("video:"+title), currentPosition);
                }
            });
            
            video.addEventListener('ended', event => {
                // localStorage.removeItem(String("video:"+title));
                chrome.storage.sync.remove(String("video:"+title));
                // Commented out cause it is useful to know last video even if you finished (easier to go to next)
                // chrome.storage.local.remove("last-video-url", function(){
                    //  A data saved callback omg so fancy
                // });
            });
        }
    });
    myLoop();
      
  }, 3000)
}
myLoop();


// document.querySelectorAll('video').forEach(video => {
//     video.addEventListener('play', event => {
//         console.log('vibeo');
//     });
//   });
// Listen for the "play" event on all video elements
// document.querySelectorAll('video').forEach(video => {
//     video.addEventListener('play', event => {
//       // When a video starts playing, check if there is a saved playback position for this video

//       console.log("PLAY!!!");
//       const videoUrl = event.target.currentSrc;
//       const savedPosition = localStorage.getItem(`video:${videoUrl}`);
//       if (savedPosition) {
//         // If there is a saved position, ask the user if they want to resume playback
//         if (confirm('Resume playback from where you left off?')) {
//           // If the user clicks "OK", set the video's current time to the saved position
//           event.target.currentTime = savedPosition;
//         } else {
//           // If the user clicks "Cancel", delete the saved position from localStorage
//           localStorage.removeItem(`video:${videoUrl}`);
//         }
//       }
//     });
//   });
  
//   // Listen for the "pause" event on all video elements
//   document.querySelectorAll('video').forEach(video => {
//     video.addEventListener('pause', event => {
//       console.log("PAUSE!!!");

//       // When a video pauses, save its current playback position to localStorage
//       const videoUrl = event.target.currentSrc;
//       const currentPosition = event.target.currentTime;
//       localStorage.setItem(`video:${videoUrl}`, currentPosition);
//     });
//   });
  

  function secondsToHms(d) {
    console.log(d);
    if(d<3600){
        return new Date(d*1000).toISOString().substring(14, 19);
    }
    return new Date(d*1000).toISOString().substring(11, 19);
    // d = Number(d);
    // var h = Math.floor(d / 3600);
    // var m = Math.floor(d % 3600 / 60);
    // var s = Math.floor(d % 3600 % 60);

    // var display = "";
    // if(h>0){
    //     display+=h+":";
    // }
    // if(m>0 || display!=""){
    //     display+=m
    // }

    // var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    // var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    // return hDisplay + mDisplay + sDisplay; 
}

// chrome.browserAction.onClicked.addListener(function(tab) {
//     console.log("CLICKED???");
//     const myUrl = "https://www.patreon.com/theyard/posts"
//     let bruh = chrome.storage.local.get("last-video-url", function(items){
//         //  items = [ { "phasersTo": "awesome" } ]
//         let x = items.last-video-url;
//         if(x!=null){
//             myUrl = x;
//         }
//     });
//     chrome.windows.create({
//       // Just use the full URL if you need to open an external page
//       url: chrome.runtime.getURL(myUrl)
//     });
//   });

function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = chrome.tabs.query(queryOptions);
    return tab;
  }