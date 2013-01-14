
/**
 * Module dependencies.
 */

var express  = require('express')
  , routes   = require('./routes')
  , user     = require('./routes/user')
  , http     = require('http')
  , mongoose = require('mongoose')
  , stripe   = require('stripe')(api_key)
  , request  = require('request')
  , xml2js   = require('xml2js')
  , mysql    = require('mysql')
  , path     = require('path');

// secret stripe API key
var api_key  = 'iDOgWKg2mlDC4wh3VUgb4B5z9LZQld8v';

var app = express();
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res){
    res.render('index.ejs', {}, function(err, str) {
        res.render('layout.ejs', {
            body: str
        });
    });  
});

app.all('/checkout', function(req, res){
    res.render('checkout.ejs', {}, function(err, str) {
        res.render('layout.ejs', {
            body: str
        });
    });  
});


app.get('/stripe', function(req, res) {

  stripe.charges.create({ 
      amount:50,
      currency:'usd', 
      card:{
          number:'4000000000000010',
          exp_month:'04',
          exp_year:'16', 
          cvc:'123'
      }, 
      description:'Coderse donation'
    },function(err, response) {
      if (err) {
         console.log(response);
          res.send(response);
         return;
      }
      console.log(response);
       res.send(response);
   }
 );


  //-----------------------------------
    // var theSource =  'https://api.stripe.com/v1/charges';
    // request.post(
    //     theSource,
    //     { form: { amount: '300', currency:'usd', card:'5555555555554444',description:'Coderise'} },
    //     function (error, response, body) {
    //         if (!error && response.statusCode == 200) {
    //             console.log(body);
    //             res.send(body);
    //         }
    //     }
    // );
    // var client = request.get(source,{},
    // function(err, response, strip_response) {

    //   var parser = new xml2js.Parser({normalize:true, trim:false});
    //    parser.parseString(strip_response, function (err, result) {       
    //    console.log(result);       
    // });
  //-----------------------------------

});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
