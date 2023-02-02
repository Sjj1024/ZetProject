console.log('这是内容脚本执行的');

// 选中csdn的调研卡片隐藏:类似于去除广告
window.onload = function () {
  const npsBox = document.getElementsByClassName("csdn-side-toolbar")
  console.log('toolbar----', npsBox);
  if (npsBox && npsBox[0]) {
    npsBox[0].style.display = "none"
  }
}


chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('这是ContentScript脚本执行内容');
    console.log(sender.tab ?
      "from a content script:" + sender.tab.url :
      "from the extension");
    document.body.style.backgroundColor = 'orange';
    // 执行百度自动翻页到最后，并自动点击下一页的按钮
    console.log('开始执行自动滚动内容');
    const next = document.getElementsByClassName("n")
    let nextBtn = null
    for (const key in next) {
      if (Object.hasOwnProperty.call(next, key)) {
        const element = next[key];
        if (element.innerText === "下一页 >") {
          nextBtn = element
        }
      }
    }
    nextBtn.scrollIntoView(false)
    nextBtn.click()
    // sendBackgroun()
    if (request.greeting === "hello") {
      sendResponse({ farewell: "goodbye if " })
    } else {
      sendResponse({ farewell: "goodbye else " })
    }
  }
);


// 尝试和background.js通讯
async function sendBackgroun() {
  const response = await chrome.runtime.sendMessage('get-user-data');
  // do something with response here, not outside the function
  console.log("contentjs----", response);
}