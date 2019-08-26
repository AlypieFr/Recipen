from mongoengine import Document, EmbeddedDocument, StringField, DateTimeField, IntField, BooleanField, \
    EmbeddedDocumentListField, EmbeddedDocumentField
import datetime


class Ingredient(EmbeddedDocument):
    name = StringField(max_length=100, required=True)
    is_group_title = BooleanField(required=False, default=False)
    quantity = IntField(required=False)
    unit = StringField(max_length=100, required=False)
    level = IntField(default=0)


class Instruction(EmbeddedDocument):
    text_inst = StringField(required=True)
    level = IntField(default=0)


class Proposal(EmbeddedDocument):
    text_prop = StringField(required=True)


class Author(EmbeddedDocument):
    name = StringField(required=True)
    id = IntField(required=True)


class Category(EmbeddedDocument):
    name = StringField(required=True, choices=["Entrée", "Plat principal", "Dessert", "Accompagnements", "Base",
                                               "Biscuits & Friandises", "Pain & Viennoiserie", "Divers"])


class Recipe(Document):
    title = StringField(max_length=255, required=True)
    pub_date = DateTimeField(required=False, default=datetime.datetime.utcnow)
    last_modif = DateTimeField(required=False, default=datetime.datetime.utcnow)
    author = EmbeddedDocumentField(Author, required=True)
    description = StringField(required=True)
    ingredients = EmbeddedDocumentListField(Ingredient, required=True)
    instructions = EmbeddedDocumentListField(Instruction, required=True)
    proposals = EmbeddedDocumentListField(Proposal, required=False, default=[])
    excerpt = StringField(required=True)
    time_prep = IntField(required=True)
    time_cook = IntField(required=False)
    time_rest = IntField(required=False)
    picture_file = StringField(required=True)
    nb_people = IntField(required=True)
    nb_people_max = IntField(required=False)
    precision = StringField(max_length=150, required=False)
    enable_comments = BooleanField(required=False, default=True)
    published = BooleanField(required=False, default=False)
    slug = StringField(max_length=255, required=True, unique=True)
    heart_stroke = IntField(choices=[1, 2, 3], required=False)
    categories = EmbeddedDocumentListField(Category, required=True)

