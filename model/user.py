from mongoengine import Document, StringField, DateTimeField, IntField, BooleanField
import datetime


class User(Document):
    name = StringField(required=True)
    password = StringField(required=True)
    email = StringField(required=True, unique=True)
    date_creation = DateTimeField(required=False, default=datetime.datetime.utcnow, null=False)
    date_last_connexion = DateTimeField(required=False, null=True)
    role = StringField(required=True, choices=["admin", "editor", "moderator", "basic"])
    active = BooleanField(required=False, default=False)
    enabled = BooleanField(required=False, default=True)
