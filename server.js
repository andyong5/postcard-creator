const express = require('express');

const multer = require('multer');
const bodyParser = require('body-parser');
const sql = require("sqlite3").verbose();
const fs = require('fs');
const FormData = require("form-data");


let filename = '/images/duck.jpg';

const postDB = new sql.Database("postcards.db");

let cmd = " SELECT name FROM sqlite_master WHERE type='table' AND name='postCardTable' ";
postDB.get(cmd, function (err, val) {
    console.log(err, val);
    if (val == undefined) {
        console.log("No database file - creating one");
        createPostCardDB();
    } else {
        console.log("Database file found");
    }
});

function createPostCardDB() {
  const cmd = 'CREATE TABLE postCardTable ( url TEXT PRIMARY KEY, image TEXT, message TEXT, font TEXT,color TEXT)';
  postDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure",err.message);
    } else {
      console.log("Created database");
    }
  });
}

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/images')    
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

let upload = multer({storage: storage});



const app = express();




app.use(express.static('public'));


app.use("/images",express.static('images'));


app.get("/", function (request, response) {
  response.sendFile(__dirname + '/public/creator.html');
});


let path;
 
app.post('/upload', upload.single('newImage'), function (request, response) {
  
  console.log("Recieved",request.file.originalname,request.file.size,"bytes")
  filename = "/images/"+request.file.originalname;
  sendMediaStore(filename, request, response);
  if(request.file) {
  }
  else throw 'error';
});



app.use(bodyParser.json());

app.post('/saveDisplay', function (req, res) {
  console.log("Server recieved", req.body);
  let rowID = makeid(36);
  let image = req.body.image;
  let message = req.body.message;
  let font = req.body.font;
  let color = req.body.color;
  
  console.log(image);
  console.log(message);
  console.log(font);
  console.log(color);
  console.log(rowID);
  
  cmd = "INSERT INTO postCardTable (url, image, message, font, color) VALUES (?,?,?,?,?)";
  postDB.run(cmd,rowID,image,message,font,color,function(err){
    if (err){
      console.log("DB insert error",err.message);
    } else{ 
      res.send(rowID);
    }
  });
});

function getURL(request, response, next) {
  console.log("got in here");
  let url = request.originalUrl;
  
  console.log(url);
  
  let id = url.substring(url.lastIndexOf("?") + 1);
  console.log(id);
  
  let cmd = "SELECT * FROM postCardTable where url = \""+id+"\";";
  
  console.log("cmd to execute: " + cmd);
  postDB.all(cmd, function (err, rows) {
    if (err) {
      console.log("Database reading error", err.message)
      next();
    } else {
      
      response.json(rows);
      console.log("rows",rows);
    }
  });
}

app.get("/display/id?*", getURL); 
  

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function sendMediaStore(filename, serverRequest, serverResponse) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    serverResponse.status(400);
    serverResponse.send("No API key provided");
  } else {

    let form = new FormData();
    
    form.append("apiKey", apiKey);
    form.append("storeImage", fs.createReadStream(__dirname + filename));

    form.submit("http://ecs162.org:3000/fileUploadToAPI", function(err, APIres) {
      if (APIres) {
        console.log("API response status", APIres.statusCode);
        let body = "";
        APIres.on("data", chunk => {
          body += chunk;
        });
        APIres.on("end", () => {
    
          if (APIres.statusCode != 200) {
            serverResponse.status(400); // bad request
            serverResponse.send(" Media server says: " + body);
          } else {
            serverResponse.status(200);
            fs.unlink("/app/"+filename, (err) => {
            if (err) {
              console.error(err)
              return
            }
            //file removed
          });
            serverResponse.send(body);
          }
        });
      } else {
        serverResponse.status(500);
        serverResponse.send("Media server seems to be down.");
      }
    });
  }
}


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
