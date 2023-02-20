console.log('这是background脚本执行内容');

// 监听传递过来的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 2. A page requested user data, respond with a copy of `user`
  console.log('这是background脚本onMessage', message);
  if (message.includes("editUserAgent")) {
    const userAgent = message.split(":")[1]
    configRules[0].action.requestHeaders.values = userAgent
    console.log('background---useragent---', userAgent, configRules);
    const rules = {
      addRules: [
        {
          id: 2,
          priority: 2,
          action: {
            type: 'modifyHeaders',
            requestHeaders: [
              {
                header: 'user-agent',
                operation: 'set',
                value: userAgent,
              },
            ],
          },
          condition: {
            urlFilter: '|https*',
            resourceTypes: [
              "csp_report",
              "font",
              "image",
              "main_frame",
              "media",
              "object",
              "other",
              "ping",
              "script",
              "stylesheet",
              "sub_frame",
              "webbundle",
              "websocket",
              "webtransport",
              "xmlhttprequest"
            ],
          },
        },
      ]
    }
    addRules(rules)
    // chrome.tabs.reload()
  } else if (message === 'resetUserAgent') {
    delRules(2)
    // chrome.tabs.reload()
  } else {
    console.log('background脚本onMessage: else', message);
    sendContent(message)
  }
  sendResponse(user);
});



// 消息传递
const user = {
  username: 'demo-user'
};

// 添加的规则内容
const configRules = [
  {
    id: 2,
    priority: 2,
    action: {
      type: 'modifyHeaders',
      requestHeaders: [
        {
          header: 'user-agent',
          operation: 'set',
          value: `Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25`,
        },
      ],
    },
    condition: {
      urlFilter: '|https*',
      resourceTypes: [
        'main_frame',
        'xmlhttprequest',
      ],
    },
  },
]

// 添加规则
async function addRules(rules) {
  // console.log('添加ruleId', ruleId);
  // const rule = configRules.find(item => item.id === ruleId)
  // if (!rule) {
  //   console.log('没有找到对应的ruleID', ruleId);
  //   return
  // }
  // 更新动态规则的操作：添加、删除
  chrome.declarativeNetRequest.updateDynamicRules(rules, () => {
    if (chrome.runtime.lastError) {
      console.log('chrome.runtime.lastError-出错：', chrome.runtime.lastError);
    } else {
      chrome.declarativeNetRequest.getDynamicRules(rules => console.log(rules))
    }
    console.log('修改请求头.....declarativeNetRequest---addRules');
  })
}

// 删除规则
async function delRules(ruleId) {
  console.log('删除ruleId', ruleId);
  const rules = { removeRuleIds: [ruleId] }
  // 更新动态规则的操作：添加、删除
  chrome.declarativeNetRequest.updateDynamicRules(rules, () => {
    if (chrome.runtime.lastError) {
      console.log('chrome.runtime.lastError-', chrome.runtime.lastError);
    } else {
      chrome.declarativeNetRequest.getDynamicRules(rules => console.log(rules))
    }
    console.log('修改请求头.....declarativeNetRequest----delRules');
  })
}

// 给content.js
async function sendContent(tabID) {
  const response = await chrome.tabs.sendMessage(tabID, { greeting: "hello" });
  // do something with response here, not outside the function
  console.log("sendContentResponse---", response);
}

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

// 获取可用rules数量
chrome.declarativeNetRequest.getAvailableStaticRuleCount(
  (count) => {
    console.log('StaticRuleCount----', count);
  }
)

// 获取动态的规则getDynamicRules
chrome.declarativeNetRequest.getDynamicRules(
  (rules) => {
    console.log('getDynamicRules-----', rules);
  }
)

// 返回当前可用的静态规则id
chrome.declarativeNetRequest.getEnabledRulesets(
  (rulesetIds) => {
    console.log('getEnabledRulesets---', rulesetIds);
  }
)

// getMatchedRules
chrome.declarativeNetRequest.getMatchedRules(
  (details) => {
    console.log('getMatchedRules-----', details);
  }
)