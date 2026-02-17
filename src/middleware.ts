import { Response,Request,NextFunction } from "express";
import jwt,{JwtPayload} from 'jsonwebtoken'
import { jwt_secret } from "./config";
import { Types } from "mongoose";
import { UserModel } from "./db";

export interface AuthRequest extends Request {
    userid?: Types.ObjectId
}
export const auth=async (req:AuthRequest,res:Response,next:NextFunction)=>{
        const header=req.headers["token"];
        if(!header)return res.json('Not Authorized');
        const decode=jwt.verify(header as string,jwt_secret);
        if(decode){
            if(typeof decode=='string'){
                return res.json({
                    "message":"not logged in"
                })
            }
          
            req.userid=(decode as JwtPayload).id;
            next()

        }
        else{
            res.json("not logged in")
        }

}