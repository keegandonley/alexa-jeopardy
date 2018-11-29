/*
	Opens the skill, and directs the user to press the buttons they'll use

	Returns directive with 30 second timeout to click both buttons
	Emits register on completion (IMPLEMENTED)
	Emits failedRegister on timeout (IMPLEMENTED)
*/

module.exports = {
	canHandle: function canHandle(handlerInput) {
	  return handlerInput.requestEnvelope.request.type === "LaunchRequest";
	},
	handle: function handle(handlerInput) {
	  var speechText = "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_intro_01'/>Welcome to computer science club jeopardy! Please press the buttons in use for this game. At any time, say 'exit' to quit.";
  
	  return handlerInput.responseBuilder
		.speak(speechText)
		.addDirective({
		  "type": "GameEngine.StartInputHandler",
		  "timeout": 30000,
		  "proxies": [ "red", "blue", "green", "pink" ],
		  "recognizers": {
			"all pressed": {
			  "type": "match",
			  "fuzzy": true,
			  "anchor": "start",
			  "pattern": [
				{
				  "gadgetIds": [ "red" ],
				  "action": "down"
				},
				{
				  "gadgetIds": [ "blue" ],
				  "action": "down"
				},
				{
				  "gadgetIds": [ "green" ],
				  "action": "down"
				},
				{
				  "gadgetIds": [ "pink" ],
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
			"failedRegister": {
			  "meets": [ "timed out" ],
			  "reports": "history",
			  "shouldEndInputHandler": true
			}
		  }
		})
		.getResponse();
	}
  };
