var express = require('express');
var router = express.Router();

router.get('/photography', function(request, response){
    
    var data = request.app.get('appData');
    console.log("--- APPDATA ---", data);
    
    response.render('photography', {
        jumboPic: '/images/photos/p4-2.jpg',
        pageTitle: 'Photography',
        parks: data,
        pageID: 'photography'
    });
});

module.exports = router;
