const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

exports.sendotp = async(req,res) => {

    try{
        const {email} = req.body;

        const checkUserPresent =  await User.findOne({email});

        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already registred',
            })
        }

        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generator: ",otp);

        let result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp});
        }

        const otpPayload = {email,otp};

        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:`OTP Sent SuccessFully`,
            otp,
        })
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};


exports.signup = async(req,res) => {
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
    
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({   
                success:false,
                message:"All fields are required",
            })
        }
    
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:'Password and Confirm password value does not match, please try again',
            });
        }
    
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User is already exist',
            });
        }
    
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
    
        if(recentOtp.length === 0){
            return res.status(400).json({
                success:false,
                message:'OTPP Found',
            });
        }
        else if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }
    
        const hashedPassword = await bcrypt.hash(password,10);

        let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        // approved think
    
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
    
        const user= await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType:accountType,
            approved: approved,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });
    
        return res.status(200).json({
            success:true,
            user,
            message:'User is registered SucessFully',
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registrered please try again',
        });
    }
}


exports.login = async(req,res) => {
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'All fields aae required,please try again',
            });
        }

        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered, please signup again',
            });
        }

        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }

            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:'Logged in Successfully',
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect',
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login Failure, Please try again',
        })
    }
}


exports.changePassword = async (req, res) => {
	try {
		const userDetails = await User.findById(req.user.id);

		const { oldPassword,confirmOldPassword, newPassword, confirmNewPassword } = req.body;

		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

        if (oldPassword !== confirmOldPassword) {
			return res.status(400).json({
				success: false,
				message: "The old password and old confirm password does not match",
			});
		}

		if (newPassword !== confirmNewPassword) {
			return res.status(400).json({
				success: false,
				message: "The new password and new confirm password does not match",
			});
		}

		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
                `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`,
				passwordUpdated(
					updatedUserDetails.email,
					`${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} 
        catch (error) {
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		return res.status(200).json({ 
            success: true, 
            message: "Password updated successfully" 
        });
	} 
    catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};