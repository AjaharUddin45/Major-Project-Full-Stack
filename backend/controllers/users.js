const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { response } = require("express");

// module.exports.renderSignupForm = (req, res) => {
//     res.render("users/signup.ejs");
// };

// const signup = async (req, res) => {
//     try {
//         let { username, email, password } = req.body;
//         const newUser = new User({ email, username });
//         const registeredUser = await User.register(newUser, password);
//         console.log(registeredUser);
//         req.flash("success", "Welcome to Wanderlust!");
//         res.redirect("/listings");
//     } catch (e) {
//         req.flash("error", e.message);
//         res.redirect("/signup");
//     }
// };

// i m rewritting my sigup using JWT Auth
const signup = async (req,res)=>{
        const  {username,email,password} = req.body;
        try {
            
            if(!username){
                return res.status(400).json({
                success: false,
                message: "Username is required"
                });
            }
             if (!email) {
               return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }
            const exist = await User.findOne({email});
            if(exist){
                return res.status(400).json({
                success: false,
                message: "Email is already taken"
                });
            }

             if(!password || password.length < 6){
                return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
                })
            }

            //hashing password before storing to database
             const passwordHash = await bcrypt.hash(password,10);
             //console.log("Hassedpassword : ", passwordHash);

            const user = await User.create({
                username,
                email,
                password:passwordHash,
            });
           res.status(201).json({
            success: true,
            message: "Welcome to Wanderlust!",
            user:{
                id: user._id,
                username: user.username,
                email: user.email,
            }
           });
          // res.send("register successfull");

        } catch (err) {
            res.status(400).json({
            success: false,
            message: err.message,
           });

        }
}



// module.exports.renderLoginForm = (req, res) => {
//     res.render("users/login.ejs")
// };

// const login = async (req, res) => {
//     req.flash("success", "Welcome back to wanderlust!");
//     let redirectUrl = res.locals.redirectUrl || "/listings";
//     res.redirect(redirectUrl);
// };

const login = async (req,res)=>{
     const {email,password} = req.body;
    try{
       
        if(!email){
               return res.status(400).json({
                success: false,
                message: "Email is required"
        });
     }else if(!password){
            return res.status(400).json({
                success: false,
                message: "Please enter correct password"
     });
    }
    const user = await User.findOne({email});
     if(!user){
         return res.status(400).json({
                success: false,
                message: "EmailId is not present in the Database!!!"
     });
     }

    //compare password
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(isPasswordValid){
        //create a jwt token
        const token = await jwt.sign({
                                id:user._id,name:user.username},
                                process.env.JWT_SECRET,
                                { expiresIn: "7d" 

            });
        //console.log(token);

        //now I will add my token to the cookies and send back a response to the user
         res.cookie("token",token,
               {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    maxAge: 7 * 24 * 60 * 60 * 1000
               },
           );
         res.status(200).json({
            success: true,
            message: "Welcome back to Wanderlust!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    }


    }catch(err){
             res.status(400).json({
            success: false,
            message: err.message,
    });
}
}

const getProfile = async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(200).json({
            success: true,
            user: null
        });
    }

    try {
        const decodedMessage = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const { id } = decodedMessage;

        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
                user: null
            });
        }

        return res.status(200).json({
            success: true,
            user
        });

    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
            user: null
        });
    }
};

const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
         secure: process.env.NODE_ENV === "production",
        sameSite:
            process.env.NODE_ENV === "production"
                ? "none"
                : "lax",
    });

    return res.status(200).json({
        success: true,
        message: "You are logged out!",
    });
};

module.exports = {
        signup,
        login,
        getProfile,
        logout
}