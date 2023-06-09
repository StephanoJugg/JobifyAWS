import  mongoose, {Model}  from 'mongoose';

const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "Please provide a company name"],
        maxLength: 50,
    }, 
    position: {
        type: String,
        required: [true, "Please provide a position"],
        maxLength: 100,
    },
    status: {
        type: String,
        enum: ['interview', 'declined', 'pending'],
        default: 'pending'
    },
    jobType: {
        type: String,
        enum: ['full-time', 'part-time', 'contract', 'internship'],
        default: 'full-time'
    },
    jobLocation: {
        type: String,
        required: [true, "Please provide a location"],
        default: 'my city'
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide a user"],
    }
},
{timestamps: true}
);

export default mongoose.model('Job', JobSchema );