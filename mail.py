# import necessary packages

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from settings import MAIL
import smtplib


def send_mail(to, subject, message):
    # create message object instance
    msg = MIMEMultipart()

    # setup the parameters of the message
    msg['From'] = MAIL["from"]
    msg['To'] = to
    msg['Subject'] = subject

    # add in the message body
    msg.attach(MIMEText(message, 'plain'))

    # create server
    server = smtplib.SMTP(f'{MAIL["server"]}: {MAIL["port"]}')

    server.starttls()

    # Login Credentials for sending the mail
    server.login(MAIL["username"], MAIL["password"])

    # send the message via the server.
    server.sendmail(msg['From'], msg['To'], msg.as_string())

    server.quit()

    print("successfully sent email to: %s" % (msg['To']))
