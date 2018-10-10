
var settings;

$(function () {
  settings = new Vue({
    el: '#configForm',
    data: {
      config: {
        path: "/"
      },
      configLoaded:false
    },
    methods: {
      loadConfig: function ()
      {
        var self = this;
        storage.get("config.json", function (err, data) {
          if (err) {
            console.warn("Error loading config, probably file does not exist so creating a new one.");
            storage.set("config.json",{"path":self.config.path}, function (err) {
              if (err) {
                console.error(null, err);
              }
              else {
                self.configLoaded = true;
              }
            });
          } else {
            self.config = data;
            self.configLoaded = true;
          }
        });
      },
      saveConfig: function (){
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
      },
      openBrowse: function (){
        var selection = dialog.showOpenDialog({ properties: ['openDirectory']});
        this.config.path = selection[0];
      }
    },
    watch: {
      config: {
         handler(val){
           this.saveConfig();
         },
         deep: true
      }
    }
  });

  settings.loadConfig();
});
