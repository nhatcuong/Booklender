import os
import logging

from flask import Flask
import flask
from flask_sqlalchemy import SQLAlchemy

basedir = os.path.dirname(os.path.abspath(os.path.dirname(__file__)))


def get_logger():
    logger = logging.getLogger("BookLender")
    log_formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(log_formatter)
    logger.addHandler(console_handler)
    return logger


logger = get_logger()


class Config(object):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'booklender.db')


app = Flask(__name__, static_folder=os.path.join(basedir, "static"))
app.config.from_object(Config())

db = SQLAlchemy(app)

import shelf.models
dbname = os.path.join(basedir, "booklender.db")
if not os.path.isfile(dbname):
    logger.info("create db file")
    db.create_all() #all tables have been declared in models

import shelf.services
@app.route('/')
def redirect_to_homepage():
    # return flask.render_template(flask.url_for('static', filename="index.html"))
    return app.send_static_file('lendingpage/lendingpage.html')

if __name__ == '__main__':
    app.run()
