let hot_arr=undefined;
function getHot(type) {

    $(".hot-container").html('');
    $(".hot-type").text(type);

    let loadData = (data,type)=>{
        let selector = $("#hot-type-selector")

        if (type === undefined) {
            $.each(data,function (index,element) {
                if (index === 0) {
                    $(".hot-type").text(element.hot_name);
                    for (let t = 1; t <= 15; t++) {
                        let item =
                            "<div class=\"hot-p\">\n" +
                            "    <a href=\"" + element.content[t].href + "\" target=\"_blank\">" + element.content[t].title + "</a>\n" +
                            "</div>";
                        $(".hot-container").append(item);
                    }
                }

                let p = "<div class=\"hot-choose-p\">"+element.hot_name+"</div>"
                selector.append(p);
            })
        } else {
            //each循环 使用$.each方法遍历返回的数据data
            $.each(data, function (index, element) {
                if(type === element.hot_name) {
                    for (let t = 1; t <= 15; t++) {
                        let item =
                            "<div class=\"hot-p\">\n" +
                            "    <a href=\"" + element.content[t].href + "\" target=\"_blank\">" + element.content[t].title + "</a>\n" +
                            "</div>";
                        $(".hot-container").append(item);
                    }
                }

                if (selector.children().length < data.length) {
                    let p = "<div class=\"hot-choose-p\">"+element.hot_name+"</div>"
                    selector.append(p);
                }
            })
        }

    }

    if (hot_arr === undefined) {
        $.getJSON("http://47.117.116.187:8875/hot", function(data) {
            hot_arr = JSON.parse(data)

            loadData(hot_arr,type)
        });
    } else {
        loadData(hot_arr,type);
    }

}

function url_fix(url_to_fix) {
    let url = url_to_fix;
    if (url_to_fix.indexOf('http') == -1)
        url = 'http://' + url_to_fix;
    return url;
}

function base_url_get(url_to_get){
    let url = url_fix(url_to_get);
    let u = new URL(url);
    return u.origin;
}
