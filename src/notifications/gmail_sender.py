import smtplib
from email.mime.text import MIMEText
from src.config import GMAIL_ADDRESS, GMAIL_APP_PASSWORD


class GmailSender:
    def __init__(self, user_login: str, user_password: str):
        self.sender: str = GMAIL_ADDRESS
        self.password: str = GMAIL_APP_PASSWORD
        self.user_login = user_login
        self.user_password = user_password

    def send_reg_email(self, recipient: str):
        message = f"""
        Вы были успешно зарегестрированны на сервисе Meet-Tracker\n
        Ваш логин для входа:{self.user_login}\n
        Ваш пароль для входа:{self.user_password}\n
        """
        msg = MIMEText(message)
        msg["Subject"] = "Регистрация на MeetTracker"
        msg["From"] = self.sender
        msg["To"] = recipient
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp_server:
            smtp_server.login(self.sender, self.password)
            smtp_server.sendmail(self.sender, recipient, msg.as_string())
        return "Email sent!"
