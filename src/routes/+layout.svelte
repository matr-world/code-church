<script>
    import "../app.postcss";

    import { page } from "$app/stores";
</script>

<nav class="flex justify-center border-b">
    <div class="max-w-xl w-full py-3">
        <div class="flex justify-between">
            <a
                class="link flex items-center"
                href="/">
                <img
                    class="h-10 m-0 mr-1"
                    alt=""
                    src="favicon.png">
                <h1 class="text-xl font-bold">My Project</h1>
            </a>
            <div class="flex justify-end">
                <a
                    class="btn mr-3"
                    class:btn-accent={$page.url.pathname === "/"}
                    href="/">
                    <svg
                        class:fill-primary={$page.url.pathname !== "/"}
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"><path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z" /></svg>
                </a>
                <a
                    class="btn mr-3"
                    class:btn-accent={$page.url.pathname === "/page/one"}
                    href="/page/one">One</a>
                <a
                    class="btn"
                    class:btn-accent={$page.url.pathname === "/page/two"}
                    href="/page/two">Two</a>
            </div>
        </div>
    </div>
</nav>

<main class="flex justify-center">
    <div class="max-w-xl w-full py-10">
        <article class="prose">
            <slot />
            <i>Written by <a href="https://chat.openai.com/">ChatGPT</a></i>
        </article>
    </div>
</main>

