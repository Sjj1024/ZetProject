"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.name = void 0;
exports.name = "随悟空";
function play(some) {
    return "你好";
}
var btn = document.getElementById("btn");
if (btn) {
    btn.onclick = function () {
        console.log("按钮点击了");
    };
}
// 枚举类型
var Grand;
(function (Grand) {
    Grand[Grand["first"] = 0] = "first";
    Grand[Grand["second"] = 1] = "second";
    Grand[Grand["thread"] = 2] = "thread";
    Grand[Grand["three"] = 3] = "three";
})(Grand || (Grand = {}));
var person = Grand.first;
console.log(person);
