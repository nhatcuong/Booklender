from flask import jsonify

def getData(req):
    if (len(req.form) == 0):
        return req.json
    return req.form

def getError(msg):
    return jsonify({"error": msg})


def getSuccess(msg):
    return jsonify({"success": msg})