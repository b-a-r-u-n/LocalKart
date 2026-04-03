import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        phoneNumber: {
            type: Number,
            default: null,
            maxlength: 10
        },
        address: [
        {
            fullName: String,
            phoneNumber: String,
            street: String,
            city: String,
            state: String,
            pinCode: String,
            isDefault: {
                type: Boolean,
                default: false
            }
        }
        ],
        isAdmin: {
            type: Boolean,
            default: false
        },
        refreshToken:{
            type: String,
            default: ""
        }
    }
    , {timestamps: true}
)


userSchema.pre("save", async function(next){
    if(!this.isModified("password"))
        return;
    
    this.password = await bcrypt.hash(this.password, 10);
    return;
})

userSchema.methods.isPasswordCorrect = async function(password){
    return bcrypt.compareSync(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);