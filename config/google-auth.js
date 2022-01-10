const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// TODO: will it create a new instance everytime i import or no
module.exports = client;
