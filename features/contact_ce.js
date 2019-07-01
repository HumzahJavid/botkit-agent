var request = require('request'); 
module.exports = function(controller) {

    // chatbot will respond upon recieving "rest" (case insensitive)
    controller.hears(async(message) => message.text && message.text.toLowerCase() === 'rest', ['message'], async (bot, message) => {
        await bot.reply(message, "Processing REST request");
        // the rest query to process
        var botkit_input = 'list people';
        var headers = {'Accept': 'application/json', 'Content-type': 'text/plain; charset=utf-8', "body": botkit_input}
        request.post("http://localhost:8080/ce-store/special/hudson/interpreter", headers, (error, res, body) => {
            if (error){
                console.log("the error is " + error);
            } else {
                console.log("The REST API response: \n");
                console.log(body);
            }
        })
    });
}