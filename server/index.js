

const express = require('express')
const bodyParser = require('body-parser')

//const writeNote = require('./mongoHelper.js')

const { MongoClient } = require('mongodb')
const uri = 'mongodb://admin:admin@localhost:27017/?authSource=admin'
const client = new MongoClient(uri);


async function writeNote(record) {

  try {
    await client.connect();

    // database: note-tracker
    let db = client.db('note-tracker')

    // hardcoding to always use this 'document' id
    let filter = {
      _id: 1
    }

    let update = {
      $set: record
    }

    let options = {
      upsert: true
    }

    // collection: records
    const res = await db.collection('records').updateOne(filter, update, options)

    console.log(`mongodb res: ${JSON.stringify(res)}`)

  } catch (e) {
    console.error(`mongodb error: ${e}`);
  } finally {
    //await client.close();
  }
}


const app = express()

app.use(bodyParser.json())

// cors: application-level middleware
app.use((req, res, next) => {
  const allowedOrigins = ['http://127.0.0.1:8080', 'http://localhost:8080']
  const origin = req.headers.origin

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
  }
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', true)
  return next()
})

app.get('/tags', (req, res) => {
  res
    .header("Content-Type", 'application/json')
    .send(JSON.stringify(tags, null, 4))
    .end()
})

app.post('/tags', (req, res) => {
  writeNote(
    {
      _id: 1,
      tags: req.body
    }
  )
  res.sendStatus(200);
})

app.get('/notes', (req, res) => {
  res
    .header("Content-Type", 'application/json')
    .send(JSON.stringify(notes, null, 4))
    .end()
})

app.post('/notes', (req, res) => {
  writeNote(
    {
      _id: 1,
      notes: req.body
    }
  )

  res.sendStatus(200)
})

// Start the server
const PORT = 8090
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
  console.log('Press Ctrl+C to quit.')
})