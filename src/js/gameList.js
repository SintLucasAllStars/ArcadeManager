
var gameList;

var Game = function (title, author, year, executable, timesPlayed)
{
  this.title = title;
  this.author = author;
  this.year = year;
  this.executable = executable;
  this.timesPlayed = timesPlayed;
}

$(function (){
  gameList = new Vue ({
      el: "#gameList",
      data: {
          newGame: new Game("", "", (new Date()).getFullYear(), "", 0),
          games: [],
          selectedGame: 0,
          installing: false,
          updating: false,
          anticheat: false,
          anticheatTime: 5
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
          this.games.push(new Game(this.newGame.title, this.newGame.author, this.newGame.year, this.newGame.executable, this.newGame.timesPlayed));
        },
        removeGame: function(game){
          var index = this.games.indexOf(game);
          if (index > -1) {
            this.games.splice(index, 1);
            var dir = path.dirname(game.executable);
            rimraf.sync(dir);
          }
        },
        runGame: function(game){
          if(!this.anticheat)
          {
            this.anticheat = true;
            var self = this;
            setTimeout(function(){self.anticheat = false;}, this.anticheatTime*1000);
            game.timesPlayed++;
            this.saveGameList();
            shell.openItem(game.executable);
          }
        },
        selectExe: function ()
        {
          var selection = dialog.showOpenDialog();
          this.newGame.executable = selection[0];
        },
        installNewDialog: function ()
        {
          this.updating = false;
          this.newGame.title = "";
          this.newGame.author = "";
          this.newGame.year = (new Date()).getFullYear();
          this.newGame.executable = "";
          this.newGame.timesPlayed = 0;
        },
        installGame: function()
        {
          if(this.updating)
          {
            var original = this.games[this.selectedGame];
            this.removeGame(original);
          }

          var source = path.dirname(this.newGame.executable);
          var exeName = path.basename(this.newGame.executable);
          var destination = path.join(settings.config.path, path.basename(source));

          this.installing = true;
          var self = this;

          if(source != destination)
          {
            console.log("Will copy " + source + " ---> " + destination);
            ncp(source, destination, function (err) {
             if (err) {
               return console.error(err);
             }
             console.log('done installing!');
             self.installing = false;
             self.newGame.executable = path.join(destination, exeName);
             self.addGame();
            });
          }
          else
          {
            console.log("NOT COPYING " + source + " ---> " + destination);
            self.addGame();
          }
        },
        updateGame: function (game)
        {
          var index = this.games.indexOf(game);
          if (index > -1) {
            this.selectedGame = index;
            this.updating = true;
            this.newGame.title = game.title;
            this.newGame.author = game.author;
            this.newGame.year = game.year;
            this.newGame.executable = game.executable;
            this.newGame.timesPlayed = game.timesPlayed;
          }
        },
        getCoverURL: function (game)
        {
          var index = this.games.indexOf(game);
          if (index > -1) {
            var dir = path.dirname(this.games[index].executable);
            var cover = path.join(dir, "cover.jpg");
            if(fs.existsSync(cover)) {
              var _img = fs.readFileSync(cover).toString('base64');
              var cover_base64 = "data:image/png;base64," + _img;
              return cover_base64;
            }
            else {
              return "images/cover.jpg";
            }
          }
        },
        isSelected: function (game)
        {
          var index = this.games.indexOf(game);
          return this.selectedGame == index;
        },
        selectGame: function (game)
        {
          var index = this.games.indexOf(game);
          if(index > -1)
          {
            this.selectedGame = index;
          }
        },
        next: function (game)
        {
          if(!this.updating){
            if(this.selectedGame < this.games.length-1)
            {
              this.selectedGame++;
            }
            else {
              this.selectedGame = 0;
            }
          }
        },
        prev: function (game)
        {
          if(!this.updating){
            if(this.selectedGame > 0)
            {
              this.selectedGame--;
            }
            else {
              this.selectedGame = this.games.length-1;
            }
          }
        },
        redButton: function (){
          this.runGame(this.games[this.selectedGame]);
        },
        blueButton: function (){
          this.removeGame(this.games[this.selectedGame]);
        },
        yellowButton: function(){
          $(".tile-group .selected .yellow button").click();
        },
        greenButton: function () {
          this.installNewDialog();
          $("#installButton").click();
        },
        whiteButton: function () {
          $("#instructionsButton").click();
        }
      },
      watch: {
        games: 'saveGameList'
      },
      mounted: function() {
       var self = this;
       window.addEventListener('keyup', function(event) {
         // If down arrow was pressed...
         if (event.keyCode == 39 || event.keyCode == 68) { //RIGHT ARROW or D
           self.next();
         } else if(event.keyCode == 37 || event.keyCode == 65) { //LEFT ARROW or A
           self.prev();
         } else if(event.keyCode == 82 || event.keyCode == 55) //Red
         {
           event.preventDefault();
           self.redButton();
         } else if(event.keyCode == 16 || event.keyCode == 56) //Blue
         {
           event.preventDefault();
           self.blueButton();
         } else if(event.keyCode == 70 || event.keyCode == 57) //Yellow
         {
           event.preventDefault();
           self.yellowButton();
         }
         else if(event.keyCode == 32 || event.keyCode == 52) //Green
         {
           event.preventDefault();
           self.greenButton();
         }
         else if(event.keyCode == 17 || event.keyCode == 53) //White
         {
           event.preventDefault();
           self.whiteButton();
         }
       });
     }
  });

  $('#newGameModal').on('hidden.bs.modal', function () {
    gameList.updating = false;
  })

  gameList.loadGameList();
});
