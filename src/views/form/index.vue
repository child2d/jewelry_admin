<template>
  <div class="test">
    <input id="file" type="file" name="file[]" multiple="multiple">
    <br><br>
    <el-button type="primary" @click="upload()">确 定</el-button>

    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      multiple
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <el-button type="primary" @click="upload2()">确 定</el-button>

  </div>
</template>

<script>
// import { getOssSign } from '@/api/user'

export default {
  data() {
    return {
      ossUrl: 'http://jewelry3510.com/api/getsign',
      fileList: [

      ]
    }
  },
  mounted() {
  },
  methods: {
    upload() {
      var getSuffix = function(fileName) {
        var pos = fileName.lastIndexOf('.')
        var suffix = ''
        if (pos !== -1) {
          suffix = fileName.substring(pos)
        }
        return suffix
      }
      console.log(document.getElementById('file').files[0])

      var file = document.getElementById('file').value
      if (file.length === 0) {
        alert('请选择文件')
      }

      var filename = new Date().getTime() + getSuffix(file)
      var formData = new FormData()

      // 注意formData里append添加的键的大小写
      formData.append('key', this.dir + filename) // 存储在oss的文件路径

      // 如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了
      formData.append('file', document.getElementById('file').files)
      // axios.post(this.ossUrl, formData).then((response) => {
      //   console.log('response: ', response.ResultData)
      // })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      console.log('fileList: ', fileList)
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    upload2() {
      console.log(this.fileList)
      var formData = new FormData()

      // 注意formData里append添加的键的大小写
      formData.append('key', this.dir + new Date().getTime()) // 存储在oss的文件路径

      // 如果是base64文件，那么直接把base64字符串转成blob对象进行上传就可以了
      formData.append('file', this.fileList)

      // axios.post(this.ossUrl, formData).then((response) => {
      //   console.log('response: ', response.ResultData)
      // })
    }
  }
}
</script>
