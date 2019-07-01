var request = require('request');
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


    // chatbot will respond upon recieving "rest" (case insensitive)
    controller.hears(async (message) => checkValidRestQuery(message.text) === true, ['message'], async (bot, message) => {
        var botkitInput = extractQuery(message.text);
        // the rest query to process
        await bot.reply(message, "Processing REST request: \'" + botkitInput + "\'");
        // Extract the actual rest query 
        var headers = { 'Accept': 'application/json', 'Content-type': 'text/plain; charset=utf-8', "body": botkitInput }
        request.post("http://localhost:8080/ce-store/special/hudson/interpreter", headers, (error, res, body) => {
            if (error) {
                console.log("the error is " + error);
            } else {
                console.log("The REST API response: \n");
                console.log(body);
            }
        });
        await bot.reply(message, "Check console log for output");
    });
}