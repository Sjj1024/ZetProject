// 动态初始化Obj对象
const key = "home"

// 直接使用key会导致结果变成key：{ key: '洛阳' }
const fields = { key: "洛阳" }
console.log("组装后的fields对象是:", fields)

// 所以要想使用key，就要使用[]包括
const forms = { [key]: "洛阳" }
console.log('组装后的forms对象是', forms);


const loginObj = {name:"wang", age: 19, home:"luouahg"}
console.log('对象的所有key是:', Object.keys(loginObj));
console.log('对象的所有key是:', loginObj.keys);

// 给对象添加新属性
loginObj.city = "广州"
console.log('loginObj---', Object.keys(loginObj));
console.log('loginObj---', loginObj);