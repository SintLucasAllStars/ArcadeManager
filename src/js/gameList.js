
var gameList;

var Game = function (title, author, year, executable)
{
  this.title = title;
  this.author = author;
  this.year = year;
  this.executable = executable;
  this.timesPlayed = 0;
}

$(function (){
  gameList = new Vue ({
      el: "#gameList",
      data: {
          newGame: new Game("Test Game 2", "David Jonas", (new Date()).getFullYear(), "davidtest002.exe"),
          games: [],
          selectedGame: 0,
          installing: false
        },
      methods: {
        loadGameList: function(){
          var self = this;
          storage.get("games.json", function (err, data) {
            if (err) {
              console.log("Game list probably does not exist yet. Adding empty list.");
              self.saveGameList();
            } else {
              self.games = data;
              console.log("Games loaded");
            }
          });
        },
        saveGameList: function(){
          storage.set("games.json", this.games, function (err) {
            if(err)
            {
              console.error(err);
            }
            else
            {
              console.log("Games saved");
            }
          });
        },
        addGame: function(){
          this.games.push(new Game(this.newGame.title, this.newGame.author, this.newGame.year, this.newGame.executable));
        },
        removeGame: function(game){
          var index = this.games.indexOf(game);
          if (index > -1) {
            this.games.splice(index, 1);
          }
        },
        runGame: function(game){
          game.timesPlayed++;
          this.saveGameList();
          shell.openItem(game.executable);
        },
        selectExe: function ()
        {
          var selection = dialog.showOpenDialog();
          this.newGame.executable = selection[0];
        },
        installGame: function()
        {
          var source = path.dirname(this.newGame.executable);
          var exeName = path.basename(this.newGame.executable);
          var destination = path.join(settings.config.path, path.basename(source));

          this.installing = true;
          var self = this;

          //console.log("copying " + source + " into " + destination);

          ncp(source, destination, function (err) {
           if (err) {
             return console.error(err);
           }
           console.log('done installing!');
           self.installing = false;
           self.newGame.executable = path.join(destination, exeName);
           self.addGame();
          });
        },
      },
      watch: {
        games: 'saveGameList'
      }
  });

  gameList.loadGameList();
});
