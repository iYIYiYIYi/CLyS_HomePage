function init_sundry() {
    $('.picker').farbtastic('.color-pick');

    // setInterval(set_color,1000);
}

const intensity = 0.25;
let colorOnShow = false;

function set_color() {
    const color = $('.color-pick').css('background-color');
    _set_b_c(color);
}

function _set_b_c(color) {
    const num = color.substring(color.indexOf('(') + 1, color.lastIndexOf(')')).split(/,\s*/);
    const back = 'rgb(' + num[0] + ',' + num[1] + ',' + num[2] + ')';
    const border_d = 'rgb(' + num[0] * (1 - intensity) + ',' + num[1] * (1 - intensity) + ',' + num[2] * (1 - intensity) + ')';
    const border_b = 'rgb(' + num[0] * (1 + intensity) + ',' + num[1] * (1 + intensity) + ',' + num[2] * (1 + intensity) + ')';
    let fontcolor = 'rgb(' + 17 + ',' + 17 + ',' + 17 + ')';
    if ( num[0]*0.299 + num[1]*0.578 + num[2]*0.114 < 192 ){
        fontcolor = 'rgb(' + 255 + ',' + 255 + ',' + 255 + ')';
    }

    config.background = back;
    $(':root')[0].style.setProperty('--back',back);
    $(':root')[0].style.setProperty('--border-d',border_d);
    $(':root')[0].style.setProperty('--border-b',border_b);
    $(':root')[0].style.setProperty('--fontcolor',fontcolor);


    WIDGET.CONFIG.dataColor = fontcolor;
    $('.color-pick').val('#'+parseInt(num[0]).toString(16)+parseInt(num[1]).toString(16)+parseInt(num[2]).toString(16));
    $('.color-pick').css('background-color',back);
}