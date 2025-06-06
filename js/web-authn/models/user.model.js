import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new Schema({
    username: {
         type: String, 
         required: true, 
         unique: true ,
         trim: true,
         lowercase:true,
         index:true,
         minlength:3,
        },
    email: { 
        type: String,
         required: true,
          unique: true,
            trim: true,
            lowercase:true,
        },
        avatar:{
            type:String,

        },
        oauth:{
                providers:[{
                providerName:{
                    type:String,
                    default:null,
                    enum:['google','github','spotify','microsoft','facebook']
                },
                sub:{
                    type: String,
                    default:null,
                }
            }
        ]
        },
    password: {
         type: String,
          required: true,
        },
   //Enter your fields here 
    refreshToken:{
        type:String
    },
    verificationToken:{
       type:String,
       default:null
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationTokenExpiryDate:{
        type:Date,
        default:null
    },
    TwoFAchallenge:{
        type:String,
        default:null
    },
    TwoFAEnabled:{
         type:Boolean,
         default:false
     },
     TwoFAverified:{
        type:Boolean,
        default:false
     },
     PassKey:{
        type: Schema.Types.Mixed,
        default:null,
        required:function(){
            return (this.TwoFAEnabled && this.TwoFAverified)
        }
     },
     
},{
    timestamps:true

});
userSchema.pre("save", async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken =  function(){
return jwt.sign(
    {
        _id:this._id,
        email:this.email,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
)

}
userSchema.methods.generateRefreshToken =function(){
  return  jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User=mongoose.model('User',userSchema);

