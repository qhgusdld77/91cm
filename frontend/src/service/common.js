import store from '../store'
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

  checkFileType(file) {
    let type = file.extension
    type = type.toLowerCase().trim()
    switch (type) {
      case ('png'):
      case ('jpg'):
      case ('gif'):
        return file.path
      case ('zip'):
      case ('7z'):
      case ('tar'):
        return require('@/assets/images/fileIcon/zip_icon.png')
      case 'pdf':
        return require('@/assets/images/fileIcon/pdf_icon.png')
      case 'txt':
        return require('@/assets/images/fileIcon/txt_icon.png')
      default:
        return require('@/assets/images/fileIcon/file_icon.png')
    }
  }
}

export default new CommonClass()
