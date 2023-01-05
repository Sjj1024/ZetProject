(function(){
  console.log('这是background脚本执行内容');
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    }
  );
})()