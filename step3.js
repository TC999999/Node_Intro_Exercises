const fs = require("fs");
const axios = require("axios");

function cat(args) {
  let path = args[0];
  if (path == "--out") {
    path = args[2];
  }

  fs.readFile(path, "utf8", (err, data) => {
    if (err) {
      console.log(`Error reading ${path}`);
      console.log(err);
    } else {
      if (args[1]) {
        writeNew(args[1], data);
      } else {
        console.log(data);
      }
    }
  });
}

async function webCat(args) {
  try {
    if (args.length == 0) {
      throw new Error("Requires at least 1 argument");
    } else if (args[0] == "--out" && args.length == 1) {
      throw new Error("--out is a flag, requires two arguements after");
    } else if (args[0] == "--out" && (args.length == 2 || args.length > 3)) {
      throw new Error(
        "Using --out requires two arguements: --out, new file to write into, file to copy."
      );
    } else if (args[0] !== "--out" && args.length == 1) {
      let promise = await axios.get(args[0]);
      console.log(promise.data);
    } else if (args[0] == "--out" && args.length == 3) {
      let promise = await axios.get(args[2]);
      writeNew(args[1], promise.data);
    } else if (args[0] !== "--out" && args.length > 1) {
      for (let arg of args) {
        await webCat([arg]);
      }
    } else {
      throw new Error("could not understand arguement");
    }
  } catch (e) {
    if (e.code == "ECONNREFUSED") {
      cat(args);
    } else if (e.code == "ERR_BAD_REQUEST") {
      console.log(`Error fetching ${e.config.url}`);
      console.log(e);
    } else {
      console.log(e);
    }
  }
}

function writeNew(filename, line) {
  fs.writeFile(filename, line, "utf8", (err) => {
    if (err) {
      console.log(err);
      process.kill(1);
    }
  });
}

let args = process.argv;

let writeArgs = [];
for (let i = 2; i < args.length; i++) {
  writeArgs.push(args[i]);
}

webCat(writeArgs);
