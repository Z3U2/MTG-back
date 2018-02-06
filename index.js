const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const sqlite = require('sqlite3').verbose();

let wrapPromise = new Promise(function(resolve, reject) {
  const db = new sqlite.Database('./db/test.db',(err)=>{
    if (err) {
      reject(err)
    }
    else {
      resolve(db)
    }
  })
});



let f = async () => {
  let db = await wrapPromise;
  const movieRouter = require('./routers/movies.js');
  const categoryRouter = require('./routers/categories.js');


  app.use(cors());
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
      extended: true
  }))

  app.use('/movies',movieRouter.start(db))
  app.use('/categories',categoryRouter.start(db))
  app.post('/new',async (req,res) => {
      try {
          res.send(await newEntry(req.body,db))

      }
      catch (e) {
          res.status(500).send(e)
      }

  })
  app.listen(3000)
  console.log("listen port 3000")
}
f();

async function newEntry(data,db) {
    let sql1 = "INSERT INTO movies(name,synopsis,trailer,image) VALUES ('"+data.title+"','"+data.synopsis+"','"+data.trailer+"','"+data.image+"') "
    let wrapPromise = new Promise(((resolve, reject) => {
        db.run(sql1,(err) => {
            if (err) {
                reject(err);
            }
            db.get('SELECT last_insert_rowid() as id',(err,row) => {
                if (err) {
                    reject(err)
                }
                let sql2 = "INSERT INTO movCat(movId,catId) VALUES " + data.categories.map(category => `('${row.id}','${category.id}')`).join(',')
                db.run(sql2,(err)=> {
                    if (err) {
                        reject(err)
                    }
                    resolve()
                })

            })
        })
    }))
    return wrapPromise
}