class search_engine {
    name='';
    url='';
}

let config = {
    use_bing_wall:false,
    background:'rgb(240,240,240)',
    hot_type:'知乎热榜',
    search_engines:[{name:'百度',url:'https://www.baidu.com/s?&wd='},
                    {name:'知乎',url:'https://www.zhihu.com/search?type=content&q='},
                    {name:'Google',url:'https://www.google.com/search?q='}],
    search_index:0,
    websiteGroups:[],
    recentWebsites:[{name:'百度',url:'http://www.baidu.com'},{name:'知乎',url:'https://www.zhihu.com/search?type=content&q='}]
};

function loadConfig() {
    if (checkCookie('config')) {
        config = convertObject('config');
    }

    for (let i of config.websiteGroups) {
        add_website_card(i);
    }

    getHot(config.hot_type);
    $(".hot-b").text(config.hot_type);
    _set_b_c(config.background);
    obtainRecent();

    for (let i of config.search_engines) {
        addSearchEnginep(i.name,i.url);
    }
    refreshSearchEngine_li();

    $(".swiper-wrapper").on("click",".website-card-link",function (e) {
        console.log(this);
        let ele = $(this);
        let name = ele.children('a:first-child').text()
        let url = ele.children('a:first-child').attr('href');
        console.log(name,url);
        pushRecentWebsites({name,url});
        console.log(config.recentWebsites);
    });


    if(config.use_bing_wall === true) {
        $("#set-bing-wall").prop("checked",true);
        setBingBackground();
    }
}

function pushRecentWebsites({name,url}) {
    for (let i=0;i<config.recentWebsites.length;i++) {
        if (config.recentWebsites[i].name === name&&config.recentWebsites[i].url) {
            return;
        }
    }
    if (config.recentWebsites.length < 6) {
        config.recentWebsites.unshift({name,url});
    } else {

        config.recentWebsites.pop();
        config.recentWebsites.unshift({name,url});
    }

    obtainRecent();
}

function obtainRecent() {
    let finalOut = '',img_url = '';
    for (let i=0;i<config.recentWebsites.length;i++) {
        img_url = base_url_get(config.recentWebsites[i].url) + '/favicon.ico';
        finalOut += " <div class=\"recently-p\">\n" +
            "            <a href=\""+config.recentWebsites[i].url+"\" target=\"_blank\">\n" +
            "                 <div class=\"recently-in-a\">\n" +
            "                      <img class=\"recently-img\" onerror=\"this.src='images/error-website.png'\" src=\""+img_url+"\">\n" +
            "                      <div class=\"recently-w\">"+config.recentWebsites[i].name+"</div>\n" +
            "                 </div>\n" +
            "            </a>\n" +
            "      </div>\n";
    }

    $('.recently-used-container').html(finalOut);
}

function setBingBackground(){
    $('body').css({'background-image': 'url(\"http://bing.ioliu.cn/v1/rand/?w=1280&h=720\")',
        'background-size': 'cover',
        'background-repeat': 'no-repeat'});
    $('.b-w').css('opacity',0.6);
    let root = $(':root')[0]
    root.style.setProperty('--border-d','rgba(0,0,0,0)');
    root.style.setProperty('--border-b','rgba(0,0,0,0)');
}

function removeBingBackground(){
    $('body').css('background','');
    $('.b-w').css('opacity',0);
    let root = $(':root')[0]
    let color = root.style.getPropertyValue('--back')
    _set_b_c(color)
}

function saveConfig() {
    let con = convertJSON(config);
    setCookie('config',con);
}

/***
 * 设置Cookie
 */
function setCookie(name,value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days*24*60*60*1000);
    var cookie = document.cookie;
    cookie = name+"="+value+ ";expires=" + exp.toGMTString();
    document.cookie = cookie;
}

/***
 * 获取Cookie
 */
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++)
    {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
    }
    return "";
}

/***
 * 检测Cookie
 */
function checkCookie(cname)
{
    var cookie=getCookie(cname);
    if (cookie!="")
    {
        return true;
    }
    return false;
}

/**
 * 将中文符号转换成英文符号
 */
function chineseChar2englishChar(chineseChar){
    // 将单引号‘’都转换成'，将双引号“”都转换成"
    var str = chineseChar.replace(/\’|\‘/g,"'").replace(/\“|\”/g,"\"");
    // 将中括号【】转换成[]，将大括号｛｝转换成{}
    str = str.replace(/\【/g,"[").replace(/\】/g,"]").replace(/\｛/g,"{").replace(/\｝/g,"}");
    // 将逗号，转换成,，将：转换成:
    str = str.replace(/，/g,",").replace(/：/g,":");
    return str;
}

//---------------下面这一段是JSON对象处理函数---------------//
function convertJSON(object){
    //将JSON对象转换为string
    var str = JSON.stringify(object);
    return str;
}

function convertObject(name){
    //从cookie读取JSON对象
    var object = JSON.parse(getCookie(name));
    return object;
}