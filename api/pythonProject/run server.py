import os
path = r"C:\Users\GIGABYTE-PC\Desktop\arj\pet projects\django sample\pythonProject\virtual\mysite"
print("cd " + path)
os.system("cd " + path)
os.system("python manage.py runserver 8080")


x = input()
while( x!= "X" ):
    x = input("hit X to break")
    
