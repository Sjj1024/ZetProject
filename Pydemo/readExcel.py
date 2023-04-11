import pandas as pd

res = pd.read_excel("D:\ZatProject\Something\Pydemo\\test2.xlsx")

newArrsy =  [[*i] for i in res.values]

df = pd.DataFrame(newArrsy, columns=["id", "name"])


df2 = res.append(df)


df2.to_excel("res.xlsx")