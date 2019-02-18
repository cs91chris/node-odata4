const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
const ODataServer = require('simple-odata-server')
const Adapter = require('simple-odata-server-mongodb')


const mongoHost = process.env.MONGO_HOST || "127.0.0.1"
const mongoPort = process.env.MONGO_PORT || "27017"
const mongoDB = process.env.MONGO_DATABASE || "odata"

const SERVER = {
    port: 1338
}

const MONGO = {
    host: "mongodb://" + mongoHost + ":" + mongoPort,
    database: mongoDB,
    options: {
        useNewUrlParser: true
    }
}


const app = express()

app.use(cors())
app.use(bodyParser.json())


app.post("/model", function(req, res) {
    let model = req.body
    let odataServer = ODataServer().model(model)

    MongoClient.connect(MONGO.host, MONGO.options, function(err, db) {
        if(err) {
            console.log(err)

            res.status(503).json({
                error: {
                    code: 503,
                    message: err
                }
            }).end()
	}
        else {
            odataServer.adapter(
                Adapter(function(cb) {
    	            cb(err, db.db(MONGO.database))
                })
            )

            app.use("/" + model.namespace, function(req, res) {
                odataServer.handle(req, res)
            })

            res.status(201).json({
		success: {
                    message: "successfully created",
                    namespace: "/" + model.namespace
                }
            }).end()
        }
    })
})

app.listen(SERVER.port, function() {
    console.log("Server running at http://127.0.0.1:" + SERVER.port + "/")
})

