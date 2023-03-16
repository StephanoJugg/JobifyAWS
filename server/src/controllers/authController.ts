import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import {StatusCodes} from 'http-status-codes';
import { BadRequestError, UnauthenticatedError } from '../errors';


const register = async (req: Request, res: Response, next: NextFunction) => {
    const {name, email, password} = req.body;

    if(!name || !email || !password) {
        throw new BadRequestError('Please provide name, email and password')
    }

    const userAlreadyExists = await User.findOne({email});
    if(userAlreadyExists) {
        throw new BadRequestError('User already exists');
    }

    const user = await User.create({name, email, password});
    const token = user.schema.methods.createJWT();
    if(!user) {
        throw new Error('User not created');
    }

    return res.status(StatusCodes.CREATED).json({ user: { 
        email: user.email, 
        lastName: user.lastName, 
        location: user.location, 
        name: user.name}, 
        token, location: user.location });
    
};
const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    if(!email || !password) {
        throw new BadRequestError('Please provide valid credentials');
    }

    const user = await User.findOne({email}).select('+password');
    if(!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    const isPasswordValid = await user.comparePasswords(password);
    if(!isPasswordValid) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    const token = user.schema.methods.createJWT();
    user.password = "";

    res.status(StatusCodes.OK).json({ user, token, location: user.location });
};
const updateUser = async (req: Request, res: Response) => {
    const {email, name, lastName, location} = req.body;

    if(!email || !name || !lastName || !location) {
        throw new BadRequestError('Please provide valid credentials');
    }

    const user = await User.findOne({_id: req.user?.userId});

    if(!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }

    user.name = name;
    user.email = email;
    user.lastName = lastName;
    user.location = location;

    await user.save();

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({ user, token, location: user.location });

};

export { register, login, updateUser };