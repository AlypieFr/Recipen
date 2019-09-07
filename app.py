#!/usr/bin/env python3

import json
import hashlib
from flask import Flask, render_template, request, jsonify, Response
from flask_mongoengine import MongoEngine
from settings import db_name, site_name, timezone, locale
from werkzeug.exceptions import NotFound
from mongoengine.errors import NotUniqueError
from flask_babel import Babel
from flask_babel import gettext as _
from jinja2 import ext

from mail import send_mail
from model.recipe import Recipe, Ingredient, Instruction, Category
from model.user import User


app = Flask(__name__)
app.config['MONGODB_DB'] = db_name
app.config['BABEL_DEFAULT_LOCALE'] = locale
app.config['BABEL_DEFAULT_TIMEZONE'] = timezone
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

@app.route('/panel')
def panel_home():
    return render_template("panel/basis.html", title=_("Panel") + " | " + site_name)


@app.route('/register', methods=['GET'])
def register_page():
    return render_template("web/register.html", title=_("Register") + " | " + site_name)


@app.route('/register', methods=['POST'])
def register():
    data = json.loads(request.data)
    if data["email"] is None or data["email"] == "" or data["password"] is None or data["password"] == ""\
            or data["name"] is None or data["name"] == "":
        return Response(json.dumps({"success": False, "message": _("Missing required fields")}), status=409)
    role = "basic"
    nb_user = User.objects().count()
    if nb_user == 0:
        role = "admin"
    user = User(name=data["name"], email=data["email"],
                password=hashlib.sha3_512(data["password"].encode()).hexdigest(), role=role, active=False)
    try:
        user.save()
        token = "?token=" + hashlib.md5((data["name"] + data["email"]).encode()).hexdigest() + "&mail=" + data["email"]
        send_mail(data["email"], f"{site_name} - " + _("please activate your account"),
                  _("Welcome %s,\n\nPlease click on this link to activate your account on %s:\n") %
                  (data["name"], site_name) + request.url_root + "activate" + token)
        return jsonify(success=True,
                       message=_("User successfully created. Please check your mail to validate your account."))
    except NotUniqueError:
        return Response(json.dumps({"success": False,
                                     "message": _("There is already a user with this mail address")}), status=409)


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
