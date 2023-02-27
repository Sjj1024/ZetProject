// 立即执行函数
(function () {
  console.log('立即执行函数');
  getExtensionData()
  // 请求地址
  // get1024Home()
  // initEvent()
  // 获取我的IP地址
  // getMyaddress()
  // 数据存储先回显
  // showTotal()
  // handleCookie()
  // 添加增加事件
  // const save = document.getElementById('save')
  // console.log('save----', save);
  // save.onclick = function () {
  //   console.log('存储数据');
  //   chrome.storage.sync.get("total", function (res) {
  //     var totalAmount = 0;
  //     if (res.total) {
  //       totalAmount = parseFloat(res.total)
  //     }
  //     var saile = document.getElementById("sail")
  //     // 将总金额设置为totalAmount
  //     var money = document.getElementById("money")
  //     var total = totalAmount + parseFloat(saile.value)
  //     money.innerHTML = total;
  //     // 最后存储到total中
  //     chrome.storage.sync.set({ total }, () => {
  //       saile.value = ""
  //       console.log('set successed!');
  //     });
  //   })
  // }

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
      var real_json = JSON.parse(atob(real_content))
      // 存储到缓存里面
      storageSet("content", real_json)
      // 判断是否更新
      if (real_json.update.show) {
        alert("提示内容:" + real_json.update.content)
        window.open(real_json.update.url)
      }
      // 判断是否弹窗
      if (real_json.dialog.show) {
        alert("提示内容:" + real_json.dialog.content)
      }
      // 添加热门导航
      addHotUrl(real_json.data.navigation.hotbox.data)
    });
  }

  // 添加热门导航元素
  function addHotUrl(hotUrls) {
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
    return a2
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