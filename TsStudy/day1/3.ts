let a = 10;
// 字面量
let b: 10;
// b =11;

// 定义c只能是a或者c类型，赋值别的值就不行
let c: "a" | "c";

// 联合类型
let myType: string | boolean | number;
myType = "nihao";

// any类型：任何类型
let myAny;
myAny = 100;

// unknown是类型安全的any类型
if (typeof myAny === "string") {
    // 类型断言：用来告诉解析器，我们变量的实际类型
    let r = myAny as string
    let z = <string>myAny;
}


// 函数类型返回
function fn(): string | number {
    return ""
}

// 对象:object不实用，因为js中一切皆对象
let myObj: object;
myObj = function () {
}

// 常用这种方式表示一个对象
let myConent: {
    name: string,
    age: number
}

myConent = {
    name: "随悟空",
    age: 10
}


// 函数变量
let say: (name: string) => string;

say = function (name) {
    return `${name} 你好`
}


// 数组类型
let myArray: string[]
let g: Array<number>

// 元祖：固定长度数组，效率比数组好
let myTuple: [string, string, number]

myTuple = ["nihao", "zhongguo", 19]

//枚举类
enum Gender {
    male,
    female
}

let someMan: Gender;
someMan = 1;
console.log(Gender.female)

//type类型的别名:给myinfo定义为string类型
type myinfo = string;
let home: myinfo = "河南省洛阳市"
