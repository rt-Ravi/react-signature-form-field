import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss"; 

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named"
    },
    {
      file: "dist/index.esm.js",
      format: "esm"
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    babel({ babelHelpers: "bundled", exclude: "node_modules/**", extensions: [".js", ".jsx"] , presets: ["@babel/preset-env", "@babel/preset-react"] }),

    postcss({
      inject: true,
      extract: true, // ✅ creates separate CSS file
    }),
  ],
  external: ["react", "react-dom"]
};
