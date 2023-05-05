interface content {
    code:number,
    content:string,
    url:string
}


const response:content = {
    code:100,
    content: "1ni",
    url:""
}


class MyRes implements content{
    code: number;
    content: string;
    url: string;
    constructor(code:number, content:string, url:string) {
        this.code = code
        this.content =content
        this.url = url
    }
}


const res:content = JSON.parse("{ \"code\": 200, \"content\": \"编码内容\",\"url\": \"urllurljrljl\", \"msg\": \"success\" }")
console.log("JSON后的res对象是:", res)

console.log(res.content)
