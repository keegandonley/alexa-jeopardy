var animations = require("../animations");

// Handles clicking a button once while in-game
// Listens for another click to move on
module.exports = {
	canHandle: function canHandle(handlerInput) {
	  return handlerInput.requestEnvelope.request.type === "GameEngine.InputHandlerEvent"
		&& handlerInput.requestEnvelope.request.events[0]
		&& handlerInput.requestEnvelope.request.events[0].name === "newRoundFail"
	},
	handle: function handler(handlerInput) {
	  return handlerInput.responseBuilder
		.speak("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/>Thanks for playing!<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_outro_01'/>")
		.withShouldEndSession(true)
		.getResponse();
	}
};
