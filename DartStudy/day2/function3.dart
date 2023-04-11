import 'React.dart';


void saveInfo(String name, {int age = 18, String sex = '女'}) {
  print("用户名:${name}, 年龄：${age}, 性别: ${sex}");
}



void main(List<String> args) {
  saveInfo("王思聪");

  React r = new React();
  r.isheight = 100;
  print(r.area);
} 
