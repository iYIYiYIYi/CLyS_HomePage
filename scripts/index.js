//when the website begin load
$(document).ready(function () {
    loadConfig();
    init_swiper();
    initSurface();
});
//when user leaving the website
window.onbeforeunload=function () {
    saveConfig();
};
let mySwiper;
let activedIndex = 1;
function init_swiper() {

    var bullets_need = document.getElementById('slide-container').childElementCount-1;
    mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal', // 垂直切换选项
        // loop: true, // 循环模式选项
        mousewheel: true,
        touchRatio:0.5,
        initialSlide:1,
        // simulateTouch:false,
        observer:true,
        observeSlideChildren:true,
        fadeEffect: {
            crossFade: true,
        },
        onSlideChangeEnd: function(swiper) {
            bullets_need = document.getElementById('slide-container').childElementCount-1;
            this.pagination.renderBullet(bullets_need);
            swiper.update();
            // mySwiper.startAutoplay();
            // mySwiper.reLoop();
        },
        // 分页器
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            bulletClass: 'bullet',
            releaseOnEdges: true,
            bulletActiveClass: 'bullet-active',
            renderBullet: function (index, className) {
                if (index == 1)
                    return '<span class="' + className + '">' + '<img class="bullet-img" src="images/links.png">' + '</span>';

                if (index == 0)
                    return '<span class="' + className + '">' + '<img class="bullet-img" src="images/settings.png">' + '</span>';

                return '<span class="' + className + '">' + '<img class="bullet-img" src="images/websites.png">' + '</span>';
            },
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            slideChangeTransitionEnd: function () {
                activedIndex = this.activeIndex;
            },
        }

    });

    var date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth(),
        day = date.getUTCDate(),
        months = [ "Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];

    document.getElementById('daymonth').innerHTML = months[month] + " " + day;
    document.getElementById('year').innerHTML = year;

    var clockH = $(".hours");
    var clockM = $(".minutes");

    function time() {
        var d = new Date(),
            s = d.getSeconds() * 6,
            m = d.getMinutes() * 6 + (s / 60),
            h = d.getHours() % 12 / 12 * 360 + (m / 12);
        clockH.css("transform", "rotate("+h+"deg)");
        clockM.css("transform", "rotate("+m+"deg)");
    }

    var clock = setInterval(time, 1000);
    time();

}

let user;

