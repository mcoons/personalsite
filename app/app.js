var express = require("express");
var reload = require('reload');
var app = express();
const localport = 3000;

app.set('port', process.env.PORT || localport);
app.set('view engine', 'ejs');
app.set('views', 'app/views');


var ExifImage = require('exif').ExifImage;

const fs = require('fs');

const parksFolder = 'app/public/images/parks';
const DOMpath = '/images/parks';


var parkNames = [];
var parks = [];
var fullParkData = [];
var parksProcessed = 0;

parkNames = fs.readdirSync(parksFolder);
    console.log("park names:", parkNames);
    console.log("---------------------");

parkNames.forEach( (park, parkNamesIndex) => {
    console.log("Processing", park);

    let parkData = new Object();
    parkData.name = park;
    parkData.images = [];

    let files = fs.readdirSync(parksFolder+'/'+park);
    console.log("--- files ---");
    console.log(files);

    files.forEach( (file, filesIndex) => {

        if (file != '.DS_Store') {

            let imageData = new Object();
            imageData.name = file;
            imageData.path = DOMpath+'/'+park + "/" + file;

            imageData.exif = {};

            new ExifImage({ image : parksFolder+'/'+park + '/' + file }, function (error, exifData) {
                console.log("---------------------");
                console.log(exifData);
                console.log("---------------------");
                // imageData.exif = exifData;

                imageData.createDate = exifData.exif.CreateDate;
                imageData.model = exifData.image.Model;
                imageData.lensModel = exifData.exif.LensModel;

                imageData.exposureTime = exifData.exif.ExposureTime;
                if (imageData.exposureTime < 1){
                    imageData.exposureTime = "1/" + (1/imageData.exposureTime)
                }

                imageData.ISO = exifData.exif.ISO;
                imageData.fNumber = exifData.exif.FNumber;
                imageData.focalLength = exifData.exif.FocalLength;
                imageData.exposureCompensation = exifData.exif.ExposureCompensation;
            })
            parkData.images.push(imageData);

        }

    })
    parks.push(parkData);

    // })
})



app.set('appData', parks);

app.locals.siteTitle = "Michael Coons";

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/projects'));
app.use(require('./routes/photography'));
app.use(require('./routes/contact'));

var server = app.listen(app.get('port'), function(){
    console.log("listening on port: " + app.get('port'));
});

reload(server, app);


// -----      OLD WAY     -----


// fs.readdir(parksFolder, (err, files) => {
//     if (err)
//         console.log("ERR:",err);
//     else
//         parkNames = files;

//     console.log("park names:", parkNames);
//     console.log("---------------------");

//     parkNames.forEach( (park, parkNamesIndex) => {
//         console.log("Processing", park);

//         let parkData = new Object();
//         parkData.name = park;
//         parkData.images = [];
//         let processedFiles  = 0;

//         fs.readdir(parksFolder+'/'+park, (err, files) => {
//             if (err)
//                 console.log("ERR:",err);
//             else {
//                 files.shift();  // remove .DS_Store

//                 files.forEach( (file, filesIndex) => {

//                     let imageData = new Object();
//                     imageData.name = file;
//                     imageData.path = DOMpath+'/'+park + "/" + file;

//                     imageData.exif = {};

//                     new ExifImage({ image : parksFolder+'/'+park + '/' + file }, function (error, exifData) {
//                         // console.log(exifData);
//                         // imageData.exif = exifData;

//                         imageData.createDate = exifData.exif.CreateDate;
//                         imageData.model = exifData.image.Model;
//                         imageData.lensModel = exifData.exif.LensModel;
//                         imageData.exposureTime = exifData.exif.ExposureTime;
//                         imageData.ISO = exifData.exif.ISO;
//                         imageData.fNumber = exifData.exif.FNumber;
//                         imageData.focalLength = exifData.exif.FocalLength;
//                         imageData.exposureCompensation = exifData.exif.ExposureCompensation;

//                         parkData.images.push(imageData);
//                         processedFiles++;

//                         if (processedFiles === files.length){
//                             console.log("--- Park Data ---")
//                             console.log(parkData);
//                             parks.push(parkData);
//                             parksProcessed++;
//                         }

//                         if (parksProcessed === parkNames.length){
//                             console.log("-- Parks Array --")
//                             console.log(parks);

//                             fullParkData = parks;
//                             app.set('appData', parks);

//                         }
//                     })
//                 });
//             }
//         });
//     });
// });