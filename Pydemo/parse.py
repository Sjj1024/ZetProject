import requests
import json

url = "http://localhost:8028/fedx-api/psi/add"

for i in range(10, 20):
    name = str(i*7)
    params = {"projectId": "6363957506556825600", "psiName": name, "psiSummary": "222222", "psiType": "RSA",
              "localDataSetId": "6363958205344649216", "selfid": "id", "remoteDataSetId": ["6363958773572177920"],
              "psiResultName": "2222", "psiResultSummary": "22222", "onlyId": False}
    payload = json.dumps(params)
    headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,zh-HK;q=0.8,zh-TW;q=0.7',
        'Authorization': 'Fedx eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbi1bUk9MRV9BRE1JTiwgQVVUSF9XUklURSwgVVNFUklEXzEsIFVOSVFVRV82MzY3OTc2NzgzMjIzOTg0MTI4XSIsImlhdCI6MTY2ODM5NTk2OCwiZXhwIjoxNjY4NDgyMzY4fQ.FuecN-nDXgkParVPHvHxzcIbxSAYe4vBwWPQEKYLDwFb5peIYvwW08K_Mdh5YBCpq4XgR9TaWUNN6KGCKj1TfQ',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json;charset=UTF-8',
        'Cookie': 'isOpenMenuStatus=1; sidebarStatus=1; sessionToken=dc712b12f699b87694fbd2c2970d34fa',
        'Origin': 'http://localhost:8028',
        'Referer': 'http://localhost:8028/pj/detail/6363957506556825600',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)
