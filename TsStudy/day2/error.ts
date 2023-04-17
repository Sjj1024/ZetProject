export const name: string = "随悟空"

function play(some: any) {
    return "你好"
}

const btn = document.getElementById("btn");
if (btn) {
    btn.onclick = function () {
        console.log("按钮点击了")
    }
}

// 枚举类型
enum Grand {
    first,
    second,
    thread,
    three
}

let person:Grand = Grand.first;

console.log(person)


