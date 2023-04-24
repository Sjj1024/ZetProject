var Person = /** @class */ (function () {
    function Person() {
        this.name = '猪八戒';
        this.age = 18;
    }
    Person.prototype.eat = function () {
        console.log("猪八戒在吃饭了");
    };
    Person.prototype.play = function () {
        console.log("猪八戒在玩耍了");
    };
    return Person;
}());
// 创建一个猪八戒
var zhu = new Person();
zhu.eat();
zhu.play();
