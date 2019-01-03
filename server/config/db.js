let mongoose = require('mongoose');
let fs       = require('fs');
let path     = require('path');
let models   = path.join(__dirname, ['..','models'].join(path.sep));
mongoose.connect('mongodb://localhost/foodproject', {
    useNewUrlParser: true
});

module.exports.register = function() {
    fs.readdirSync(models).forEach(function(file) {
        if(file.indexOf('.js') >= 0) {
            require(models + '/' + file);
        }
    });
}
