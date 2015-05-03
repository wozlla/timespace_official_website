$(function(){
    $("form").on("submit", function(e){
        var title = $("#title").val(),
            body = $("#body").val(),
            icon = $("#icon-url").val();

        $.post("/pc/admin/news", {
            icon: icon,
            title: title,
            body: body
        }, function(url){
            location.href = url;
        });

        return false;
    });
});

