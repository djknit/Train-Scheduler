var trains = [];

// When the "add a train" form is submitted...
$("#add-train-submit").on("click", function(event) {
    
    event.preventDefault();

    // Store the form values
    var newName = $("#name").val().trim();
    var newDestination = $("#destination").val().trim();
    var newFirstTrain = $("#first-train").val();
    var newFrequency = parseInt($("#frequency").val());

    // Verify that the user entered a first departure time
    if (!newFirstTrain) {
        $("#form-instructions").text("You must enter a recent known departure time.");
    }
    // Verify a positive number was entered for frequency
    else if (newFrequency <= 0) {
        $("#form-instructions").text("Frequency must be a positive whole number.");
    }
    // Verify that the destination field was not left blank
    else if (newDestination === "") {
        $("#form-instructions").text("Please include the destination.");
    }
    // If the submission passed all of the above verifications...
    else {
        $("#form-instructions").text("Last train added: " + newName + " to " + newDestination + ".");
        // Clear input fields
        $(".new").val("");
        // Create a new train object from the information entered
        var newTrain = {
            name: newName,
            destination: newDestination,
            firstTrainTime: newFirstTrain,
            frequency: newFrequency,
            nextArrival: {},
            timeUntilNextTrain: function() {
                var now = moment("hh:mm");
                var firstTrainMoment = moment(this.firstTrainTime, "hh:mm");
                var timeSinceFirstTrain = now.subtract(firstTrainMoment, "mm");
                console.log(timeSinceFirstTrain)
                // If timeSinceFirstTrain is negative, the first departure time is later than the current time, so the it must have been the previous day.
                // If so, subtract 1 day from the result because this is equivalent to subtracting 1 day from the first-departure-time before subtracting the current time.
                // if (timeSinceFirstTrain < 0) {
                    
                // }
            },
            // calculateNextArrival: function() {
            //     var 
            // }
        }
        trains.push(newTrain);
    }
});