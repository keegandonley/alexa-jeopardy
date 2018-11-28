"use strict";

var Alexa = require("ask-sdk");
var LaunchRequestHandler = require("./handlers/LaunchRequest");
var SessionEndedRequestHandler = require("./handlers/SessionEndedRequest");
var ButtonClickHandler = require("./handlers/ButtonClick");
var ButtonRegisterHandler = require("./handlers/ButtonRegister");
var newRoundHandler = require("./handlers/NewRound");
var ErrorHandler = require("./handlers/Error");
var FailedRegisterHandler = require("./handlers/FailedRegister");
var StartTimeoutHandler = require("./handlers/StartTimeout");
var NoStartHanlder = require("./handlers/NoStart");


var skill = void 0;
module.exports.hello = function(event, context, callback) {
  console.log("REQUEST++++" + JSON.stringify(event));
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        SessionEndedRequestHandler,
        ButtonClickHandler,
        ButtonRegisterHandler,
        newRoundHandler,
        FailedRegisterHandler,
        StartTimeoutHandler,
        NoStartHanlder
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }

  skill.invoke(event, context).then(function(resp) {
    console.log("RESPONSE++++" + JSON.stringify(resp));
    callback(null, resp);
  });
};

