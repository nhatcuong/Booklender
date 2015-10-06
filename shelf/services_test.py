import unittest

import requests

import random

import string

prefix = 'http://127.0.0.1:5000/'


class BookTest(unittest.TestCase):
    def testCreateBook(self):
        r = requests.post(prefix + "book/create", data={
            "title": "",
            "author": "Kiran Desai"
        })
        assert r.status_code == 401
        r = requests.post(prefix + "book/create", data={
            "title": "The Heritage Of Loss",
            "author": "Kiran Desai"
        })
        assert r.status_code == 201

    def testGetAllBook(self):
        r = requests.post(prefix + "book/all")
        assert r.json()["books"] is not None
        bookNumber0 = len(r.json()["books"])
        r = requests.post(prefix + "book/create", data={
            "title": randomStringOfLen(10),
            "author": randomStringOfLen(10)
        })
        r = requests.post(prefix + "book/all")
        assert r.json()["books"] is not None
        assert len(r.json()["books"]) == bookNumber0 + 1;


def randomStringOfLen(l):
    return ''.join(random.choice(string.ascii_lowercase) for i in range(l))
