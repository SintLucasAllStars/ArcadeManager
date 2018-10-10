import Keyboard from 'simple-keyboard';

var currentEdittingInputElement;

$(function (){
  let keyboard = new Keyboard({
    onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button)
  });

  function onChange(input){
    currentEdittingInputElement.value = input;
    //console.log("Input changed", input);
  }

  function onKeyPress(button){
    //console.log("Button pressed", button);
  }

  $("input[type=text]").focus(function (){
    //$("#keyboard").slideToggle(200);
    currentEdittingInputElement = this;
    keyboard.setInput(currentEdittingInputElement.value);
  });

  $(window).on('shown.bs.modal', function (event){
      if($(event.target).hasClass('keyboard'))
      {
        $("#keyboard").slideToggle(100);
      }
  });

  $(window).on('hidden.bs.modal', function (event){
    if($(event.target).hasClass('keyboard'))
    {
      $("#keyboard").slideToggle(100);
    }
  });
});
