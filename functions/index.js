const functions = require('firebase-functions');
const admin = require('firebase-admin');
const os = require('os');
const path = require('path');
const spawn = require('child-process-promise').spawn;
const cors = require('cors')({ origin: true });
const Busboy = require('busboy');
const fs = require('fs');

const gcconfig = {
  projectId: 'cryptocardz-c5066',
  keyFilename: 'cryptocardz-cb4378419f3f.json'
};

const gcs = require('@google-cloud/storage')(gcconfig);
//const gcs = require('@google-cloud/storage')();
//const os = require('os');
//const path = require('path');
//const spawn = require('child-process-promise').spawn;
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.uploadFile = functions.https.onRequest((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,DELETE,HEAD,PUT,OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  cors(req, res, () => {
    if (req.method !== 'POST') {
      return res.status(500).json({
        message: 'Not allowed'
      });
    }
    const busboy = new Busboy({ headers: req.headers });
    let uploadData = null;

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      const filepath = path.join(os.tmpdir(), filename);
      uploadData = { file: filepath, type: mimetype };
      file.pipe(fs.createWriteStream(filepath));
    });

    busboy.on('finish', () => {
      const bucket = gcs.bucket('cryptocardz-c5066.appspot.com');
      bucket
        .upload(uploadData.file, {
          uploadType: 'media',
          metadata: {
            metadata: {
              contentType: uploadData.type
            }
          }
        })
        .then(() => {
          return res.status(200).json({
            message: 'It worked!'
          });
        })
        .catch(err => {
          return res.status(500).json({
            error: err
          });
        });
    });
    busboy.end(req.rawBody);
  });
});
