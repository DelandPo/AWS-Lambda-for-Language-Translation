const RapidAPI = require('rapidapi-connect');
const rapid = new RapidAPI("default-application_599635c0e4b028109d40f323", "664e0992-ede1-4fc6-8a63-16e6001c75b7");


const langCodes = {
    "Dutch" : "nl",
    "German" : "de",
    "English" : "en",
    "French" : "fr",
    "Italian" : "it",
    "Spanish" : "es"
};



buildSpeechletResponse = (outputText, shouldEndSession) => {
    
      return {
        outputSpeech: {
          type: "PlainText",
          text: outputText
        },
        shouldEndSession: shouldEndSession
      }
    
    }
    
 generateResponse = (speechletResponse, sessionAttributes) => {
    
      return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
      }
    }

exports.handler = (event, context) => {
    
    try {
        if(event.session.new){
            console.log("It is the new session")
        }
        
        switch(event.request.type){
            case "LaunchRequest":
                console.log('Launch Request')
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse("Welcome to our translator app, To start translating, Say something like How do you say Hello in Spanish. To know more about the supported Language say Language ",false),
                        {}
                    )
                )
                break;
    
            case "IntentRequest":
                 console.log("Intent Request")
                 switch(event.request.intent.name)
                 {
                     case "StartConversationIn":
                        
                                language = event.request.intent.slots.Language.value;
                                ptext = event.request.intent.slots.PlainText.value;
                                langCode = langCodes[language];
                                console.log("Language: "+language);
                                console.log("Sentence : "+ptext);
                                console.log("Language Code :"+langCode);
                                rapid.call('GoogleTranslate', 'translate', {
                                    'apiKey': 'AIzaSyAiKm5vqqjwZ22qxEb4OqCWq9zD1AHxWD0',
                                    'string': ptext,
                                    'targetLanguage': langCode
                        
                            }).on('success', (payload) => {
                                context.succeed(
                                    generateResponse(
                                        buildSpeechletResponse(payload,true),
                                        {}
                                    )
                                );
                            }).on('error',(payload) => {
                                context.fail(
                                    generateResponse(
                                        buildSpeechletResponse("Translation was unsucessful",true),
                                        {}
                                    )
                                )
                            });
                    break;

                    case "AMAZON.HelpIntent":
                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse("To start translating Say something like how do you say hello in french",false),
                                {}
                            )
                        )
                    break;

                    case "AMAZON.StopIntent":
                    context.succeed(
                        generateResponse(
                            buildSpeechletResponse("Goodbye, Have a good day!",true),
                            {}
                        )
                    )
                    break;

                    case "SupportedLanguage":
                    context.succeed(
                        generateResponse(
                            buildSpeechletResponse("The supported languages are German, Dutch, French, Italian, Spanish, English",true),
                            {}
                        )
                    )
                    break;

                    default:
                    console.log("hey");
                        context.succeed(
                            generateResponse(
                                buildSpeechletResponse("Some thing went wrong, Could you try one more time? Say something like how do you say hello in french",true),
                                {}
                            )
                        )
                 }
                break;

            case "SessionEndedRequest":
                console.log("Session has been ended")
                break;
    
            default:
                context.succeed(
                    generateResponse(
                        buildSpeechletResponse("Some thing went wrong, Could you try one more time? Say something like how do you say hello in french",true),
                        {}
                    )
                )
        }
    } 

    catch (error) {
      
        console.log("Hello world!");
        context.succeed(
            generateResponse(
                buildSpeechletResponse("Some thing went wrong, Could you try one more time? Say something like how do you say hello in french For more information Say Help ",false),
                {}
            )
        )        
    }
    
  };
