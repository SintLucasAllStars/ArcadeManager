const fs = require('fs');
const path = require('path');
const storage = require('electron-storage');
const $ = require('jquery');
const { dialog } = require('electron').remote;

var FSManager = function ()
{
  this.config = {"path": "/"};
  this.loadConfig();
  this.files = [];
};

FSManager.prototype.loadConfig = function () {
  var self = this;
  storage.get("config.json", function (err, data) {
    if (err) {
      storage.set("config.json",{"path":self.config.path}, function (err) {
        if (err) {
          console.error(null, err);
        }
        else {
          self.configLoaded = true;
          self.onConfigLoaded(self.config, err);
        }
      });
    } else {
      self.config = data;
      self.configLoaded = true;
      self.onConfigLoaded(data, err);
    }
  });
}

FSManager.prototype.onConfigLoaded = function (data, err) {
  var self = this;
  if(err)
  {
    console.error(err);
    return;
  }
  else
  {
    $("#basePath").val(this.config.path);
  }
  this.updateFileList();
}

FSManager.prototype.updateFileList = function () {
  self = this;
  this.getFiles(function (files){
      fileList.files = files;
    }, function (err){
      console.error(err)
    });
}

FSManager.prototype.openBrowse  = function () {
  var selection = dialog.showOpenDialog({ properties: ['openDirectory']});
  this.setConfig("path", selection[0]);
}

FSManager.prototype.setConfig = function (field, value) {
  this.config[field] = value;
  settings[field] = value;
  storage.set("config.json", this.config, function (err) {
    if(err)
    {
      console.error(err);
    }
    else
    {
      console.log("Configuration saved");
    }
  });

  this.updateFileList();
}

FSManager.prototype.getFiles = function(callback, failCallback)
{
  var self = this;
  fs.readdir(this.config.path, {withFileTypes: true}, function (err, files){
    if(err)
    {
      failCallback(err);
    }
    else
    {
      callback(files);
    }
  });
};


var fsm = new FSManager();
