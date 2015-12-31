import os
import logging

from flask import Flask
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
app.debug = True
app.config.from_object(Config())

db = SQLAlchemy(app)
import models

dbname = os.path.join(basedir, "booklender.db")
if not os.path.isfile(dbname):
    logger.info("create db file")
    db.create_all()  # all tables have been declared in models
    models.User.create_static(username="nhatcuong", password="secret_nhatcuong")
    models.User.create_static(username="thuypi", password="secret_thuypi")
    db.session.commit()


import services
