<template>
  <div class="hello">
    <el-upload
      class="upload-demo"
      ref="upload"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
      :on-change="handleChange"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件生成word</el-button>
    </el-upload>
  </div>
</template>

<script>
import { pinyin } from 'pinyin-pro'
import { saveAs } from 'file-saver'
// import * as docx from 'docx'

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      result: '',
      fileList: []
    }
  },
  mounted() {},
  methods: {
    submitUpload() {
      // this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList, 2222)
    },
    handleChange(file, fileList) {
      console.log(file, fileList, 223333)
      this.loadWords(file)
    },
    handlePreview(file) {
      console.log(file, 1111)
    },
    async loadWords(file) {
      const reader = new FileReader()
      reader.onload = async () => {
        const text = reader.result
        const words = text.split(/\s+/)
        console.log(words)
        let pinArr = words.map((item) => pinyin(item))
        console.log(pinArr)

        for (let i = 0; i < pinArr.length; i++) {
          if (i % 12 == 0 && i != 0) {
            pinArr.splice(i, 0, '\n\n')
          }
        }

        const blob = new Blob([pinArr], { type: 'application/msword' })
        saveAs(blob, 'myWordDocument.doc')
      }

      reader.readAsText(file.raw)
    }
  }
}
</script>
