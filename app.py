#!/usr/bin/env python3

import json
import hashlib
from flask import Flask, render_template, request, jsonify, Response
from flask_mongoengine import MongoEngine
from settings import db_name, site_name, timezone, locale
from werkzeug.exceptions import NotFound
from flask_babel import Babel
from flask_babel import gettext as _
from jinja2 import ext

from view.register import page as register
from view.panel import page as panel

from mail import send_mail
from model.recipe import Recipe, Ingredient, Instruction, Category
from model.user import User


app = Flask(__name__)
app.config['MONGODB_DB'] = db_name
app.config['BABEL_DEFAULT_LOCALE'] = locale
app.config['BABEL_DEFAULT_TIMEZONE'] = timezone
app.register_blueprint(register)
app.register_blueprint(panel)
babel = Babel(app)
db = MongoEngine(app)


@app.context_processor
def inject_default_data():
    return dict({
        "locale": locale,
        "locales": [locale],
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
    return render_template("web/basisnav.html", title=_("Panel") + " | " + site_name)


@app.route('/login', methods=["GET", "POST"])
def login():
    if request.method == 'GET':
        email = ""
        after = "/"
        if "email" in request.args and request.args.get("email") is not None:
            email = request.args.get("email")
        if "after" in request.args and request.args.get("after") is not None:
            after = request.args.get("after")
        return render_template("web/login.html", email=email, after=after, title=_("Login") + " | " + site_name)


@app.errorhandler(NotFound)
def error_handle_not_found(e):
    return render_template("404.html", title=site_name)


if __name__ == "__main__":
    app.run(use_debugger=True, use_reloader=True)
