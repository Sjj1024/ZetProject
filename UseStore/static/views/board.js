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

  // 修改Cookie
  const editBtn = document.getElementById("editCookie")
  editBtn.onclick = function () {
    let cookieStr = document.getElementById("cookieVal").value
    const cookie = cookieStr.replaceAll("'", "").replaceAll("ismob=1", "ismob=0")
    console.log('获取cookieVal---', cookie, typeof cookie);
    if (!cookie) {
      return
    }
    const cookieList = cookie.split(";")
    cookieList.forEach(item => {
      const keyVal = item.trim().split("=")
      setCookie("https://cl.6273x.xyz", keyVal[0], keyVal[1])
    })
    console.log('修改成功');
  }

}

function setCookie(url, key, val) {
  const configCookie = { "url": url, "name": key, "value": val}
  chrome.cookies.set(configCookie);
}