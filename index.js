const jsonServer = require("json-server");
const auth = require("json-server-auth");
const db = require("./db.json");
const cors = require("cors");

const PORT = process.env.PORT || 8000;

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

// Add custom routes
server.get("/api/budgets/transactions", async (req, res) => {
  try {
    const output = db.budgets.map((budget) => {
      const transactions = db.transactions
        .filter((el) => el.category === budget.category && el.amount < 0)
        .slice(0, 3);
      return {
        ...budget,
        spent: 0,
        latest: transactions,
      };
    });
    res.jsonp(output);
  } catch (error) {
    return res.jsonp({ msg: "Server error" });
  }
});

server.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://personal-finance-server.onrender.com"
  );

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

server.use(middlewares);
server.use(cors({ origin: "*" }));
server.use("/api", auth);
server.use("/api", router);

server.listen(PORT, () => {
  console.log("JSON Server is running");
});
