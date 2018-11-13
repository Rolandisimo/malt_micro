import { Request, Response } from "express";
import { validateRule } from "./validators/RuleCreation";
import { Fee } from "src/models/Fee";
import { RuleCreation } from "./types";

export class RulesController {
    public static async postRule(req: Request, res: Response): Promise<Response> {
        try {
            const data = req.body as RuleCreation;
            validateRule(data);

            await Fee.create({
                name: data.name,
                rate: data.rate,
                restrictions: JSON.stringify(data.restrictions),
            });

            return res.status(204).json();
        } catch (error) {
            return res.status(error.status || 500).json(error.message);
        }
    }
}
