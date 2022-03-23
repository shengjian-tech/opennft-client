chrome.runtime.onMessage.addListener((res) => {
  console.log(res);
  let data = JSON.parse(res);
  if (data.message == "OpenNFT") {
    //打开其他页面配置
    chrome.windows.create({
      url: "../index.html#/Details?index=转移资产",
      type: "popup",
      width: 460,
      height: 700,
    });
  }
});
