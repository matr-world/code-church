<script>
    import "../app.postcss";
</script>

<main class="max-w-xl mx-auto py-10 prose min-h-screen">
    <slot />
</main>

<footer class="py-5">
    <div class="w-full divider"></div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5 px-4 items-start">
        <div>
            <div class="text-xs m-0">Made during</div>
            <h4 class="text-lg font-bold m-0">Code Church</h4>
            <p class="text-xs">Offering tutorials, example code, and community to get you started on your web development journey.</p>
        </div>
        <div>
            <div class="text-xs m-0">A project by</div>
            <h4 class="text-lg font-bold m-0">Matr World</h4>
            <p class="text-xs">A creative agency producing Web3 focused experiments.</p>
        </div>
        <div>
            <div class="text-xs m-0">Powered by</div>
            <h4 class="text-lg font-bold m-0">Helius SDK/API</h4>
            <p class="text-xs">Powerful APIs and super quick RPCs that provide the best development experience when interacting with Solana.</p>
        </div>
    </div>
    <div class="px-5 py-6">
        <div class="text-xs m-0">Links</div>
        <div class="flex flex-wrap">
            <a
                class="link mr-5"
                href="https://github.com/matr-world/code-church"
                rel="noreferrer"
                target="_blank">View Code on GitHub</a>
            <a
                class="link mr-5"
                href="https://www.youtube.com/@matrworld2280"
                rel="noreferrer"
                target="_blank">YouTube Tutorials</a>
            <a
                class="link mr-5"
                href="https://discord.gg/rQt2Y59pz7"
                rel="noreferrer"
                target="_blank">Join Discord</a>
            <a
                class="link mr-5"
                href="https://twitter.com/matrterminal"
                rel="noreferrer"
                target="_blank">Follow Twitter</a>
            <a
                class="link mr-5"
                href="https://matr.world"
                rel="noreferrer"
                target="_blank">Matr Website</a>
        </div>
    </div>
</footer>
