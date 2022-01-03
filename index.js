let express = require("express")
var cors = require('cors');
let app = express()
const port = 3001

app.use(cors())
app.use(express.json())

app.set('case sensitive routing', true);

const { Client } = require('pg')
const client = new Client({
    password: "example",
    user: "postgres",
    host: "192.168.178.51" //your local IP
})
client.connect()

app.get('/api/get', (req, res) => {
    console.log("hi")
    client.query("SELECT short_uri, destination_url, case_sensitive FROM links;", (err, result) => {
        res.status(200).json(result.rows)
    })
})

app.post('/api/add', (req, res) => {
    console.log("new hi")
    console.log(req.body)
    client.query(`INSERT INTO links (short_uri, destination_url, case_sensitive) VALUES ('${req.body.short}', '${req.body.target}', '${req.body.caseSensitive}')`, (err, result) => {
        if (!err) {
            console.log("ok")
            res.sendStatus(200)
        } else {
            console.log("err: " + err)
            res.sendStatus(500)
        }
    })
})

app.post('/api/delete', (req, res) => {
    console.log("remove hi")
    console.log(req.body)
    client.query(`DELETE FROM links WHERE short_uri = '${req.body.short}';`, (err, result) => {
        if (!err) {
            console.log("ok")
            res.sendStatus(200)
        } else {
            console.log("err: " + err)
            res.sendStatus(500)
        }
    })
})

app.post('/api/edit', (req, res) => {
    console.log("edit hi")
    console.log(req.body)
    client.query(`UPDATE links SET short_uri = '${req.body.short}', destination_url = '${req.body.target}', case_sensitive = '${req.body.caseSensitive}' WHERE short_uri = '${req.body.oldShort}';`, (err, result) => {
        if (!err) {
            console.log("ok")
            res.sendStatus(200)
        } else {
            console.log("err: " + err)
            res.sendStatus(500)
        }
    })
})

app.get('/*', (req, res) => {
    console.log(req.path)
    client.query(`SELECT destination_url, case_sensitive, short_uri FROM links WHERE LOWER(short_uri) = LOWER('${req.path.substring(1)}');`, (err, result) => {
        if (result.rows.length == 0) {
            console.log(`path: ${req.path} redirect to: 404`)
            res.status(404).send()
        } else {
            if (result.rows[0]["case_sensitive"] && (result.rows[0]["short_uri"] != req.path.substring(1))) {
                console.log(`path: ${req.path} redirect to: 404`)
                res.status(404).send()
            } else {
                console.log(`path: ${req.path} redirect to: ${result.rows[0]["destination_url"]}`)
                res.redirect(result.rows[0]["destination_url"])
            }
        }
    })
})

app.listen(port, () => {
    console.log(`App listening at http://192.168.178.51:${port}`)
})

console.log("hi")