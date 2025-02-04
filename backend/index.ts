import app from "./app";
import config from "./utils/config";

const port = config.PORT || 3001;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});