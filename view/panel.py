from flask import Blueprint, render_template, session, redirect, flash, url_for, request, Response
from flask_babel import gettext as _

from settings import SITE_NAME

page = Blueprint('panel', __name__)


@page.before_request
def before_request():
    if "is_authenticated" not in session or session["is_authenticated"] is None or not session["is_authenticated"]:
        if "application/json" in dict(request.accept_mimetypes):
            return Response(response={"success": False, "message": _("Not authenticated")}, status=403,
                            mimetype="application/json")
        flash("error|" + _("Please login to continue"))
        return redirect(url_for("login", after=request.full_path, email=session["email"] if "email" in session else ""))


@page.route('/panel')
def panel_home():
    return render_template("panel/basis.html", title=_("Panel") + " | " + SITE_NAME)
