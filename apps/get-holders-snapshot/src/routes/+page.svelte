<script lang="ts">
    import type { MintListItem } from "$lib/types";

    import validateAddress from "src/lib/util/solana/validate-address";
    import copy from "$lib/util/copy-to-clipboard";
    import chunkArray from "$lib/util/chunk-array";
    import downloadString from "$lib/util/download-string";

    import { tweened } from "svelte/motion";

    let firstCreatorAddress = "";

    let invalidFirstCreatorAddress = false;
    let finishedGeneratingSnapshot = false;
    let failedToGenerateSnapshot = false;
    let showCopied = false;

    let loadingMintList = false;

    let showGenerateProgress = false;

    let mintList:MintListItem[] = [];
    let snapshot:Record<string, string> = {};

    const snapshotCount = tweened(0, {
        duration : 500,
    });

    $: snapshotMints = Object.keys(snapshot);
    $: snapshotValues = Object.values(snapshot);
    $: $snapshotCount = snapshotMints.length;
    $: progress = (snapshotMints.length / mintList.length) * 100;
    $: snapshotSuccess = snapshotValues.filter((value) => value);

    // only sort/filter once done generating snapshot
    $: maybeSorted = finishedGeneratingSnapshot ?
        snapshotSuccess.filter((holder) => holder).sort((a, b) => a.localeCompare(b)) :
            snapshotSuccess;

    $: result = maybeSorted.join("\n");

    const downloadSnapshot = () => downloadString(result, "text/plain", `snapshot-${firstCreatorAddress}.txt`);

    const copyToClipboard = () => copy(result, showCopied);

    const getOwners = async () => {
        try {
            const chunkedMintList = chunkArray(mintList, 50);
            for(const chunk of chunkedMintList) {
                // eslint-disable-next-line no-await-in-loop
                const response = await fetch(`/api/owners`, {
                    method : "POST",
                    body   : JSON.stringify({
                        addresses : chunk,
                    }),
                });
                const { data } = await response.json();
                snapshot = {
                    ...snapshot,
                    ...data,
                };
            }
        } catch(error) {
            console.log(error);
        }
    };


    const getMintlist = async ():Promise<MintListItem[] | undefined> => {
        loadingMintList = true;

        if(!validateAddress(firstCreatorAddress)) {
            loadingMintList = false;
            showGenerateProgress = false;
            invalidFirstCreatorAddress = true;
            
            return;
        }

        const response = await fetch(`/api/${firstCreatorAddress}/mintlist`);

        const { data } = await response.json();

        loadingMintList = false;

        mintList = [ ...data ];
    };

    const generateSnapshot = async () => {
        finishedGeneratingSnapshot = false;
        invalidFirstCreatorAddress = false;
        showGenerateProgress = true;

        try {
            await getMintlist();
            await getOwners();

            finishedGeneratingSnapshot = true;
        } catch(error) {
            failedToGenerateSnapshot = true;
            showGenerateProgress = false
        };
    };

</script>

