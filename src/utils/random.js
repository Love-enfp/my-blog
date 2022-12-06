  // 随机颜色
  export const getColor =()=> {
    var colorArr = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f".split(",");
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += colorArr[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  // 随机字体大小
  export const getSize =()=> {
    return Math.floor(Math.random() * 10 + 18) + "px";
  }