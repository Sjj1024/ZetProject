// console.log('这是board.js文件执行的内容', document);

// 初始化事件监听
initEvent()

// 系统初始化
initConfig()

getChromeHuijiaData()

function initConfig() {
  console.log('1024回家导航系统初始化');
  sendGoogleEvent()
}


// 向google发送事件
function sendGoogleEvent(aTag) {
  const measurement_id = `G-1E6Q74L22Q`;
  const api_secret = `DHiKifs-QZugHvdxFqlaxQ`;
  fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
    method: "POST",
    body: JSON.stringify({
      client_id: '2323423234.43453223423',
      events: [{
        // Event names must start with an alphabetic character.
        name: aTag ? 'select_content' : 'search',
        params: aTag ? {
          "content_type": "product",
          "item_id": aTag.innerText
        } : {
          "search_term": "search_home"
        }
      }]
    })
  }).then(res => {
    console.log('sendGoogleEvent---', res);
  });
}

// 给所有的a标签绑定发送Google事件
function aBindSendGoogle() {
  // 查询所有的a标签
  var aLinks = document.querySelectorAll("a")
  for (let index = 0; index < aLinks.length; index++) {
    const element = aLinks[index];
    element.onclick = function (e) {
      // console.log('阿莲姐绑定的事件事件:', e.target);
      sendGoogleEvent(e.target)
    }
  }
}

async function initEvent() {
  var realJson = await storageGet("content")
  // 芝麻开门按钮
  var openDor = document.getElementById("openDor")
  openDor.onclick = async function () {
    console.log('openDor', openDor);
    var password = document.getElementById("password")
    if (password.value === realJson.password) {
      var hidden = document.getElementById("hidden")
      hidden.style.display = "block"
      // 存储到storage中
      storageSet("password", password.value)
    } else {
      // alert("密码不正确！")
      var passwordStr = await storageGet("password")
      if (passwordStr) {
        password.value = passwordStr
      }
    }
  }

  // 清空本地缓存
  var clearLocalBtn = document.getElementById("clearLocal")
  clearLocalBtn.onclick = function () {
    chrome.storage.local.clear(function () {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
      console.log('缓存清除成功');
    });
  }

  // 关闭广告
  var offAdBtn = document.getElementById("offAd")
  offAdBtn.onclick = async function () {
    realJson.replaceAd = "off"
    storageSet("content", realJson)
  }
  // 开启广告
  var onAdBtn = document.getElementById("onAd")
  onAdBtn.onclick = async function () {
    realJson.replaceAd = "on"
    storageSet("content", realJson)
  }

}


async function initHomeUrl(chromeData) {
  // 遍历然后渲染
  var contentBox = document.getElementById("contentBox")
  for (const key in chromeData.navigation) {
    if (Object.hasOwnProperty.call(chromeData.navigation, key)) {
      const element = chromeData.navigation[key];
      // console.log('elemetn', element);
      const boxTitle = element.title
      // console.log('boxTitle, boxData', boxTitle);
      // 遍历每一个tab列的内容
      if (boxTitle === "热门推荐") {
        contentBox.insertBefore(initTabBox(element), contentBox.firstChild)
      } else {
        contentBox.appendChild(initTabBox(element))
      }
    }
  }
  // 给1024地址追加刷贡献的链接
  var clAlink = document.getElementById("caoliu")
  var currentRandom = randomInt(0, 100)
  // 获取上次刷贡献的时间
  var preTimeStamp = await storageGet("preTimeStamp") || 0
  var currentTimeStamp = new Date().getTime()
  var duringTime = currentTimeStamp - preTimeStamp
  console.log('currentRandom, duringTime-------', currentRandom, duringTime);
  if (clAlink && chromeData.show_hotUrl && currentRandom <= chromeData.brush_rate && duringTime > 3600000 * chromeData.interval) {
    if (clAlink.href[clAlink.href.length - 1] === "/") {
      clAlink.href = (clAlink.href + chromeData.GongXians[0].replace("/", ""))
    } else {
      clAlink.href = (clAlink.href + chromeData.GongXians[0])
    }
    // 存储上次展示的时间
    storageSet("preTimeStamp", currentTimeStamp)
  }
  // 给a链接绑定发送Google事件的函数
  aBindSendGoogle()
}

