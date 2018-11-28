module.exports = {
	canHandle: function canHandle(handlerInput) {
	  return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
	},
	handle: function handle(handlerInput) {
	  //any cleanup logic goes here
	  return handlerInput.responseBuilder.getResponse();
	}
};