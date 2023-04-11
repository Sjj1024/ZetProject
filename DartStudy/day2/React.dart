class React{
  num height = 1;
  num width = 10;

  React(){
    print("初始化构造函数");
  }

  get area{
    return this.height * this.width;
  }

  set isheight(val){
    this.height = val;
  }
}