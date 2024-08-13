const mongoose=require('mongoose');

const userSchema=mongoose.Schema(
    {
        
        fullname:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        confirmPassword:{
            type:String,
        
        }
    },
    {
        timestamps:true
    }
)

const User=mongoose.model('User',userSchema);

module.exports=User;