const Data= require('./data')
const passport= require('passport');
const LocalStrategy= require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
async (email, password, done) => {
    try {
        // console.log('Credentials Received: ', email, password);

        const user= await Data.findOne({email: email});
        if(!user){
            return done(null, false, {message: 'Incorrect Email'})
        }

        const isPasswordMatch= await user.comparePassword(password);
        if(isPasswordMatch){
            return done(null, true);
        }
        else{
            return done(null, false, {message: 'Incorrect Password'})
        }

    } catch (err) {
        return done(err);
    }
}
))

module.exports= passport;