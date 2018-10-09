const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');
var readFileAsync = Promise.promisify(fs.readFile);
var readdirAsync = Promise.promisify(fs.readdir);

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {  
    //items[id] = text;
    fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
      
      if (err) {  
        throw ('error creating one file');
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {

  
  // let data = [];
  
  // var files = [];
  
  // data = (readdirAsync(exports.dataDir));
  
  // for (var i = 0; i < data.length; ++i) {
  //   files.push(readFileAsync(path.join(exports.dataDir, data[i])));
  // }
  
  // Promise.all(files).then(function() {
  //   console.log("all the files were created");
  // });
  
  return readdirAsync(exports.dataDir).then(function(files) {
    Promise.all(files.map(function(fileName) {
      return exports.readOneAsync(fileName.split('.')[0])
    })).then(function(list) {
      callback(null, list);
    })
  })
  
  
  
  // readdirAsync(exports.dataDir).map(function(file) {
  //   return readFileAsync(path.join(exports.dataDir, file))
  // }).then(function(content) {
  //   Promise.all(content).then(function(theContent) {
  //     console.log();
  //   });
  // })
  
  // return readdirAsync(exports.dataDir).then(function(files) {
  //   Promise.all(files).then(function(contents) {
  //     contents.map(function(file) {
  //       readFileAsync(path.join(exports.dataDir, file)).then(function(content) {
  //         var id = file.split('.')[0];
  //         data.push({id, 'text': content.toString()});
  //       }).then(function() {
  //         callback(null, data);
  //       })
  //     })
  //   })
  // })
};

exports.readOne = (id, callback) => {
  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
  fs.readFile(path.join(exports.dataDir, id + '.txt'), (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
      //throw ('error reading one file');
    } else {
      //console.log(fileData.toString());
      callback(null, {id, 'text': fileData.toString()});
    }
  });
};

exports.readOneAsync = Promise.promisify(exports.readOne);

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, { id, text });
  // }
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, id + '.txt'), text, (err) => {
        if (err) {
          throw ('error creating one file');
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
  
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  exports.readOne(id, (err, data) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(path.join(exports.dataDir, id + '.txt'), (err) => {
        callback(null);
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
