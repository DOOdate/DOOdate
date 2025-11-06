# Install the required packages with `pip install -r requirements.txt`

### Notes - Cameron Labelle - 10/29/2025
What to know to work on the backend:
* The 'parser' directory contains our app, which is plugged into Django
* 'parser/models.py' contains the database models. I created 'Syllabus' and 'Deadline' models.
* 'manage.py' is the entry script to interacting with the backend
* Run 'python manage.py shell' to open an interactive shell (to test the database for example)
  * In this interactive shell, try creating Syllabus and Deadline objects, save them to the database with the .save() method, and access them from the database with Syllabus.objects.all() or Deadline.objects.get(id=x) for example.
* Run the Django server with 'python manage.py runserver'. Right now there is a Hello World end point at /api/test 
  * Edit this in doodate/views.py, change the url in doodate/urls.py
* If you make updates to the models, run 'python manage.py makemigrations' then 'python manage.py migrate'.

### Notes - Nikolas Kaern - 10/30/2025
Updated:
*There is now a way to test/add data directly from the backend using a POST command (add 'addtest/' to the end of the local host url).
*There is now a way to view all the test data directly from the backend using a GET command (add 'addtest/' to the end of the local host url).
*Changed the original end point for the Hello World from '/api/test' to ''
*Where the endpoints are stored have been reconfigured to a new folder, 'api', outside of the 'doodate' folder
*Added a 'test' model to parser/models.py for easier testing of backend setup 
