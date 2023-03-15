import { Request, Response } from "express";

const createJob = async (req: Request, res: Response) => {
    return res.send("Create Job")
};
const deleteJob = async (req: Request, res: Response) => {
    return res.send("Delete Job")
};
const getAllJobs = async (req: Request, res: Response) => {
    return res.send("Get All Jobs")
};
const updateJob = async (req: Request, res: Response) => {
    return res.send("Update Job")
};
const showStats = async (req: Request, res: Response) => {
    return res.send("Show stats")
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };