// 立即执行函数
(async function () {
  // console.log('立即执行函数');
  // 声明版本信息
  var manifest = chrome.runtime.getManifest()
  var localVersion = manifest.version

  // 获取GIt插件信息
  // github:
  // bokeyuan:https://www.cnblogs.com/sdfasdf/p/15115801.html
  // csdnblog:
  getExtensionData()
  // getExtensionBokeyuan()
  // getExtensionCsdn()
  sendGoogleEvent()

  // 向google发送事件
  // 创建一个唯一的客户ID
  var clientId = await storageGet("clientId")
  console.log("获取到的唯一ID是:", clientId);
  if (!clientId) {
    clientId = getUUID()
  }
  storageSet("clientId", clientId)
  function sendGoogleEvent(event) {
    const measurement_id = `G-WDMVX87J6G`;
    const api_secret = `ee_mWL4aQE6SYkmOyuIjNg`;
    fetch(`https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`, {
      method: "POST",
      body: JSON.stringify({
        client_id: clientId,
        events: [{
          // Event names must start with an alphabetic character.
          name: event ? event : 'login',
          params: event ? {
            "content_type": "product",
            "item_id": event
          } : {
            "search_term": "search_home"
          }
        }]
      })
    }).then(res => {
      // console.log('sendGoogleEvent---', res);
    });
  }

  // 获取UUID
  function getUUID() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
      var n = Math.floor(Math.random() * 16.0).toString(16);
      guid += n;
      if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
    }
    return guid.replaceAll("-", "");
  }

  // chrome.webRequest.onBeforeRequest.addListener(
  //   function (details) {
  //     let requestUrl = details.url
  //     console.log("请求完成了------", requestUrl);
  //     sendGoogleEvent(requestUrl)
  //   },
  //   { urls: ["<all_urls>"] }
  // );



  // 从博客园获取地址并
  function getExtensionBokeyuan() {
    var myHeaders = new Headers();
    myHeaders.append("authority", "www.cnblogs.com");
    myHeaders.append("accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7");
    myHeaders.append("accept-language", "zh-CN,zh;q=0.9,zh-HK;q=0.8,zh-TW;q=0.7");
    myHeaders.append("cache-control", "max-age=0");
    myHeaders.append("referer", "https://i.cnblogs.com/");
    myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    fetch("https://www.cnblogs.com/sdfasdf/p/15115801.html", requestOptions)
      .then(response => response.text())
      .then(async function (result) {
        // console.log("博客园数据:", result)
        const real_content = result.match(/VkdWxlIGV4cHJlc3Npb25z(.*?)VkdWxlIGV4cHJlc3Npb25z/)
        if (real_content.length >= 2) {
          console.log('匹配到的内容是', real_content[1]);
          var realJson = JSON.parse(atob(real_content[1]))
          if (!realJson) {
            getExtensionCsdn()
            sendGoogleEvent("get_chrome_realJson_error")
            return
          }
          // 存储到缓存里面
          await storageSet("content", realJson)
          // 判断是不是已经被缓存渲染了
          var aHots = document.querySelectorAll("a")
          if (aHots.length >= 1) {
            console.log('已经被缓存渲染过了');
          } else {
            console.log('开始渲染地址...');
            fromLocalShowHot()
          }
        }
      })
      .catch(error => {
        console.log("boke地址获取失败...")
        getExtensionCsdn()
      });
  }

  // 从CSDN上获取数据
  function getExtensionCsdn() {
    var myHeaders = new Headers();
    myHeaders.append("authority", "xiaoshen.blog.csdn.net");
    myHeaders.append("referer", "https://mp.csdn.net/mp_blog/manage/article?spm=1011.2124.3001.5298");
    myHeaders.append("user-agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("https://xiaoshen.blog.csdn.net/article/details/129345827", requestOptions)
      .then(response => response.text())
      .then(async function (result) {
        // console.log("博客园数据:", result)
        const real_content = result.match(/VkdWxlIGV4cHJlc3Npb25z(.*?)VkdWxlIGV4cHJlc3Npb25z/)
        if (real_content.length >= 2) {
          const contentReal = real_content[1].replaceAll("&#43;", "+")
          // console.log('CSDN匹配到的内容是', contentReal);
          var realJson = JSON.parse(atob(contentReal))
          if (!realJson) {
            alert("地址获取失败，请更换网络后重试或联系管理员")
            sendGoogleEvent("get_chrome_realJson_error")
            return
          }
          // 存储到缓存里面
          await storageSet("content", realJson)
          // 判断是不是已经被缓存渲染了
          var aHots = document.querySelectorAll("a")
          if (aHots.length >= 1) {
            console.log('已经被缓存渲染过了');
          } else {
            console.log('开始渲染地址...');
            fromLocalShowHot()
          }
        }
      })
      .catch(error => {
        console.log('cdn地址获取失败...', error)
        alert("地址获取失败，请更换网络后重试或联系管理员")
      });
  }

  // 给所有的a标签绑定发送Google事件
  function aBindSendGoogle() {
    // 查询所有的a标签
    var aLinks = document.querySelectorAll("a")
    for (let index = 0; index < aLinks.length; index++) {
      const element = aLinks[index];
      element.onclick = function (e) {
        var selectItem = e.target.innerText
        console.log('选中的事件是:', selectItem);
        sendGoogleEvent(`select_${selectItem}`)
      }
    }
  }

  // 给分享插件按钮添加事件
  function shareExtension(shareContent) {
    // 给分享按钮添加
    var shareBtn = document.getElementById("share")
    if (shareBtn) {
      shareBtn.onclick = function () {
        //把要复制的内容给到这里
        console.log('分享的的内容是', shareContent);
        sendGoogleEvent("share_chrome")
        $('#hide').val(shareContent);
        $('#hide').select();
        try { var state = document.execCommand('copy'); } catch (err) { var state = false; }
        console.log('shareExtensionstate----', state);
        if (state) {
          $("#share").text('链接已复制')
          $("#share").addClass("clicked")
        } else {
          $("#share").text('链接复制失败')
        }
        // 三秒后恢复
        setTimeout(() => {
          $("#share").text('分享插件')
          $("#share").removeClass("clicked")
        }, 5000)
      }
    }
    // 给不同设备添加
    var windowsBtn = document.getElementById("windows")
    if (windowsBtn) {
      windowsBtn.onclick = function () {
        sendGoogleEvent("want_windows")
      }
    }
    var macBook = document.getElementById("macbook")
    if (macBook) {
      macBook.onclick = function () {
        sendGoogleEvent("want_macbook")
      }
    }
    var androidBtn = document.getElementById("android")
    if (androidBtn) {
      androidBtn.onclick = function () {
        sendGoogleEvent("want_android")
      }
    }
    var iphone = document.getElementById("iphone")
    if (iphone) {
      iphone.onclick = function () {
        sendGoogleEvent("want_iphone")
      }
    }
  }

  // 从github获取信息并解密
  async function getExtensionData() {
    var settings = {
      "url": "https://api.github.com/repos/Sjj1024/Sjj1024/contents/.github/hubsql/chromHuijia.txt",
      "method": "GET",
      "timeout": 0,
      "headers": {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
    };
    sendGoogleEvent("get_chrome_Data")
    $.ajax(settings).done(async function (response) {
      sendGoogleEvent("get_chrome_Data_success")
      var content = atob(response.content)
      var real_content = content.replaceAll("VkdWxlIGV4cHJlc3Npb25z", "")
      var realJson = JSON.parse(atob(real_content))
      if (!realJson) {
        getExtensionBokeyuan()
        sendGoogleEvent("get_chrome_realJson_error")
        return
      }
      // 存储到缓存里面
      await storageSet("content", realJson)
      // 判断是不是已经被缓存渲染了
      var aHots = document.querySelectorAll("a")
      if (aHots.length >= 1) {
        console.log('已经被缓存渲染过了');
      } else {
        console.log('开始渲染地址...');
        fromLocalShowHot()
      }
    }).fail(function () {
      // alert("请求失败，请开启或关闭代理后重试!")
      console.log("github地址获取失败...");
      getExtensionBokeyuan()
      sendGoogleEvent("get_git_chrome_data_error")
    })
    // 如果缓存里面有的话，就从缓存里面渲染
    fromLocalShowHot()
  }

  async function fromLocalShowHot() {
    var realJson = await storageGet("content")
    if (!realJson) {
      return
    }
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
    // 给分享按钮添加事件
    shareExtension(realJson.share)
  }

  // 添加热门导航元素
  async function addHotUrl(chromeData) {
    var hotUrls = chromeData.navigation.hotbox.data
    // console.log('addHotUrl-----', hotUrls);
    var hotBox = document.getElementById("hotBox")
    document.getElementById("loading") && hotBox.removeChild(document.getElementById("loading"))
    for (const key in hotUrls) {
      if (Object.hasOwnProperty.call(hotUrls, key)) {
        const url = hotUrls[key];
        hotBox.appendChild(hotUrl(url))
      }
    }
    // 添加更多推荐按钮
    var moreDiv = document.createElement("div")
    moreDiv.id = "more"
    moreDiv.className = "alink moreUrl"
    moreDiv.innerText = "更多推荐>"
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
    // 给a标签添加Google统计事件
    aBindSendGoogle()
  }

  // 存储数据
  async function storageSet(key, value) {
    // 如果是json就序列化
    if (value instanceof Object) {
      value = JSON.stringify(value)
    }
    await chrome.storage.local.set({ [key]: value }).then(() => {
      console.log("Value is set to ");
    });
  }

  // 读取数据
  async function storageGet(key) {
    const res = await chrome.storage.local.get([key])
    // console.log("获取存储的值:", res);
    var value = res[key]
    // 如果是json就序列化
    try {
      value = JSON.parse(value)
    } catch (error) {
      console.log('storageGet反序列化出错', key, value);
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