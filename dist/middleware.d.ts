import { Response, Request, NextFunction } from "express";
import { Types } from "mongoose";
export interface AuthRequest extends Request {
    userid?: Types.ObjectId;
}
export declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=middleware.d.ts.map