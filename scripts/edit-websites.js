function initEdit() {

    $("body").on("blur",".edit-website-n",function () {
        if ($(this).val() == '') {
            $(this).attr('placeholder','名称 请勿留空...');
        }
    });

    $("body").on("blur",".edit-website-u",function () {
        if ($(this).val() == '') {
            $(this).attr('placeholder','链接 请勿留空...');
        }
    });

    $("body").on("blur",".website-card-head-i",function () {
        let local_or_cloud = $('#upload').prop('checked');
        let name = $(this).val();

        if (!local_or_cloud) {
            for (let i of config.websiteGroups) {
                if (i.groupName == name) {
                    alert_c('有一个卡片也叫这个名字');
                    return;
                }
            }
        }

    });

    $("body").on("blur",".website-id-input",function () {
        let ele = $(this);

        if (ele.val() == '')
            ele.attr('placeholder','没有id');

        get_websiteGroup_by_id(ele.val().trim());
    });

    //搜索引擎
    $("body").on("blur",".search-engine-input-bar",function () {
        let ele = $(this);
        // 如果编辑完链接
        if (ele.is('.search-engine-url')) {
            if(ele.prev().val() == '') {
                ele.prev().attr('placeholder','名称 要填啊');
                return;
            }

            if (ele.val() == '') {
                ele.attr('placeholder','链接 要填啊');
                return;
            }

            let name = ele.prev().val();
            let url = ele.val();
            url = url_fix(url);

            for (let i of config.search_engines) {
                if (i.name === name) {
                    i.url = url;
                    console.log(url);
                    return;
                }
            }
            config.search_engines.push({name,url});


        }

    });

    $("body").on("click",".edit-website-card-b",function (e) {
        //删除单独链接
        if ($(e.target).is(".edit-website-del")||$(e.target).parent().is(".edit-website-del")) {
            if ($(e.target).parent().is('.edit-website-card-p')) {
                $(e.target).parent().remove();
            } else if ($(e.target).parent().parent().is('.edit-website-card-p')) {
                $(e.target).parent().parent().remove();
            }
        }

        //添加新链接框
        if ($(e.target).is(".add-new-website-i")) {
            $(e.target).parent().before($(new editWebsites().val()))
        }
        else if (e.target === this) {
            //存储
            let local_or_cloud = $('#upload').prop('checked');
            let groupName = $('.website-card-head-i').val().trim();
            let websites = getWebsites();
            if (websites === undefined || groupName === '') {
                confirm_ch("啊?","填漏了内容的话没法保存",function () {
                    hideEdit();
                });
                return ;
            }

            let newWebsiteGroup =  {
                websiteHash:'none',
                groupName:groupName,
                links:{}
            }
            for (let i of websites) {
                newWebsiteGroup.links[i.name] = i.url;
            }


            for (let i of config.websiteGroups) {
                if (i.groupName === groupName) {
                    i.links = newWebsiteGroup.links
                    update_website_card(i)
                    hideEdit();
                    return;
                }
            }
            config.websiteGroups.push(newWebsiteGroup);
            add_website_card(newWebsiteGroup);

            hideEdit();
        }

    })

}


function update_website_card(websiteGroup) {

    let ele = $('.website-card-content:contains('+websiteGroup.groupName+')').children("div:last-child");
    let final_link = '';
    for (let i in websiteGroup.links) {
        final_link += " <div class=\"website-card-link\">\n" +
            "             <a href=\""+websiteGroup.links[i]+"\" target=\"_blank\">"+ i +"</a>\n" +
            "        </div>\n" ;
    }
    ele.html(final_link);
    return ele.parent();
}

function showEdit(elems,headname,websiteHash) {
    const pan = $(editWebsites.pan(elems,headname,websiteHash));
    $("body").append(pan)
    pan.fadeIn(200,function () {
        $(".edit-website-card").animate({top:'40%'},'swing');
    });
}

function hideEdit() {
    $(".edit-website-card").animate({top:'110%'},'swing',function () {
        $(".edit-website-card-b").fadeOut(200,function () {
            $(".edit-website-card-b").remove();
        });
    });
}

function getWebsites() {
    let websites = new Array();
    let ns = $('.edit-website-n');
    let us = $('.edit-website-u');
    let name,url;
    for (let i=0;i<ns.length;i++) {
        name = $(ns.get(i)).val();
        url = $(us.get(i)).val();

        if (name === ''||url === '')
            return undefined;

        //标准化链接
        url = url_fix(url);

        websites.push(new editWebsites(
            name,
            url
        ));
    }

    return websites;
}

class editWebsites {
    name = '';
    url = '';

    static pan=function (elems,headname,websiteHash='') {
        var out = '';
        var hn = '';
        if (headname !== undefined)
            hn = ' value=\"'+ headname +'\"  disabled = \"disabled\" ';

        if (elems instanceof Array) {
            if (elems[0] instanceof editWebsites)
                elems.forEach(value => out += value.val());
            else
                elems.forEach(value => out += value+'');
        }
        if (elems instanceof editWebsites)
            out = elems.val();

        return '<div class=\"edit-website-card-b\">'+
            '<div class=\"edit-website-card standard\">'+
                '<div class=\"edit-website-card-h\">'+
                    '编辑'+
                '</div>'+
                '<div class=\"edit-website-card-c\">'+
                        '<div class=\"edit-website-card-p\">'+
                            '<input type=\"text\" placeholder=\"组名\" '+hn+' class=\"website-card-head-i standard-input\">'+
                        '</div>'+
                            out +
                        '<div class=\"edit-website-card-p\">'+
                            '<div class=\"add-new-website-i standard\">'+
                                '+'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
            '</div>';
    }

    constructor(name,url) {
        if (name !== undefined)
            this.name = name;
        if (url !== undefined)
            this.url = url;
    }
    
    val=function () {
        return '<div class="edit-website-card-p">'+
            '<input type=\"text\" placeholder=\"名称\" value=\"'+this.name+'\" class=\"edit-website-n standard-input\">'+
                '<input type=\"text\" placeholder=\"链接\" value=\"'+this.url+'\" class=\"edit-website-u standard-input\">'+
                '<button class=\"edit-website-del standard-button\">'+
                    '<img src=\"images/close.png\">'+
                '</button>'+
        '</div>';
    }

}