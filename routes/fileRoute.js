const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');
const File = require('../models/file');

require('dotenv').config();
const Storage_URL = process.env.STORAGE_URL

const storage = multer.diskStorage({
    destination: Storage_URL,
    filename: function (req, file, cb) {
       // return cb(null, file.originalname)
       return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
 });

const upload = multer({ storage: storage });

let router = express.Router();

router.route('/')
.post(upload.array('files', 12),(req,res)=>{

    var arrFiles = req.files;
    for(var i in arrFiles)
    {
        console.log(arrFiles[i]);
        
        var filepath = Storage_URL+ '/' + arrFiles[i].filename;
        var ext = path.extname(arrFiles[i].filename);

        var file = new File({
           fileName: arrFiles[i].originalname,
           filePath: filepath,
           fileExt: ext
        });

        file.save((err) => {
           if (err) {
              console.log(err);
           }
        });
    }

    res.send('done');
})

.get((req, res) => {
    File.find({},(err, files) => {
        res.send(files);
    });
});


router.route('/file/:id')
.get((req, res) => {

    let fileId = req.params.id;

    File.find({_id:fileId}, (err, file) => {

        if(!err)
        {
            res.sendFile(file[0].filePath);
        }
        else
        {
            console.log(err);
        }

    });
})
.delete((req, res) =>{

    let fileId = req.params.id;

    File.findByIdAndRemove(fileId, function (err, file) {
        if (err) {
           console.log(err);
        }
        else {

           fs.unlink(file.filePath , function (err) {
              if (err) {
                 console.log(err);
              }
              else {
                 res.status(200).json({ msg: "file deleted" });
              }
           });

        }
     });

});

router.route('/file/download/:id')
.get((req, res) => {

    let fileId = req.params.id;

    File.find({_id:fileId}, (err, file) => {
        if(!err)
        {
            res.download(file[0].filePath,file[0].fileName);
        }
        else
        {
            console.log(err);
        }

    });
});


module.exports = router;