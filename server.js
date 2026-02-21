const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json())

MongoClient.connect(process.env.MONGO_URI)
.then((client) =>
    {
        console.log('connect to the database');
        const db = client.db('star-wars-quotes');
        const quotesCollaction = db.collection('quotes');

        app.get('/', (req, res) =>{
            db.collection('quotes')
            .find()
            .toArray()
            .then(results => {
                  res.render('index.ejs', {quotes: results})
                })
            .catch(error => console.error(error))
            
            })
        
        app.post('/quotes', (req, res) =>{
            quotesCollaction
            .insertOne(req.body)
            .then((result) => {
                 res.redirect('/')
             })
            .catch((error) => console.error(error))
    
        })

        app.put('/quotes', (req, res) => {
            quotesCollaction
            .findOneAndUpdate(
                {name: 'Anshuman Dehury'},
                {
                    $set : {
                        name: req.body.name,
                        quote: req.body.quote,
                    },

                },
                {
                    upsert: true,
                },
            )
            .then((result)=>{
                res.json('success')
            })
            .catch((error) => console.error(error))
        })

        app.delete('/quotes', (req, res) =>{
            quotesCollaction
            .deleteOne({name: req.body.name})
            .then((result) =>{
                if(result.deletedCount === 0)
                    return res.json('No quote to delete')
                res.json("Delete the Darth Vader's quote.")
            })
            .catch(error => console.error(error))
        })
        
    })
.catch(error => console.error(error))

app.use(express.urlencoded({extended: true}))


// app.get('/', (req, res) => {
    
//     res.sendFile(__dirname + '/index.html')
    
// });


app.listen(3000, () =>{
    console.log('Listening on 3000')
})