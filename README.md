# Train-Scheduler
This train scheduler keeps track of the arrival times for multiple trains. Visitors to the site are allowed to enter the details for new trains in the form on the page. The input is validated and then added to an array that stores the data for all of the trains on the schedule. The next train arrival is calculated using the arrival frequency and time of first arrival provided by the user and the result is displayed. Trains can be removed from the schedule by pressing a button next to the data for that train on the page. Each time a train is added or removed from the schedule, the new trains array is stored in a Firebase database. The page is updated from the database when the page is first loaded and when a value is added to the database.

This project is developed and maintained by David Knittel. It was originally developed as a homework assignment for the KU Coding Bootcamp.