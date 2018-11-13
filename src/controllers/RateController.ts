
import { Request, Response } from "express";
import { validateRate } from "./validators/RateRequest";
import { RateRequest } from "./types";
import { FeeLocator } from "src/services/FindFee";

export class RateController {
    public static async postRate(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body as RateRequest;
            validateRate(data);

            const rate = await new FeeLocator(data).findMatchingFee(data);

            return res.json(rate);
        } catch (error) {
            return res.status(error.status || 500).json(error.message);
        }
    }
}
