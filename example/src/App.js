import React, { Component } from 'react'

import {UploadImgsToOss} from 'boke-ui-r';

export default class App extends Component {
  
  getOss = () => {
    let oss = {
      "host": "https://bokecad-cloud.oss-cn-shenzhen.aliyuncs.com",
      "accessId": "LTAItiP3Q0rj2QYo",
      "policy": "eyJleHBpcmF0aW9uIjoiMjAxOS0wNi0wMlQwNjo1MTo1Ny4zODNaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjBdXX0=",
      "signature": "2QPMAXLqWJ3QT+ErwxvyluFxoZY=",
      "imageDir": "aimu_ms_test",
      "expireDate": "2019-06-02 14:51:57"
    }
    return oss;
  }
  successUpload = (aa) => {
    console.log(aa)
  }

  render () {
    return (
      <div>
        <UploadImgsToOss getOss={this.getOss} successUpload={this.successUpload} />
      </div>
    )
  }
}
