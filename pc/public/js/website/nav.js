$(function(){
    $("nav .description").on("click", function(e){
        $("nav .dropdown").show();
        e.stopPropagation();
        e.preventDefault();
    });

    $(document).on("click", function(e){
        $("nav .dropdown").hide();
    });

    $("nav .bird").on("click", function(){

    });
});

