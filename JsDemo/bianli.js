const testArray = ["a", "b", "c", "d"]
const tesObj = {
  name: "aaa",
  age: "bbb",
  home: "ccc",
  city: "ddd"
}

console.log('testArray用for in 得到的值是：');
for (const key in testArray) {
  if (Object.hasOwnProperty.call(testArray, key)) {
    const element = testArray[key];
    console.log('得到的key-val是:', key, element);
  }
}

console.log('tesObj用for in 得到的值是：');
for (const key in tesObj) {
  if (Object.hasOwnProperty.call(tesObj, key)) {
    const element = tesObj[key];
    console.log('得到的key-val是:', key, element);
  }
}