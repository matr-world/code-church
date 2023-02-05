import { PublicKey } from "@solana/web3.js";

export default (address:string) => {
    try {
        return Boolean(new PublicKey(address));
    } catch(error) {
        return false;
    }
};
