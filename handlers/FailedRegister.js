/*
	User failed to register buttons in 30 seconds, alexa skill exits
*/
module.exports = {
	canHandle: function canHandle(handlerInput) {
	  console.log(JSON.stringify(handlerInput.requestEnvelope.request, null, 2));
	  return handlerInput.requestEnvelope.request.type === "GameEngine.InputHandlerEvent"
		&& handlerInput.requestEnvelope.request.events[0]
		&& handlerInput.requestEnvelope.request.events[0].name === "failedRegister";
	},
	handle: function handler(handlerInput) {
	  return handlerInput.responseBuilder
		.speak("Sorry, you need to register buttons to play! Goodbye")
		.withShouldEndSession(true)
		.getResponse();
	}
};
