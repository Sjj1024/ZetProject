var response = {
    code: 100,
    content: "1ni",
    url: ""
};
var MyRes = /** @class */ (function () {
    function MyRes(code, content, url) {
        this.code = code;
        this.content = content;
        this.url = url;
    }
    return MyRes;
}());
var res = JSON.parse("{ \"code\": 200, \"content\": \"编码内容\",\"url\": \"urllurljrljl\", \"msg\": \"success\" }");
console.log("JSON后的res对象是:", res);
console.log(res.content);
