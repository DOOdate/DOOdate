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