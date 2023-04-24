var Person = /** @class */ (function () {
    function Person(name, age) {
        this.name = '猪八戒';
        this.city = '河南省';
        this.name = name;
        this.age = age;
    }
    Person.home = '洛阳';
    return Person;
}());
var sun = new Person("王思聪", 19);
console.log(sun);
console.log(Person.home);
Person.home = "上海市";
console.log(Person.home);
//只读属性不允许修改
console.log(sun.city);
var wang = new Person("王健林", 10);
console.log(wang);
