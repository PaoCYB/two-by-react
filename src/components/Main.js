require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片
let imageDatas=require('../data/imageDatas.json');

//将图片名信息专程图片URL路径信息
imageDatas=(function gebImageURL(imageDataArr) {

  for (var i=0,j=imageDataArr.length;i<j;i++){
    let singleImageData=imageDataArr[i];

    singleImageData.imageURL=require('../images/'+
    singleImageData.fileName);
 imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);



class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
