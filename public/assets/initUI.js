(async() => {
    const src = chrome.runtime.getURL(('/react/index.js'))
    await import(src) 
})()