import axios from 'axios'
class CommonClass {
  replacemsg(originContent) {
    if (originContent == null){
      return
    }
    let content = ''
    content = originContent.replace(/&lt;p&gt;/gim, '<p>')
    content = content.replace(/&lt;\/p&gt;/gim, '</p>')
    return content
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  replaceErrorMsg(originContent) {
    let array = originContent.split("\n")
    let content = ''
    for (let i in array) {
      content += '<p>' + array[i] + '</p>'
    }
    return content.replace(/ /gi, '&nbsp;')
  }

  replacemsgForPreview(originContent) {
    let array = originContent.split("&lt;/p&gt;&lt;p&gt;")
    let content = ''
    for (let i in array) {
      content += array[i] + ' '
    }
    content = content.replace('&lt;/p&gt;', '')
    content = content.replace('&lt;p&gt;', '')
    return content
  }

  byteCount(s, b, i, c) {
    for (b = i = 0; c = s.charCodeAt(i++); b += c >> 11 ? 3 : c >> 4 ? (c >> 7 ? 2 : 1) : 2) ;
    return b
  }

  byteLimit(length) {
    if (length > 30000) {
      alert('최대 30000byte까지 입력이 가능합니다.')
      return false
    } else {
      return true
    }
  }

  fileDownload(file) {
    axios.get("/api/file/download/" + file.server_name, {
      responseType: 'blob'
    })
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]))
        const link = document.createElement('a')
        link.href = url;
        link.setAttribute('download', file.original_name)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      })
  }

  checkFileType(file, option='thumb') {
    let type = file.extension
    type = type.toLowerCase().trim()
    switch (type) {
      case ('png'):
      case ('jpg'):
      case ('jpeg'):
      case ('gif'):
        if (option == 'origin'){
          return "/api/file/download/"+ file.server_name
        }
        //download뒤에 thumb인지 origianl인지 구분 api 만들기
        return "/api/file/download/thumb" + file.server_name
      case ('zip'):
      case ('7z'):
      case ('tar'):
        if(option == 'tiles'){
          return require('@/assets/images/fileIcon/zip-new.png')
        }else{
          return require('@/assets/images/fileIcon/zip_icon.png')
        }
      case 'pdf':
        if(option == 'tiles'){
          return require('@/assets/images/fileIcon/pdf-new.png')
        }else{
          return require('@/assets/images/fileIcon/pdf_icon.png')
        }

      case 'txt':
        return require('@/assets/images/fileIcon/txt_icon.png')
      default:
        return require('@/assets/images/fileIcon/file_icon.png')
    }
  }
}

export default new CommonClass()
