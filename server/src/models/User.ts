import  mongoose, {Model}  from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface IUser {
    name: string;
    email: string;
    password: string;
    lastName: string;
    location: string;
}

interface IUserMethods {
    createJWT: () => string;
    comparePasswords: (enteredPassword: string) => Promise<boolean>;
}

type UserModel = Model<IUser, {}, IUserMethods>


const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        minLength: 3,
        maxLength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        validate: {
            validator: validator.isEmail as any,
            message: 'Please provide a valid email!'
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minLength: 6,
        select : false,
    },
    lastName: {
        type: String,
        trim: true,
        maxLenght: 20,
        default:"Smith"
    },
    location: {
        type: String,
        trim: true,
        maxLenght: 20,
        default:"New York"
    }


});

UserSchema.pre("save", async function(){
    
    if(!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.method("createJWT", function(){
    console.log(this + "CREATE JWT METHOD")
    return jwt.sign({userId: this._id}, process.env.JWT_SECRET!, {expiresIn: "1h"});
});


UserSchema.method("comparePasswords", async function(enteredPassword: string){
    
    const isMatch: boolean = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
});

export default mongoose.model<IUser, UserModel>("User", UserSchema);