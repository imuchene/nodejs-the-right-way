import * as fs from "fs";

fs.readFile("target.txt", (err: Error | null, data: Buffer) => {
  if (err) {
    throw err;
  }

  console.log(data.toString());
});
