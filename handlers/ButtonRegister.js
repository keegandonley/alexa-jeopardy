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
	  var redId = handlerInput.requestEnvelope.request.events[0].inputEvents[0].gadgetId;
		var blueId = handlerInput.requestEnvelope.request.events[0].inputEvents[1].gadgetId;
		var greenId = handlerInput.requestEnvelope.request.events[0].inputEvents[2].gadgetId;
		var pinkId = handlerInput.requestEnvelope.request.events[0].inputEvents[3].gadgetId;
	  console.log('!!!! REGISTERED: ' + redId + ', ' + blueId + ', ' + greenId + ', ' + pinkId);
	  attributes.red = redId;
		attributes.blue = blueId;
		attributes.green = greenId;
		attributes.pink = pinkId;
	  handlerInput.attributesManager.setSessionAttributes(attributes);
  
	  return handlerInput.responseBuilder
		.speak("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_bridge_01'/>thanks for registering! Let's get started. Click any button to start the first round")
		.addDirective({
		  "type": "GadgetController.SetLight",
		  "version": 1,
		  "targetGadgets": [ redId ],
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
		  "targetGadgets": [ blueId ],
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
		  "type": "GadgetController.SetLight",
		  "version": 1,
		  "targetGadgets": [ greenId ],
		  "parameters": {
			"triggerEvent": "none",
			"triggerEventTimeMs": 0,
			"animations": [
			  {
				"repeat": 255,
				"targetLights" : [ "1" ],
				"sequence": animations.green
			  }
			]
		  }
		})
		.addDirective({
		  "type": "GadgetController.SetLight",
		  "version": 1,
		  "targetGadgets": [ pinkId ],
		  "parameters": {
			"triggerEvent": "none",
			"triggerEventTimeMs": 0,
			"animations": [
			  {
				"repeat": 255,
				"targetLights" : [ "1" ],
				"sequence": animations.pink
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
