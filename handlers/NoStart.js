/*
	Called if the user doesn't start a game within 90 seconds after being warned
	Exits the Alexa skill
*/

module.exports = {
	canHandle: function canHandle(handlerInput) {
	  console.log(JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
	  return handlerInput.requestEnvelope.request.type === "GameEngine.InputHandlerEvent"
		&& handlerInput.requestEnvelope.request.events[0]
		&& handlerInput.requestEnvelope.request.events[0].name === "noStart";
	},
	handle: function handler(handlerInput) {
	  return handlerInput.responseBuilder
		.speak("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/>Hmm, it looks like you still haven't started a game. Goodbye")
		.withShouldEndSession(true)
		.getResponse();
	}
};