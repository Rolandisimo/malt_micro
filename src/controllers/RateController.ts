
import { Request, Response } from 'express';
import { validateRate } from "./validators/RateRequest";
import { RateRequest } from "./types";
import { findFee } from "src/services/FindFee";

export class RateController {
    public static async postRate(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body as RateRequest;
            validateRate(data);

            const rate = await findFee(data);

            return res.json(rate);
        } catch (error) {
            return res.status(error.status || 500).json(error.message);
        }
    }
}
