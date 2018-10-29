const cardService = require('../services/card.service');
const imageService = require('../services/image.service');

const maxAttempts = 3;
module.exports = {
    'GameState': {
        'AnswerIntent': function (object) {
            if (answerIsCorrect.call(this, object.value)) {
                const url = this.getSessionAttribute('currentfullImage');
                let answer = this.getSessionAttribute('currentObject');
                cardService.createCard.call(this, url, `It's a ${answer}!`);
                this.ask(`That's right, great job!\n\nWould you like to do another one?`);
            } else {
                this.toIntent('TryAgainIntent');
            }
        },

        'StartRound': function () {
            getNextQuestion.call(this).then(url => {
                cardService.createCard.call(this, url);
                this.ask(`What is this a picture of?`);
            });
        },

        'DecisionIntent': function (object) {
            let inputs = this.getInputs();
            if (inputs.positive.value && inputs.positive.value.length > 0) {
                this.toIntent('StartRound');
            } else {
                this.toStatelessIntent('EndIntent');
            }
        },

        'TryAgainIntent': async function () {
            const responses = [
                `Sorry, that's not right. What could it be?`,
                `That's not it, last try!`
            ]

            let attempts = this.getSessionAttribute('currentAttempts');
            let answer = this.getSessionAttribute('currentObject');
            attempts++;
            if (attempts >= maxAttempts) {
                const url = this.getSessionAttribute('currentfullImage');
                cardService.createCard.call(this, url, `It's a ${answer}!`);
                this.ask(`Sorry, it's actually a ${answer}!\n\nWould you like to do another one?`);
            } else {
                this.setSessionAttribute('currentAttempts', attempts);
                let shownSegments = this.getSessionAttribute('currentURLs');
                let currentObject = this.getSessionAttribute('currentObject');
                let doneSegments = shownSegments.map(item => item.segment);
                const result = await imageService.getRandomSegment(shownSegments[0].id, currentObject, doneSegments);
                shownSegments.push(result);
                this.setSessionAttribute('currentURLs', shownSegments);
                cardService.createCard.call(this, result.url);
                this.ask(responses[attempts - 1]);
            }
        }
    }
}

function answerIsCorrect(answer) {
    const currentAnswer = this.getSessionAttribute('currentObject');
    return currentAnswer.toLowerCase() === answer.toLowerCase();
}


async function getNextQuestion() {
    let result = await imageService.getRandomImage();
    this.setSessionAttribute('currentObject', result.tag);
    this.setSessionAttribute('currentAttempts', 0);
    this.setSessionAttribute('currentfullImage', result.full_img);
    this.setSessionAttribute('currentURLs', [{
        url: result.segment_img,
        id: result.imageId,
        segment: result.segment
    }]);

    return result.segment_img;
}
