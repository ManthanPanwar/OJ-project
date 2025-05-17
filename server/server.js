const app = require("./app.js");

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running on port 5000");
});
