const path = require("path");

module.exports = {
    entry: {
        api: ["./quiz.api.js"],
        player: ["./quiz.player.js"]
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
            }
        ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js"
    }
};
