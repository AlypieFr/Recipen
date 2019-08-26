#!/usr/bin/env python3

from flask import Flask, render_template
from flask_mongoengine import MongoEngine
from settings import db_name, site_name, timezone, locale
from werkzeug.exceptions import NotFound
from flask_babel import Babel
# from flask.ext.babel import gettext
from jinja2 import ext
from model.recipe import Recipe, Ingredient, Instruction, Category


app = Flask(__name__)
app.config['MONGODB_DB'] = db_name
app.config['BABEL_DEFAULT_LOCALE'] = locale
app.config['BABEL_DEFAULT_TIMEZONE'] = timezone
babel = Babel(app)
db = MongoEngine(app)


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
    return render_template("web/basis.html", title="Panel | " + site_name)

@app.route('/panel')
def panel_home():
    return render_template("panel/basis.html", title="Panel | " + site_name)


@app.errorhandler(NotFound)
def error_handle_not_found(e):
    return render_template("404.html", title=site_name)


if __name__ == "__main__":
    app.run(use_debugger=True, use_reloader=True)
