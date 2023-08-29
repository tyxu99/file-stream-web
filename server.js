const express = require("express");
const nodeFetch = require("node-fetch");
const cryptoJs = require("crypto-js");

const app = express();

const router = express.Router();

const port = process.env.port || 5001;

app.listen(port, () => {
  console.log("listening on ===========>>>>>>>>>", port);
});

app.use((req, res, next) => {
  console.log(
    "app use=====>>>>",
    req.ip,
    req.body,
    req.url,
    req.params,
    req.cookies,
  );
  next();
});

router.use("/backend-test", (req, res, next) => {
  console.log(
    "router use+++++++++>>>>",
    req.ip,
    req.body,
    req.url,
    req.params,
    req.cookies,
  );
  next();
});

router.get("/backend-test", (req, response) => {
  const { url, body, method, query, params, ip, headers } = req;
  console.log(url, body, method, query, params, ip, headers);

  const originTxt = "hello";
  const salt = new Date().getTime();
  const current = Math.round(new Date().getTime() / 1000);
  // nodeFetch("https://openapi.youdao.com/api", {
  //   method: "POST",
  //   headers: {
  //     "response-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     q: originTxt,
  //     from: "en",
  //     to: "zh-CHS",
  //     appKey,
  //     salt,
  //     sign: cryptoJs.SHA256(appId + originTxt + salt + current + appKey),
  //     signType: "v3",
  //     current,
  //   }),
  // })
  //   .then((res) => res.json)
  //   .then((res) => {
  //     console.log("nooooooodeFetch", res);
  //     response.send(res);
  //   });
  response.send({
    current,
    appId,
    appKey,
  });
});

app.use("/", router);
