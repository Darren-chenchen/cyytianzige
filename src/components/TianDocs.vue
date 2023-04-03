<template>
  <div class="TianDocs">
    <el-upload class="upload-demo" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :auto-upload="false" :on-change="handleChange">
      <el-button slot="trigger" size="small" type="warning">选取文件生成excel</el-button>
    </el-upload>
    <canvas id="myCanvas"></canvas>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'
import { pinyin } from 'pinyin-pro'
import * as ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export default {
  data() {
    return {
      imageData: ''
    }
  },
  components: {},
  watch: {},
  mounted() {
    this.getimageData()
    console.log(XLSX.utils)
  },
  methods: {
    getimageData() {
      const canvas = document.getElementById('myCanvas')
      canvas.width = 96 * 4 // 设置宽度为96px，即1cm对应的像素值
      canvas.height = 96 // 设置高度为96px，即1cm对应的像素值

      // 获取2d绘图上下文
      const ctx = canvas.getContext('2d')

      // 绘制田字格
      ctx.strokeStyle = '#000' // 设置线条颜色为黑色
      const lineDash = [3] // 虚线样式
      ctx.setLineDash(lineDash) // 设置虚线样式
      ctx.lineWidth = 2

      // 绘制横线
      ctx.beginPath()
      ctx.moveTo(0, 48)
      ctx.lineTo(canvas.width, 48)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(canvas.width, 0)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(0, 96)
      ctx.lineTo(canvas.width, 96)
      ctx.stroke()

      // 绘制竖线
      for (let i = 0; i < 9; i++) {
        ctx.beginPath()
        ctx.moveTo((i * (4 * 96)) / 8, 0)
        ctx.lineTo((i * (4 * 96)) / 8, canvas.height)
        ctx.stroke()
      }
      this.imageData = canvas.toDataURL('image/png')
    },
    handleChange(file, fileList) {
      console.log(file, fileList, 223333)
      this.loadWords(file)
    },
    loadWords(file) {
      const reader = new FileReader()
      reader.onload = async () => {
        const text = reader.result.replaceAll(',', '')
        const words = text.split(/\s+/)
        console.log(words)
        let pinArr = words.map((item) => pinyin(item))
        let newArray = []
        pinArr.forEach((item) => {
          if (item) {
            newArray.push(item)
          }
        })
        console.log(newArray, file)
        this.doExport(newArray)
      }
      reader.readAsText(file.raw)
    },
    async doExport(pinArr) {
      let array = this.chunkArray(pinArr, 8)

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('My Sheet')
      const img = workbook.addImage({
        base64: this.imageData,
        extension: 'png'
      })
      let cols = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
      array.forEach((item, index) => {
        worksheet.addRow(item)
        if (index % 2 == 1) {
          worksheet.getRow(index + 1).height = 28.35
          cols.forEach((element) => {
            worksheet.addImage(img, `${element}${index + 1}:${element}${index + 1}`)
          })
        }
        if (index == array.length - 1) {
          cols.forEach((element) => {
            worksheet.addImage(img, `${element}${index + 2}:${element}${index + 2}`)
          })
        }
      })
      worksheet.columns.forEach((column) => {
        column.width = 16
      })
      worksheet.getRow(array.length + 1).height = 28.35

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      saveAs(blob, 'My Excel File.xlsx')
    },
    chunkArray(myArray, chunkSize) {
      const arrayLength = myArray.length
      const tempArray = []
      for (let index = 0; index < arrayLength; index += chunkSize) {
        const myChunk = myArray.slice(index, index + chunkSize)
        if (index > 0) {
          let arr = []
          for (let i = 0; i < chunkSize.length; i++) {
            arr.push('')
          }
          tempArray.push(arr)
        }
        tempArray.push(myChunk)
      }
      return tempArray
    }
  }
}
</script>

<style scoped>
.TianDocs {
  margin-top: 20px;
}
</style>
