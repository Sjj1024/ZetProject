
import 'package:http/http.dart' as http;

void main(List<String> arguments) async {
  // This example uses the Google Books API to search for books about http.
  // https://developers.google.com/books/docs/overview
  var url = Uri.https('www.pub.dev', "/packages/http/example");

  // Await the http get response, then decode the json-formatted response.
  var response = await http.get(url);
  if (response.statusCode == 200) {
    print('Number of books about http: ${response.body}');
  } else {
    print('Request failed with status: ${response.statusCode}.');
  }
}