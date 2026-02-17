"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const zod_1 = __importDefault(require("zod"));
const zod_2 = require("./zod");
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173"
}));
app.post('/api/signup', async (req, res) => {
    let response;
    try {
        const username = req.body.username;
        const password = req.body.password;
        const result = zod_2.userParse.safeParse({ username, password });
        if (!result.success) {
            return res.json({
                error: zod_1.default.treeifyError(result.error)
            });
        }
        const hashedpassword = await bcrypt_1.default.hash(password, 2);
        await db_1.UserModel.create({
            username, password: hashedpassword
        });
        res.json({
            "message": "user inserted successfully"
        });
    }
    catch (err) {
        res.json({
            err
        });
    }
});
app.post('/api/signin', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const user = await db_1.UserModel.findOne({
            username
        });
        if (user != undefined && await bcrypt_1.default.compare(password, user.password)) {
            const token = jsonwebtoken_1.default.sign({ id: user._id.toString() }, config_1.jwt_secret);
            res.json({ "token": token });
        }
        else
            res.json("Wrong Credentials");
    }
    catch (err) {
        res.json(err);
    }
});
app.post('/api/content', middleware_1.auth, async (req, res) => {
    const link = req.body.link;
    const type = req.body.type;
    const title = req.body.title;
    const description = req.body.description;
    try {
        const tagsarray = req.body.tags;
        const finalarray = await Promise.all(tagsarray.map(async (str) => {
            const tag = await db_1.TagModel.findOne({ title: str });
            if (tag) {
                return tag.title;
            }
            else {
                const temptag = await db_1.TagModel.create({ title: str });
                return temptag.title;
            }
        }));
        if (!req.userid) {
            res.json({
                "error": "userid not valid"
            });
        }
        else {
            await db_1.ContentModel.create({
                link,
                type,
                title,
                tags: finalarray,
                description,
                userid: req.userid
            });
            res.json({
                "message": "successfully inserted"
            });
        }
    }
    catch (err) {
        res.json(err);
    }
});
app.get('/api/content', middleware_1.auth, async (req, res) => {
    if (!req.userid) {
        return res.json({
            "message": "Not Authorized"
        });
    }
    try {
        const temparr = await db_1.ContentModel.find({
            userid: req.userid
        });
        return res.json({
            "content": temparr
        });
    }
    catch (err) {
        res.json({ err });
    }
});
app.delete('/api/content', middleware_1.auth, async (req, res) => {
    if (!req.userid) {
        return res.json({
            "message": "not authorized"
        });
    }
    try {
        const deletesuccess = await db_1.ContentModel.deleteOne({
            _id: req.body._id
        });
        if (deletesuccess.deletedCount != 0) {
            return res.json({
                "message": "deleted successfully"
            });
        }
        return res.status(403).json({
            "message": "unsuccessful in deleting"
        });
    }
    catch (err) {
        res.json({ err });
    }
});
app.post('/api/share', middleware_1.auth, async (req, res) => {
    //if link exist or not 
    //based on true or false remove or create
    const { share } = req.body;
    if (!req.userid) {
        res.json('Not Authorized');
        return;
    }
    const existinglink = await db_1.LinkModel.findOne({
        userid: req.userid
    });
    if (share) {
        if (existinglink) {
            return res.json({ link: existinglink });
        }
        let hash = (0, utils_1.random)(30);
        while (await db_1.LinkModel.findOne({
            hash
        })) {
            hash = (0, utils_1.random)(30);
        }
        await db_1.LinkModel.create({
            hash: hash,
            userid: req.userid
        });
        return res.json({
            hash
        });
    }
    else {
        if (existinglink) {
            await db_1.LinkModel.deleteOne({
                userid: req.userid
            });
        }
        return res.json({
            "message": "the link is deleted"
        });
    }
});
app.post("/api/share/:sharelink", middleware_1.auth, async (req, res) => {
    if (!req.userid) {
        return res.json({
            "message": "not authorized"
        });
    }
    const hash = req.params.sharelink;
    if (!hash) {
        return res.json({
            "meesage": "hashnot not processed"
        });
    }
    const existinglink = await db_1.LinkModel.findOne({
        hash: hash
    });
    if (existinglink) {
        const user = await db_1.UserModel.findOne({
            _id: existinglink.userid
        });
        const content = await db_1.ContentModel.find({
            userid: existinglink.userid
        });
        return res.json({
            username: user?.username,
            content: content
        });
    }
    else {
        res.json({
            "message": "brain is private cannot be sharred"
        });
    }
});
app.listen(3000);
//# sourceMappingURL=index.js.map