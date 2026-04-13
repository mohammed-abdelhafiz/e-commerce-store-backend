import { Request, Response } from "express";
import * as analyticsService from "./analytics.service";

export const getAnalytics = async (req: Request, res: Response) => {
  const analytics = await analyticsService.getAnalytics();
  res.json(analytics);
};
