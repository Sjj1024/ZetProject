console.log('这是board.js文件执行的内容', document);

// 初始化事件监听
initEvent()

// 系统初始化
initConfig()


function initConfig(){
  console.log('系统初始化');
  document.getElementById("useragent").innerHTML = navigator.userAgent
}

// 显示网站的cookie
function showCookie() {
  const homePaths = document.getElementsByClassName("home1024")
  const url = homePaths[0].href
  console.log('showCookieurl--', url);
  if (!url) {
    return
  }
  chrome.cookies.getAll({ url }, function (cookies) {
    console.log('得到的Cookie是：', cookies);
    tabCookies = cookies;
    const resList = cookies.map(item => {
      return `${item.name}=${item.value}`
    })
    const cookieStr = resList.join("; ")
    console.log("cookies-----", cookieStr);
    document.getElementById("cookies").innerHTML = cookieStr
  });
}


function initEvent() {
  // 切换userAgent
  const toggleUserAgent = document.getElementById("toggleUseragent")
  toggleUserAgent.onclick = async function () {
    // 先获取当前激活的tab页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    // 然后向这个tab页里面发送消息
    console.log('开始toggleUserAgent: ', tab);
    const userAgent = document.getElementById("userAgentVal").value
    const response = await chrome.runtime.sendMessage(`editUserAgent:${userAgent}`);
    // const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
    // do something with response here, not outside the function
    // 切换
    document.getElementById("useragent").innerHTML = userAgent
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
    document.getElementById("useragent").innerHTML = navigator.userAgent
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

  // 添加获取地址事件
  const getHome = document.getElementById("btn-1024")
  getHome.onclick = get1024Home

  // 同步数据按钮
  const asyncDataBtn = document.getElementById("asyncBtn")
  asyncDataBtn.onclick = function(){
    console.log('开始同步数据');
    const dataKey = document.getElementById("dataKey").value
    const dataVal = document.getElementById("asyncData").value
    dataVal && asyncSetData(dataKey, dataVal)
  }

  const asyncGetDataBtn = document.getElementById("asyncGetBtn")
  asyncGetDataBtn.onclick = function(){
    console.log('开始获取并展示数据');
    const dataKey = document.getElementById("dataKey").value
    asyncGetData(dataKey)
  }

  // 清空所有的同步数据
  const clearDataBtn = document.getElementById("clearAsyncBtn")
  clearDataBtn.onclick = function(){
    const dataKey = document.getElementById("dataKey").value
    clearData(dataKey)
  }

}

// 同步数据到账户中
function asyncSetData(key, value){
  chrome.storage.sync.set({ [key]: value }).then(() => {
    console.log("Value is set to " + value);
    document.getElementById("asyncDataBox").innerHTML = "同步成功！"
  });
}


function clearData(key){
  if (key) {
    chrome.storage.sync.remove(key).then(()=>{
      console.log('清空一个值');
      asyncGetData()
    })
  }else{
    chrome.storage.sync.clear().then(()=>{
      console.log('清空所有的值');
      document.getElementById("asyncDataBox").innerHTML = "数据全部清空了"
    })
  }
}

// 获取数据
async function asyncGetData(key){
  // 获取单个key的值
  // chrome.storage.sync.get([key]).then((result) => {
  //   console.log("Value currently is ", result);
  //   document.getElementById("asyncDataBox").innerHTML = result[key]
  // });
  // 获取到的所有数据
  const all = await chrome.storage.sync.get();
  let resultContent = "<br>"
  console.log('获取到的所有同步数据是:', all);
  for (const key in all) {
    if (Object.hasOwnProperty.call(all, key)) {
      const element = all[key];
      resultContent += `${key} : ${element} <br>`
    }
  }
  document.getElementById("asyncDataBox").innerHTML = resultContent
}

// 获取1024地址
function get1024Home() {
  var form = new FormData();
  form.append("a", "get18");
  form.append("system", "android");
  var settings = {
    "url": "https://get.xunfs.com/app/listapp.php",
    "method": "POST",
    "timeout": 0,
    "processData": false,
    "mimeType": "multipart/form-data",
    "contentType": false,
    "data": form
  };
  $.ajax(settings).done(function (response) {
    var homePath = JSON.parse(response)
    console.log("homePath----", homePath);
    var home1 = homePath.url1
    var home2 = homePath.url2
    var home3 = homePath.url3
    var homeBox = document.getElementById("home-box")
    homeBox.appendChild(getHomeA(home1))
    homeBox.appendChild(getHomeA(home2))
    homeBox.appendChild(getHomeA(home3))
    // 显示Cookie
    showCookie()
  });
}

function getHomeA(home) {
  var a2 = document.createElement("a")
  a2.href = `https://${home}/`
  a2.text = `https://${home}/`
  a2.target = "_blank"
  a2.className = "home1024"
  return a2
}

function setCookie(url, key, val) {
  const configCookie = { "url": url, "name": key, "value": val }
  chrome.cookies.set(configCookie);
}