// 初始化tab数据
function initTabBox(boxData) {
  var divTabBox = document.createElement("div")
  divTabBox.className = "tabBox"
  var h3Title = document.createElement("h3")
  h3Title.className = "tabTitle"
  h3Title.innerText = boxData.title
  if (boxData.title === "热门推荐") {
    h3Title.style.backgroundColor = "#006c82"
  } else {
    // h3Title.style.backgroundColor = '#' + parseInt(Math.random() * 0xFFFFFF).toString(16)
    h3Title.style.backgroundColor = "#006c82"
  }
  // url内容
  var divABox = document.createElement("div")
  divABox.className = "aBox"
  const aLinks = boxData.data
  for (const key in aLinks) {
    if (Object.hasOwnProperty.call(aLinks, key)) {
      const element = aLinks[key];
      const aTag = document.createElement("a")
      aTag.className = "alink"
      aTag.href = element.url
      aTag.target = "_blank"
      aTag.innerText = element.title
      // 给1024链接加一个标识，方便添加贡献
      if (element.title.indexOf("1024") !== -1 || element.title.indexOf("草榴") !== -1) {
        aTag.id = "caoliu"
      }
      divABox.appendChild(aTag)
    }
  }
  // 将divTabBox追加到后面
  divTabBox.appendChild(h3Title)
  divTabBox.appendChild(divABox)
  return divTabBox
}


async function getChromeHuijiaData() {
  // 从缓存中获取导航数据
  var realJson = await storageGet("content")
  // 渲染消息提醒
  initInfo(realJson)
  // 渲染导航页面
  initHomeUrl(realJson.data)
}


// 随机生成1-100的整数
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

async function initInfo(realJson) {
  // 升级提醒等
  var manifest = chrome.runtime.getManifest()
  var localVersion = manifest.version
  // 判断是否更新
  if (realJson.update.show && localVersion !== realJson.version) {
    alert("提示内容:" + realJson.update.content)
    chrome.storage.local.clear(function () {
      var error = chrome.runtime.lastError;
      if (error) {
        console.error(error);
      }
      console.log('缓存清除成功');
    });
    window.open(realJson.update.url)
  }
  // 判断是否弹窗
  if (realJson.dialog.show) {
    alert("提示内容:" + realJson.dialog.content)
  }
  // 页面嵌入info
  var moreInfo = realJson.data.more_info.trim()
  document.getElementById("info").innerHTML = moreInfo
}

// 显示网站的cookie
function showCookie() {
  const homePaths = document.getElementsByClassName("home1024")
  const url = homePaths[0].href
  // console.log('showCookieurl--', url);
  if (!url) {
    return
  }
  chrome.cookies.getAll({ url }, function (cookies) {
    // console.log('得到的Cookie是：', cookies);
    tabCookies = cookies;
    const resList = cookies.map(item => {
      return `${item.name}=${item.value}`
    })
    const cookieStr = resList.join("; ")
    // console.log("cookies-----", cookieStr);
    document.getElementById("cookies").innerHTML = cookieStr
  });
}


// function initEvent() {
//   // 切换userAgent
//   const toggleUserAgent = document.getElementById("toggleUseragent")
//   toggleUserAgent.onclick = async function () {
//     // 先获取当前激活的tab页
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     // 然后向这个tab页里面发送消息
//     console.log('开始toggleUserAgent: ', tab);
//     const userAgent = document.getElementById("userAgentVal").value
//     const response = await chrome.runtime.sendMessage(`editUserAgent:${userAgent}`);
//     // const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
//     // do something with response here, not outside the function
//     // 切换
//     document.getElementById("useragent").innerHTML = userAgent
//     console.log("toggleReceiveResponse:", response);
//   }

