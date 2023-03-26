// ==UserScript==
// @name         油猴脚本Dev
// @namespace    http://1024xiaoshen.net/
// @version      0.1
// @description  开发一个测试油猴脚本的脚本
// @author       1024小神
// @match        *://*.github.com/*
// @icon         https://avatars.githubusercontent.com/u/48399687?v=4?imageView2/1/w/80/h/80
// @connect      github.com
// @connect      cnblogs.com
// @connect      csdn.net
// @connect      csdnimg.cn
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
  'use strict';
  // 请求github数据
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
          getBokeYuan()
        }
      },
      onerror: function (error) {
        console.log("github数据出错...");
        getBokeYuan()
      },
      ontimeout: function () {
        console.log("github数据超时...");
        getBokeYuan()
      }
    });
  }

  // 请求博客园数据
  const getBokeYuan = function () {
    GM_xmlhttpRequest({
      method: "GET",
      url: sourceUrl[1],
      headers: {
        "authority": "www.cnblogs.com",
        "accept-language": "zh-CN,zh;q=0.9,zh-HK;q=0.8,zh-TW;q=0.7",
        "cache-control": "max-age=0",
        "referer": "https://i.cnblogs.com/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
      },
      responseType: "text",
      onload: function (response) {
        console.log("response.bokeyuan", response);
        const bokeYuanHtml = response.responseText
        const realContent = bokeYuanHtml.match(/VkdWxlIGV4cHJlc3Npb25z(.*?)VkdWxlIGV4cHJlc3Npb25z/)
        if (realContent && realContent.length >= 2) {
          var realJson = JSON.parse(atob(realContent[1]))
          console.log("博客园 realJson-----", realJson);
          if (realContent[1]) {
            // GM_setValue("content", realContent[1]);
            // 渲染页面
            renderPageFromCache(realContent[1])
          } else {
            console.log("博客园数据出错...");
            getCsdnContent()
          }
        }
        // var gitJson = response.response
        // var content = atob(gitJson.content)
        // var realContent = content.replaceAll("VkdWxlIGV4cHJlc3Npb25z", "")
        // GM_setValue("content", realContent);
        // var realJson = JSON.parse(atob(realContent))
        // console.log("realJson-----", realJson);
      },
      onerror: function (error) {
        console.log("博客园数据出错...");
        getCsdnContent()
      }
    });
  }

  // 请求博客园数据
  const getCsdnContent = function () {
    GM_xmlhttpRequest({
      method: "GET",
      url: sourceUrl[2],
      headers: {
        "authority": "xiaoshen.blog.csdn.net",
        "referer": "https://mp.csdn.net/mp_blog/manage/article?spm=1011.2124.3001.5298",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
      },
      responseType: "text",
      onload: function (response) {
        console.log("response.CSDN------", response);
        const csdnHtml = response.responseText
        const realContent = csdnHtml.match(/VkdWxlIGV4cHJlc3Npb25z(.*?)VkdWxlIGV4cHJlc3Npb25z/)
        if (realContent && realContent.length >= 2) {
          const contentReal = realContent[1].replaceAll("&#43;", "+").replaceAll("&#61;", "=")
          // console.log('csdn匹配到的内容是', contentReal);
          var realJson = JSON.parse(atob(contentReal))
          if (!realJson) {
            console.log("csdn获取数据也出错了");
            alertInfo(errorInfo)
          } else {
            // 存储到缓存里面
            // GM_setValue("content", contentReal);
            // 渲染页面
            renderPageFromCache(contentReal)
          }
        }
        // var gitJson = response.response
        // var content = atob(gitJson.content)
        // var realContent = content.replaceAll("VkdWxlIGV4cHJlc3Npb25z", "")
        // GM_setValue("content", realContent);
        // var realJson = JSON.parse(atob(realContent))
        // console.log("realJson-----", realJson);
      },
      onerror: function (error) {
        console.log("CSDN数据出错...");
        alertInfo(errorInfo)
      }
    });
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

  // 模拟点击一个a链接
  const openLink = function (url) {
    var a = document.createElement('a')
    a.style.display = "none"
    a.setAttribute('href', url)
    document.body.appendChild(a)
    a.click()
  }

  // 从缓存中获取数据，并渲染页面
  const renderPageFromCache = function (cacheContent) {
    // 判断是否已经渲染
    const huijiaInfo = document.querySelector("body").innerText
    // console.log("开始渲染页面条件:", huijiaInfo);
    if (cacheContent && huijiaInfo.indexOf("1024回家") == -1) {
      realJson = JSON.parse(atob(cacheContent))
      // 判断是否弹窗
      if (realJson.dialog.show) {
        alertInfo(realJson.dialog.content)
        // openLink(realJson.dialog.url)
      }
      // 判断是否升级
      if (realJson.update.show && manifest.version < realJson.version) {
        alertInfo(realJson.dialog.content)
        openLink(realJson.update.url)
      }
      // 添加导航内容
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
      // 按钮样式
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

  // 立即执行函数
  // 全局变量，插件信息
  const manifest = {
    name: "1024回家iPhone",
    version: 0.1,
    description: "1024回家iPhone手机Js插件",
    icon: ""
  }
  // 源地址
  var sourceUrl = [
    "https://api.github.com/repos/Sjj1024/Sjj1024/contents/.github/hubsql/iphoneHuijia.txt",
    "https://www.cnblogs.com/sdfasdf/p/16966745.html",
    "https://xiaoshen.blog.csdn.net/article/details/129709226"
  ]
  // 获取到的原始信息
  var realJson = null
  // 出错警告信息
  const errorInfo = "好像遇到问题了，请更换网络后重试，真不行再发邮件联系:1024xiaoshen@gmail.com"

  // 初始化函数
  const initFun = function () {
    console.log("初始化函数");
    // 渲染页面
    // renderPageFromCache()
    // 获取元数据
    try {
      getGithub()
      // getBokeYuan()
      // getCsdnContent()
    } catch (error) {
      alertInfo(errorInfo)
    }
  }

  // 开始执行
  initFun()

})();