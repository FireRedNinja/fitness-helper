$('.datepicker').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 15, // Creates a dropdown of 15 years to control year,
    today: 'Today',
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false // Close upon selecting a date,
});

$("#submitPlan").click(function () {
    if ($('.datepicker').val() != "" && $('#workout-plan').val() != "") {
        var goal = '<li class="collection-item avatar"><img src="assets/logo.png" alt="" class="circle"><h5>Date: ' + $('.datepicker').val() + '</h5><p>Details: ' + $('#workout-plan').val() + '</p><a href="#!" class="secondary-content"><i class="material-icons">delete</i></a></li>';
        $('#submitPlan').click(
            $(".collection").append(goal)
        );
    } else {
        Materialize.toast('Fill required field', 3000, 'rounded');        
    }
});