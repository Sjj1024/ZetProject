class Person {
    name: string = '猪八戒'
    age: number
    static home:string = '洛阳'
    readonly city:string = '河南省'
    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }
}

// 创建一个猪八戒
const zhu = new Person("猪八戒", 18)

const sun = new Person("王思聪", 19)
console.log(sun)
console.log(Person.home)
Person.home = "上海市"
console.log(Person.home)
//只读属性不允许修改
console.log(sun.city)
const wang = new Person("王健林", 10)
console.log(wang)
