(function() {
  'use strict';

  // Debounce helper function
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }



  /* randomise colors */
  var btnRandomColors = document.getElementById('btn-random-colors'),
    btnRandomColorsInner = document.getElementById('btn-random-colors-inner'),
    colorPickers = document.getElementsByClassName('jscolor'),
    thisRandomColor,
    generatorInput = document.getElementById('color-input'),
    generatorButtons = document.getElementsByClassName('color-input-button');

  btnRandomColors.onclick = function() {
    // animation
    // if animation is already running, stop it and re-trigger it
    if (btnRandomColors.classList.contains('active')) {
      btnRandomColors.classList.remove('active');
      setTimeout(function() {
        btnRandomColors.classList.add('active');
      }, 50);
    }
    // if animation not yet running, trigger it normally
    else {
      btnRandomColors.classList.add('active');
    }

    // update colors
    // random
    if (parseInt(generatorInput.value, 10) === 0) {
      generateColors(randomColor);
    }
    // pastel
    else {
      generateColors(pastelColor);
    }
  };



  // set color generator input by clicking on titles
  function setGeneratorInput(thisButton) {
    generatorInput.value = thisButton.target.dataset.colorInput;
  }

  for (var i = 0; i < generatorButtons.length; i++) {
    generatorButtons[i].onclick = setGeneratorInput;
  }



  // prefixer helper function
  var prefixes = ['webkit', 'moz', ''];

  function prefixedEventListener(element, type, callback) {
    for (var p = 0; p < prefixes.length; p++) {
      if (!prefixes[p]) {
        type = type.toLowerCase();
      }
      element.addEventListener(prefixes[p]+type, callback, false);
    }
  }



  // listen for animation end and remove animation class
  prefixedEventListener(btnRandomColors, 'AnimationEnd', function(e) {
    btnRandomColors.classList.remove('active');
  });


  
  // output a single color hex value
  var outputColor;

  function randomColor() {
    outputColor = '';
    for (var i = 1; i <= 6; i++) {
      outputColor = outputColor + (~~(Math.random()*16)).toString(16);
    }
    return outputColor;
  }



  // output a pastel color hex value (http://stackoverflow.com/a/12266311)
  var r,
    g,
    b;

  function randHex() {
    return (Math.round(Math.random()* 127) + 127).toString(16);
  }

  function pastelColor() {
    r = randHex();
    g = randHex();
    b = randHex();
    return r + g + b;
  }

  // generate colors
  function generateColors(generationFunction) {
    for (var c = 1; c <= 5; c++) {
      thisRandomColor = generationFunction();
      updateCol(c, thisRandomColor, true);

      // animate and update color pickers ("c - 1" matches the index of the color picker)
      colorPickers[c - 1].classList.add('animate-color');
      colorPickers[c - 1].jscolor.fromString(thisRandomColor);
    }
  }



  // update shapes
  var thisClassName,
    selectedShapes;

  function updateCol(number, color, animateColor) {
    // remove animation from color picker ("number - 1" matches the index of the color picker)
    colorPickers[number - 1].classList.remove('animate-color');

    thisClassName = 'col-' + number;
    selectedShapes = document.getElementsByClassName(thisClassName);

    // changeCol(selectedShapes, color, animateColor);

    for (var i = 0; i < selectedShapes.length; i++) {
      if (animateColor) {
        selectedShapes[i].classList.add('animate-color');
      }
      else {
        selectedShapes[i].classList.remove('animate-color');
      }
      selectedShapes[i].style.backgroundColor = '#' + color;
    }
  }

  var debounceUpdateCol = debounce(function(number, color, animateColor) {
    updateCol(number, color, animateColor);
  }, 15);

  // attach "debounceUpdateCol" to window for global scope 
  window.debounceUpdateCol = debounceUpdateCol;



  /* Filters */
  var setFilters = debounce(function() {
    filterString = 'brightness(' + brightnessInput.value + '%) saturate(' + saturateInput.value + '%) hue-rotate(' + hueRotateInput.value + 'deg) grayscale(' + grayscaleInput.value + '%)';
    stage.style.webkitFilter = filterString;
    stage.style.filter = filterString;

    filterOutput.textContent = '-webkit-filter: ' + filterString + '; filter: ' + filterString + ';';
  }, 15);



  // get main stage element
  var stage = document.getElementById('stage');

  // filters
  var brightnessInput = document.getElementById('brightness-input');
  var saturateInput = document.getElementById('saturate-input');
  var hueRotateInput = document.getElementById('hue-rotate-input');
  var grayscaleInput = document.getElementById('grayscale-input');
  var filterString;
  var filterOutput = document.getElementById('filter-output');

  // array with all filters
  var inputs = [];
  inputs.push(brightnessInput, saturateInput, hueRotateInput, grayscaleInput);
  for (var j = 0; j < inputs.length; j++) {
    inputs[j].addEventListener('input', setFilters, true);
  }



  // reset filters
  var btnResetFilters = document.getElementById('btn-reset-filters');

  btnResetFilters.onclick = function() {
    brightnessInput.value = 100;
    saturateInput.value = 100;
    hueRotateInput.value = 0;
    grayscaleInput.value = 0;

    setFilters();
  };

  // init filter output text on load
  setFilters();

})();