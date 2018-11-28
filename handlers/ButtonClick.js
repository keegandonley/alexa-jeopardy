var animations = require("../animations");

// Handles clicking a button once while in-game
// Listens for another click to move on
module.exports = {
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
				"sequence": animations.rainbow
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
};
