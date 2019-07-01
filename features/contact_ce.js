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
        //"REST: query here".substring("REST: ".length) == "query here"
        return botkitText.substring(restQueryMarker.length)
    }

    // chatbot will respond upon recieving query beginning with "REST: " (case sensitive)
    controller.hears(async (message) => checkValidRestQuery(message.text) === true, ['message'], async (bot, message) => {
        var botkitInput = extractQuery(message.text);
        // the rest query to process
        await bot.reply(message, "Processing REST request: \'" + botkitInput + "\'");
        var headers = { 'Accept': 'application/json', 'Content-type': 'text/plain; charset=utf-8', "body": botkitInput }
        // request wrapped in await(promise) function, to make POST response available
        response = await rp.post("http://localhost:8080/ce-store/special/hudson/interpreter", headers)
            .catch(function (error) {
                console.error("POST query not successful, error is \n" + error)
                return ("ERROR:\n" + error);
            });
        // chatbot replies with POST reponse (or in place html error, tested with url error)
        await bot.reply(message, response);
    });
}