function initSurface() {

    $(".swiper-wrapper").on("mouseover mouseout",".scrollable",function (event) {
        if (event.type === "mouseover"){
            mySwiper.mousewheel.disable();
        }
        if (event.type === "mouseout"){
            mySwiper.mousewheel.enable();
        }
    });

    $(".swiper-wrapper").on("click",".edit-website-card-button",function () {
        let ele = $(this);
        if (ele.is(".edit-website-card-button")) {
            let headname = ele.prev().text();
            let elements = new Array();

            for (let i of config.websiteGroups) {
                if (i.groupName === headname) {
                    for (let j in i.links) {
                        elements.push(new editWebsites(j,i.links[j]));
                    }
                    showEdit(elements,headname);
                    break;
                }
            }
        }


    });

    $(".swiper-wrapper").on("click",".config",function (e) {

        let ele = $(e.target)

        //删除这个搜索引擎
        if (ele.is('.search-engine-save-button')||ele.parent().is('.search-engine-save-button')) {
            if (ele.parent().is('.search-engine-save-button')) {
                ele = ele.parent().parent();
            } else {
                ele = ele.parent();
            }

            let name = $(ele.prev().children().get(0)).val().trim();
            let url = $(ele.prev().children().get(1)).val().trim();

            ele.parent().remove();
            if (name == undefined||url == undefined)
                return;

            for (let i=0;i<config.search_engines.length;i++) {
                if (config.search_engines[i].name===name&&config.search_engines[i].url===url) {
                    if (config.search_index === config.search_engines.length-1)
                        config.search_index --;
                    config.search_engines.splice(i,1);

                    refreshSearchEngine_li();
                    break;
                }
            }
        }

        if (ele.is(".logout")) {
            logout();
        }

        if (ele.is(".add-new-websitesp")) {
            showEdit();
        }

        //添加新搜索引擎
        if (ele.is(".add-new-search-engine")) {
            addSearchEnginep();
        }

        //修改背景颜色
        if (ele.is(".color-pick")) {
            $('.color-picker').fadeIn(200);
            colorOnShow = true;
        } else if (colorOnShow) {
            set_color();
            colorOnShow = false;
            $('.color-picker').fadeOut(200);
        }

        //开启bing壁纸
        if (ele.is("#set-bing-wall")) {
            if (ele.prop('checked')) {
                config.use_bing_wall = true;
                setBingBackground();
            } else {
                config.use_bing_wall = false;
                removeBingBackground();
            }
        }

        if (ele.is(".hot-b")) {
            $(".hot-choose").fadeToggle(200);
        }

        if (ele.is(".hot-choose-p")) {
            config.hot_type = ele.text().trim();
            $(".hot-b").text(config.hot_type);
            getHot(config.hot_type);
            $(".hot-choose").fadeToggle(200);
        }

        //删除模块
        let counter;
        if (ele.is(".websites-id-p-del") || ele.parent().is(".websites-id-p-del")) {
            let t = ele.prev().text() || ele.parent().prev().text();
            t = t.trim().replace(' ', '');

            if (ele.is(".websites-id-p-del"))
                ele.parent().remove();
            else
                ele.parent().parent().remove();

            //删除本地块
            counter = 0;
            for (let i of config.websiteGroups) {
                if (i.groupName + i.websiteHash == t) {
                    remove_website_card(i);
                    config.websiteGroups.splice(counter, 1);
                    return;
                }
                counter++;
            }

        }

        //

    });

    $("#search-engine-ul").on("click","li",function (e) {
        let ele = $(this);
        $($(".change-search-engine").get(config.search_index)).removeClass('selected-engine');
        config.search_index = $('#search-engine-ul li').index(this);
        $(ele.children().get(0)).addClass('selected-engine');
        let icon_url = $($(ele.children().get(0)).children().get(0)).attr('src');
        $($('#change-engine').children().get(0)).attr('src',icon_url);
    })
    let search_query = $('#search-query')
    $("#do-search").click(function () {
        let query = search_query.val().trim();
        if (query === '') {
            $('#search-query').attr('placeholder','搜点什么呢')
            return;
        }

        window.open(config.search_engines[config.search_index].url+query.toString(),'_blank');
    });

    $("body").keydown(function (e) {
        switch (e.which) {
            case 13:
                let query =search_query.val().trim();
                if (search_query.val().trim() !== '')
                    window.open(config.search_engines[config.search_index].url+query.toString(),'_blank');
                break;
        }
    })

    initEdit();
    init_sundry();
}

function zoomEngineContainer() {
    container = document.getElementById("engine-container");
    if (container.style.display === 'none'){
        uniformOpacity(container,0.2,true);
    } else {
        uniformOpacity(container,0.2,false);
    }
}

function hold_website_containers() {
    let containers = $('.website-c-sig');
    for (let j=0;j<containers.length;j++){
        let childrens = $(containers.get(j)).children().length;
        if (j<containers.length-1&&childrens<6) {
            //开始转移
            for (let i=0;i<6-childrens;i++) {
                console.log($(containers.get(j+1)).children().eq(0));
                $(containers.get(j+1)).children().eq(0).appendTo($(containers.get(j)));
            }
        }

        if (childrens === 0) {
            $(containers.get(j)).remove();
        }

    }
}

function remove_website_card(websites) {
    let website_cards;
    if (websites instanceof Array) {
        for (let i of websites) {
            if (websites.websiteHash !== ''&&websites.websiteHash !=='none') {
                website_cards = $('.website-card:contains('+websites.websiteHash+')');
                website_cards.remove();
            } else {
                website_cards = $('.website-card:contains('+websites.groupName+')');
                for (let i=0;i<website_cards.length;i++) {
                    if ($(website_cards.get(i)).find('.website-hash').text().trim() !== '')
                        continue;
                    website_cards.get(i).remove();
                }
            }
        }
    }
    hold_website_containers();
}

