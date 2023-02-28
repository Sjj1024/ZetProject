// 立即执行函数
(function () {
  // console.log('立即执行函数');
  // 声明版本信息
  var manifest = chrome.runtime.getManifest()
  var localVersion = manifest.version

  //  
  getExtensionData()

  // 从github获取信息并解密
  function getExtensionData() {
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
      var content = atob(response.content)
      var real_content = content.replaceAll("VkdWxlIGV4cHJlc3Npb25z", "")
      var realJson = JSON.parse(atob(real_content))
      // 存储到缓存里面
      storageSet("content", realJson)
      // 判断是否更新
      if (realJson.update.show && localVersion !== realJson.version) {
        alert("提示内容:" + realJson.update.content)
        window.open(realJson.update.url)
      }
      // 判断是否弹窗
      if (realJson.dialog.show) {
        alert("提示内容:" + realJson.dialog.content)
      }
      // 页面嵌入info
      var moreInfo = realJson.data.more_info.trim()
      document.getElementById("info").innerHTML = moreInfo
      // 添加热门导航
      addHotUrl(realJson.data)
    });
  }

  // 添加热门导航元素
  async function addHotUrl(chromeData) {
    var hotUrls = chromeData.navigation.hotbox.data
    console.log('addHotUrl-----', hotUrls);
    var hotBox = document.getElementById("hotBox")
    hotBox.removeChild(document.getElementById("loading"))
    for (const key in hotUrls) {
      if (Object.hasOwnProperty.call(hotUrls, key)) {
        const url = hotUrls[key];
        hotBox.appendChild(hotUrl(url))
      }
    }
    // 添加更多推荐按钮
    var moreDiv = document.createElement("div")
    moreDiv.id = "more"
    moreDiv.className = "alink"
    moreDiv.innerText = "更多推荐"
    hotBox.appendChild(moreDiv)
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
    // 给更多按钮添加事件
    initEvent()
  }

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

  function hotUrl(home) {
    var a2 = document.createElement("a")
    a2.href = home.url
    a2.text = home.title
    a2.target = "_blank"
    a2.className = "alink"
    // 给1024链接加一个标识，方便添加贡献
    if (home.title.indexOf("1024") !== -1 || home.title.indexOf("草榴") !== -1) {
      a2.id = "caoliu"
    }
    return a2
  }

  // 随机生成1-100的整数
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function initEvent() {
    // 添加打开设置页面事件
    const openset = document.getElementById("more")
    openset.onclick = function () {
      chrome.tabs.create({
        url: './static/views/onboarding.html'
      });
    }
  }

  function addButtonClickToContentMessage(btnId, message) {
    document.getElementById(btnId).onclick = async function () {
      // 先获取当前激活的tab页
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      // 然后向这个tab页里面发送消息
      console.log('开始addButtonClickToContentMessage: ' + tab);
      const response = await chrome.tabs.sendMessage(tab.id, { greeting: message });
      // do something with response here, not outside the function
      console.log(response);
    }
  }
})()