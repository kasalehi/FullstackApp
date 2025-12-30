import express from 'express'
import axios from 'axios'
import pg from 'pg'

const app=express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

const db= new pg.Client({
    host:"localhost",
    user:"postgres",
    password:"root",
    database:"Data",
    port:5433,
});

db.connect();






app.get('/', async (req, res)=>{
    const databs=await db.query("select * from capitals");
    const data= databs.rows
    res.render('index.ejs', {data}) 
})

app.get('/new',(req, res)=>{
    res.render('form.ejs')
})

app.get('/edit/:id', async (req, res)=>{
    const id= Number(req.params.id);
    const databs=await db.query(`select * from capitals where id=${id}`);

    res.render('form.ejs', {data:databs.rows[0]})
    
});

app.post('/edit/:id',async(req, res)=>{
    const id= Number(req.params.id);
    const {country, capital} = req.body;
    await db.query(`UPDATE capitals
       SET country = $1, capital = $2
       WHERE id = $3`,
      [country, capital, id])
    res.redirect('/')
    console.log('data is updated')
})




app.post('/submit',async(req, res)=>{
    await db.query("insert into capitals(id, country, capital) values($1, $2, $3)",[req.body.id,req.body.country, req.body.capital])
    res.redirect('/')
    console.log('data is added')
})

app.get('/edit/')



app.get('/del/:id', async(req, res)=>{
    const id= 
    req.params.id;
    const data= await db.query(`delete from capitals where id=${id}`);
    res.redirect('/')

})





app.listen(port, ()=>{
    console.log(`the app is running pn port ${port}...`)
})