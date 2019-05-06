'''file to swap courses for ssw 690 project'''
import os
import mysql
import mysql.connector
import MySQLdb


db = mysql.connector.connect(
    host = "mallard.stevens.edu",
    user     = "dbobadilla",
    password = "2019admin",
    database = "scheduling"
)

query_studentcourses="select * from studentcourses;"
query_exchangecollection="select * from exchangecollection"

cursor = db.cursor()

cursor.execute(query_exchangecollection)
myresult=cursor.fetchall()
cursor.execute(query_studentcourses)
myresult2=cursor.fetchall()



def course_check():
    for i in myresult:
        for j in myresult:
            if i[2]==j[3] and i[3]==j[2]:
                student1=i[1]
                student2=j[1]
                student1_give=i[2]
                student2_give=j[2]

                del_sql="DELETE FROM exchangecollection WHERE student_id = '{}' and ex_g_course_id ='{}' and ex_w_course_id = '{}';".format(i[1],i[2],j[2])
                cursor.execute(del_sql)
                del_sql2="DELETE FROM exchangecollection WHERE student_id = '{}' and ex_g_course_id ='{}'and ex_w_course_id = '{}' ;".format(j[1],j[2],i[2])
                cursor.execute(del_sql2)
                db.commit()
                return [student1, student2, student1_give, student2_give]

ret=course_check()

try:
    q1=f'''Update studentcourses SET course_id="{ret[3]}" where student_id="{ret[0]}" and course_id="{ret[2]}"; '''
    q2=f'''Update studentcourses SET course_id="{ret[2]}" where student_id="{ret[1]}" and course_id="{ret[3]}"; '''
    cursor.execute(q1)
    cursor.execute(q2)
    #print(f"sucessfully swapped matched values from user '{ret[0]}' and user '{ret[1]}' values")
except:
    print("NO MATCHING VAlUES to SWAP")
    exit()


query_get_studentemail1=f'''select given_name,email from students where student_id = '{ret[0]}'; '''
query_get_studentemail2=f'''select given_name,email from students where student_id = '{ret[1]}'; '''

cursor.execute(query_get_studentemail1)
myresult3=cursor.fetchall()

cursor.execute(query_get_studentemail2)
myresult4=cursor.fetchall()


msg=f"course {ret[2]} swapped with {ret[3]} sucessfully!"
msg2=f"course {ret[3]} swapped with {ret[2]} sucessfully!"

for i in myresult3:
    for j in myresult4:
        notification1=f"insert into notification values('{ret[0]}', '{i[0]}', '{i[1]}','{msg}');"
        print(notification1)
        cursor.execute(notification1)

        notification2=f"insert into notification values('{ret[1]}', '{j[0]}', '{j[1]}', '{msg2}');"
        print(notification2)
        cursor.execute(notification2)
        
        db.commit()