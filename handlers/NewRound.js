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
		var red = attributes.red;
		var blue = attributes.blue;
		var green = attributes.green;
		var pink = attributes.pink;
		console.log('!!!! NEW ROUND: ' + red + ', ' + blue + ', ' + green + ', ' + pink);

		return handlerInput.responseBuilder
			.speak("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_bridge_02'/>let's play!<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_countdown_loop_64s_minimal_01'/>")
			.addDirective({
				"type": "GadgetController.SetLight",
				"version": 1,
				"targetGadgets": [red],
				"parameters": {
					"triggerEvent": "none",
					"triggerEventTimeMs": 0,
					"animations": [
						{
							"repeat": 255,
							"targetLights": ["1"],
							"sequence": animations.red
						}
					]
				}
			})
			.addDirective({
				"type": "GadgetController.SetLight",
				"version": 1,
				"targetGadgets": [blue],
				"parameters": {
					"triggerEvent": "none",
					"triggerEventTimeMs": 0,
					"animations": [
						{
							"repeat": 255,
							"targetLights": ["1"],
							"sequence": animations.blue
						}
					]
				}
			})
			.addDirective({
				"type": "GadgetController.SetLight",
				"version": 1,
				"targetGadgets": [green],
				"parameters": {
					"triggerEvent": "none",
					"triggerEventTimeMs": 0,
					"animations": [
						{
							"repeat": 255,
							"targetLights": ["1"],
							"sequence": animations.green
						}
					]
				}
			})
			.addDirective({
				"type": "GadgetController.SetLight",
				"version": 1,
				"targetGadgets": [pink],
				"parameters": {
					"triggerEvent": "none",
					"triggerEventTimeMs": 0,
					"animations": [
						{
							"repeat": 255,
							"targetLights": ["1"],
							"sequence": animations.pink
						}
					]
				}
			})
			.addDirective({
				"type": "GameEngine.StartInputHandler",
				"timeout": 64000,
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
						"meets": ["button_down_recognizer"],
						"reports": "matches",
						"shouldEndInputHandler": true,
						"maximumInvocations": 1
					},
					"roundTimeout": {
						"meets": ["timed out"],
						"reports": "history",
						"shouldEndInputHandler": true
					}
				}
			})
			.getResponse();
	}
};
