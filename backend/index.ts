import app from "./app";
import config from "./utils/config";

app.listen(config.PORT, () => {
  console.log("Server is running on port 3000");
});
