console.log('这是board.js文件执行的内容', document);

// 初始化事件监听
initEvent()


function initEvent() {
  // 切换userAgent
  const toggleUserAgent = document.getElementById("toggleUseragent")
  toggleUserAgent.onclick = async function () {
    // 先获取当前激活的tab页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // 然后向这个tab页里面发送消息
    console.log('开始toggleUserAgent: ', tab);
    const response = await chrome.runtime.sendMessage("editUserAgent");
    // const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
    // do something with response here, not outside the function
    console.log("toggleReceiveResponse:", response);
  }

  // 恢复userAgent
  const resetUserAgent = document.getElementById("resetUseragent")
  resetUserAgent.onclick = async function () {
    // 先获取当前激活的tab页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // 然后向这个tab页里面发送消息
    console.log('开始resetUserAgent: ', tab);
    const response = await chrome.runtime.sendMessage("resetUserAgent");
    // const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
    // do something with response here, not outside the function
    console.log("resetUserAgentReceiveResponse:", response);
  }
}