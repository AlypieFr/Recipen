#!/usr/bin/env python3

import json
import hashlib
from flask import Flask, render_template, request, jsonify, Response
from flask_mongoengine import MongoEngine
from flask_bcrypt import Bcrypt
from settings import DB_NAME, SITE_NAME, TIMEZONE, LOCALE
from werkzeug.exceptions import NotFound
from flask_babel import Babel
from flask_babel import gettext as _
from jinja2 import ext

from view.register import page as register
from view.panel import page as panel

from settings import SECRET_KEY

from mail import send_mail
from model.recipe import Recipe, Ingredient, Instruction, Category
from model.user import User


app = Flask(__name__)
app.config['MONGODB_DB'] = DB_NAME
app.config['BABEL_DEFAULT_LOCALE'] = LOCALE
app.config['BABEL_DEFAULT_TIMEZONE'] = TIMEZONE
app.register_blueprint(register)
app.register_blueprint(panel)
app.secret_key = SECRET_KEY
babel = Babel(app)
db = MongoEngine(app)
crypt = Bcrypt(app)


@app.context_processor
def inject_default_data():
    return dict({
        "locale": LOCALE,
        "locales": [LOCALE],
    })


@app.route('/')
def home():
    # recipe = Recipe(title="Première recette de test",
    #                 description="Ma description trop bien",
    #                 ingredients=[{"name": "premier ingrédient"}, {"name": "second ingrédient", "quantity": 2, "unit": "g"}],
    #                 instructions=[{"text_inst": "Faire ça"}, {"text_inst": "Puis ensuite faire ça", "level": 1}],
    #                 excerpt="Aaaaaah!!!",
    #                 time_prep=60,
    #                 picture_file="mapremiererecette.jpg",
    #                 nb_people=2,
    #                 slug="premiere_recette_de_test",
    #                 categories=[{"name": "Plat principal"}, {"name": "Entrée"}],
    #                 author={"name": "Floréal", "id": "1"})
    # recipe.save()
    return render_template("web/basisnav.html", title=_("Panel") + " | " + SITE_NAME)


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == 'GET':
        email = ""
        after = "/"
        if "email" in request.args and request.args.get("email") is not None:
            email = request.args.get("email")
        if "after" in request.args and request.args.get("after") is not None:
            after = request.args.get("after")
        return render_template("web/login.html", email=email, after=after, title=_("Login") + " | " + SITE_NAME)


@app.errorhandler(NotFound)
def error_handle_not_found(e):
    return render_template("404.html", title=SITE_NAME)


if __name__ == "__main__":
    app.run(use_debugger=True, use_reloader=True)
