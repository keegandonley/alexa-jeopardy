"use strict";

var Alexa = require("ask-sdk");

var blueAnimation = [
  {
    "durationMs": 1000,
    "color": "0000ff",
    "blend": true
  },
  {
    "durationMs": 1000,
    "color": "0000e6",
    "blend": true
  },
  {
    "durationMs": 1000,
    "color": "0000cc",
    "blend": true
  },
  {
    "durationMs": 1000,
    "color": "0000b3",
    "blend": true
  },
  {
    "durationMs": 1000,
    "color": "0000cc",
    "blend": true
  },
  {
    "durationMs": 1000,
    "color": "0000e6",
    "blend": true
  }
];

var redAnimation = [
  {
    "durationMs": 1000,
    "color": "ff0000",
    "blend": true
  },
  {
    "durationMs": 1000,
    "color": "e60000",
    "blend": true
  },
  {
    "durationMs": 1000,
    "color": "cc0000",
    "blend": true
  },
  {
    "durationMs": 1000,
    "color": "b30000",
    "blend": true
  },
  {
    "durationMs": 1000,
    "color": "cc0000",
    "blend": true
  },
  {
    "durationMs": 1000,
    "color": "e60000",
    "blend": true
  }
];

var rainBowAnimation = [
  {
    "durationMs": 100,
    "color": "ff00ff",
    "blend": false
  },
  {
    "durationMs": 100,
    "color": "ff9900",
    "blend": false
  },
  {
    "durationMs": 100,
    "color": "ffff00",
    "blend": false
  },
  {
    "durationMs": 100,
    "color": "33cc33",
    "blend": false
  },
  {
    "durationMs": 100,
    "color": "66ffff",
    "blend": false
  },
  {
    "durationMs": 100,
    "color": "9900cc",
    "blend": false
  }
];

// Opens the skill, and directs the user to press the buttons they'll use
var LaunchRequestHandler = {
  canHandle: function canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle: function handle(handlerInput) {
    var speechText = "Welcome to computer science club jeopardy! Please press the buttons in use for this game. At any time, say 'exit' to quit.";

    return handlerInput.responseBuilder
      .speak(speechText)
      .addDirective({
        "type": "GameEngine.StartInputHandler",
        "timeout": 90000,
        "proxies": [ "left", "right" ],
        "recognizers": {
          "all pressed": {
            "type": "match",
            "fuzzy": true,
            "anchor": "start",
            "pattern": [
              {
                "gadgetIds": [ "left" ],
                "action": "down"
              },
              {
                "gadgetIds": [ "right" ],
                "action": "down"
              }
            ]
          }
        },
        "events": {
          "register": {
            "meets": [ "all pressed" ],
            "reports": "matches",
            "shouldEndInputHandler": true,
            "maximumInvocations": 1
          },
          "failedregister": {
            "meets": [ "timed out" ],
            "reports": "history",
            "shouldEndInputHandler": true
          }
        }
      })
      .getResponse();
  }
};

var SessionEndedRequestHandler = {
  canHandle: function canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle: function handle(handlerInput) {
    //any cleanup logic goes here
    return handlerInput.responseBuilder.getResponse();
  }
};

// Handles clicking a button once while in-game
// Listens for another click to move on
var ButtonClickHandler = {
  canHandle: function canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "GameEngine.InputHandlerEvent"
      && handlerInput.requestEnvelope.request.events[0]
      && handlerInput.requestEnvelope.request.events[0].name === "userClick"
  },
  handle: function handler(handlerInput) {
    // get the attributes
    var attributes = handlerInput.attributesManager.getSessionAttributes();
    console.log(attributes);
    var winner = handlerInput.requestEnvelope.request.events[0].inputEvents[0].gadgetId;
    attributes.winner = winner;
    return handlerInput.responseBuilder
      .speak("we have a winner! Double click any button to move on")
      .addDirective({
        "type": "GadgetController.SetLight",
        "version": 1,
        "targetGadgets": [ winner ],
        "parameters": {
          "triggerEvent": "none",
          "triggerEventTimeMs": 0,
          "animations": [
            {
              "repeat": 255,
              "targetLights" : [ "1" ],
              "sequence": rainBowAnimation
            }
          ]
        }
      })
      .addDirective({
        "type": "GameEngine.StartInputHandler",
        "timeout": 90000,
        "proxies": [],
        "recognizers": {
          "double_click_recognizer": 
          {
              "type": "match",
              "fuzzy": true,
              "anchor": "end",
              "pattern": [
               {
                 "action": "down"
               },
               {
                "action": "up"
                },
                {
                  "action": "down"
                },
                {
                 "action": "up"
                 },
              ]
           },
        },
        "events": {
          "newRoundClick": {
            "meets": [ "double_click_recognizer"],
            "reports": "matches",
            "shouldEndInputHandler": true,
          }
        }
      })
      .getResponse();
  }
}

