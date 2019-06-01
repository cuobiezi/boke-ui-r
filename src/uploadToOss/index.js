import React, { Component } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

export default class UploadToOss extends Component {
  static propTypes = {
    getOss: PropTypes.func,
    successUpload: PropTypes.func,
    img: PropTypes.string
  }
  constructor(props) {
    super(props)
    this.state = {
      imageUrl: this.props.img || null
    }
  }
  // 选择图片
  onChange = (file) => {
    this.getOss(file.target.files[0])
  }
  // 获取权限
  getOss = (file) => {
    let res = this.props.getOss()
    this.uploadToOss(res, file)
  }
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
          console.log('-image---error', resError)
        })
        throw new Error('Fail to get response with status ' + res.status)
      }
      const imageUrl = '/images/' + ossObj.imageDir + '/' + imageName + '.png'
      this.props.successUpload(imageUrl)
      this.setState({
        imageUrl,
        isUpload: true
      })
    }).catch(err => {
      console.log(err)
    })
  }
  componentWillReceiveProps(nextProps) {
    const { img } = nextProps
    this.setState({imageUrl: img})
  }

  render() {
    const {imageUrl} = this.state
    console.log(imageUrl)
    return (
      <div className={styles['boke-upload']}>
        <div className={styles['boke-upload-input-cover']} >
          { imageUrl ? <img alt='imgs' src={imageUrl} /> : '+' }
        </div>
        <input type='file' onChange={this.onChange} className={styles['boke-upload-input']} />
      </div>
    )
  }
}
