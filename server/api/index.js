import serverless from "serverless-http";
import app from "../src/app.js";

// Export the serverless handler for Vercel
export default serverless(app);
