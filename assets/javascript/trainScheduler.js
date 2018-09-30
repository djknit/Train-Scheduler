// Declare an array to store the trains
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
        $("#form-instructions").attr("title", "");
    }
    // Verify a positive number was entered for frequency
    else if (newFrequency <= 0) {
        $("#form-instructions").text("Frequency must be a positive whole number.");
        $("#form-instructions").attr("title", "");
    }
    // Verify that the destination field was not left blank
    else if (newDestination === "") {
        $("#form-instructions").text("Please include the destination.");
        $("#form-instructions").attr("title", "");
    }
    // If the submission passed all of the above verifications...
    else {
        $("#form-instructions").html("Last train added: <em>" + newName + "</em> to <em>" + newDestination + "</em>.");
        $("#form-instructions").attr("title", "Last train added: <Train Name> to <Destination>");
        // Clear input fields
        $(".new").val("");
        // Create a new train object from the information entered
        var newTrain = {
            name: newName,
            destination: newDestination,
            firstTrainTime: moment(newFirstTrain, "hh:mm").format("hh:mm a"),
            frequency: newFrequency,
            nextArrival: {},
            // Methods
            calculateNextArrival
        }
        trains.push(newTrain);
        storeTrains();
        displayTrains();
    }
});

// Method for calculating next arrival of a train object
function calculateNextArrival() {
    // Grab the current point in time and create a moment object
    var now = moment();
    // Create moment object for first train departure time
    var firstTrainMoment = moment(this.firstTrainTime, "hh:mm");
    // Determine the minutes since the first departure
    var timeSinceFirstTrain = now.diff(firstTrainMoment, "minutes");
    // If timeSinceFirstTrain is negative, the first departure time is later than the current time, so the first departure must have been during the previous day.
    //   In this case, we must subtract 1 day from the first departure time...
    //   i.e. {timeSinceFirstTrain = now - firstTrainMoment} => {timeSinceFirstTrain = now - (firstTrainMoment - 1 day)} === {timeSinceFirstTrain = now - firstTrainMoment + 1 day}
    //   Therefore we must add 1 day (1440 minutes) to timeSinceFirstTrain
    if (timeSinceFirstTrain < 0) {
        timeSinceFirstTrain = timeSinceFirstTrain + 1440;
    }
    // The time since the last train is the remainder of (timeSinceFirstTrain/Frequency).
    //   This is accessed via the modulus operator %
    var timeSinceLastTrain = timeSinceFirstTrain % this.frequency;
    // The time until the next train is the difference between the arrival frequency and the time since the last arrival
    var timeUntilNextTrain = this.frequency - timeSinceLastTrain;
    // Set the timeUntil property of nextArrival
    this.nextArrival.timeUntil = timeUntilNextTrain;
    // Add the minutes until the next arrival to the current time to get the time of the next arrival
    var nextArrivalTime = now.add(timeUntilNextTrain, "minutes");
    // Set the time property of nextArrival
    this.nextArrival.time = nextArrivalTime.format("hh:mm a");
    // Set the timeCalculated property of nextArrival
    this.nextArrival.timeCalculated = now.format("hh:mm a");
}

// Function for displaying train information in the table for the trains stored in the trains array
function displayTrains() {
    // Clear the body of the schedule table
    $("#schedule-body").empty();
    // For each object in the trains array...
    trains.forEach(function(train, index) {
        // Update the calculated next train arrival information
        train.calculateNextArrival();
        // Create a new table row element filled with the trains information
        var newTr = $(
            `<tr title="${train.name} to ${train.destination}: First train departed at ${train.firstTrainTime}">
                <td class="x-column"><button class="remove" id="${index}">x</button></td>
                <td>${train.name}</td>
                <td>${train.destination}</td>
                <td>${train.frequency}</td>
                <td>${train.nextArrival.time}</td>
                <td>${train.nextArrival.timeUntil}</td>
            </tr>`);
        // Append the new row to the table
        $("#schedule-body").append(newTr);
    });
}

// When the update button on the schedule is clicked, update the display
$("#update-schedule").on("click", displayTrains);

// When the "x" button in front of one of the train's information in the table, remove that train's information
$(document).on("click", ".remove", function() {
    var trainIndex = $(this).attr("id");
    // Remove corresponding train from trains array
    trains.splice(trainIndex, 1);
    // Update database
    storeTrains();
    // Update table display
    displayTrains();
});