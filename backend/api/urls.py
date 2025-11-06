from django.urls import path
from . import views

urlpatterns = [
    path('', views.getData),
    path('test/', views.getTestData),
    path('addtest/', views.addTest),
    path('addsyllabus', views.upload_syllabus)
]