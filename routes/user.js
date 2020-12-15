var snowflake = require('snowflake-sdk');
const nodemailer = require('nodemailer');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
//Global variable 
var verify = Math.floor((Math.random() * 10000000) + 1);

// email connection

var transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: 'dylanrychlik@gmail.com',
      pass: '3Hotdogs!'
   }
});
// cookie parser
app.use(cookieParser());

//connection.connect();




app.get('/', (req, res) => {
   res.render('index.ejs');
});


var verification = verify;


// verification 

exports.verify = function (req, res) {
   var email = 'dylanrychlik@gmail.com';//'req.body.email';
 var connection = snowflake.createConnection( {
         account: 'zya38129.us-east-1',
         username: 'DRYCH',
         password: '3Hotdogs!',
         database: 'MAHITIX'
         }
       );

   connection.connect(
      function (err, conn) {
         if (err) {
            console.error('Unable to connect: ' + err.message);
         }
         else {
            console.log('Successfully connected to Snowflake.');
            // Optional: store the connection ID.
            connection_ID = conn.getId();
         }
      }
   );
   connection.execute({
      sqlText: "SELECT ID, VERIFICATION FROM MAHITIX.PUBLIC.ACCOUNTS WHERE EMAIL = ?",
      binds: [email],
      complete: function (err, stmt, rows) {
         if (err) {
            console.log(err);
         } else {
            console.log("verification", rows[0].VERIFICATION);
            verification = rows[0].VERIFICATION;
            console.log("verification", verification);
            /*  var verify1 = req.query.verify;
              var verify2 = result[0].verification; 
              if(verify1 == verify2) {
                  activateAccount(result[0].verification);
              }else{
                  res.send("<h1>verification fail</h1>")
              } */
         }
      }
   });
   var get = req.body;
   console.log("verification", verification);
   console.log("verification", verify);
   if (verification == verify) {
      connection.execute({
         sqlText: "UPDATE MAHITIX.PUBLIC.ACCOUNTS SET VERIFICATION = ?",
         binds: [verify],
         complete: function (err, stmt, rows) {
            if (err) {
               console.log(err);
            }
            else {
               /* let userdata = {
                    Email: `${req.body.email}`,
                    verify: "TRUE"
                 }*/
               res.cookie("UserInfo", rows[0]);
               res.send('<h1>Account Verification Successfully</h1>');
            }
         }
      });
   }
   else {
      res.send("<h1>verification failed</h1>")
   }



}

var email;
//---------------------------------------------signup page call------------------------------------------------------
exports.signup = function (req, res) {
   message = '';
   if (req.method == "POST") {

      //var verification = post.verification;
   var connection = snowflake.createConnection( {
         account: 'zya38129.us-east-1',
         username: 'DRYCH',
         password: '3Hotdogs!',
         database: 'MAHITIX'
         }
       );
      connection.connect(
         function (err, conn) {
            if (err) {
               console.error('Unable to connect: ' + err.message);
            }
            else {
               console.log('Successfully connected to Snowflake.');
               // Optional: store the connection ID.
               connection_ID = conn.getId();
            }
         }
      );


      var mailOption = {
         from: 'dylanrychlik@gmail.com', // sender this is your email here
         to: `${req.body.email}`, // receiver email2
         subject: "Account Verification",
         html: `<h1>Hello Friend Please Click on this link<h1><br><hr><p>HELLO I AM 
      THECODERANK I MAKE THIS TUTORIAL FOR MY SUBSCRIBERS AND OUR FRIENDS.</p>
      <br><a href="http://localhost:8081/verification/?verify=${verify}">CLICK ME TO ACTIVATE YOUR ACCOUNT</a>`
      }
      var post = req.body;
      var name = post.user_name;
      var pass = post.password;
      var fname = post.first_name;
      var lname = post.last_name;
       email = post.email;

      //var verification = post.verify;
      connection.execute({

         sqlText: "INSERT INTO MAHITIX.PUBLIC.ACCOUNTS(ID, FIRST_NAME,LAST_NAME,EMAIL,USER_NAME, PASSWORD,VERIFICATION) VALUES ('2','" + fname + "','" + lname + "','" + email + "','" + name + "','" + pass + "','" + verify + "');",

         complete: function (err) {
            if (err) {
               console.error('Failed to execute statement due to the following error: ' + err.message);
               res.render('signup');
            }
            if (err) {
               console.log(err)
            } else {
               transporter.sendMail(mailOption, (error, info) => {
                  if (error) {
                     console.log(error)
                  } else {

                     let userdata = {
                        email: `${req.body.email}`,
                     }
                     res.cookie("UserInfo", userdata);
                     res.send("Your Mail Send Successfully")
                  }
               })
               console.log('Data Successfully insert')
            }

         }
      });

   }
   else {
      res.render('signup');
   }
};
//Forgot password 
exports.forgot = function (req, res) {
   
  message = '';
   if (req.method == "POST") {
console.log('req.body:',req.body);
    var mailOption = {
      from: 'dylanrychlik@gmail.com', // sender this is your email here
      to: `${req.body.user_name}`, // receiver email2
      subject: "Forgot Password",
      html: `<h1>Hello Friend Please Click on this link
         <br><a href="http://localhost:8081/reset">CLICK ME TO RESET YOUR PASSWORD</a>`


   }
   transporter.sendMail(mailOption, (error, info) => {
      if (error) {
         console.log(error)
      } else {

         let userdata = {
            email: 'dylanrychlik@gmail.com',
         }
         res.cookie("UserInfo", userdata);
         res.send("Your Mail Send Successfully")
      }
   })
 
 }
   else {
      res.render('index');
    
   }

};
let userdata = {
   email: 'dylanrychlik@gmail.com',
   user_name: '',
   first_name: '',
   user_name: '',
   pass: '',
}

