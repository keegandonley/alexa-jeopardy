module.exports = {
	canHandle: function canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
	},
	handle: function handle(handlerInput) {
		//any cleanup logic goes here
		return handlerInput.responseBuilder
		.speak("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/> Thanks for playing!<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_outro_01'/>")
		.withShouldEndSession(true)
		.getResponse();
	}
};