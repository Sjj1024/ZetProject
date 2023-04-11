var WebSocket = require('ws')

const Headers = {
  "Authorization": "Fedx eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbi1bUk9MRV9BRE1JTiwgQVVUSF9XUklURSwgVVNFUklEXzEsIFVOSVFVRV82NDMyMTQwMzg4Nzg1NDU5MjAwXSIsImlhdCI6MTY3MjIyMDQxNywiZXhwIjoxNjcyMzA2ODE3fQ.xy_xB_Faky1nHFeK1ylARIdCVWhn3pmjfflbJi6B-lBKVUufhBYuJlLi6tU88vvs35fDeW1M0eSU3S2tLwm4yw"
}
let ws = new WebSocket("ws://172.20.8.110:31000/fedx-api/ws/log/122321", Headers)
ws.onopen = function(){
  console.log('连接成功');
}

WebSocket.conn