// Both buttons are registered, so we set them to animate their color
var ButtonRegisterHandler = {
  canHandle: function canHandle(handlerInput) {
    console.log(JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
    return handlerInput.requestEnvelope.request.type === "GameEngine.InputHandlerEvent"
      && handlerInput.requestEnvelope.request.events[0]
      && handlerInput.requestEnvelope.request.events[0].name === "register";
  },
  handle: function handler(handlerInput) {
    var attributes = handlerInput.attributesManager.getSessionAttributes();
    console.log('Event Handled: GameEngine.InputHandlerEvent');
    var leftId = handlerInput.requestEnvelope.request.events[0].inputEvents[0].gadgetId;
    var rightId = handlerInput.requestEnvelope.request.events[0].inputEvents[1].gadgetId;
    console.log('!!!! REGISTERED: ' + leftId + ', ' + rightId);
    attributes.left = leftId;
    attributes.right = rightId;
    handlerInput.attributesManager.setSessionAttributes(attributes);

    return handlerInput.responseBuilder
      .speak("thanks for registering! Let's get started")
      .addDirective({
        "type": "GadgetController.SetLight",
        "version": 1,
        "targetGadgets": [ leftId ],
        "parameters": {
          "triggerEvent": "none",
          "triggerEventTimeMs": 0,
          "animations": [
            {
              "repeat": 255,
              "targetLights" : [ "1" ],
              "sequence": redAnimation
            }
          ]
        }
      })
      .addDirective({
        "type": "GadgetController.SetLight",
        "version": 1,
        "targetGadgets": [ rightId ],
        "parameters": {
          "triggerEvent": "none",
          "triggerEventTimeMs": 0,
          "animations": [
            {
              "repeat": 255,
              "targetLights" : [ "1" ],
              "sequence": blueAnimation
            }
          ]
        }
      })
      .addDirective({
        "type": "GameEngine.StartInputHandler",
        "timeout": 90000,
        "proxies": [],
        "recognizers": {
          "button_down_recognizer": 
          {
              "type": "match",
              "fuzzy": true,
              "anchor": "end",
              "pattern": [
               {
                 "action": "down"
               }
              ]
           }
        },
        "events": {
          "userClick": {
            "meets": [ "button_down_recognizer" ],
            "reports": "matches",
            "shouldEndInputHandler": true,
            "maximumInvocations": 1
          }
        }
      })
      .getResponse();
  }
}

var newRoundHandler = {
  canHandle: function canHandle(handlerInput) {
    console.log(JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
    return handlerInput.requestEnvelope.request.type === "GameEngine.InputHandlerEvent"
      && handlerInput.requestEnvelope.request.events[0]
      && handlerInput.requestEnvelope.request.events[0].name === "newRoundClick";
  },
  handle: function handler(handlerInput) {
    var attributes = handlerInput.attributesManager.getSessionAttributes();
    var left = attributes.left;
    var right = attributes.right;
    console.log('!!!! NEW ROUND: ' + left + ', ' + right);

    return handlerInput.responseBuilder
      .speak("let's play another turn!")
      .addDirective({
        "type": "GadgetController.SetLight",
        "version": 1,
        "targetGadgets": [ left ],
        "parameters": {
          "triggerEvent": "none",
          "triggerEventTimeMs": 0,
          "animations": [
            {
              "repeat": 255,
              "targetLights" : [ "1" ],
              "sequence": redAnimation
            }
          ]
        }
      })
      .addDirective({
        "type": "GadgetController.SetLight",
        "version": 1,
        "targetGadgets": [ right ],
        "parameters": {
          "triggerEvent": "none",
          "triggerEventTimeMs": 0,
          "animations": [
            {
              "repeat": 255,
              "targetLights" : [ "1" ],
              "sequence": blueAnimation
            }
          ]
        }
      })
      .addDirective({
        "type": "GameEngine.StartInputHandler",
        "timeout": 90000,
        "proxies": [],
        "recognizers": {
          "button_down_recognizer": 
          {
              "type": "match",
              "fuzzy": true,
              "anchor": "end",
              "pattern": [
               {
                 "action": "down"
               }
              ]
           }
        },
        "events": {
          "userClick": {
            "meets": [ "button_down_recognizer" ],
            "reports": "matches",
            "shouldEndInputHandler": true,
            "maximumInvocations": 1
          },
          "roundTimeout": { // TODO: handle timeouts here
            "meets": [ "timed out" ],
            "reports": "history",
            "shouldEndInputHandler": true
          }
        }
      })
      .getResponse();
  }
}



var ErrorHandler = {
  canHandle: function canHandle() {
    return true;
  },
  handle: function handle(handlerInput, error) {
    console.log("Error handled: " + error.message);

    return handlerInput.responseBuilder
      .speak("Sorry, I can't understand the command. Please say again.")
      .reprompt("Sorry, I can't understand the command. Please say again.")
      .getResponse();
  }
};

var skill = void 0;

module.exports.hello = function(event, context, callback) {
  console.log("REQUEST++++" + JSON.stringify(event));
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        SessionEndedRequestHandler,
        // NewRoundRequestHandler,
        ButtonClickHandler,
        ButtonRegisterHandler,
        newRoundHandler
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  skill.invoke(event, context).then(function(resp) {
    console.log("RESPONSE++++" + JSON.stringify(resp));
    callback(null, resp);
  });
};

