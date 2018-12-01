var animations = require("../animations");
const phrases = ['we have a winner!', 'Congratulations!', 'That\'s the round!']

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
			.speak("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>"+ phrases[Math.floor(Math.random() * 100) % phrases.length] + "Double click the winning button to move on")
			.addDirective({
				"type": "GadgetController.SetLight",
				"version": 1,
				"targetGadgets": [winner],
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
						],
						"gadgetIds": [winner]
					},
				},
				"events": {
					"newRoundClick": {
						"meets": ["double_click_recognizer"],
						"reports": "matches",
						"shouldEndInputHandler": true,
					},
					"newRoundTimeout": {
						"meets": ["timed out"],
						"reports": "history",
						"shouldEndInputHandler": true
					}
				}
			})
			.getResponse();
	}
};
