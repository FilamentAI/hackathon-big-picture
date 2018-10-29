'use strict';

// =================================================================================
// App Configuration
// =================================================================================
require('dotenv').config();
const { App } = require('jovo-framework');
const cardService = require('./services/card.service');
const imageService = require('./services/image.service');;

const config = {
    logging: false,
};

const app = new App(config);


// =================================================================================
// App Logic
// =================================================================================

app.setHandler(
    require('./states/welcome.state'),
    require('./states/game.state'),
    {
        'LAUNCH': function () {
            this.toIntent('WelcomeIntent');
        },

        'WelcomeIntent': function () {
            const user = this.getUserId();
            const speech = `<speak>
        Let's play Big Picture! I'm going to show you pictures, tell me the animal you see! You will need the Google Assistant app on your phone to play this game.
        <break time="1s"/>
        <emphasis level="strong">Ok, lets go!</emphasis>
        </speak>`

            imageService.getRandomImage().then(result => {
                this.setSessionAttribute('currentObject', result.tag);
                this.setSessionAttribute('currentAttempts', 0);
                this.setSessionAttribute('currentfullImage', result.full_img);
                this.setSessionAttribute('currentURLs', [{
                    url: result.segment_img,
                    id: result.imageId,
                    segment: result.segment
                }]);
    
                cardService.createCard.call(this, result.segment_img);
                this.followUpState('GameState').ask(speech);
            });
        },
        'EndIntent': function () {
            let speech = `Goodbye, thanks for playing!`;
            this.tell(speech);
        }
    });

module.exports.app = app;
