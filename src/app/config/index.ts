import dotenv from "dotenv"
import path from "path";

dotenv.config({ path: path.join(process.cwd(), '.env') });
export const  config = {
    port : process.env.PORT,
    access_token_expires_in: process.env.ACCESS_TOKEN_EXP_DATE,
    secret_access_token: process.env.SECRET_ACCESS_TOKEN,
    refresh_token_exp: process.env.REFRESH_TOKEN_EXP,
    refresh_token: process.env.REFRESH_TOKEN,
    node_env: process.env.NODE_ENV
}