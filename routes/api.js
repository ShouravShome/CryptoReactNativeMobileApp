var express = require('express');
var router = express.Router();

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const authorize = (req, res, next) => {
    const authorization = req.headers.authorization
    let token = null;
    const secretkey = "secret key"
    if (authorization && authorization.split(" ").length === 2) {

        token = authorization.split(" ")[1]
        console.log("token:", token)
    } else {
        res.status(401).json({ error: true, message: "Unauthorized" });
        return
    }
    try {
        const decoded = jwt.verify(token, secretkey)
        if (decoded.exp < Date.now()) {
            res.status(401).json({ error: true, message: "Unauthorized" });
            return
        }
        next()
    } catch (e) {
        res.status(401).json({ error: true, message: "Unauthorized" });
    }
}


router.post("/watchlist", authorize, async function (req, res, next) {
    const email = req.body.email;
    const name = req.body.name;
    const price = req.body.price;
    const id = req.body.coin;
    const symbol = req.body.symbol;
    const image = req.body.image;
    const market_cap_rank = req.body.market_cap_rank;
    const high_24h = req.body.high_24h;
    const low_24h = req.body.low_24h;
    try {
        const queryUsers = await req.db
            .from("watchlist")
            .select("*")
            .where({ email, id });

        if (queryUsers.length > 0) {
            console.log("Wishlist already exists")
            res.status(202).json({
                error: true,
                message: "Wishlist already exeists"
            })
            return
        }
        await req.db.from("watchlist").insert({ email, name, price, id, symbol, image, market_cap_rank, high_24h, low_24h })
        res.status(200).json({ error: false, message: "Successfully inserted" })
    } catch (error) {
        console.error("Error inserting row:", error);
        res.status(500).json({ message: "Failed to insert row." });
    }
})

router.post("/watchlist/delete", authorize, async function (req, res, next) {
    const email = req.body.email;
    const id = req.body.coin;
    try {
        const queryUsers = await req.db
            .from("watchlist")
            .select("*")
            .where({ email, id });

        if (queryUsers.length < 1) {
            console.log("No Watchlist found")
            res.status(202).json({
                error: true,
                message: "No watchlist found"
            })
            return
        }
        await req.db.from("watchlist").where({ email, id }).del();
        res.status(200).json({ error: false, message: "Successfully deleted" });
    } catch (error) {
        console.error("Error deleting row:", error);
        res.status(500).json({ message: "Failed to delete row." });
    }
});
router.get("/all/:email", authorize, async function (req, res, next) {
    try {
        let row = req.db.from("watchlist").select("name", "price", "id", "symbol", "image", "market_cap_rank", "high_24h", "low_24h")
        row = row.where("email", "=", req.params.email)
        result = await row;
        if (result.length === 0) {
            res.status(202).json({ Error: true, Message: "No data", watchlist: await row })
        }
        else {
            res.status(200).json({ Error: false, Message: "Success", watchlist: await row })
        }

    } catch (err) {
        console.log(err);
        res.json({ Error: true, Message: "Error in MySQL query" })
    }

})

module.exports = router;

