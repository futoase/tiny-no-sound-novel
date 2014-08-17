// Tiny no sound novel
var SE = (function() {
  wave = {
    pochi: new Audio("pochi.wav")
  };

  wave.pochi.volume = 0.1;

  return wave;
})();

var Novel = (function() {
  var stateIndex = 0;
  var scene = [];
  var state = [];

  var presentScene
  ,   semaphore
  ,   type;

  function setState() {
    scene = [];

    for(i = 0; i < state[stateIndex].length; i++) {
      currentState = state[stateIndex][i];
      if (currentState.type == "message") {
        scene.push({ 
          type: currentState.type,
          message: currentState.message.split(''),
          count: currentState.message.length,
          speed: currentState.speed * 10,
          dom: $("<p class='message'>")
        });
      } else if (currentState.type == "image"){
        scene.push({
          type: currentState.type,
          url: currentState.url
        });
      }
    }
  };

  function appendScene() {
    $(".stage").append(presentScene.dom);

    if (presentScene.type == "message") {
      createMessageScene(presentScene);
    } else if (presentScene.type == "image") {
      changeImageScene(presentScene);
    }
  }

  function createMessageScene(presentScene) {
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

  function changeImageScene(presentScene) {
    $(".stage").css('background-image', 'url(' + presentScene.url +  ')');
  }

  function nextState() {
    $(".stage").empty();
    stateIndex++;
    setState();
  }

  function initializeStage(sceneConfig) {
    $(".stage").css('background-image', 'url(' + sceneConfig.url +  ')');
  }

  var init = function init(sceneConfig) {
    initializeStage(sceneConfig);
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
  Novel.init(scenario.init);
  Novel.play();
});
