

chrome.action.onClicked.addListener((tab) => {
    let bruh = chrome.storage.sync.get("last-video-url", function(items){
        //  items = [ { "phasersTo": "awesome" } ]
        console.log(items);
        let x = items['last-video-url']
        console.log(x);
        let myUrl = "https://www.patreon.com/theyard/posts"
        if(x!=null){
            myUrl = x;
        }
        chrome.tabs.create({
            // Just use the full URL if you need to open an external page
            url: myUrl
          });
    });
    
    // chrome.scripting.executeScript({
    //   target: {tabId: tab.id},
    //   files: ['content.js']
    // });
  });