//Reset 
// verification 

exports.reset = function (req, res) {
   message = '';
   if (req.method == "POST") {
      //var verification = post.verification;
     var connection = snowflake.createConnection( {
         account: 'zya38129.us-east-1',
         username: 'DRYCH',
         password: '3Hotdogs!',
         database: 'MAHITIX'
         }
       );

      connection.connect(
         function (err, conn) {
            if (err) {
               console.error('Unable to connect: ' + err.message);
            }
            else {
               console.log('Successfully connected to Snowflake.');
               // Optional: store the connection ID.
               connection_ID = conn.getId();
            }
         }
      );


      var post = req.body;

      var pass = post.password;

      var email = 'dylanrychlik@gmail.com';
      let userdata = {
         email: 'dylanrychlik@gmail.com',

      }

      //var verification = post.verify;
      connection.execute({

         //sqlText: "INSERT INTO MAHITIX.PUBLIC.ACCOUNTS(ID, FIRST_NAME,LAST_NAME,EMAIL,USER_NAME, PASSWORD,VERIFICATION) VALUES ('2','" + fname + "','" + lname + "','" + email + "','" + name + "','" + pass + "','" + verify + "');",
         sqlText: "UPDATE MAHITIX.PUBLIC.ACCOUNTS SET PASSWORD = '" + pass + "' WHERE EMAIL = '" + email + "';",

         complete: function (err) {
            if (err) {
               console.error('Failed to execute statement due to the following error: ' + err.message);
               res.render('index');
            }
            if (err) {
               console.log(err)
            } else {


               console.log('Data Successfully updated');

               console.log(email);
               console.log(pass);
               res.render('index');
            }
         }

      });


   } else {
      res.render('reset');
   }

}

//-----------------------------------------------login page call------------------------------------------------------
exports.login = function (req, res) {
   var message = '';
   var sess = req.session;

   if (req.method == "POST") {
      var post = req.body;
      var Email = post.user_name;
      var Pass = post.password;
   var connection = snowflake.createConnection( {
         account: 'zya38129.us-east-1',
         username: 'DRYCH',
         password: '3Hotdogs!',
         database: 'MAHITIX'
         }
       );

      connection.connect(
         function (err, conn) {
            if (err) {
               console.error('Unable to connect: ' + err.message);
            }
            else {
               console.log('Successfully connected to Snowflake.');
               // Optional: store the connection ID.
               connection_ID = conn.getId();
            }
         }
      );

      connection.execute({
         sqlText: "select ID, EMAIL,PASSWORD from MAHITIX.PUBLIC.ACCOUNTS where EMAIL = ? and PASSWORD = ?",
         binds: [Email, Pass],
         complete: function (err, stmt, rows) {
            if (err) {
               console.error('Failed to execute statement due to the following error: ' + err.message);
            }
            else {
               console.log('Successfully executed statement: ' + stmt.getSqlText());
               console.log(rows);
               if (rows <= 1) {
                  message = 'Wrong Credentials.';
                  res.render('index.ejs', { message: message });
               } else {
                  console.error('login successful');
                  sess.userId = rows[0].ID;
                  sess.user = rows[0];
                  console.log(rows[0].ID);
                  res.redirect('/home/dashboard');
               }
            }
         }


      });
   }
   else {
      res.render('index.ejs', { message: message });
   }

};


//-----------------------------------------------dashboard page functionality----------------------------------------------

