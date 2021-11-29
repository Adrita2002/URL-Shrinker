const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ShortUrl = require('./models/shortUrl')

mongoose.connect('mongodb://localhost/urlShortener', {useNewUrlParser:true,useUnifiedTopology:true});

app.set('view engine','ejs')
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}))

app.get('/',async(req,res)=>{
    const shortUrls = await ShortUrl.find();
    res.render('index',{shortUrls:shortUrls});
})

app.post('/shortUrls',async(req,res)=>{
   await ShortUrl.create({full: req.body.fullUrl})//will create a new short url; this is asynchronous, but we want to wait for this to finish before we move on; hence async/ await is used
   res.redirect('/');
})


app.get('/:shortUrl',async(req,res)=>{
    const shortUrl = await ShortUrl.findOne({short:req.params.shortUrl})
    if(shortUrl == null) return res.sendStatus(404);

    shortUrl.clicks++;
    shortUrl.save()

    res.redirect(shortUrl.full)
})

const port = process.env.PORT || 3000;

app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})

