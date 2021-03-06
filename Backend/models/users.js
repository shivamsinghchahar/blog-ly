const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// TODO: Add a field for own articles
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        minlength: 4
    },
    bio: String,
    name: String,
    image: String,
    email: {
        type: String,
        unique: true,
        required: true,
        match: new RegExp('@.*[.]')
    },
    password: {
        type: String,
        default: ''
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    favourites: [{
        type: String
    }]
}, { timestamps: true });

userSchema.pre('save', function (next) {
    const user = this;
    
    bcrypt.hash(user.password, 8, function (err, hash) {
        if (err) return next(err);

        user.password = hash;
        next();
    });
});

userSchema.methods.validatePassword = async function (textPassword, cb) {
    
    bcrypt.compare(textPassword, this.password, (err, isValidated) => {
        if (err) return next(err);

        return cb(null, isValidated);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = User;