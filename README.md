# Shelter-System
A system used for a CBO to keep track of residents in a shelter.


TO DO:
- create a one-page html client side with minimal functionality for staff
    - inputs for registering/changing/deleting staff
    - inputs for registering/updating/deleting customers
    - a way to show all customers
    - a way to show all data and reports for a single specified customer 
    - a way to add a report/new info about a customer (which room they are in, check in/out, etc.)

- create a one-page js server side with minimal functionality for staff:
    - a get method for changing staff
    - a get method for changing customers
    - a get method for deleting staff
    - a get method for deleting customer
    - a post method for showing all customers
    - a post method for showing a report of a customer
    - a get/post method for adding a report about a customer
    
- basic database structure to be created:
    - a table of all the rooms in the shelter:
        - int field for room num
        - an int field for ID of the customer assigned to the room
    
    - a table of all the job positions for staff within the shelter:
        - a text field for job position

Extra:
- set the timezone of the database (last minute task)
