//var snowflake = require('snowflake-sdk');
const mysql   = require('mysql');
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
   var connection = mysql.createConnection({
      host: "cloud19.hostgator.com",
      user: "uzaqleuw_root",
      password: "3Hotdogs!"
    });
    

 
   
      var sqlText  = "SELECT ID, VERIFICATION FROM uzaqleuw_Simpledatabase.Accounts WHERE EMAIL = ?";
      connection.connect(function(err) {
         if (err) {throw err;}
         else {
         console.log("Connected!");
         connection.query(sqlText,[email], function (err, result) {
           if (err) {throw err;}else {
           console.log("Result: " + result);
           //console.log("verification", result[0].VERIFICATION);
           //verification = result[0].VERIFICATION;
           console.log("verification", verification);
           }
         });
      }
       });
      
   
   
   var get = req.body;
   console.log("verification", verification);
   console.log("verification", verify);
   if (verification == verify) {
     
        var sqlText = "UPDATE uzaqleuw_Simpledatabase.Accounts SET VERIFICATION =" + verification;
       
         connection.query(sqlText, function (err, result) {
           if (err) {throw err;}else {
         
         res.cookie("UserInfo", result);
         res.send('<h1>Account Verification Successfully</h1>');
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
   var connection = mysql.createConnection({
      host: "cloud19.hostgator.com",
      user: "uzaqleuw_root",
      password: "3Hotdogs!"
    });
 


      var mailOption = {
         from: 'dylanrychlik@gmail.com', // sender this is your email here
         to: `${req.body.email}`, // receiver email2
         subject: "Account Verification",
         html: `<h1>Hello Friend Please Click on this link to verify your account<h1><br><hr>
      <br><a href="https://radiant-castle-92259.herokuapp.com/verification/?verify=${verify}">CLICK ME TO ACTIVATE YOUR ACCOUNT</a>`
      }
      var post = req.body;
      var name = post.user_name;
      var pass = post.password;
      var fname = post.first_name;
      var lname = post.last_name;
       email = post.email;
       var sqlText = "INSERT INTO uzaqleuw_Simpledatabase.Accounts(ID, FIRST_NAME,LAST_NAME,EMAIL,USER_NAME, PASSWORD,VERIFICATION) VALUES ('','" + fname + "','" + lname + "','" + email + "','" + name + "','" + pass + "','" + verify + "');";
      //var verification = post.verify;
      connection.connect(function(err) {
         if (err) throw err;
         console.log("Connected RYAN!");
         connection.query(sqlText, function (err, result) {
           if (err){throw err;} else {
           console.log("Result: " + result);
           transporter.sendMail(mailOption, (error, info) => {
            if (error) {
               console.log('Test ALEX!',error);
            } else {

               let userdata = {
                  email: `dylanrychlik@gmail.com`,
               }
              res.cookie("UserInfo", userdata);
               res.send("Please check your email to verify your account.")
            }
         })

                  }
                        });
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
      html: `<h1Please Click on this link to reset your password
         <br><a href="https://radiant-castle-92259.herokuapp.coms/verification/reset">CLICK ME TO RESET YOUR PASSWORD</a>`


   }
   transporter.sendMail(mailOption, (error, info) => {
      if (error) {
         console.log(error)
      } else {

         let userdata = {
            email: 'dylanrychlik@gmail.com',
         }
         res.cookie("UserInfo", userdata);
         res.send("Please check your email to reset your password")
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
      var connection = mysql.createConnection({
         host: "cloud19.hostgator.com",
         user: "uzaqleuw_root",
         password: "3Hotdogs!"
       });

      var post = req.body;

      var pass = post.password;

      var email = 'dylanrychlik@gmail.com';
      let userdata = {
         email: 'dylanrychlik@gmail.com',

      }

      //var verification = post.verify;
   

         //sqlText: "INSERT INTO MAHITIX.PUBLIC.ACCOUNTS(ID, FIRST_NAME,LAST_NAME,EMAIL,USER_NAME, PASSWORD,VERIFICATION) VALUES ('2','" + fname + "','" + lname + "','" + email + "','" + name + "','" + pass + "','" + verify + "');",
        var sqlText = "UPDATE uzaqleuw_Simpledatabase.Accounts SET PASSWORD = '" + pass + "' WHERE EMAIL = '" + email + "';";
        connection.connect(function(err) {
         if (err) throw err;
         console.log("Connected! Reset!");
         connection.query(sqlText, function (err, result) {
           if (err) {throw err;} 
           else {


            console.log('Data Successfully updated');

            console.log(email);
            console.log(pass);
            res.render('index');
         }
         });
       });
       /*  complete: function (err) {
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
*/


   } else {
      res.render('reset');
   }

}


var userID; 
//-----------------------------------------------login page call------------------------------------------------------
exports.login = function (req, res) {
   var message = '';
   var sess = req.session;
   console.log('sess: ',req.body);

   if (req.method == "POST") {
      var post = req.body;
      var id = post.userId;
      var Email = post.user_name;
      var Pass = post.password;
      console.log('Test: ',id);
      var connection = mysql.createConnection({
         host: "cloud19.hostgator.com",
         user: "uzaqleuw_root",
         password: "3Hotdogs!"
       });

      connection.connect(
         function (err, conn) {
            if (err) {
               console.error('Unable to connect: ' + err.message);
            }
            else {
               console.log('Successfully connected to Snowflake.');
               // Optional: store the connection ID.
               //connection_ID = conn.getId();
            }
         }
      );

  
        var sqlText = "select ID,EMAIL,PASSWORD from uzaqleuw_Simpledatabase.Accounts where EMAIL = ? and PASSWORD = ?";
        connection.query(sqlText, [Email,Pass], function (err, result) {
         if (err) {throw err;}
         else {
         console.log(result);
       
            console.log('Successfully executed statement: ');
            console.log(result);
            if (result <= 1) {
               message = 'Wrong Credentials.';
               res.render('index.ejs', { message: message });
            } else {
               console.error('login successful');
               
               userID = JSON.stringify(result[0].ID);
               sess.user = result;
               console.log('User id:',JSON.stringify(result[0].ID));
               res.redirect('/home/dashboard');
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

 
   console.log('ddd=' + userID);
   if (userID == null) {
      res.redirect("/login");
      return;
   }
   var connection = mysql.createConnection({
      host: "cloud19.hostgator.com",
      user: "uzaqleuw_root",
      password: "3Hotdogs!"
    });
    

   connection.connect(
      function (err, conn) {
         if (err) {
            console.error('Unable to connect: ' + err.message);
         }
         else {
            console.log('Successfully connected to Snowflake.');
            // Optional: store the connection ID.
          //  connection_ID = conn.getId();
         }
      }
   );
   var sql = "select *  from uzaqleuw_Simpledatabase.Accounts where ID='" + userID + "'";
  // sqlText: "select *  from uzaqleuw_Simpledatabase.ACCOUNTS where ID='" + userID + "'",
   connection.query(sql,function(err) {
         if (err) {
            console.error('Failed to execute statement due to the following error: ' + err.message);
         }
         else {

            res.render('dashboard.ejs');
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
  var connection = mysql.createConnection( {
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
          //  connection_ID = conn.getId();
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
    var connection = mysql.createConnection( {
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
            //   connection_ID = conn.getId();
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