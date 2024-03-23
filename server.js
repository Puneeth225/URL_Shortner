const express = require('express')
const app = express()
const mongoose = require('mongoose')
const shortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost:27017/urlShortner',{
    useNewUrlParser: true
})

app.set('view engine','ejs')
app.use(express.urlencoded({extended: false}))

app.get('/', async (req,res)=>{
    const shortUrls = await shortUrl.find()
    res.render('index',{shortUrls: shortUrls})
})

app.post('/shortUrls', async (req,res)=>{
    await shortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async (req,res) => {
    try {
        const shortUrlDoc = await shortUrl.findOne({ short: req.params.shortUrl });
        if (!shortUrlDoc) {
            return res.sendStatus(404);
        }
        shortUrlDoc.clicks++;
        await shortUrlDoc.save(); 
        
        res.redirect(shortUrlDoc.full);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(process.env.PORT || 5000);