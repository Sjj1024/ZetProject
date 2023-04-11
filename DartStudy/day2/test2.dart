
// 定义一个抽象类或者接口
abstract class Animal{
  // 定义一个抽象方法，没有实现方法体的方法就是抽象方法
  eat();
  play();
}

class Dog implements Animal{
  @override
  eat() {
    print("小狗会吃肉");
  }

  @override
  play() {
    print("小狗会自己玩耍");
  }

  wang(){
    print("汪汪叫");
  }
}


void main(List<String> args) {
  print("开始学习dart");
  Animal d = new Dog();
  d.eat();
  // d没有wang，因为此时d是Animal的一个实例，不是Dog
  // d.wang()

  var l1 = ["1", "b", "c"];
  print(l1);
  var l2 = l1;
  l2.add("444");
  print(l1);

  // set集合
  var s1 = {"a", "b"};
  s1.add("c");
  s1.add("c");
  print(s1);
  var l3 = s1.toList();
  print(l3);

  // map字典
  var m1 = {"a":1, "b":2};
  m1.addAll({"c": 3});
  print(m1);
  print(m1['e']);

  // 遍历
  m1.forEach((key, value) {
    print("${key}--${value}");
  });
}