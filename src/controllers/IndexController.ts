import { Request, Response } from "express";

export class IndexController {
  public static async getHealth(_req: Request, res: Response): Promise<Response> {
    return res.json({
      environment: process.env.NODE_ENV,
    });
  }
}
