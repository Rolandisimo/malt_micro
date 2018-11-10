import { Request, Response } from 'express';

export class IndexController {
  public static async getHealth(_req: Request, res: Response): Promise<Response> {
    return res.json({
      environemnt: process.env.NODE_ENV,
    });
  }
}
