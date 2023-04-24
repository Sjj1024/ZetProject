class Person {
    name: string = '猪八戒'
    age: number = 18
    eat(){
        console.log("猪八戒在吃饭了")
    }
    play(){
        console.log("猪八戒在玩耍了")
    }
}

// 创建一个猪八戒
const zhu = new Person()

zhu.eat()

zhu.play()
