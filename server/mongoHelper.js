const { MongoClient } = require('mongodb')

const uri = 'mongodb://admin:admin@localhost:27017/?authSource=admin'
const client = new MongoClient(uri);

export async function writeNote(record) {

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