function add_website_card(websites) {
    let ele = $(".website-c-sig").last();
    if (ele.length === 0) {
        let new_tab = "<div class=\"swiper-slide swiper-slide-container website-c-sig\">\n" +
            "</div>>";
        $("#slide-container").append(new_tab);
        ele = $(".website-c-sig").last();
    }

    let leftcount = 6 - ele.children().length;
    if (leftcount <= 0) {
        let new_tab = "<div class=\"swiper-slide swiper-slide-container website-c-sig\">\n" +
                      "</div>>";

        ele = $(new_tab).insertAfter(ele);
    }

    let final_link = '';
    for (let i in websites.links) {
        final_link += " <div class=\"website-card-link\">\n" +
            "             <a href=\""+websites.links[i]+"\" target=\"_blank\">"+ i +"</a>\n" +
            "        </div>\n" ;
    }


    var website_card = "<div class=\"website-card standard scrollable\">\n" +
        "                    <div class=\"website-card-content\">\n" +
        "                        <div class=\"website-card-head\">"+websites.groupName+"</div>\n" +
        "                        <div class=\"edit-website-card-button\">\n" +
        "                            <img src=\"images/more.png\">\n" +
        "                        </div>\n" +
        "                        <div class=\"website-card-container\">\n" +
                                    final_link +
        "                        </div>\n" +
        "                    </div>\n" +
        "                </div>";

    ele.append($(website_card));

    let website_label = "<div class=\"websites-id-p\">\n" +
        "                  <p class=\"websites-id-p-f\">\n" +
                                websites.groupName+
        "                  </p>\n" +
        "                  <button class=\"websites-id-p-del\">\n" +
        "                        <img src=\"images/websites-id-del.png\">\n" +
        "                  </button>\n" +
        "              </div>";
    $('.websites-id-container').append($(website_label));
}

function addSearchEnginep(name,url) {

    if (name == undefined || url == undefined) {
        var new_search_engine_p = "<div class=\"search-engine-p standard\">\n" +
            "                                <div class=\"search-engine-icon-box\">\n" +
            "                                    <img class=\"search-engine-icon\" src=\"\" onerror=\"this.src='images/search-engine-light.png'\">\n" +
            "                                </div>\n" +
            "                                <div class=\"search-engine-input-block\">\n" +
            "                                    <input class=\"search-engine-input-bar search-engine-name\" placeholder=\"名称\" type=\"text\">\n" +
            "\n" +
            "                                    <input class=\"search-engine-input-bar search-engine-url\" placeholder=\"链接\" type=\"text\">\n" +
            "                                </div>\n" +
            "                                <div class=\"search-engine-save-button-box\">\n" +
            "                                    <button class=\"search-engine-save-button\">\n" +
            "                                        <img class=\"summit-img\" src=\"images/close.png\">\n" +
            "                                    </button>\n" +
            "                                </div>\n" +
            "                            </div>"
        $(".add-new-search-engine").before($(new_search_engine_p));
    } else {
        var new_search_engine_p = "<div class=\"search-engine-p standard\">\n" +
            "                                <div class=\"search-engine-icon-box\">\n" +
            "                                    <img class=\"search-engine-icon\" src=\"\" onerror=\"this.src='images/search-engine-light.png'\">\n" +
            "                                </div>\n" +
            "                                <div class=\"search-engine-input-block\">\n" +
            "                                    <input class=\"search-engine-input-bar search-engine-name\" value="+name+" placeholder=\"名称\" type=\"text\">\n" +
            "\n" +
            "                                    <input class=\"search-engine-input-bar search-engine-url\" value="+url+" placeholder=\"链接\" type=\"text\">\n" +
            "                                </div>\n" +
            "                                <div class=\"search-engine-save-button-box\">\n" +
            "                                    <button class=\"search-engine-save-button\">\n" +
            "                                        <img class=\"summit-img\" src=\"images/close.png\">\n" +
            "                                    </button>\n" +
            "                                </div>\n" +
            "                            </div>"
        $(".add-new-search-engine").before($(new_search_engine_p));
    }
}

function refreshSearchEngine_li() {
    let icon_url ;
    let ele = '';
    let o = '';
    let t = '';
    for (let i=0;i<config.search_engines.length;i++) {
        icon_url = base_url_get(config.search_engines[i].url) + '/favicon.ico'
        if (i === config.search_index) {
            t = 'selected-engine';
            $($('#change-engine').children().get(0)).attr('src',icon_url);
        }
        ele = "<li>\n" +
            "          <button class=\"change-search-engine "+t+"\">\n" +
            "              <img onerror=\"this.src='images/search-engine-light.png'\" src=\""+icon_url+"\">\n" +
                                config.search_engines[i].name +
            "              </button>\n" +
            "     </li>"
        o += ele;
        t = '';
    }
    $('#search-engine-ul').html(o)
}

function copyToClip(content, message) {
    var aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    if (message == null) {
        alert_ch("复制成功","方块标识码已经在剪贴板上了,粘贴一个试试?");
    } else{
        alert_c(message);
    }
}