<div class="toast toast-top">
    {#if invalidFirstCreatorAddress}
        <div class="alert alert-warning flex w-full justify-between">
            <span>Invalid first creator address.</span>
            <button
                class="btn btn-ghost btn-sm"
                on:click={() => (invalidFirstCreatorAddress = false)}>
                <svg
                    class="fill-black h-5 w-5"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    stroke-linejoin="round"
                    stroke-miterlimit="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"><path
                    d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                    fill-rule="nonzero" /></svg>
            </button>
        </div>
    {:else if failedToGenerateSnapshot}
        <div class="alert alert-warning flex w-full justify-between">
            <span>Failed to generate snapshot.</span>
            <button
                class="btn btn-ghost btn-sm"
                on:click={() => (failedToGenerateSnapshot = false)}>
                <svg
                    class="fill-black h-5 w-5"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    stroke-linejoin="round"
                    stroke-miterlimit="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"><path
                    d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                    fill-rule="nonzero" /></svg>
            </button>
        </div>
    {/if}
    {#if showCopied}
        <div class="alert alert-success flex w-full justify-between">
            <span>Copied result to clipboard.</span>
            <button
                class="btn btn-ghost btn-sm"
                on:click={() => (showCopied = false)}>
                <svg
                    class="fill-black h-5 w-5"
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    stroke-linejoin="round"
                    stroke-miterlimit="2"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"><path
                    d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm0 1.5c-4.69 0-8.497 3.807-8.497 8.497s3.807 8.498 8.497 8.498 8.498-3.808 8.498-8.498-3.808-8.497-8.498-8.497zm0 7.425 2.717-2.718c.146-.146.339-.219.531-.219.404 0 .75.325.75.75 0 .193-.073.384-.219.531l-2.717 2.717 2.727 2.728c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.384-.073-.53-.219l-2.729-2.728-2.728 2.728c-.146.146-.338.219-.53.219-.401 0-.751-.323-.751-.75 0-.192.073-.384.22-.531l2.728-2.728-2.722-2.722c-.146-.147-.219-.338-.219-.531 0-.425.346-.749.75-.749.192 0 .385.073.531.219z"
                    fill-rule="nonzero" /></svg>
            </button>
        </div>
    {/if}
</div>

<section class="pt-10 pb-5">
    <h1 class="m-0 text-5xl">Holder Snaphot</h1>
    <p class="m-0">Get all of the holders of a Solana NFT collection.</p>
</section>

<section class="pb-10">
    <div class="flex items-center">
        <svg
            class="fill-warning h-5 w-5 mr-1"
            clip-rule="evenodd"
            fill-rule="evenodd"
            stroke-linejoin="round"
            stroke-miterlimit="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"><path
            d="m12.002 21.534c5.518 0 9.998-4.48 9.998-9.998s-4.48-9.997-9.998-9.997c-5.517 0-9.997 4.479-9.997 9.997s4.48 9.998 9.997 9.998zm0-1.5c-4.69 0-8.497-3.808-8.497-8.498s3.807-8.497 8.497-8.497 8.498 3.807 8.498 8.497-3.808 8.498-8.498 8.498zm0-6.5c-.414 0-.75-.336-.75-.75v-5.5c0-.414.336-.75.75-.75s.75.336.75.75v5.5c0 .414-.336.75-.75.75zm-.002 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"
            fill-rule="nonzero" /></svg>
        <h2 class="m-0">Get First Creator Address</h2>
    </div>
    <p>To lookup NFTs by creator, you'll need to provide the first creator address of the collection. If you don't have know the first creator, look up one of the NFTs int the collection on Solana Terminal and you'll see "First Creator" in the details.</p>
    
    <div>
        <a
            class="btn btn-primary"
            href="https://solanaterminal.com"
            rel="noreferrer"
            target="_blank">Solana Terminal</a>
    </div>
</section>

<section class="pb-10">
    <h1 class="m-0">Generate Snapshot</h1>
    <p class="mt-0">
        Provide the First Creator Address of a Solana NFT to get a list of all NFTs in the collection. If your project used multiple Candy Machines, be sure to run this tool on each one.
    </p>
    <input
        class="input input-bordered w-full"
        placeholder="First Creator Address"
        type="text"
        bind:value={firstCreatorAddress}>
    <button
        class="btn btn-success btn-block mt-3"
        class:loading={loadingMintList}
        on:click={generateSnapshot}>
        Generate
    </button>
</section>

{#if showGenerateProgress}
    <section>
        <div class="rounded-lg bg-slate-900 p-2 flex justify-between items-center mb-4">
            <div>
                <p class="m-0">
                    Downloading mintlist...
                </p>
            </div>
            {#if mintList.length < 1}
                <div>
                    <button class="btn btn-sm btn-ghost loading"></button>
                </div>
            {:else}
                <div>
                    <svg
                        class="fill-success h-5 w-5"
                        clip-rule="evenodd"
                        fill-rule="evenodd"
                        stroke-linejoin="round"
                        stroke-miterlimit="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"><path
                        d="m11.998 2.005c5.517 0 9.997 4.48 9.997 9.997 0 5.518-4.48 9.998-9.997 9.998-5.518 0-9.998-4.48-9.998-9.998 0-5.517 4.48-9.997 9.998-9.997zm-5.049 10.386 3.851 3.43c.142.128.321.19.499.19.202 0 .405-.081.552-.242l5.953-6.509c.131-.143.196-.323.196-.502 0-.41-.331-.747-.748-.747-.204 0-.405.082-.554.243l-5.453 5.962-3.298-2.938c-.144-.127-.321-.19-.499-.19-.415 0-.748.335-.748.746 0 .205.084.409.249.557z"
                        fill-rule="nonzero" /></svg>
                </div>
            {/if}
        </div>
        
        {#if mintList.length > 0}
            <div class="rounded-lg bg-slate-900 p-2 mb-4">
                <p class="m-0">
                    Found <strong>{mintList[0]?.name}</strong> and {mintList.length - 1} more.
                </p>
                <div class="flex">
                    <button></button>
                </div>
            </div>

            <div class="rounded-lg bg-slate-900 p-2 mb-4">
                <div class="flex justify-between flex-wrap items-center">
                    <p class="m-0">Getting owners...</p>
                    {#if snapshotMints.length < mintList.length && !finishedGeneratingSnapshot}
                        <button class="btn btn-sm btn-ghost loading">
                            {$snapshotCount.toFixed()}/{mintList.length}
                        </button>
                    {:else}
                        <svg
                            class="fill-success h-5 w-5"
                            clip-rule="evenodd"
                            fill-rule="evenodd"
                            stroke-linejoin="round"
                            stroke-miterlimit="2"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"><path
                            d="m11.998 2.005c5.517 0 9.997 4.48 9.997 9.997 0 5.518-4.48 9.998-9.997 9.998-5.518 0-9.998-4.48-9.998-9.998 0-5.517 4.48-9.997 9.998-9.997zm-5.049 10.386 3.851 3.43c.142.128.321.19.499.19.202 0 .405-.081.552-.242l5.953-6.509c.131-.143.196-.323.196-.502 0-.41-.331-.747-.748-.747-.204 0-.405.082-.554.243l-5.453 5.962-3.298-2.938c-.144-.127-.321-.19-.499-.19-.415 0-.748.335-.748.746 0 .205.084.409.249.557z"
                            fill-rule="nonzero" /></svg>
                    {/if}
                </div>
                <progress
                    class="progress progress-success w-full"
                    max="100"
                    value={progress}></progress>
            </div>

            {#if finishedGeneratingSnapshot}
                {@const failed = Object.entries(snapshot).filter(([ _, address ]) => !address)}

                <div class="rounded-lg bg-slate-900 p-2 mb-4">
                    <div class="flex justify-between flex-wrap items-center">
                        <div>
                            <h3 class="m-0">
                                Snapshot Complete!
                            </h3>
                            <p class="mt-0">Download or copy the list of holder wallets below. Duplicate entries indicate multiple NFTs held.</p>
                        </div>
                        <div class="flex">
                            <button
                                class="btn mr-2"
                                on:click={downloadSnapshot}>
                                Download
                            </button>
                            <button
                                class="btn"
                                on:click={copyToClipboard}>
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
                
                {#if failed.length}
                    <div class="rounded-lg bg-slate-900 p-2 mb-4">
                        <div class="mb-4">
                            <h4 class="m-0">Failed</h4>
                            <p>Couldn't lookup the owner of the following mints.</p>
                            <ul>
                                {#each failed as [ mint ]}
                                    <li>
                                        <a
                                            href="https://solanaterminal.com/token/{mint}"
                                            rel="noreferrer"
                                            target="_blank">
                                            {mint}
                                        </a>
                                    </li>
                                {/each}
                            </ul>
                        </div>
                    </div>
                {/if}
            {/if}
           
            <pre>{result}</pre>
        {/if}
    </section>
{/if}
