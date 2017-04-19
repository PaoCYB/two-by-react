require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

//获取图片
let imageDatas=require('../data/imageDatas.json');

//将图片名信息专程图片URL路径信息
imageDatas=((imageDataArr) =>{
  for (var i=0,j=imageDataArr.length;i<j;i++){
    let singleImageData=imageDataArr[i];
    singleImageData.imageURL=require('../images/'+ singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);

/*
* 获取区间内的一个随机值
*
* */
var getRangeRandom=(low,high)=> Math.floor(Math.random() * (high-low) + low);


class ImgFigure extends React.Component {
  constructor(props){
    super(props);
  }
  render(){

    var styleObj = {};
    //如果props属性中指定了这张图片的位置,则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img className="img-size" src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { //垂直方向
        x: [0, 0],
        topY: [0, 0]
      }
    };

    this.state = {
      imgsArrangeArr: [
        //{
        //  pos:{
        //    left:'0',
        //    top:'0'
        //  },
        //    rotate:0, //旋转角度
        //isInverse:false //正反面
        //isCenter:false 图片是否居中
        //}
      ]
    };
  }

  /*
  * 重新布局所有图片
  * @param centerIndex 指定居中排布哪个图片
  *
  * */
  rearrange(centerIndex){
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant =this.Constant,
      centerPos=Constant.centerPos,
      hPosRange=Constant.hPosRange,
      vPosRange=Constant.vPosRange,
      hPosRangeLeftSecX=hPosRange.leftSecX,
      hPosRangeRightSecX=hPosRange.rightSecX,
      hPosRangeY=hPosRange.y,
      vPosRangeTopY=vPosRange.topY,
      vPosRangeX=vPosRange.x,

      imgsArrangeTopArr=[],
      topImgNum=Math.ceil(Math.random() * 2),
      //取一个或者不取
      topImgSpliceIndex=0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);
      //首先剧中CenterIndex的图片

      imgsArrangeCenterArr[0]={

        pos:centerPos,

    }

      //取出要布局上侧的图片的状态信息

      topImgSpliceIndex = Math.ceil(Math.random()*(imgsArrangeArr.length-topImgNum));

      imgsArrangeTopArr =imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

      //布局位于上侧的图片

      imgsArrangeTopArr.forEach((value,index)=> {
        imgsArrangeTopArr[index].pos={
          top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        }
      });

      //布局左右图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边,右边部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        }
      };
    }
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }
  /*利用rearramhe函数
   *居中对应index的图片
   *
   */
  center(index) {
    return () => {
      this.rearrange(index);
    }
  }



  //组件加载后，为每一张图片计算其位置的范围
  componentDidMount() {

  //首先拿到舞台的大小
  let stageDOM = this.refs.stage,
    stageW = stageDOM.scrollWidth,
    stageH = stageDOM.scrollHeight,
    halfStageW = Math.ceil(stageW / 2),
    halfStageH = Math.ceil(stageH / 2);

  //拿到一个imgFigure的大小
  let imgFigureDOM = this.refs.imgFigure0,
  imgW = imgFigureDOM.scrollWidth,
    imgH = imgFigureDOM.scrollHeight,
    halfImgW = Math.ceil(imgW / 2),
    halfImgH = Math.ceil(imgH / 2);

  //计算中心点的值
  this.Constant.centerPos = {
    left: halfStageW - halfImgW,
    top: halfStageH - halfImgH
  }

  //计算左右区域图片排布位置取值范围

  this.Constant.hPosRange.leftSecX[0] = -halfStageW;
  this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

  this.Constant.hPosRange.rightSecX[0] = halfStageW - halfImgW;
  this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

  this.Constant.hPosRange.y[0] = -halfImgW;
  this.Constant.hPosRange.y[1] = stageH - halfImgH;

  //计算上测区域图片排布取值范围
  this.Constant.vPosRange.topY[0]=-halfImgH;
  this.Constant.vPosRange.topY[1]=halfStageH - halfImgH * 3;

  this.Constant.vPosRange.x[0]=halfImgW - imgW;
  this.Constant.vPosRange.x[1]=halfImgW;
  let num=Math.floor(Math.random() * 10);
  this.rearrange(num);


}

  render() {
    var controllerUnits=[],
        imgFigures=[];

    imageDatas.forEach((value,index)=> {
      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index]={
          pos:{
            left: 0,
            top: 0,
          }
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure'+index}
        arrange={this.state.imgsArrangeArr[index]}/>);

    });


    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
