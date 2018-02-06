const express = require('express');
const categoryRouter = express.Router();



module.exports = {
  start :  (db) => {

    categoryRouter.get('/',async (req,res,next)=>{
      try {
        res.json(await getCategories())
      }
      catch(e){
        res.status(500).send(e)
      }
    })

    categoryRouter.get('/:id',async (rea,res,next)=>{
      try {
        res.json(await getCategorie(id))
      }
      catch(e){
        res.status(500).send(e)
      }
    })

    async function getCategories(page){
      let sql = `SELECT * FROM categories ORDER BY category ` + (page === undefined ? "" : `LIMIT 9 OFFSET ${(page-1)*9}`) ;
      let params = [];
      let wrapPromise = new Promise((resolve,reject) => {
        db.all(sql,params,(err,rows)=>{
          if (err) {
            reject(err)
          }
          resolve(rows)
        })
      })
      return wrapPromise;
    }

    async function getCategorie(id){
      let sql = `SELECT * FROM categories WHERE id = ${id}`;
      let params = [];
      let wrapPromise = new Promise((resolve,reject) => {
        db.get(sql,params,(err,row)=>{
          if (err) {
            reject(err)
          }
          resolve(row)
        })
      })
      return wrapPromise;
    }

    return categoryRouter;
  }
};
