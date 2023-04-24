const response:string = "{\"code\":200,\"content\":\"编码内容\"}"


type gitRes = {
    code: number,
    content: string
}


interface gitResponse {
    code: number,
    msg: string
}

interface gitResponse {
    content: string
}


const res1: gitRes = {
    code: 100,
    content: "sdfasssdfsfasdfsfd"
}

const res2: gitResponse = {
    code: 200,
    msg: "success",
    content: "编码内容"
}

console.log(res1)

console.log(res2)

console.log(JSON.stringify(res2))

const res3:gitResponse = JSON.parse(response)
console.log(res3)


// 使用接口来规范类的定义
class GitResponse implements gitResponse{
    code: number;
    content: string;
    msg: string;
    constructor(code:number, content:string, msg:string) {
        this.code = code
        this.content = content
        this.msg = msg
    }
}


const response1:GitResponse = new GitResponse(200, "编码内容", 'success')

console.log(response1)
