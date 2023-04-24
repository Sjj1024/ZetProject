abstract class Animal {
    name: string
    age: number

    constructor(name: string, age: number) {
        this.name = name
        this.age = age
    }

    sayHello() {
    }
}

class Cat extends Animal {
    play() {
        console.log("小猫在玩耍")
    }

    sayHello() {
        console.log("小猫在打招呼~")
    }
}


class Dog extends Animal {
    sayHello() {
        console.log("小狗在说话")
    }
}



const huahua = new Cat("花花",2)
huahua.sayHello()
huahua.play()

const wangcai = new Dog("旺财", 4)
wangcai.sayHello()
console.log(wangcai.name);


type play = (where:string) => void

const swing:play = function (wh){
    console.log(`一起去玩耍吧，去哪里呢？${wh}`)
}


swing("去游泳吧")
