const personList = ["wang", "si", "cong"]

personList.unshift("beijing")

console.log("personList----", personList);

// 必须为整数，如果后面没有，表示删除后面所有的
personList.splice(2, 1, "nihao", "lyoyang")

console.log("personList----", personList);
