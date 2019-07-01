var request = require('request');
var rp = require("request-promise-native");
module.exports = function (controller) {

    function checkValidRestQuery(botkitText) {
        var restQueryMarker = "REST: ";
        if (botkitText.includes(restQueryMarker)) {
            return true;
        } else {
            return false;
        }
    }

    function extractQuery(botkitText) {
        var restQueryMarker = "REST: ";
        return botkitText.substring(restQueryMarker.length)
        //tf.substring(find.length)
        //"REST: query here".substring("REST: ".length) == "query here"
    }

    // chatbot will respond upon recieving query beginning with "REST: " (case sensitive)
    controller.hears(async (message) => checkValidRestQuery(message.text) === true, ['message'], async (bot, message) => {
        var botkitInput = extractQuery(message.text);
        // the rest query to process
        await bot.reply(message, "Processing REST request: \'" + botkitInput + "\'");
        var headers = { 'Accept': 'application/json', 'Content-type': 'text/plain; charset=utf-8', "body": botkitInput }
        // request wrapped in promise
        rp.post("http://localhost:8080/ce-store/special/hudson/interpreter", headers)
            .then(function (body) {
                console.log("The REST API response: \n");
                console.log(body);
            })
            .catch(function (error) {
                console.error("the error is " + error);
            });
        await bot.reply(message, "Check console log for output");
    });
}