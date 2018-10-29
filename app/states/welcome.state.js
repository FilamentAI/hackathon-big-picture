const cardService = require('../services/card.service');

let dogImage = 'http://mymodernmet.com/wp/wp-content/uploads/2017/09/dog-portraits-alexander-khokhlov-5.jpg';
module.exports = {
    'WelcomeState': {
        'AnswerIntent': function (object) {
            this.toIntent('MyNameIsIntent', object);
        },

        'MyNameIsIntent': function (name) {
            if (name.value && name.value.length > 0) {
                this.setSessionAttribute('name', name.value);
                const speech = `Hey ${name.value}, nice to meet you! Let's start... What is this a picture of?`;
                const reprompt = `What is this a picture of?`;

                this.setSessionAttribute('currentObject', 'dog');
                this.setSessionAttribute('currentAttempts', 0);
                this.setSessionAttribute('currentURLs', [dogImage]);
                
                cardService.createCard.call(this, dogImage);
                this.followUpState('GameState').ask(speech, reprompt);
            } else {
                this.toIntent('AskNameAgain');
            }
        },

        'AskNameAgain': function () {
            const speech = `Sorry, I didn't get that, what is your name?`;
            const reprompt = `What is your name?`;
            this.ask(speech, reprompt);
        }
    }
}