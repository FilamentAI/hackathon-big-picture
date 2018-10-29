const ImageManager = require('filament-big-picture');

const imageManager = new ImageManager({
    awsClientId: process.env.S3_CLIENT_KEY,
    awsClientSecret: process.env.S3_CLIENT_SECRET,
    fileList: process.env.FILE_LIST
});

const getRandomImage = function() {
    return imageManager.getRandomImage();
};

const getRandomSegment = function(id, tag, existingSegments) {
    return imageManager.getRandomSegment(id, tag, existingSegments);
};

module.exports = {
    getRandomImage,
    getRandomSegment
}