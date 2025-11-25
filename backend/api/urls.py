from django.urls import path
from . import views
from .views import gen_Function
from .views import upload_blank

#The view paths, as defined in 'MODEL_MAPS' in views.function, have GET functions and DELETE functions
#URL path structure is as follows - '/api/ModelName/iDNum/' - add to end of local host for GET path
#To see a list of all same Models, path -> '/api/ModelName/0/'  - add to end of local host for GET path
#To use a DELETE request, use same structure with curl in command prompt (very not safe change if this is real)
#i.e 'curl -X DELETE 'http://localhost8000/api/ModelName/iDNum/' 

urlpatterns = [
    path('', views.getData),
    path('test/', views.getTestData),
    path('addtest/', views.addTest),
    path('api/addsyllabus/', views.upload_syllabus, name="upload_syllabus"),
    path('api/courses/', views.upload_blank, name="upload_blank_course/deadline"),
    path('api/savetoken/', views.save_token, name="save_token"),
    path("api/<str:model>/<int:pk>/", gen_Function, name="generic_function"),
]