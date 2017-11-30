var uniqueid = 50;

$("#submitGoal").click( function() {
    var goal = '<li class="collection-item avatar" id="' + uniqueid + '"><img src="assets/logo.png" alt="" class="circle"><h5>' + $('#workout-plan').val() +  '</h5><a id="' + uniqueid + '"href="#!" class="secondary-content"><i class="material-icons">delete</i></a></li>';
    $('#submitGoal').click(
        $(".collection").append(goal)
    );
});

$(".secondary-content").click(function() {
    alert($(".secondary-content").attr("id"));
    $(".secondary-content").attr("id").remove();
});




