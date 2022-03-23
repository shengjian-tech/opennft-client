var s = document.createElement("SCRIPT");
s.src = chrome.runtime.getURL("../js/oth.js");
document.querySelector("html").appendChild(s);

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
