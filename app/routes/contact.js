var express = require('express');
var router = express.Router();

router.get('/contact', function(request, response){
    response.render('contact', {
        pageTitle: 'Contact',
        pageID: 'contact'
    });
});

module.exports = router;