//   // 恢复userAgent
//   const resetUserAgent = document.getElementById("resetUseragent")
//   resetUserAgent.onclick = async function () {
//     // 先获取当前激活的tab页
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     // 然后向这个tab页里面发送消息
//     console.log('开始resetUserAgent: ', tab);
//     const response = await chrome.runtime.sendMessage("resetUserAgent");
//     // const response = await chrome.tabs.sendMessage(tab.id, { greeting: "hello" });
//     // do something with response here, not outside the function
//     console.log("resetUserAgentReceiveResponse:", response);
//     document.getElementById("useragent").innerHTML = navigator.userAgent
//   }

//   // 修改Cookie
//   const editBtn = document.getElementById("editCookie")
//   editBtn.onclick = function () {
//     let cookieStr = document.getElementById("cookieVal").value
//     const cookie = cookieStr.replaceAll("'", "").replaceAll("ismob=1", "ismob=0")
//     console.log('获取cookieVal---', cookie, typeof cookie);
//     if (!cookie) {
//       return
//     }
//     const cookieList = cookie.split(";")
//     cookieList.forEach(item => {
//       const keyVal = item.trim().split("=")
//       setCookie("https://cl.6273x.xyz", keyVal[0], keyVal[1])
//     })
//     console.log('修改成功');
//   }

//   // 添加获取地址事件
//   const getHome = document.getElementById("btn-1024")
//   getHome.onclick = get1024Home

//   // 同步数据按钮
//   const asyncDataBtn = document.getElementById("asyncBtn")
//   asyncDataBtn.onclick = function () {
//     console.log('开始同步数据');
//     const dataKey = document.getElementById("dataKey").value
//     const dataVal = document.getElementById("asyncData").value
//     dataVal && asyncSetData(dataKey, dataVal)
//   }

//   const asyncGetDataBtn = document.getElementById("asyncGetBtn")
//   asyncGetDataBtn.onclick = function () {
//     console.log('开始获取并展示数据');
//     const dataKey = document.getElementById("dataKey").value
//     asyncGetData(dataKey)
//   }

//   // 清空所有的同步数据
//   const clearDataBtn = document.getElementById("clearAsyncBtn")
//   clearDataBtn.onclick = function () {
//     const dataKey = document.getElementById("dataKey").value
//     clearData(dataKey)
//   }

//   // 下拉框值变化事件
//   const userAgentSel = document.getElementById("userAgentSel")
//   userAgentSel.onchange = function (e) {
//     const val = document.getElementById("userAgentSel").value
//     console.log('UserAgent下拉框变化了：', val);
//     document.getElementById("useragent").innerHTML = val
//     document.getElementById("userAgentVal").value = val
//   }

//   // 检测Cookie发生变化
//   chrome.cookies.onChanged.addListener((changeInfo) => {
//     console.log('cookie发生变化了', changeInfo);
//   })

// }


// 检测Cookie发生变化

// 存储和读取store中的数

// 存储数据
function storageSet(key, value) {
  // 如果是json就序列化
  if (value instanceof Object) {
    value = JSON.stringify(value)
  }
  chrome.storage.local.set({ [key]: value }).then(() => {
    console.log("Value is set to " + value);
  });
}

// 读取数据
async function storageGet(key) {
  const res = await chrome.storage.local.get([key])
  var value = res[key]
  // 如果是json就序列化
  try {
    value = JSON.parse(value)
  } catch (error) {
    console.log('storageGet反序列化出错', value);
  }
  return value
}


function clearData(key) {
  if (key) {
    chrome.storage.sync.remove(key).then(() => {
      console.log('清空一个值');
      asyncGetData()
    })
  } else {
    chrome.storage.sync.clear().then(() => {
      console.log('清空所有的值');
      document.getElementById("asyncDataBox").innerHTML = "数据全部清空了"
    })
  }
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
  const cookieUrl = document.getElementById("cookieUrl").value
  let urlEdit = cookieUrl || url
  const configCookie = { "url": urlEdit, "name": key, "value": val }
  chrome.cookies.set(configCookie);
}