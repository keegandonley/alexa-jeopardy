/*
	Called if the user doesn't start a game within 90 seconds after registering

	Returns directive with 30 second timeout to click both buttons
	Emits newRoundClick on completion (IMPLEMENTED)
	Emits noStart on timeout (IMPLEMENTED)
*/

module.exports = {
	canHandle: function canHandle(handlerInput) {
		console.log(JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
		return handlerInput.requestEnvelope.request.type === "GameEngine.InputHandlerEvent"
			&& handlerInput.requestEnvelope.request.events[0]
			&& handlerInput.requestEnvelope.request.events[0].name === "startTimeout";
	},
	handle: function handler(handlerInput) {
		return handlerInput.responseBuilder
			.speak("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/>Hmm, it looks like you haven't started a game yet. I'll give you another 90 seconds.")
			.addDirective({
				"type": "GameEngine.StartInputHandler",
				"timeout": 90000,
				"proxies": [],
				"recognizers": {
					"button_down_recognizer": {
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
						"meets": ["button_down_recognizer"],
						"reports": "matches",
						"shouldEndInputHandler": true,
						"maximumInvocations": 1
					},
					"noStart": {
						"meets": ["timed out"],
						"reports": "history",
						"shouldEndInputHandler": true
					}
				}
			})
			.getResponse();
	}
};