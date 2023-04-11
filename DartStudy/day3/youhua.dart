class Container {
  final int height = 0;
  final int width = 0;
  const Container(int height);
}

void main(List<String> args) {
  print("优化内存");
  const c1 = Container(1);
  const c2 = Container(1);
  print(identical(c1, c2));
  const c3 = const Container(5);
  var c4 = const Container(5);
  print(identical(c3, c4));
}