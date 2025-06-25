import smtplib
from email.message import EmailMessage
from lib.constants import EMAIL_ADDRESS,EMAIL_PASSWORD

def send_email(subject: str, body: str, to_email: str):
    try:
        sender_mail=EMAIL_ADDRESS
        sender_pass=EMAIL_PASSWORD
        msg=EmailMessage()

        msg['Subject']=subject
        msg['From']=sender_mail
        msg['To']=to_email
        msg.add_alternative(body, subtype="html")

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(sender_mail, sender_pass)
            smtp.send_message(msg)
        return True
    except Exception as e:
      print('An exception occurred',e)
      return False