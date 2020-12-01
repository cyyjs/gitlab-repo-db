import clear from 'rollup-plugin-clear'
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from "rollup-plugin-terser"
import path from 'path'

const plugins = [
  clear({
    // required, point out which directories should be clear.
    targets: ['lib'],
    // optional, whether clear the directores when rollup recompile on --watch mode.
    watch: true, // default: false
  }),
  typescript({
    tsconfig: 'tsconfig.json',
    cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache')
  }),
  resolve({ preferBuiltins: true }),
  commonjs(),
  terser()
]

export default {
  input: `./src/index.ts`,
    plugins,
    output: {
      format: 'cjs',
      file: `lib/index.js`,
    },
    external: [
      'gitlab-api-v4',
      'uuid',
      'mingo'
    ]
}
