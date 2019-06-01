import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

export default class UploadImgsToOss extends Component {
  static propTypes = {
    maxNum: PropTypes.number,
    imageUrls: PropTypes.array,
    getOss: PropTypes.func,
    successUpload: PropTypes.func
  }
  constructor(props) {
    super(props)
    this.state = {
      imageUrls: this.props.imageUrls || [],
      maxNum: this.props.maxNum || 6,
      showDelete: -1
    }
  }
  // 选择图片
  onchange = (file) => {
    this.getOss(file.target.files)
    file.target.value = ''
  }
  // 获取上传权限
  getOss = (files) => {
    let res = this.props.getOss()
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
      }
      const imageUrl = '/images/' + ossObj.imageDir + '/' + imageName + '.png'
      this.setState({
        imageUrls: [...this.state.imageUrls, imageUrl]
        // isUpload: true
      })
      this.props.successUpload(this.state.imageUrls)
    }).catch(err => { console.log(err) })
  }
  // 删除图片
  delete = (imgurl) => {
    let img = this.state.imageUrls.filter((item) => item !== imgurl)
    this.setState({
      imageUrls: img
    })
    // 删除
    this.props.successUpload(img)
  }
  onDragStart = (e) => {
    console.log(e, 'aaa')
  }
  onDrop = () => {
    // console.log('bbb')
  }
  onDragLeave = () => {
    console.log('lever')
  }
  render() {
    const { imageUrls, maxNum, showDelete } = this.state
    return (
      <div className={styles['boke-c-uploadImgs']} style={{width: 100 + 110 * imageUrls.length + 'px'}} >
        {imageUrls.map((item, index) => (
          <div
            draggable='true'
            onDragOver={(e) => this.onDrop(e, index)}
            onDragLeave={(e) => this.onDragLeave(e, index)}
            onDragStart={(e) => this.onDragStart(e, index)}
            className={styles['boke-upload-images']}
            onMouseLeave={() => { this.setState({showDelete: -1}) }}
            onMouseEnter={() => { this.setState({showDelete: index}) }}
            key={index}>
            <img className={styles['upload-img']} style={{width: '98px'}} alt='' src={item} />{index}
            {
              showDelete === index ? <div className={styles['delete-this-imge']}><img onClick={() => { this.delete(item) }} alt='删除' src={require('./delete.svg')} /></div> : ''
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
