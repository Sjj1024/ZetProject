(function(){
  console.log('立即执行函数');
  var btn = document.getElementById("save")
  console.log('btn----', btn);
  btn.addEventListener("click", (e)=>{
    console.log('存储数据');
  })
})()