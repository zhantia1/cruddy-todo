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
  var data = [];
  var result = [];
  // _.each(items, (text, id) => {
  //   data.push({ id, text });
  // });
  // callback(null, data);
  return readdirAsync(exports.dataDir)
    .then(function(files) {
      for (var i = 0; i < files.length; i++) {
        var id = files[i].split('.')[0];
        result.push({id});
        data.push(readFileAsync(path.join(exports.dataDir, files[i])));
      }
      Promise.all(data).then(function(value) {
        result.push({value: value.toString});
        console.log(result);
      });
    });

    // for (var i = 0; i < files.length; i++) {
    //   var text = readFileAsync(path.join(exports.dataDir, files[i]));
    //   // data.push({id, files});
    //   data.push(text);
    //   console.log(data);
    // }
    // Promise.all(data).then(function() {
    //   callback(null, data);
    // });
    
    
    // _.each(files, (fileName) => {
    //   fs.readFile(path.join(exports.dataDir, fileName), (err, fileData) => {
    //     if (err) {
    //       callback(new Error(`No item with id: ${id}`));
    //     } else {
    //       data.push( { 'text': fileData.toString() } );
    //       callback(null, data);
    //     }
    //   });
    // });
    // '00001.txt'
    // _.each(files, (fileName) => {
    //   var id = fileName.split('.')[0];
    //   data.push({id, 'text': id});
    // });
    // callback(null, data);
  //}
  //});
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
