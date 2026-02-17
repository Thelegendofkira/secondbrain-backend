import express from "express"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel, LinkModel, ContentModel, TagModel } from "./db";
import z from "zod";
import { userParse } from "./zod";
import { jwt_secret } from "./config";
import { auth, AuthRequest } from "./middleware";
import { Types } from "mongoose";
import { random } from "./utils";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173"
}));
app.post('/api/signup', async (req, res) => {
    let response;
    try {
        const username = req.body.username;
        const password = req.body.password;
        const result = userParse.safeParse({ username, password });
        if (!result.success) {
            return res.json({
                error: z.treeifyError(result.error)
            });
        }
        const hashedpassword = await bcrypt.hash(password, 2);
        await UserModel.create({
            username, password: hashedpassword
        })
        res.json({
            "message": "user inserted successfully"
        })
    }
    catch (err) {
        res.json({
            err
        });
    }



})
app.post('/api/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await UserModel.findOne({
            username
        })
        if (user != undefined && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id.toString() }, jwt_secret);
            res.json({ "token": token });
        }
        else res.json("Wrong Credentials");
    }
    catch (err) {
        res.json(err);
    }
})


app.post('/api/content', auth, async (req: AuthRequest, res) => {
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    const description = req.body.description;
    try {
        const tagsarray: string[] = req.body.tags;
        const finalarray = await Promise.all(tagsarray.map(async (str: string) => {
            const tag = await TagModel.findOne({ title: str });
            if (tag) {
                return tag.title as string;
            }
            else {
                const temptag = await TagModel.create({ title: str });
                return temptag.title as string;
            }
        }))
        if (!req.userid) {
            res.json({
                "error": "userid not valid"
            })
        }
        else {
            await ContentModel.create({
                link,
                type,
                title,
                tags: finalarray,
                description,
                userid: req.userid
            })
            res.json({
                "message": "successfully inserted"
            })
        }
    }
    catch (err) {
        res.json(err);
    }


})
app.get('/api/content', auth, async (req: AuthRequest, res) => {
    if (!req.userid) {
        return res.json({
            "message": "Not Authorized"
        })
    }
    try {
        const temparr = await ContentModel.find({
            userid: req.userid
        })

        return res.json({
            "content": temparr
        })
    }
    catch (err) {
        res.json({ err })
    }

})
app.delete('/api/content', auth, async (req: AuthRequest, res) => {
    if (!req.userid) {
        return res.json({
            "message": "not authorized"
        })
    }
    try {
        const deletesuccess = await ContentModel.deleteOne({
            _id: req.body._id
        })
        if (deletesuccess.deletedCount != 0) {
            return res.json({
                "message": "deleted successfully"
            })

        }
        return res.status(403).json({
            "message": "unsuccessful in deleting"
        })

    }
    catch (err) {
        res.json({ err });
    }

})
app.post('/api/share', auth, async (req: AuthRequest, res) => {
    //if link exist or not 
    //based on true or false remove or create
    const { share } = req.body;
    if (!req.userid) {
        res.json('Not Authorized');
        return;
    }
    const existinglink = await LinkModel.findOne({
        userid: req.userid
    })
    if (share) {
        if (existinglink) {
            return res.json({ link: existinglink })
        }
        let hash = random(30);
        while (await LinkModel.findOne({
            hash
        })) {
            hash = random(30);
        }
        await LinkModel.create({
            hash: hash,
            userid: req.userid
        })
        return res.json({
            hash
        })
    }
    else {
        if (existinglink) {
            await LinkModel.deleteOne({
                userid: req.userid
            })
        }
        return res.json({
            "message": "the link is deleted"
        })

    }
})
app.post("/api/share/:sharelink", auth, async (req: AuthRequest, res) => {
    if (!req.userid) {
        return res.json({
            "message": "not authorized"
        })
    }
    const hash = req.params.sharelink;
    if (!hash) {
        return res.json({
            "meesage": "hashnot not processed"
        })
    }
    const existinglink = await LinkModel.findOne({
        hash: hash
    })
    if (existinglink) {
        const user = await UserModel.findOne({
            _id: existinglink.userid
        })
        const content = await ContentModel.find({
            userid: existinglink.userid
        })
        return res.json({
            username: user?.username,
            content: content
        })
    }
    else {
        res.json({
            "message": "brain is private cannot be sharred"
        })
    }
})


app.listen(3000);
