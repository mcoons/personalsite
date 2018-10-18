var express = require('express');
var router = express.Router();

router.get('/photography', function(request, response){
    var pagePhotos = [];

    response.render('photography', {
        pageTitle: 'Photography',
        // photos: pagePhotos,
        pageID: 'photography'
    });
});

module.exports = router;