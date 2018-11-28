var animations = require("../animations");

module.exports = {
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
				"sequence": animations.red
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
};
