import { Connection } from "@solana/web3.js";

import { RPC_ENDPOINT } from "$env/static/private";

export default () => new Connection(
    RPC_ENDPOINT,
    "confirmed"
);
