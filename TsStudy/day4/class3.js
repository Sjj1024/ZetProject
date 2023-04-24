var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Animal = /** @class */ (function () {
    function Animal(name, age) {
        this.name = name;
        this.age = age;
    }
    Animal.prototype.sayHello = function () {
    };
    return Animal;
}());
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Cat.prototype.play = function () {
        console.log("小猫在玩耍");
    };
    Cat.prototype.sayHello = function () {
        console.log("小猫在打招呼~");
    };
    return Cat;
}(Animal));
var Dog = /** @class */ (function (_super) {
    __extends(Dog, _super);
    function Dog() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Dog.prototype.sayHello = function () {
        console.log("小狗在说话");
    };
    return Dog;
}(Animal));
var huahua = new Cat("花花", 2);
huahua.sayHello();
huahua.play();
var wangcai = new Dog("旺财", 4);
wangcai.sayHello();
console.log(wangcai.name);
var swing = function (wh) {
    console.log("\u4E00\u8D77\u53BB\u73A9\u800D\u5427\uFF0C\u53BB\u54EA\u91CC\u5462\uFF1F".concat(wh));
};
swing("去游泳吧");
