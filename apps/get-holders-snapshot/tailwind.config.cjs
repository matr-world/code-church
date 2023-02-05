const config = {
    content : [ "./src/**/*.{html,js,svelte,ts}" ],

    theme : {
        extend : {},
    },

    plugins : [
        require("@tailwindcss/typography"),
        require("daisyui"),
    ],

    daisyui : {
        themes : [
            {
                matr : {
                    ...require("daisyui/src/colors/themes")["[data-theme=night]"],

                    "base-100" : "#050f18",
                },
            },
        ],
    },
};

module.exports = config;
