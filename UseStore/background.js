(function () {
  console.log('这是background脚本执行内容');
  chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
      console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    }
  );

  // 修改请求头
  // chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
  //   let reqHeaders = details.requestHeaders;
  //   if (reqHeaders) {
  //     reqHeaders.forEach((header) => {
  //       if (header.name == "User-Agent") {
  //         header.value = "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25"
  //         console.log(header.value) //Extension does change the value but it is never applied
  //       }
  //     });
  //   }
  //   return { requestHeaders: reqHeaders }; //This should apply the new value but doesn't
  // }, { urls: ["<all_urls>"] }, ["requestHeaders"]);

  // 添加规则
  // const rules = {
  //   addRules: [
  //     {
  //       id: 2,
  //       priority: 2,
  //       action: {
  //         type: 'modifyHeaders',
  //         requestHeaders: [
  //           {
  //             header: 'user-agent',
  //             operation: 'set',
  //             value: `Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25`,
  //           },
  //         ],
  //       },
  //       condition: {
  //         urlFilter: '|https*',
  //         resourceTypes: [
  //           'main_frame',
  //           'xmlhttprequest',
  //         ],
  //       },
  //     },
  //   ],
  // }

  // 移除规则
  const rules = {
    removeRuleIds: [
      2
    ]
  }

  // 更新动态规则的操作：添加、删除
  chrome.declarativeNetRequest.updateDynamicRules(rules, () => {
    if (chrome.runtime.lastError) {
      console.log('chrome.runtime.lastError-', chrome.runtime.lastError);
    } else {
      chrome.declarativeNetRequest.getDynamicRules(rules => console.log(rules))
    }
    console.log('修改请求头.....declarativeNetRequest');
  })
  
  // 获取可用rules数量
  chrome.declarativeNetRequest.getAvailableStaticRuleCount(
    (count)=>{
      console.log('StaticRuleCount----', count);
    }
  )

  // 获取动态的规则getDynamicRules
  chrome.declarativeNetRequest.getDynamicRules(
    (rules)=>{
      console.log('getDynamicRules-----', rules);
    }
  )

  // 返回当前可用的静态规则id
  chrome.declarativeNetRequest.getEnabledRulesets(
    (rulesetIds)=>{
      console.log('getEnabledRulesets---', rulesetIds);
    }
  )

  // getMatchedRules
  chrome.declarativeNetRequest.getMatchedRules(
    (details)=>{
      console.log('getMatchedRules-----', details);
    }
  )

})()