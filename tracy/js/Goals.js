$(document).ready = function () {
   var uniqieid = 50;
}


$("#submitGoal").click( function() {
    var goal = '<li class="collection-item avatar" id="' + uniqieid + '"><img src="assets/logo.png" alt="" class="circle"><h5>' + $('#workout-plan').val() +  '</h5><a id="' + uniqieid + '"href="#!" class="secondary-content"><i class="material-icons">delete</i></a></li>';
    $('#submitGoal').click(
        $(".collection").append(goal)
    );
});

$( "#goal1" ).click(function() {
    $("#goal1").remove()
});
$( "#goal2" ).click(function() {
    $("#goal2").remove()
});
$( "#goal3" ).click(function() {
    $("#goal3").remove()
});



