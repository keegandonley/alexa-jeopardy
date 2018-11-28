/*
	Both buttons are registered, so we set them to animate their color

	Returns directive with 90 second timeout to click any button and start
	Emits newRoundClick on completion (IMPLEMENTED)
	Emits startTimeout on timeout (IMNPLEMENTED)
*/
var animations = require("../animations");

module.exports = {
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
		.speak("thanks for registering! Let's get started. Click any button to start the first round")
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
				"sequence": animations.red
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
				"sequence": animations.blue
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
			"newRoundClick": {
			  "meets": [ "button_down_recognizer" ],
			  "reports": "matches",
			  "shouldEndInputHandler": true,
			  "maximumInvocations": 1
			},
			"startTimeout" : {
				"meets": [ "timed out" ],
				"reports": "history",
				"shouldEndInputHandler": true
			}
		  }
		})
		.getResponse();
	}
};
