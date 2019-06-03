# boke-ui-r

> boke common components with ract 

[![NPM](https://img.shields.io/npm/v/boke-ui-r.svg)](https://www.npmjs.com/package/boke-ui-r) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save boke-ui-r
```

## Usage

```jsx
import React, { Component } from 'react'

import MyComponent from 'boke-ui-r'

class Example extends Component {
  render () {
    return (
      <MyComponent />
    )
  }
}
```

## Components
- [uploadImgsToOss](###UploadImgsToOss)

### UploadImgsToOss
上传图片到Oss对象存储，包含单张、多张图片上传，图片删除，拖拽改变图片顺序，设置默认图片等功能。

| 参数           | 说明                        | 类型  | 默认值 |
| --------------| ----------------------------|-------|-------|
| *oss          | 获取对象存储权限函数          | obj   | {}    |
| *getImageUrls | 获取图片链接，上传成功和拖拽修改都会触发此函数|function(imageUrls)|-|
| *fail         | 请求失败（403为权限过期），<br/>可在此函数触发时重新获取权限修改oss属性|function(status)|-|
| maxNum        | 最多上传的图片数量            |number | 1      |
| imageUrls     | 已经上传的图片链接，用于编辑   |array  | []     |
| definedImage  | 默认图片链接（不设置此属性将不会有默认功能）| string | 'undefined' |
| defineChange  | 设置默认图片回调函数           | function(img,index) | - |

## License

MIT © [](https://github.com/)
