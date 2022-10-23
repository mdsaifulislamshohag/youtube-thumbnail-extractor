const express = require('express')

const fs = require("fs")

const request = require("request")

var youtubeThumbnail = require("youtube-thumbnail");

const app = express()

const bodyparser = require('body-parser')

const PORT = 3000

app.set('view engine', 'ejs')

app.use(bodyparser.urlencoded({ extended: false }))

app.use(bodyparser.json())

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/getvideothumbnail', (req, res) => {
    // url

    let url = req.body.url

    let quality = req.body.quality
console.log({quality})

    const thumbnail = youtubeThumbnail(url)

    if (quality == "high") {

        console.log(thumbnail.high.url)

        const thumbnail_path = Date.now() + "thumbnail.jpg"

        download(
          thumbnail.high.url,
          thumbnail_path,
          function () {
            // download the image inside browser as attachment
              
              res.download(thumbnail_path, () => {
                
            })
          }
        );
        
    }
    if (quality == "medium") {

        console.log(thumbnail.medium.url);

        const thumbnail_path = Date.now() + "thumbnail.jpg";

        download(thumbnail.medium.url, thumbnail_path, function () {
          // download the image inside browser as attachment

          res.download(thumbnail_path, () => {});
        });
        
    }
    else {
        // default

         console.log(thumbnail.default.url);

         const thumbnail_path = Date.now() + "thumbnail.jpg";

         download(thumbnail.default.url, thumbnail_path, function () {
           // download the image inside browser as attachment

           res.download(thumbnail_path, () => {});
         });
    }



    
})

var download = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

app.listen(PORT, () => {
    console.log('App is listening on Port 3000')
})