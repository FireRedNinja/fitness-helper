var uniqueid = 50;

$("#submitGoal").click(function () {
    if ($('#workout-plan').val() != "") {
        var goal = '<li class="collection-item avatar" id="goal3"><img src="assets/logo.png" alt="" class="circle"><h5>' + $('#workout-plan').val() + '</h5><a href="#!" class="secondary-content"><i class="material-icons">delete</i></a></li>';
        uniqueid++;
        $('#submitGoal').click(
            $(".collection").append(goal)
        );
    } else {
        Materialize.toast('Fill required field', 3000, 'rounded');
    }
});

$("#goal1").click(function () {
    $("#g1").remove()
});

$("#goal2").click(function () {
    $("#g2").remove()
});

$("#goal3").click(function () {
    $("#g3").remove()
});