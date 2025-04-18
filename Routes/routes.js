const express= require('express');
const data= require('./../data')
const passport= require('./../auth')
const {jwtAuthMiddleware, generateToken}= require('./../jwt');
const crypto = require('crypto');
const Data = require('./../data');
const sendEmail = require('../utils/sendMail');
const { error } = require('console');
const router= express.Router();

router.post('/signup', async (req, res) => {
    try {
        const data= req.body;

        const newData= new Data(data);

        const response= await newData.save();
        console.log('Data Saved');

        const payload= {
            id: response.id,
            email: response.email
        }
        console.log(JSON.stringify(payload));
        const token= generateToken(payload);
        console.log('Token is: '+ token);

        res.status(200).json({response: response, token: token});

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'})
    }
})

router.post('/login', async(req, res)=> {
    try {
        const {email, password}= req.body;

        const user= await Data.findOne({email: email})

        if(!user || !await user.comparePassword(password)){
            return res.status(401).json({error: 'Invalid Username or Password'})
        }

        const payload= {
            id: user.id,
            email: user.email
        }
        const token= generateToken(payload);
        res.json({token})

    } catch (err) {
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'})
    }
})



router.post('/forgot-password', async (req, res) => {
    const {email}= req.body;

    try {
        const user= await Data.findOne({email});

        if(!user){
            return res.status(400).json({error: 'User not found'})
        }

        //generate a reset token
        const token= crypto.randomBytes(20).toString('hex');

        // Set token and expiry on user object
        user.resetPasswordToken= token;
        user.resetPasswordExpires= Date.now() + 15 * 60 * 1000;   //15 minutes

        await user.save();

        // const resetUrl = `${frontend.com}/reset-password/${token}` ;

        const resetCode= Math.floor(10000 + Math.random() * 90000);
        console.log(resetCode)

        const html=
        `<h2>Reset Your Password</h2>
        <p>Here is your code to reset Password. This will expire in 15 minutes.</p>
        <p>${resetCode}</p>`;

        await sendEmail(user.email, 'Password Reset Request', html);

        return res.status(200).json('Password reset email sent');

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }

});

router.post('/forgot-password/:token', async(req, res)=> {
    try {
        const {token}= req.params;
        const {newPassword} = req.body;

        const user= await Data.findOne({resetPasswordToken: token});

        if(!user){
            return res.status(400).json({error: 'Invalid or Expired Token'})
        }

        //check if token is expired
        const currentTime= Date.now();
        if(user.resetPasswordToken< currentTime){
            return res.status(400).json({error: 'Token has Expired'});
        }

        //Set the new password
        user.password = newPassword;

        //Clear the reset token and expiry time (we don't need them anymore)
        user.passwordResetToken = undefined;
        user.passwordResetTokenExpiry = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }

})


module.exports= router;