//监听window消息，并发送给插件bg.js
// window.postMessage("open_nft_is");
window.addEventListener(
  "message",
  function (event) {
    console.log(event.data);
    if (event.data) {
      chrome.runtime.sendMessage(event.data);
    }
  },
  false
);
