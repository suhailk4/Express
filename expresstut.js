const express=require('express');
var app=express();
var session=require('express-session');
var parseurl=require('parseurl');
app.disable('x-powered-by');

var handlebars=require('express-handlebars').create({defaultLayout:'main.handlebars'});
app.use(express.static(__dirname + '/public'));
var port=process.env.PORT || 3000;

app.use(require('body-parser').urlencoded({extended: true}));


var formidable=require('formidable');
var credentials=require('./credentials');



app.use(require('cookie-parser')(credentials.cookieSecret));


app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.get('/',(req,res)=>{

   // res.send("Hello Express");

   res.render('home.handlebars');

});
app.get('/about',(req,res)=>{
 res.render('about.handlebars');

});

app.get('/contact',(req,res)=>{


     res.render('contact',{csrf: 'CSRF token here'});


});

app.get('/thankyou',(req,res)=>{

     res.render('thankyou.handlebars');

});





app.post('/process', function(req,res){
  console.log('Form : ' + req.query.form);
  console.log('CSRF token : ' + req.body._csrf);
  console.log('Email : ' + req.body.email);
  console.log('Question : ' + req.body.ques);
  res.redirect(303, '/thankyou');
});




app.get('/fileupload',(req,res)=>{

          var now=new Date();


          res.render('fileupload',{

            year:now.getFullYear(),
            month:now.getMonth()
          })
});

app.post('/fileupload/:year/:month',(req,res)=>{

          var form=new formidable.IncomingForm();
          form.parse(req, (err,fields,file)=>{

                    if(err)
                      {
                        res.redirect(303,'/error');
                      }


                  console.log("Received File");
                  console.log(file);
                  res.redirect(303,'/thankyou')


          });


});


app.get('/cookies',(req,res)=>{

        res.cookie('username','Suhail',{expire: new Date()+7777}).send('username has the name of Suhail');

});

app.get('/listcookies',(req,res)=>{

          console.log('Cookies :',req.cookies);
          res.send('Look in console for Cookies');

});

app.get('/clearCookie',(req,res)=>{

              res.clearCookie("username");
              res.send("Cookie Cleared");


});




















app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: credentials.cookieSecret,
}));

app.use(function(req, res, next){
  var views = req.session.views;

  if(!views){
    views = req.session.views = {};
  }

  var pathname = parseurl(req).pathname;

  views[pathname] = (views[pathname] || 0) + 1;

  next();

});

app.get('/viewcount', function(req, res, next){
  res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times');
});

app.use((req,res,next)=>{


  console.log("Looking for Url:"+ req.url);
  next();
});








 app.get('/junk', (req,res)=>{

          console.log("Tried to access Junk File");

          throw new Error("Junk file doesnt exist");

 });

 app.use((err,req,res,next)=>{

            console.log("Error:" + err.message);
            next();
 });


app.use((req,res)=>{

          res.type('text/html');
          res.status(404);
          res.render('404.handlebars');

});

app.use( function(err,req,res,next){


            console.log(err.stack);
            res.status(500);
            res.render('500');


});











app.listen(port,()=>{


  console.log(`Server is up on port ${port}`);


});
