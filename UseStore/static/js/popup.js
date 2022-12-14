// 立即执行函数
(function () {
  console.log('立即执行函数');
  // 请求地址
  // get1024Home()
  initEvent()
  // 先回显
  showTotal()
  handleCookie()
  // 添加增加事件
  const save = document.getElementById('save')
  console.log('save----', save);
  save.onclick = function () {
    console.log('存储数据');
    chrome.storage.sync.get("total", function (res) {
      var totalAmount = 0;
      if (res.total) {
        totalAmount = parseFloat(res.total)
      }
      var saile = document.getElementById("sail")
      // 将总金额设置为totalAmount
      var money = document.getElementById("money")
      var total = totalAmount + parseFloat(saile.value)
      money.innerHTML = total;
      // 最后存储到total中
      chrome.storage.sync.set({ total }, () => {
        saile.value = ""
        console.log('set successed!');
      });
    })
  }

  // 获取网站的cookie，并打印出来
  function handleCookie(params) {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
      let url = tabs[0].url;
      // use `url` here inside the callback because it's asynchronous!
      console.log('url--', url);
      console.log('tabid--', tabs[0].id);
      chrome.cookies.getAll({ url }, function (cookies) {
        const resList = cookies.map(item => {
          return `${item.name}=${item.value}`
        })
        const cookieStr = resList.join(";")
        console.log("cookies-----", cookieStr);
        document.getElementById("cookies").innerHTML = cookieStr
        document.getElementById("useragent").innerHTML = navigator.userAgent
      });
    });
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

  function initEvent(params) {
    // 添加清空全部事件
    const clearBtn = document.getElementById("clear-btn")
    clearBtn.onclick = function () {
      chrome.storage.sync.clear(() => {
        console.log('已清空所有内容');
        showTotal()
      })
    }
    // 添加获取地址事件
    const getHome = document.getElementById("btn-1024")
    getHome.onclick = get1024Home

    // 添加打开设置页面事件
    const openset = document.getElementById("openset")
    openset.onclick = function (params) {
      chrome.tabs.create({
        url: './static/views/onboarding.html'
      });
    }
    // 添加百度自动点击执行操作
    const baidu = document.getElementById("baiduauto")
    baidu.onclick = async function (){
      // 先获取当前激活的tab页
      const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
      // 然后向这个tab页里面发送消息
      console.log('开始自动滚动: ' + tab);
      const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
      // do something with response here, not outside the function
      console.log(response);
    }
  }

  // 初始化总金额
  function showTotal(params) {
    chrome.storage.sync.get("total", function (res) {
      if (res.total) {
        totalAmount = parseFloat(res.total)
        var money = document.getElementById("money")
        money.innerHTML = totalAmount;
      } else {
        var money = document.getElementById("money")
        money.innerHTML = 0
      }
    })
  }

  // 初始化的时候，回显内容
  // function showTotal() {
  //   chrome.storage.sync.get("total", function (res) {
  //     if (res.total) {
  //       totalAmount = parseFloat(res.total)
  //       var money = document.getElementById("money")
  //       var total = totalAmount + parseFloat(saile)
  //       money.innerHTML = total;
  //     }
  //   }
  // }
})()