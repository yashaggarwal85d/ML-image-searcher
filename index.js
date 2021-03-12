const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
var Scraper = require("images-scraper");
const User = require("./models/users");
var nodemailer = require("nodemailer");

require("dotenv/config");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yashaggarwal85e@gmail.com",
    pass: process.env.password,
  },
});

const app = express();
app.use(bodyparser.json());

app.set("view-engine", "ejs");

app.get("/", (req, res) => {
  res.render("frontend.ejs");
});

app.post("/sendMail", async (req, res) => {
  console.log(req.body);
  if (req.body.email) {
    var NewmailOptions = {
      from: "yashaggarwal85e@gmail.com",
      to: req.body.email,
      subject: "Images",
      text: `search complete , here are the links for ${req.body.count} ${req.body.search} :- ${req.body.text}`,
    };
    transporter.sendMail(NewmailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        res.send("done");
        console.log("Email sent: " + info.response);
      }
    });
  }
});

app.post("/", async (req, res) => {
  try {
    if (req.body.email) {
      const user = new User({
        email: req.body.email,
        hash: req.body.count,
        search: req.body.search,
      });
      const SavedUser = await user.save();

      var mailOptions = {
        from: "yashaggarwal85e@gmail.com",
        to: req.body.email,
        subject: "Searching",
        text: `we are searching for your request for ${req.body.search} ${req.body.count} images, you will get your images via email within ${req.body.count} minutes, thank you for using our service.`,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      const google = new Scraper({
        puppeteer: {
          headless: false,
        },
      });

      (async () => {
        const results = await google.scrape(req.body.search, req.body.count);
        res.json(results);
      })();
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

mongoose.connect(
  process.env.DB_CONNECTION_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("db active")
);
app.listen(3000);
