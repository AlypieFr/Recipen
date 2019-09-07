from flask import Blueprint, render_template
from flask_babel import gettext as _

from settings import site_name

page = Blueprint('panel', __name__)


@page.route('/panel')
def panel_home():
    return render_template("panel/basis.html", title=_("Panel") + " | " + site_name)