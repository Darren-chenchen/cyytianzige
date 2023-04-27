import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue2'
import vueJsx from '@vitejs/plugin-vue2-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import requireTransform from 'vite-plugin-require-transform'

export default ({ mode }) => {
  return defineConfig({
    plugins: [
      vue({
        template: {
          compilerOptions: {}
        }
      }),
      vueJsx(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons/svg')],
        symbolId: 'icon-[dir]-[name]'
      }),
      requireTransform({ fileRegex: /.vue$/ })
    ],
    css: {
      preprocessorOptions: {
        less: {}
      }
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      },
      // 忽略后缀名的配置选项, 添加 .vue 选项时要记得原本默认忽略的选项也要手动写入
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
    },
    server: {
      open: true,
      port: 8082
    },
    envPrefix: ['VUE_'],
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            // 静态资源分拆打包
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString()
            }
          }
        }
      }
    }
  })
}
