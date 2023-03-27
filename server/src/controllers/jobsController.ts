import { Request, Response } from "express";
import Job from "../models/Job";
import { BadRequestError, NotFoundError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { checkPermissions } from "../utils/checkPermissions";
import mongoose from "mongoose";
import moment from "moment";

interface IStats {
    pending: number;
    declined: number;
    interview: number;
}

interface IMonthlyApplication {
    date: string
    count: number;
}

interface IQueryObject {
    createdBy: string;
    status?: string;
    jobType?: string;
    sort?: string;
    position?: object;
}

const createJob = async (req: Request, res: Response) => {
    const {position, company} = req.body;

    if(!position || !company){
        throw new BadRequestError("Please provide a position and company");
    }

    req.body.createdBy = req.user.userId;

    const job = await Job.create(req.body);
    await job.save();

    return res.status(StatusCodes.CREATED).json({job});
};
const deleteJob = async (req: Request, res: Response) => {
    const {id: jobId} = req.params;

    const job = await Job.findOne({_id: jobId, createdBy: req.user.userId});

    if(!job){
        throw new NotFoundError("Job not found");
    }

    checkPermissions(req.user, job.createdBy.toString());

    await Job.findOneAndRemove({_id: jobId});
    res.status(StatusCodes.OK).json({message: "Job deleted"});
};
const getAllJobs = async (req: Request, res: Response) => {
    const {search, status, jobType, sort} = req.query;

    const queryObject: IQueryObject= {
        createdBy: req.user.userId
    }

    if(status && status !== 'all') {
        queryObject.status = status?.toString();
    }

    if(jobType && jobType !== 'all') {
        queryObject.jobType = jobType?.toString();
    }

    //position where the search term is found
    if(search) {
        queryObject.position = {$regex: search.toString(), $options: 'i'};
    }

    //NO AWAIT
    let jobs = Job.find(queryObject);

    //sorting Conditions
    if(sort === 'latest') {
        jobs = jobs.sort('-createdAt');
    }
    if(sort === 'oldest') {
        jobs = jobs.sort('createdAt');
    }
    if(sort === 'a-z') {
        jobs = jobs.sort('position');
    }
    if(sort === 'z-a') {
        jobs = jobs.sort('-position');
    }
    
    //setup pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    jobs = jobs.skip(skip).limit(limit);

    const allJobs = await jobs;
    const totalJobs = await Job.countDocuments(queryObject);
    const numOfPages = Math.ceil(totalJobs / limit);

    if(!allJobs){
        throw new NotFoundError("No jobs found");
    }
    
    return res.status(StatusCodes.OK).json({allJobs, totalJobs, numOfPages});
};
const updateJob = async (req: Request, res: Response) => {
    const {id: jobId} = req.params;

    const {company, position} = req.body;

    if(!company || !position){
        throw new BadRequestError("Please provide a company and position");
    }

    const job = await Job.findOne({_id: jobId, createdBy: req.user.userId});

    if(!job){
        throw new NotFoundError("Job not found");
    }

    checkPermissions(req.user, job.createdBy.toString());

    const updatedJob = await Job.findOneAndUpdate({_id: jobId}, req.body, {new: true, runValidators: true});

    res.status(StatusCodes.OK).json({updatedJob});
};
const showStats = async (req: Request, res: Response) => {
    let stats = await Job.aggregate([
        {$match: {createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
        {$group: {_id: '$status', count: {$sum: 1}}}
    ]);

    const statsObject: IStats = stats.reduce((acc, curr) => {
        const {_id: title, count} = curr;
        acc[title] = count;
        return acc;
    }, {});

    const defaultStats = {
        pending: statsObject.pending || 0,
        declined: statsObject.declined || 0,
        interview: statsObject.interview || 0,
    };

    let monhtlyApplication = await Job.aggregate([
        {$match: {createdBy: new mongoose.Types.ObjectId(req.user.userId)}},
        {
            $group: {
                _id: {
                    year :  { $substr : ["$createdAt", 0, 4 ] },   
                    month : { $substr : ["$createdAt", 5, 2 ] },                                      
                },
                count: {$sum: 1}
                
            }
        },
        {$sort: {"_id.year": -1, "_id.month": -1}},
        {$limit: 6}
    ]);

    const formatedMonthlyApplication: IMonthlyApplication[] = monhtlyApplication.map((item) => {
        const {_id: {year, month}, count} = item;
        const date = moment().month(month - 1).year(year).format("MMM Y");

        return {date: date, count: count};
    });

    res.status(StatusCodes.OK).json({defaultStats, formatedMonthlyApplication});
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };