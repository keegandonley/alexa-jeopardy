// Opens the skill, and directs the user to press the buttons they'll use
module.exports = {
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
