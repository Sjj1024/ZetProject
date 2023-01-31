console.log('这是内容脚本执行的');

// 选中csdn的调研卡片隐藏
window.onload = function () {
  const npsBox = document.getElementById("nps-box");
  if (npsBox) {
    npsBox.style.display = "none"
    console.log('npsBox----', npsBox);
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
    if (request.greeting === "hello")
      sendResponse({ farewell: "goodbye" });
  }
);