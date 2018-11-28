var animations = require("../animations");

module.exports = {
	canHandle: function canHandle(handlerInput) {
	  console.log(JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
	  return handlerInput.requestEnvelope.request.type === "GameEngine.InputHandlerEvent"
		&& handlerInput.requestEnvelope.request.events[0]
		&& handlerInput.requestEnvelope.request.events[0].name === "roundFail";
	},
	handle: function handler(handlerInput) {
	  var attributes = handlerInput.attributesManager.getSessionAttributes();
	  var left = attributes.left;
	  var right = attributes.right;
	  console.log('!!!! NEW ROUND: ' + left + ', ' + right);
  
	  return handlerInput.responseBuilder
		.speak("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_negative_response_01'/>That's time! Double click any button to go to the next round<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_countdown_loop_64s_minimal_01'/>")
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
			  },
			  "newRoundTimeout" : {
				"meets": [ "timed out" ],
				"reports": "history",
				"shouldEndInputHandler": true
			  }
			}
		  })
		.getResponse();
	}
};
