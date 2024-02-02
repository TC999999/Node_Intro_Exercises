const fs = require("fs");
const axios = require("axios");

function cat(path) {
  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading ${path}`);
      console.log(err);
    } else {
      console.log(data);
    }
  });
}

async function webCat(path) {
  try {
    let promise = await axios.get(path);
    console.log(promise.data);
  } catch (e) {
    if (e.code == "ECONNREFUSED") {
      cat(path);
    } else if (e.code == "ERR_BAD_REQUEST") {
      console.log(`Error fetching ${path}`);
      console.log(e);
    } else {
      console.log("COULD NOT UNDERSTAND ARGUMENT");
    }
  }
}

let arg = process.argv[2];

webCat(arg);
