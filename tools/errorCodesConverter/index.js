const csv = require("csv-parser");
const fs = require("fs");
const results = [];
writeJsonFile = require("write-json-file");

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (data) => results.push(data))
  .on("end", () => {
    transformedResults = results
      .map((result) => {
        return {
          event_code: result["Event Code"],
          event_name: result["EventName"],
          code: result.Code,
          in_use: result.InUse.toLowerCase() === "true",
          error_description: result["Error Description"],
          display: result.Display.toLowerCase() === "true",
          possible_causes: result["Possible Causes"],
          recommended_actions: result["Recommended Action"],
        };
      })
      .filter((item) => item.in_use);

    (async () => {
      await writeJsonFile("output.json", transformedResults);
    })();
    console.log(transformedResults);
    // [
    //   { NAME: 'Daffy Duck', AGE: '24' },
    //   { NAME: 'Bugs Bunny', AGE: '22' }
    // ]
  });
