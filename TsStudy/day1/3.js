var a = 10;
// 字面量
var b;
// b =11;
// 定义c只能是a或者c类型，赋值别的值就不行
var c;
// 联合类型
var myType;
myType = "nihao";
// any类型：任何类型
var myAny;
myAny = 100;
// unknown是类型安全的any类型
if (typeof myAny === "string") {
    // 类型断言：用来告诉解析器，我们变量的实际类型
    var r = myAny;
    var z = myAny;
}
// 函数类型返回
function fn() {
    return "";
}
// 对象:object不实用，因为js中一切皆对象
var myObj;
myObj = function () {
};
// 常用这种方式表示一个对象
var myConent;
myConent = {
    name: "随悟空",
    age: 10
};
// 函数变量
var say;
say = function (name) {
    return "".concat(name, " \u4F60\u597D");
};
// 数组类型
var myArray;
var g;
// 元祖：固定长度数组，效率比数组好
var myTuple;
myTuple = ["nihao", "zhongguo", 19];
//枚举类
var Gender;
(function (Gender) {
    Gender[Gender["male"] = 0] = "male";
    Gender[Gender["female"] = 1] = "female";
})(Gender || (Gender = {}));
var someMan;
someMan = 1;
console.log(Gender.female);
var home = "河南省洛阳市";
