// Tiny no sound novel
var SE = (function() {
  return {
    pochi: new Audio("pochi.wav")
  };
})();

var Novel = (function() {
  var stateIndex = 0
  ,   scene = []
  ,   state = []
  ,   presentScene
  ,   semaphore = false;

  function setState() {
    scene = [];
    for(i = 0; i < state[stateIndex].length; i++) {
      scene.push({ 
        message: state[stateIndex][i].message.split(''),
        count: state[stateIndex][i].message.length,
        speed: state[stateIndex][i].speed * 10,
        dom: $("<p>")
      });
    }
  };

  function appendScene() {
    $(".stage").append(presentScene.dom);

    semaphore = true;
    intervalId = setInterval(function() {
      presentScene.dom.text(
        presentScene.dom.text() + presentScene.message.shift()
      );
      SE.pochi.play();

      if (presentScene.message.length == 0) {
        presentScene.dom.text(
          presentScene.dom.text() + "↩\n"
        );
        semaphore = false;
        clearInterval(intervalId);
      }
    }, presentScene.speed);
  }

  function nextState() {
    $(".stage").empty();
    stateIndex++;
    setState();
  }

  var init = function init() {
    setState();
  }

  var play = function() {
    $(".stage").click(function() {
      if (semaphore !== true) {
        presentScene = scene.shift();
        if (presentScene !== undefined) {
          appendScene();
        } else{
          nextState();
          presentScene = scene.shift();
          appendScene();
        }
      }
    });
  };

  var appendStage = function(scene) {
    state.push(scene);
  };

  return {
    init: init,
    appendStage: appendStage,
    play: play
  };
})();

$(function() {
  Novel.appendStage(scenario.one);
  Novel.appendStage(scenario.two);
  Novel.appendStage(scenario.three);
  Novel.appendStage(scenario.four);
  Novel.init();
  Novel.play();
});
