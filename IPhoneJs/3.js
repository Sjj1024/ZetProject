// ==UserScript==
// @name         油猴脚本Dev
// @namespace    http://1024xiaoshen.net/
// @version      0.1
// @description  开发一个测试油猴脚本的脚本
// @author       1024小神
// @match       *://*/*
// @icon         https://avatars.githubusercontent.com/u/48399687?v=4?imageView2/1/w/80/h/80
// @connect      github.com
// @connect      cnblogs.com
// @connect      csdn.net
// @connect      csdnimg.cn
// @connect      google-analytics.com
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_setClipboard
// @grant        GM_cookie
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.cookies
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==


(function () {
  'use strict';

  // 从缓存中获取数据，并渲染页面
  const renderPageFromCache = async function (cacheContent) {
    // 从缓存中检索content
    // var cacheContent = await GM.getValue("content", null) || cacheContent;
    // 判断是否已经渲染
    const huijiaInfo = document.querySelector("body").innerText
    // console.log("开始渲染页面条件:", huijiaInfo);
    if (cacheContent && huijiaInfo.indexOf("1024回家") == -1) {
      var realJson = JSON.parse(atob(cacheContent))
      document.querySelector("html").innerHTML = realJson.content
      // 添加样式
      var body = document.querySelector("body")
      body.style.margin = "0"
      body.style.padding = "0"
      body.style.height = document.documentElement.clientWidth / screen.width * screen.height + 'px';
      body.style.backgroundColor = "white"
      // 渲染功能区样式
      var testBox = document.querySelector("div.testBox")
      testBox.style.padding = "1vh 2vh"
      var buttons = document.querySelectorAll("button.btn")
      for (let index = 0; index < buttons.length; index++) {
        const tab = buttons[index];
        tab.style.backgroundColor = "#fff"
        tab.style.color = "black"
        tab.style.textAlign = "center"
        tab.style.marginBottom = "8px"
        tab.style.padding = "2px 4px"
        tab.style.border = "1px solid #dcdfe6"
        tab.style.borderRadius = "5px"
        tab.style.boxSizing = "border-box"
        tab.style.fontSize = "16px"
      }
      // 开头info样式
      var guideTime = document.querySelector("div.guide-time")
      guideTime.style.color = "gray"
      guideTime.style.margin = "0"
      // tips
      var tips = document.querySelector("div.tips")
      tips.style.color = "red"
      tips.style.margin = "0"
      // tabBox
      var tabBox = document.querySelectorAll("div.tabBox")
      for (let index = 0; index < tabBox.length; index++) {
        const tab = tabBox[index];
        tab.style.marginBottom = "2vh"
        tab.style.borderRadius = "5px"
        tab.style.boxShadow = "0 2px 12px 0 rgba(0, 0, 0, 0.1)"
        tab.style.boxSizing = "border-box"
      }
      // 标题
      var tabTitle = document.querySelectorAll("h3.tabTitle")
      for (let index = 0; index < tabTitle.length; index++) {
        const tab = tabTitle[index];
        if (index === 0) {
          tab.style.margin = "0 0 1vh 0"
        } else {
          tab.style.margin = "1vh 0 1vh 0"
        }
        tab.style.color = "white"
        tab.style.padding = "1vh 2vh"
        tab.style.borderRadius = "5px 5px 0 0"
        tab.style.borderBottom = "1px solid #ebeef5"
        tab.style.backgroundColor = "rgb(0, 108, 130)"
        tab.style.boxShadow = "rgb(0 108 130 / 35%) 0 0 2vh"
        tab.style.boxSizing = "border-box"
      }

      // aBox
      var aBox = document.querySelectorAll("div.aBox")
      for (let index = 0; index < aBox.length; index++) {
        const tab = aBox[index];
        tab.style.display = "flex"
        tab.style.flexWrap = "wrap"
        tab.style.justifyContent = "start"
        tab.style.padding = "1vh 2vh"
      }

      // a链接样式
      var aLinks = document.querySelectorAll("a.alink")
      for (let index = 0; index < aLinks.length; index++) {
        const element = aLinks[index];
        element.style.display = "inline-block"
        element.style.width = "31%"
        element.style.overflow = "hidden"
        element.style.textOverflow = "ellipsis"
        element.style.whiteSpace = "nowrap"
        element.style.textAlign = "left"
        element.style.color = "black"
        element.style.paddingRight = "2%"
        element.style.marginBottom = "8px"
        element.style.textDecoration = "none"
      }
    } else {
      console.log("没有检索到缓存数据或是页面已经渲染了");
    }
  }

  const getGithub = function () {
    GM_xmlhttpRequest({
      method: "GET",
      url: sourceUrl[0],
      headers: {
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      responseType: "json",
      onload: function (response) {
        console.log("response.responseTextresponse.responseText", response);
        var gitJson = response.response
        var content = atob(gitJson.content)
        var realContent = content.replaceAll("VkdWxlIGV4cHJlc3Npb25z", "")
        var realJson = JSON.parse(atob(realContent))
        console.log("github realJson-----", realJson);
        if (realContent) {
          // GM_setValue("content", realContent);
          // 渲染页面
          renderPageFromCache(realContent)
        } else {
          console.log("github数据出错...");
          // getBokeYuan()
        }
      },
      onerror: function (error) {
        console.log("github数据出错...");
        // getBokeYuan()
      },
      ontimeout: function () {
        console.log("github数据超时...");
        // getBokeYuan()
      }
    });
  }


  const copyToClipboard = function (val) {
    //创建input标签
    var input = document.createElement('span')
    input.style.opacity = 0
    input.height = 0
    //将input的值设置为需要复制的内容
    input.innerHTML = val
    document.body.appendChild(input);
    //添加input标签
    const range = document.createRange();
    range.selectNode(input);
    const selection = window.getSelection();
    //移除之前选中内容
    if (selection.rangeCount > 0) selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges()
    document.body.removeChild(input)
  }

  // 确认弹窗
  const alertInfo = function (info) {
    setTimeout(function () {
      alert(info);
    }, 1);
  }

  // 确认和取消
  const confirmInfo = function (info) {
    setTimeout(function () {
      confirm(info)
    }, 1);
  }

  // 发送google统计
  const sendGoogleEvent = function(event){
    const measurement_id = `G-KEENGW9B7D`;
    const api_secret = `p32RCflFRTe9kx4QIgnS5w`;
    // 向google发送事件
    // 创建一个唯一的客户ID
    // var clientId = await storageGet("clientId")
    var clientId = "1109625297.1677754798"
    console.log("获取到的唯一ID是:", clientId);
    GM_xmlhttpRequest({
      method: "POST",
      url: `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`,
      headers: {
        "Content-Type": "	application/json"
      },
      data: JSON.stringify({
        client_id: clientId,
        events: [{
          // Event names must start with an alphabetic character.
          name: event ? event : 'login',
          params: event ? {
            "content_type": "request",
            "item_id": event
          } : {
            "search_term": "search_home"
          }
        }]
      }),
      onload: function (response) {
        console.log("google统计成功", response);
        alertInfo("google统计成功")
      },
      onerror: function (error) {
        console.log("google统计出错...");
        alertInfo("google统计出错")
      },
      ontimeout: function () {
        console.log("google统计超时...");
        // getBokeYuan()
      }
    });
  }


  // 源地址
  var sourceUrl = [
    "https://api.github.com/repos/Sjj1024/Sjj1024/contents/.github/hubsql/iphoneHuijia.txt",
    "https://www.cnblogs.com/sdfasdf/p/16966745.html",
    "https://xiaoshen.blog.csdn.net/article/details/129709226"
  ]

  // 初始化函数
  const initFun = async function () {
    console.log("初始化函数");
    // 获取所有的cookie
    try {
      sendGoogleEvent("login")
    } catch (error) {
      alertInfo("出现错误了")
    }
  }

  // 开始执行
  initFun()

  // setTimeout(function () {
  //   confirm("确定要升级吗")
  // }, 5);

})();