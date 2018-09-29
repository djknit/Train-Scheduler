// Initialize Firebase
var config = {
    apiKey: "AIzaSyDl-P2jRScUXF-q8ydFYxErL-lvrODALPY",
    authDomain: "train-scheduler-e7a51.firebaseapp.com",
    databaseURL: "https://train-scheduler-e7a51.firebaseio.com",
    projectId: "train-scheduler-e7a51",
    storageBucket: "train-scheduler-e7a51.appspot.com",
    messagingSenderId: "876513420064"
};
firebase.initializeApp(config);

var database = firebase.database();

// Function for storing trains array in the database
function storeTrains() {
    // Create database-friendly trains array of objects without functions or calculated values
    var trainsData = [];
    trains.forEach(function(train) {
        var trainData = {
            name: train.name,
            destination: train.destination,
            firstTrainTime: train.firstTrainTime,
            frequency: train.frequency
        }
        trainsData.push(trainData);
    });
    // Store new array in database
    database.ref().set({
        trains: trainsData
    });
}

// At the initial load and on subsequent data value changes, get a snapshot of the current data
database.ref().on("value", function(snapshot) {
    // console.log(snapshot.val());
    if (snapshot.val()) {
        // Clear the trains array
        trains = [];
        // Fill the trains array with trains from the database
        snapshot.val().trains.forEach(function(train) {
            var databaseTrain = {
                name: train.name,
                destination: train.destination,
                frequency: train.frequency,
                firstTrainTime: train.firstTrainTime,
                nextArrival: {},
                // Method
                calculateNextArrival
            }
            trains.push(databaseTrain);
        });
        // Update the schedule table display from the updated trains array
        displayTrains();
    }
});