// Require dependencies
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors')
const path = require('path');
const http = require('http');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/animation', express.static(path.join(__dirname, 'animation')));
app.use('/mylibrary',express.static(path.join(__dirname,'library')));
app.post('/fetchlibrary',(req,res)=>{
    let deviceID=req.body.deviceID;
    console.log(deviceID);
    const directoryPath = `./library/${deviceID}`;
    if (fs.existsSync(directoryPath)) {

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
              console.log('Error reading directory:', err);
              return;
            }
          
            const fileNames = [];
            
            files.forEach((file) => {
              fileNames.push(file);
            });
          
            
            console.log(fileNames);
            console.log(JSON.stringify(fileNames))
            return res.send(JSON.stringify(fileNames));
        });
        console.log(`Directory "${directoryPath}" already exists.`);

      }
      else{
        console.log('Directory does not exist');
      }
    


})
app.post('/library',(req,res)=>{
    console.log(req.body);
    let deviceID, librarylink;
    deviceID=req.body.deviceID;
    librarylink=req.body.widgetUrl;
    const fullPath = path.join('library', deviceID);
    if (fs.existsSync(fullPath)) {
        console.log(`Directory "${fullPath}" already exists.`);
      } else {
        fs.mkdir(fullPath, (err) => {
            if (err) {
              console.log("directory exist")
            } else {
              console.log(`Directory "${fullPath}" created successfully.`);
            }
          });
      }
      const destDirectory = `./library/${deviceID}`;
      const fileName = path.basename(librarylink);
      const destFilePath = path.join(destDirectory, fileName);
      const fileStream = fs.createWriteStream(destFilePath);
      const request = http.get(librarylink.replace('10.0.2.2','localhost'), function (response) {
        // Pipe the response stream into the file stream
        response.pipe(fileStream);
      });
      
      // Handle errors
    request.on('error', function (err) {
    console.error('An error occurred:', err.message);
  });
  
  // When the file has been downloaded successfully
  fileStream.on('finish', function () {
    console.log('File downloaded successfully.');
    fileStream.close();
  });

    
    return res.status(200).send({success:"success"});

}
);
// Handle files
app.listen(3000, '127.0.0.1', () => {
    console.log('Server started on port 3000');
});
