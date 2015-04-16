$(function(){
    $("nav .description").on("click", function(e){
        $("nav .dropdown").show();
        e.stopPropagation();
    });

    $(document).on("click", function(e){
        $("nav .dropdown").hide();
    });
});

