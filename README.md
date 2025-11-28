# DOOdate
DOOdate is an app built for students to help them manage the deadlines and policies in their courses. Students can have the information extracted automatically from their course syllabi, and have the results displayed on an in app calendar.

View our [demo](https://www.youtube.com/shorts/aDNztatt54M)

## Context
This app was built in a team of 5 members for the GNG2101 "Product Development" course at the University of Ottawa. The specifications for the app were provided by a client, with a focus on accessibility and helping students.

DOOdate was thus developed over the course of 3 months using React + MUI for the frontend and Django + SQLite for the backend and database.

## Instructions for use
1. Clone the repository with `git clone https://github.com/DOOdate/DOOdate`
2. Install the latest version of Python 3 from [here](https://www.python.org/downloads/)
3. Install the latest version of Node from [here](https://nodejs.org/en/download)
4. `cd` into the DOOdate/frontend directory, and run `npm i`
6. You can start the frontend development server with `npx vite`
7. `cd` into the DOOdate/backend directory, and run `python3 -m pip3 install -r requirements.txt`
8. You can start the backend server with `python manage.py runserver`. You can start the notification scheduler with `python manage.py runschedule`.
