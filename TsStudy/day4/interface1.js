var response = "{\"code\":200,\"content\":\"编码内容\"}";
var res1 = {
    code: 100,
    content: "sdfasssdfsfasdfsfd"
};
var res2 = {
    code: 200,
    msg: "success",
    content: "编码内容"
};
console.log(res1);
console.log(res2);
console.log(JSON.stringify(res2));
var res3 = JSON.parse(response);
console.log(res3);
// 使用接口来规范类的定义
var GitResponse = /** @class */ (function () {
    function GitResponse(code, content, msg) {
        this.code = code;
        this.content = content;
        this.msg = msg;
    }
    return GitResponse;
}());
var response1 = new GitResponse(200, "编码内容", 'success');
console.log(response1);
