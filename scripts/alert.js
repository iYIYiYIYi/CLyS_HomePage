class Alert {

    content;
    head = 'Attention';
    canCanceled = false;

    static confirm = 'confirm';
    static cancel = 'cancel';

    constructor(head,content,canCanceled) {
        this.head = head;
        this.content = content;
        this.canCanceled = canCanceled;
    }

    val = function () {
        if (this.canCanceled)
            return "<div class=\"alert-cover\">\n"+
                        "<div class=\"alert\">\n"+
                            "<div class=\"alert-title\">\n"+
                                    this.head+
                            "</div>\n"+
                            "<div class=\"alert-content\">\n"+
                                    this.content+
                            "</div>\n"+
                            "<div class=\"alert-confirm-buttons\">\n"+
                                "<button class=\"alert-button standard-button \">"+Alert.confirm+"</button>\n"+
                                "<button class=\"alert-button standard-button \">"+Alert.cancel+"</button>\n"+
                            "</div>\n"+
                        "</div>\n"+
                    "</div>";

        return "<div class=\"alert-cover\">"+
                    "<div class=\"alert\">\n" +
                    "        <div class=\"alert-title\">\n" +
                                    this.head +
                    "        </div>\n" +
                    "        <div class=\"alert-content\">\n" +
                                    this.content +
                    "        </div>\n" +
                    "        <div class=\"alert-confirm-buttons\">\n" +
                    "            <button class=\"alert-button standard-button \">"+Alert.confirm+"</button>\n" +
                    "<!--            <button class=\"alert-button standard-button \">cancel</button>-->\n" +
                    "        </div>\n" +
                    "    </div>\n"
                    "</div>";
    }

}

function alert_ch(head,content,callback) {
    if ($('.alert').length > 0)
        return;

    const al = $(new Alert(head, content, false).val());
    $("body").append(al);
    al.fadeIn(200);
    $(".alert-confirm-buttons").on("click",".alert-button",function () {
        if (this.innerText === Alert.confirm)
            if (typeof callback == 'function')
                callback();
        al.fadeOut(200,function () {
            al.remove();
        });
    });
}

function alert_c(content,callback) {
    alert_ch("Attention",content,callback);
}

function confirm_ch(head,content,callback) {
    if ($('.alert').length > 0)
        return;

    const conf = $(new Alert(head, content, true).val());
    $("body").append(conf);
    conf.fadeIn(200);
    $(".alert-confirm-buttons").on("click",".alert-button",function () {
        if (this.innerText === Alert.confirm)
            if (typeof callback == 'function')
                callback();

        conf.fadeOut(200,function () {
            conf.remove();
        });
    });
}

function confirm_c(content,callback) {
    confirm_ch("Attention",content,callback);
}
