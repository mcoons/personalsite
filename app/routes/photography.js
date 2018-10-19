var express = require('express');
var router = express.Router();
var app = express();

var ExifImage = require('exif').ExifImage;

const fs = require('fs');

const parksFolder = 'app/public/images/parks';
const DOMpath = '/images/parks';


var parkNames = [];
var parks = [];
var fullParkData = [];
var parksProcessed = 0;

router.get('/photography', function(request, response){
    
    fs.readdir(parksFolder, (err, files) => {
        if (err)
            console.log("ERR:",err);
        else
            parkNames = files;

        // console.log("park names:", parkNames);
        // console.log("---------------------");

        parkNames.forEach( (park, parkNamesIndex) => {
            let parkData = new Object();
            parkData.name = park;
            parkData.images = [];
            let processedFiles  = 0;

            fs.readdir(parksFolder+'/'+park, (err, files) => {
                if (err)
                    console.log("ERR:",err);
                else {
                    files.shift();  // remove .DS_Store

                    files.forEach( (file, filesIndex) => {

                        let imageData = new Object();
                        imageData.name = file;
                        imageData.path = DOMpath+'/'+park + "/" + file;

                        imageData.exif = {};

                        new ExifImage({ image : parksFolder+'/'+park + '/' + file }, function (error, exifData) {
                            // console.log(exifData);
                            // imageData.exif = exifData;

                            imageData.createDate = exifData.exif.CreateDate;
                            imageData.model = exifData.image.Model;
                            imageData.lensModel = exifData.exif.LensModel;
                            imageData.exposureTime = exifData.exif.ExposureTime;
                            imageData.ISO = exifData.exif.ISO;
                            imageData.fNumber = exifData.exif.FNumber;
                            imageData.focalLength = exifData.exif.FocalLength;
                            imageData.exposureCompensation = exifData.exif.ExposureCompensation;

                            parkData.images.push(imageData);
                            processedFiles++;

                            if (processedFiles === files.length){
                                // console.log("--- Park Data ---")
                                // console.log(parkData);
                                parks.push(parkData);
                                parksProcessed++;
                            }

                            if (parksProcessed === parkNames.length){
                                console.log("-- Parks Array --")
                                console.log(parks);

                                fullParkData = parks;
                            }
                        })
                    });
                }
            });
        });
    });


    
    // var pagePhotos = [];

    response.render('photography', {
        jumboPic: '/images/photos/p4-2.jpg',
        pageTitle: 'Photography',
        // photos: pagePhotos,
        parks: fullParkData,
        pageID: 'photography'
    });
});

module.exports = router;
