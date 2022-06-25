require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/products");
const users = require("./routes/users");
const auth = require("./middleware/auth");
const transporter = require("./middleware/mail");
const { oAuth2Client, google } = require("./middleware/google-auth");
var authed = false;
const app = express();
const cron = require("node-cron");
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;
const url = process.env.MONGO_URI;
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const { getProducts } = require("./controllers/products");
const userRouter = require("./routes/user.routes");

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
const con = mongoose.connection;
// cron.schedule('* * * * * ',getProducts);
// cron.schedule('00 16 11  * * *',getProducts);
app.use(express.json());
try {
  con.on("open", () => {
    console.log("databse connected");
  });
} catch (error) {
  console.log("Error: " + error);
}
var options = {
  swaggerOptions: {
    authAction: {
      JWT: {
        name: "JWT",
        schema: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "",
        },
        value: "Bearer <JWT>",
      },
    },
  },
};
var mailOptions = {
  from: "testphp@mailtest.radixweb.net",
  to: "akshay.chauhan@radixweb.com",
  subject: "Sending Email using Node.js",
  text: "Hii Akshay!",
};
app.get("/mail", async (req, res) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
});

app.use("/", userRouter);
app.get("/google", (req, res) => {
  if (!authed) {
    // Generate an OAuth URL and redirect there
    const url = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/gmail.readonly",
    });
    console.log(url);
    res.redirect(url);
  } else {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });
    gmail.users.labels.list(
      {
        userId: "me",
      },
      (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
        const labels = res.data.labels;
        if (labels.length) {
          console.log("Labels:");
          labels.forEach((label) => {
            console.log(`- ${label.name}`);
          });
        } else {
          console.log("No labels found.");
        }
      }
    );
    res.send("Logged in");
  }
});

app.get("/auth/google/callback", function (req, res) {
  const code = req.query.code;
  if (code) {
    // Get an access token based on our OAuth code
    oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log("Error authenticating");
        console.log(err);
      } else {
        console.log("Successfully authenticated");
        oAuth2Client.setCredentials(tokens);
        authed = true;
        res.redirect("/");
      }
    });
  }
});
app.use("/users", users);
//app.use('/products', auth, router)
app.use("/products", router);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, options)
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = con;
module.exports = app;
