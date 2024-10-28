const {
    models: { User, TempMobile, Vendor },
} = require('../../../../lib/models');


class AuthpageController {
    async resetPassword( req,res,next ){
        let {
            resetToken
        } = req.query;
        return res.render('reset-password',{
            resetToken,
            SITE_URL:process.env.siteUrl
        });
    }

    async resetPasswordPost(req,res,next) {
        console.log(req.query)
        let { resetToken } = req.query
        let {newPassword} = req.body;
        let user = await User.findOne({
            resetToken
        })

        user.password = newPassword;
        user.resetToken = ""
        await user.save();
        return res.redirect('/authpage/success');

    }

    async success( req,res,next ){
        return res.render('success',{
            SITE_URL:process.env.siteUrl
        });
    }

    async emailVerify( req,res,next ){
        let {
            resetToken
        } = req.query;
        
        let user = await User.findOne({
            emailToken:resetToken
        })
        if( user ){
            user.emailVerify = true;
            user.emailToken = "";
            await user.save();
            return res.render('email_verify',{
                "success":"true",
                "msg":"Thank you, your email has been verified"
            });
        }else{
            return res.render('email_verify',{
                "success":"false",
                "msg":"Your email is not verified"
            });
        }
    }

}


module.exports = new AuthpageController();
