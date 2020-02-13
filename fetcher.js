const request = require("request"); // 2020-02-11 npm request is deprecated
// const bent = require("bent"); // new request module, by the same author (mikeal)
const fs = require("fs");
const args = process.argv.slice(2);

const fetcher = args => {
  let url = args[0];
  let saveTo = args[1];

  const readline = require("readline");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  let requestFunc = (error, response, body) => {
    if (error) {
      console.log("error:", error);
    } else {
      if (!fs.existsSync(saveTo)) {
        fs.writeFile(saveTo, body, "utf8", error => {
          if (error || response.statusCode !== 200) {
            console.log(
              `Error saving to ${saveTo}. Response: ${response.statusCode}`
            );
            process.exit();
          } else {
            console.log(
              `Downloaded and saved ${body.length} bytes to ${saveTo}`
            );
          }
        });
      } else {
        rl.question(
          `Duplicate file. Rename to ${saveTo}1? (y + ENTER) (Any other key to cancel) `,
          answer => {
            // TODO: Log the answer in a database
            console.log(`Thank you for your answer: ${answer}`);
            if (answer === "y") {
              saveTo += 1;
              request(url, requestFunc);
              rl.pause();
            } else {
              rl.close();
            }
          }
        );
      }
    }
  };

  // using request module
  request(url, requestFunc);
  // rl.close();
};

fetcher(args);
