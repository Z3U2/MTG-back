const express = require('express');
const movieRouter = express.Router();




module.exports = {
  start : (db) => {
    console.log(db);
    movieRouter.get('/',async (req,res,next)=>{
      try {
        res.json(await getMovies())
      } catch (e) {
        res.status(500).send(e);
      }
    })

    movieRouter.get('/search',async (req,res,next)=>{
        let params = req.query
        try {
          res.json(await search(params))
        }
        catch (e){
          res.status(500).send(e)
        }
    })

    movieRouter.get('/pageNumber',async (req,res,next)=>{
      try {
        res.json(await pages())
      }
      catch(e){
        res.status(500).send(e)
      }
    })

    movieRouter.get('/page/:id',async (req,res,next)=> {
      let page = req.params.id;
      try {
        res.json(await getMovies(page))
      }
      catch (e) {
        res.status(500).send(e)
      }
    })

    movieRouter.get('/:id',async (req,res,next)=>{
      let id = req.params.id;
      try {
        res.json(await getMovie(id))
      } catch (e) {
        res.status(500).send(e)
      }
    })

    async function getMovies(page){
      let sql = `SELECT id,name,synopsis,image FROM movies ORDER BY name ` + (page === undefined ? "" : `LIMIT 9 OFFSET ${(page-1)*9}`) ;
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

    async function getMovie(id){
      let sql = `SELECT * FROM movies WHERE id = ${id}`;
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

    async function search(params = {}){
      toString = (x) => {
        let res;
        for (v of x) {
            res += `'${v}', `
        }
        res = res.slice(0,-2);
        return res;
      }
        let sql = `SELECT * FROM movies ` + (params.category === undefined ? "" : `JOIN movCat ON movies.id = movCat.movId WHERE movCat.catId=${params.category}`) + (params.name === undefined ? "" : `WHERE name LIKE '%${params.name}%' ` )+(params.all == undefined ? "LIMIT 5" : "");
      console.log(sql);
      let p = [];
      let wrapPromise = new Promise((resolve,reject) => {
        db.all(sql,p,(err,rows)=>{
          if (err) {
            reject(err)
          }
          resolve(rows)
        })
      })
      return wrapPromise;
    }

    async function pages(){
      let sql = `SELECT COUNT(id) FROM movies`
      let p = [];
      let wrapPromise = new Promise(function(resolve, reject) {
        db.get(sql,p,(err,row)=>{
          if (err) {
            reject(err);
          }
          else {
            resolve(row)
          }
        })
      });
      return wrapPromise;
    }

    return movieRouter;
  }
};
