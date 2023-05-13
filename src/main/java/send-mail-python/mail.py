import os, sys
from email.message import EmailMessage
import ssl
import smtplib

def send_mail(email_receiver, room, reservation_date, reservation_time):
    email_sender = 'dum4378my@gmail.com'
    email_password = 'kpibzzfsuuwoqhiv'
    email_start = "We would like to inform you that "
    email_end =  "room " + room + " is now available on " + reservation_date + ", " + reservation_time +'.\nBest Regards' 
    subject = 'Reservation Update'
    body = email_start + email_end
    em = EmailMessage()
    em['From'] = email_sender
    em['To'] = email_receiver
    em['Subject'] = subject
    em.set_content(body)

    context = ssl.create_default_context()

    with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
        smtp.login(email_sender, email_password)
        smtp.sendmail(email_sender, email_receiver, em.as_string()) 


send_mail(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])