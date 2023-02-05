import { json, type RequestEvent } from "@sveltejs/kit";

import { HELIUS_KEY } from "$env/static/private";

// Consume a search, return what to do with it
export async function GET({ params }: RequestEvent) {
    try {
        const response = await fetch(`https://api.helius.xyz/v1/mintlist/?api-key=${HELIUS_KEY}`, {
            method : "POST",
            body   : JSON.stringify({
                query : {
                    firstVerifiedCreators : [ params?.address ],
                },
                options : {
                    limit : 10000,
                },
            }),
        });
        
        const { result : data }  = await response.json();
        
        return json({ data });
    } catch(error) {
        console.log(error);
    }

    return json({ data : [] });
}
