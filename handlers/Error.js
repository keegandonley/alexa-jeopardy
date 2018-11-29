module.exports = {
	canHandle: function canHandle() {
		return true;
	},
	handle: function handle(handlerInput, error) {
		console.log("Error handled: " + error.message);

		return handlerInput.responseBuilder
			.speak("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/>Sorry, I can't understand the command. Please say again.")
			.reprompt("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_neutral_response_01'/>Sorry, I can't understand the command. Please say again.")
			.getResponse();
	}
};
