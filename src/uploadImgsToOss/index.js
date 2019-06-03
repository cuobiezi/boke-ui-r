import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

export default class UploadImgsToOss extends Component {
  static propTypes = {
    oss: PropTypes.object,
    maxNum: PropTypes.number,
    fail: PropTypes.func,
    imageUrls: PropTypes.array,
    getImageUrls: PropTypes.func,
    definedImage: PropTypes.string,
    defineChange: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      imageUrls: this.props.imageUrls || [],
      maxNum: this.props.maxNum || 1,
      showDelete: -1,
      drapImage: '',
      drapIndex: -1,
      definedImage: this.props.definedImage
    }
  }
  // 选择图片
  onchange = (file) => {
    this.getOss(file.target.files)
    file.target.value = ''
  }
  // 获取上传权限
  getOss = (files) => {
    let res = this.props.oss
    for (const key in files) {
      if (files.hasOwnProperty(key)) {
        const element = files[key]
        this.uploadToOss(res, element)
      }
    }
  }
  // 上传图片
  uploadToOss = (ossObj, file) => {
    let imageHash = '' + Math.random()
    let imageName = imageHash.substring(2, imageHash.length)
    // eslint-disable-next-line no-undef
    let formData = new FormData()
    formData.set('key', ossObj.imageDir + '/' + imageName + '.png')
    formData.set('policy', ossObj.policy)
    formData.set('OSSAccessKeyId', ossObj.accessId)
    formData.set('success_action_status', 200)
    formData.set('signature', ossObj.signature)
    formData.set('file', file)
    // eslint-disable-next-line no-undef
    fetch(ossObj.host, {
      method: 'POST',
      body: formData
    }).then(res => {
      if (res.status !== 200) {
        res.json().then(resError => {
        })
        throw new Error('Fail to get response with status ' + res.status)
        this.props.fail(res.status);
      }
      const imageUrl = '/images/' + ossObj.imageDir + '/' + imageName + '.png'
      this.setState({
        imageUrls: [...this.state.imageUrls, imageUrl]
        // isUpload: true
      })
      this.props.getImageUrls(this.state.imageUrls)
    }).catch(err => { console.log(err) })
  }
  // 删除图片
  delete = (imgurl) => {
    let img = this.state.imageUrls.filter((item) => item !== imgurl)
    this.setState({
      imageUrls: img
    })
    // 删除
    this.props.getImageUrls(img)
  }
  onDrop = (e, image, index) => {
    // e.preventDefault()
    let {drapIndex, drapImage, imageUrls} = this.state
    if (drapImage === image) return
    imageUrls.splice(drapIndex, 1, ...imageUrls.splice(index, 1, imageUrls[drapIndex]))
    this.setState({
      imageUrls
    })
    this.props.getImageUrls(imageUrls)
  }
  onDragLeave = (e, image, index) => {
    this.setState({
      drapImage: image,
      drapIndex: index
    })
  }
  // 点击设置默认
  clickDefined = (e, image, index) => {
    e.preventDefault()
    this.setState({
      definedImage: image
    })
    this.props.defineChange(image, index)
  }
  render() {
    const { imageUrls, maxNum, showDelete, definedImage } = this.state
    return (
      <div className={styles['boke-c-uploadImgs']} style={{width: 100 + 110 * imageUrls.length + 'px'}} >
        {imageUrls.map((item, index) => (
          <div
            draggable='true'
            onDragOverCapture={(e) => this.onDrop(e, item, index)}
            onDragLeave={(e) => this.onDragLeave(e, item, index)}
            className={styles['boke-upload-images']}
            onMouseLeave={() => { this.setState({showDelete: -1}) }}
            onMouseEnter={() => { this.setState({showDelete: index}) }}
            key={index}>
            <img className={styles['upload-img']} style={{width: '98px'}} alt='' src={item} />
            {
              showDelete === index
                ? <div className={styles['delete-this-imge']}><img onClick={() => { this.delete(item) }} alt='删除' src={require('./delete.svg')} /></div> : ''
            }
            {
              definedImage
                ? definedImage === item
                  ? <div className={styles['defined-img']}>默认</div> : <button onClick={(e) => this.clickDefined(e, item, index)} className={styles['set-defined-img']}>设置默认</button> : ''
            }
          </div>
        ))}
        {
          imageUrls.length < maxNum ? <div className={styles['boke-upload-images-input-cover']}>+</div> : ''
        }
        {
          imageUrls.length < maxNum ? <input multiple='multiple' className={styles['boke-upload-images-input']} onChange={this.onchange} type='file' /> : ''
        }
      </div>
    )
  }
}
