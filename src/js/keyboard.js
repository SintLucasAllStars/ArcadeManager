import Keyboard from 'simple-keyboard';

var currentEdittingInputElement;

$(function (){
  let keyboard = new Keyboard({
    onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button),
    layout: {
      'default': [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        'q w e r t y u i o p [ ] \\',
        'a s d f g h j k l {enter}',
        '{shift} z x c v b n m , . ? {shift}',
        '.com @ {space}'
      ],
      'shift': [
        '1 2 3 4 5 6 7 8 9 0 {bksp}',
        'Q W E R T Y U I O P [ ] \\',
        'A S D F G H J K L {enter}',
        '{shift} Z X C V B N M , . ? {shift}',
        '.com @ {space}'
      ]
    }
  });

  function onChange(input){
    $(currentEdittingInputElement).val(input);
    currentEdittingInputElement.dispatchEvent(new Event('input'))
    //console.log("Input changed", input);
  }

  function onKeyPress(button){
    //console.log("Button pressed", button);
    if (button === "{shift}") handleShiftButton();
  }

  function handleShiftButton() {
    let currentLayout = keyboard.options.layoutName;
    let shiftToggle = currentLayout === "shift" ? "default" : "shift";

    keyboard.setOptions({
      layoutName: shiftToggle
    });
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
