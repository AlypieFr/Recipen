from mongoengine import Document, StringField, DateTimeField, IntField
import datetime


class User(Document):
    id = IntField(primary_key=True)
    username = StringField(required=True)
    password = StringField(required=True)
    email = StringField(required=True)
    date_creation = DateTimeField(required=True, default=datetime.datetime.utcnow)
    date_last_connexion = DateTimeField(required=False, null=True)
    role = StringField(required=True, choices=["admin", "editor", "moderator", "basic"])
