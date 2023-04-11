const res =[4,6,7]

// 下面的两种转换方法结果是:1,3,5,4,6,7。。。。。我也是无语死了，怎么会有这种bug
const str = String(res)
// const str = res.toString()
console.log('str', str);

// 只能用JSON转成json字符串了
const strJson = JSON.stringify(res)
console.log('strJson', strJson);

const obj = {a:1, b:2, c:3, d:{e:5, f:6}}
// 下面的两种转换方法结果是:[object Object]。。。。。我也是无语死了，怎么会有这种脑洞
// const objres = String(obj)
const objres = obj.toString()
console.log('objres', objres);

// 只能用JSON转成json字符串了：所以以后数组和对象转字符串，一定要用JSON
const objJson = JSON.stringify(obj)
console.log('objJson', objJson);