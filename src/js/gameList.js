
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
          newGame: new Game("Game Title", "No Author", (new Date()).getFullYear(), "GameExecutable.exe"),
          games: [],
          selectedGame: 0,
          installing: false,
          updating: false
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
        installNewDialog: function ()
        {
          this.updating = false;
          this.newGame = new Game("Game Title", "No Author", (new Date()).getFullYear(), "GameExecutable.exe");
        },
        installGame: function()
        {
          var source = path.dirname(this.newGame.executable);
          var exeName = path.basename(this.newGame.executable);
          var destination = path.join(settings.config.path, path.basename(source));

          this.installing = true;
          var self = this;

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
        updateGame: function (game)
        {
          var index = this.games.indexOf(game);
          if (index > -1) {
            this.updating = true;
            this.newGame = game;
            //TODO: Add code to handle changes.
          }
        },
        isSelected: function (game)
        {
          var index = this.games.indexOf(game);
          return this.selectedGame == index;
        },
        next: function (game)
        {
          if(this.selectedGame < this.games.length)
          {
            this.selectedGame++;
          }
          else {
            this.selectedGame = 0;
          }
        },
        prev: function (game)
        {
          if(this.selectedGame > 0)
          {
            this.selectedGame--;
          }
          else {
            this.selectedGame = this.games.length-1;
          }
        }
      },
      watch: {
        games: 'saveGameList'
      },
      mounted: function() {
       var self = this;
       window.addEventListener('keyup', function(event) {
         // If down arrow was pressed...
         if (event.keyCode == 40) { //DOWN ARROW
           self.next();
         } else if(event.keyCode == 38) { //UP ARROW
           self.prev();
         }
       });
     }
  });

  gameList.loadGameList();
});
