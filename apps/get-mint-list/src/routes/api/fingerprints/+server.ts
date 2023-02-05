import type { RequestEvent } from "@sveltejs/kit";
import { Connection, PublicKey, type ParsedAccountData } from "@solana/web3.js";

import connect from "$lib/util/connect-solana";
import validAddress from "$lib/util/validate-address";

const getOwner = async (connection:Connection, address:string):Promise<string> => {
    const pubKey = new PublicKey(address);

    const largestAccounts = await connection.getTokenLargestAccounts(pubKey);

    const [ largestAccount ] = largestAccounts.value || {};

    if(!largestAccount?.address) {
        return "";
    }

    const largestAccountInfo = await connection.getParsedAccountInfo(largestAccount?.address);

    const {
        parsed,
    } = largestAccountInfo?.value?.data as ParsedAccountData;

    return parsed?.info?.owner;
};

export async function POST({ locals, request }: RequestEvent) {
    const {
        addresses = [ "" ],
    } = await request.json();

    const result:Record<string, string> = {};
    const connection = connect();
    
    await Promise.all(addresses.map(({ mint }:{mint:string}) => new Promise(async (resolve, reject) => {
        try {
            if(!validAddress(mint)) {
                result[mint] = "";

                return reject("invalid address");
            }

            const owner = await getOwner(connection, mint);

            result[mint] = owner;

            resolve(owner);
        } catch(error) {
            result[mint] = "";

            reject(error);
        }
    })));

    return new Response(JSON.stringify({
        data : result,
    }));
}
