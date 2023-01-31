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
                mytheme : {
        
                    primary : "#f3f4f6",
        
                    secondary : "#4b5563",
        
                    accent : "#4ade80",
        
                    neutral : "#292524",
        
                    "base-100" : "#000000",
        
                    info : "#3b82f6",
        
                    success : "#4ade80",
        
                    warning : "#fbbf24",
        
                    error : "#ef4444",
                },
            },
        ],
    },
};

module.exports = config;
