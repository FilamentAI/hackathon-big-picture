const { GoogleAction } = require('jovo-framework');

const createCard = function (imageURL, title = 'Guess the animal!') {
    let basicCard = new GoogleAction.BasicCard()
        .setTitle(title)
        // .setFormattedText(`Welcome to Alex's Hello World Google action`)
        .setImage(imageURL, 'Jovo Card')//, '750', '1125')
        .setImageDisplay('WHITE');
    // .addButton('Jovo website', 'https://www.jovo.tech/');
    this.googleAction().showBasicCard(basicCard);
};

module.exports = {
    createCard
}