var animations = require("../animations");

// Handles clicking a button once while in-game
// Listens for another click to move on
module.exports = {
	canHandle: function canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === "GameEngine.InputHandlerEvent"
			&& handlerInput.requestEnvelope.request.events[0]
			&& handlerInput.requestEnvelope.request.events[0].name === "newRoundTimeout"
	},
	handle: function handler(handlerInput) {
		var attributes = handlerInput.attributesManager.getSessionAttributes();
		return handlerInput.responseBuilder
			.speak("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/>If you'd like to continue playing, double click any button to move on. I'll give you 90 seconds")
			.addDirective({
				"type": "GadgetController.SetLight",
				"version": 1,
				"targetGadgets": [attributes.winner],
				"parameters": {
					"triggerEvent": "none",
					"triggerEventTimeMs": 0,
					"animations": [
						{
							"repeat": 255,
							"targetLights": ["1"],
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
						"meets": ["double_click_recognizer"],
						"reports": "matches",
						"shouldEndInputHandler": true,
					},
					"newRoundFail": {
						"meets": ["timed out"],
						"reports": "history",
						"shouldEndInputHandler": true
					}
				}
			})
			.getResponse();
	}
};
