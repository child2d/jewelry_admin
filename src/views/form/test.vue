<template>
  <div class="test">
    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    <div>
      <img src="" alt="">
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  data() {
    return {
      ossUrl: 'http://jewelry3510.com/api/getsign',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false
    }
  },
  methods: {
    handleRemove(file) {
      console.log(file)

      var getSuffix = function(fileName) {
        var pos = fileName.lastIndexOf('.')
        var suffix = ''
        if (pos !== -1) {
          suffix = fileName.substring(pos)
        }
        return suffix
      }

      if (file.length === 0) {
        alert('请选择文件')
      }

      var filename = new Date().getTime() + getSuffix(file.name)
      console.log('filename: ', filename)
      var formData = new FormData()

      formData.append('key', filename)
      formData.append('file', file.raw)
      axios.post(this.ossUrl, formData).then((response) => {
        console.log('response: ', response.ResultData)
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      console.log('file.url: ', file.url)
      this.dialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    }
  }
}
</script>

<style  scoped>
.ee /deep/ .el-upload--picture-card {
  margin-top: 20px;
    width: 50px;
    height: 50px;
    line-height: 50px;
}

.ee /deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
</style>
