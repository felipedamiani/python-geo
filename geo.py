import bottle
import math
from bottle import Bottle, request, response, run, route, template
from pymongo import MongoClient, GEO2D
from bson.json_util import dumps
from bson.son import SON

class EnableCors(object):
    name = 'enable_cors'
    api = 2

    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

            if bottle.request.method != 'OPTIONS':
                return fn(*args, **kwargs)

        return _enable_cors

app = bottle.app()
app.install(EnableCors())

client = MongoClient("mongodb://localhost:27017")
db = client.mydb
co = db.places

@app.route('/', method='GET')
def index():
    return dumps({"server":"OK"})

@app.route('/places/name/<name>', method='GET')
def listByName(name):
    response.content_type = 'application/json'
    return dumps(co.find({'placename':name}))

@app.route('/places/cep/<cep>', method='GET')
def listByCep(cep):
    response.content_type = 'application/json'
    return dumps(co.find({'endereco.cep':cep}))

@app.route('/places/near/<lat>/<lng>/<distance>', method='GET')
def listNear(lat, lng, distance):
    return dumps(
        db.command(
            SON([
                ('geoNear', 'places'),
                ('near', [float(lat), float(lng)]),
                ('spherical', 'true'),
                ('maxDistance', ((float(distance) * 0.000621371) / 3963.2)),
                ('distanceMultiplier', 6378.1)
            ])
        )
    )

run(host='localhost', port=8080)
