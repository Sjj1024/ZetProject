function greet(){
  var promise = new Promise(function(resolve,reject){
      var greet = "hello  world";
      // promise里面的代码是同步的，then里面的才是异步的
      console.log('greet------', greet);
      resolve(greet);
  });
  return promise;
  }

// 同步代码
console.log('p----', 111111);

var p = greet().then(v=>{
  // 这里面的才是异步代码
console.log("v------", v);
})

// 这是宏任务
console.log("p-----", p);
  