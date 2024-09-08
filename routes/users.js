var express = require('express');
var router = express.Router();

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

/* GET users listing. */
router.get('/', async function (req, res, next) {
  res.send('respond with a resource');
});


router.post("/login", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    res.status(400).json({
      error: true,
      message: "Request Body incomplete"
    })
    return;
  }

  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);

  if (queryUsers.length === 0) {
    console.log("No user")
    res.status(202).json({
      error: true,
      message: "No user"
    })
    return
  }

  const user = queryUsers[0];
  const match = await bcrypt.compare(password, user.hash)

  if(!match){
    res.status(203).json({error: true, message: "Passwords do not match"})
    console.log("do not match")
    return;
  }

  console.log("passwords match")
  const secretKey = "secret key"
  const expires_in = 60*60*24;

  const exp = Date.now() + expires_in *1000;

  const token = jwt.sign({email, exp}, secretKey)
  res.json({ token_type: "Bearer", token, expires_in})
})


  router.post("/register", async function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      res.status(400).json({
        error: true,
        message: "Request Body incomplete"
      })
      return;
    }

    const queryUsers = await req.db
      .from("users")
      .select("*")
      .where("email", "=", email);

    if (queryUsers.length > 0) {
      console.log("User already exists")
      res.status(202).json({
        error: true,
        message: "Usder already exeists"
      })
      return
    }
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);

    await req.db.from("users").insert({ email, hash })

    res.status(201).json({ error: false, message: "Successful insert" })
  })

  module.exports = router;
