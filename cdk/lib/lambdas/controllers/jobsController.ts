import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../errors";
import { StatusCodes } from "http-status-codes";

interface IStats {
  pending: number;
  declined: number;
  interview: number;
}

interface IMonthlyApplication {
  date: string;
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
  return res.status(StatusCodes.CREATED).json({});
};
const deleteJob = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ message: "Job deleted" });
};
const getAllJobs = async (req: Request, res: Response) => {
  return res.status(StatusCodes.OK).json({});
};
const updateJob = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({});
};
const showStats = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({});
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
