import rateLimit from "express-rate-limit";

export default rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req, res) => {
        res.status(429).send({ code: 429, message: "请求频繁，请稍后再试！" });
    },
})