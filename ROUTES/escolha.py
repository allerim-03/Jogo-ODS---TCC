from flask import Blueprint, render_template


escolha_bp = Blueprint('escolha', __name__)


@escolha_bp.route('/escolha')
def escolha():
    return render_template('escolha.html')