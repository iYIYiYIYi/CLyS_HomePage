function uniformOpacity(ele,time=0.5,translucent=true) {
    clearInterval(ele.timer);
    var v;
    //时间 * 帧率
    var steps = 40 * time;
    if (translucent) {
        ele.style.display = 'inherit';
        v = (1-ele.style.opacity)/steps;
    }
    else {
        v = -ele.style.opacity/steps;
    }
    var opacity = parseFloat(ele.style.opacity)
    ele.timer = setInterval(function () {
        if ((v > 0 && opacity >= 1)||(v < 0 && opacity <= 0)){
            clearInterval(ele.timer);
            if (v<0) {
                ele.style.display = 'none';
            }
        }
        opacity += v;
        ele.style.opacity = opacity;
    },time*1000/steps);
}

//Test fadeIn animation by hand