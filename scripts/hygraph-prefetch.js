import fs from "fs";
import path from "path";

import { request, gql } from "graphql-request";

const queryRequest = async (url, model, args) => {
    const queryName = `${model.slice(0, 1).toUpperCase()}${model.slice(1, model.length)}`;
    
    const data = await request(url, gql`
        query ${queryName} {
            ${model} ${args}
        }
    `);
    
    return data[model];
};

const makeStringModule = (data) => `export default ${JSON.stringify(data, null, 4)}`;

const writeData = async (outDir, name, data) => {
    await fs.promises.writeFile(path.join(outDir, `${name}.js`), makeStringModule(data));
};

(async () => {
    // eslint-disable-next-line no-console
    console.log("\n\nstarting prefetch\n");

    const {
        default : config,
    } = await import(path.join(process.cwd(), "./cms.config.js"));

    const {
        contentEndpoint = "",
        outDir = "./data",
        queries = [],
    } = config;

    // eslint-disable-next-line no-console
    console.log("config:\n\n",  {
        contentEndpoint,
        outDir,
    }, "\n\n");

    // Ensure dir
    fs.mkdirSync(outDir, { recursive : true });

    await Promise.all(queries.map(({ model, args }) => new Promise(async (resolve, reject) => {
        try {
            const response = await queryRequest(contentEndpoint, model, args);
            
            // eslint-disable-next-line no-console
            console.log("\nfetched:", model);

            await writeData(path.join(process.cwd(), outDir), model, response);

            // eslint-disable-next-line no-console
            console.log(`writing file: ${model} -> ${outDir}/${model}.js\n\n`);

            resolve();
        } catch(error) {
            reject(error);
        }
    })));
})();