exports.dashboard = function (req, res, next) {

   var user = req.session.user,
      userId = req.session.userId;
   console.log('ddd=' + userId);
   if (userId == null) {
      res.redirect("/login");
      return;
   }
 var connection = snowflake.createConnection( {
         account: 'zya38129.us-east-1',
         username: 'DRYCH',
         password: '3Hotdogs!',
         database: 'MAHITIX'
         }
       );

   connection.connect(
      function (err, conn) {
         if (err) {
            console.error('Unable to connect: ' + err.message);
         }
         else {
            console.log('Successfully connected to Snowflake.');
            // Optional: store the connection ID.
            connection_ID = conn.getId();
         }
      }
   );
   var sql = "SELECT * FROM `ACCOUNTS` WHERE `ID`='" + userId + "'";

   connection.execute({
      sqlText: "select *  from MAHITIX.PUBLIC.ACCOUNTS where ID='" + userId + "'",
      complete: function (err) {
         if (err) {
            console.error('Failed to execute statement due to the following error: ' + err.message);
         }
         else {

            res.render('dashboard.ejs');
         }
      }
   });
};
//------------------------------------logout functionality----------------------------------------------
exports.logout = function (req, res) {
   req.session.destroy(function (err) {
      res.redirect("/login");
   })
};
//const obj = '';
//--------------------------------render user details after login--------------------------------
exports.profile = function (req, res) {

   var userId = req.session.userId;
   if (userId == null) {
      res.redirect("/login");
      return;
   }
  var connection = snowflake.createConnection( {
         account: 'zya38129.us-east-1',
         username: 'DRYCH',
         password: '3Hotdogs!',
         database: 'MAHITIX'
         }
       );

   connection.connect(
      function (err, conn) {
         if (err) {
            console.error('Unable to connect: ' + err.message);
         }
         else {
            console.log('Successfully connected to Snowflake.');
            // Optional: store the connection ID.
            connection_ID = conn.getId();
         }
      }
   );


   connection.execute({
      sqlText: "select *  from MAHITIX.PUBLIC.ACCOUNTS where EMAIL='dylanrychlik@gmail.com'",
      complete: function (err, stmt, row) {
         if (!err) {
            /*  obj = JSON.parse(JSON.stringify(row[0]));
                  res.render('profile', {
                      obj:obj,
                      title: 'profile',
                      classname: 'profile'
                  });*/
            res.render('profile',
               { email: row[0].EMAIL, user_name: row[0].USER_NAME, first_name: row[0].FIRST_NAME, last_name: row[0].LAST_NAME, password: row[0].PASSWORD });


         }
         else
            res.status(502).json([{
               status: 'failed',
               errMsg: 'Error while performing query.'
            }])
      }
   });

};
function UpdateUser(user_name,first_name,last_name,password ) {
   userdata.user_name = user_name;
   userdata.first_name = first_name;
   userdata.last_name = last_name;
   userdata.password = password;
};
//---------------------------------edit users details after login----------------------------------
exports.editprofile = function (req, res) {
  // var userId = req.session.userId;
   var message = '';
   var sess = req.session;

   if (req.method == "POST") {
     // var post = req.session;
      var userId = '2';
      var post = req.body;
      var name = post.user_name;
      var pass = post.password;
      var fname = post.first_name;
      var lname = post.last_name;
      var email = post.email;
    
      console.log(name, pass, fname, lname);
      if (userId == null) {
         res.redirect("/login");
         return;
      }
    var connection = snowflake.createConnection( {
         account: 'zya38129.us-east-1',
         username: 'DRYCH',
         password: '3Hotdogs!',
         database: 'MAHITIX'
         }
       );

      connection.connect(
         function (err, conn) {
            if (err) {
               console.error('Unable to connect: ' + err.message);
            }
            else {
               console.log('Successfully connected to Snowflake.');
               // Optional: store the connection ID.
               connection_ID = conn.getId();
            }
         }
      );


      connection.execute({
         sqlText: "UPDATE MAHITIX.PUBLIC.ACCOUNTS SET FIRST_NAME =" + "'" +fname+ "'" + ", LAST_NAME = " + "'" + lname+ "'" + ", USER_NAME = " + "'" + name + "'" + ", PASSWORD = " + "'" + pass + "'" + " WHERE EMAIL = 'dylanrychlik@gmail.com'",
         // UPDATE MAHITIX.PUBLIC.ACCOUNTS SET FIRST_NAME = 'John', LAST_NAME = 'Smith', USER_NAME = 'Jsmith365', PASSWORD = '3Hotdogs' WHERE EMAIL = 'dylanrychlik@gmail.com';
         complete: function (err, stmt, row) {
            if (err) {
               console.error('Failed to execute statement due to the following error: ' + err.message);
            }
            else {
               console.log('Sucessfully updated profile');
               res.redirect('/home/dashboard');
            }
         }
      });
   } else {
      res.redirect('/home/dashboard');
   }
};