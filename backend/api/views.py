from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework.views import APIView
from parser.models import *
from .serializers import *
from core.services import pdf_db, syllabus_parser, course_template_builder
from django.core.files.uploadedfile import UploadedFile
from django.core.serializers import serialize
from django.core.exceptions import BadRequest
from rest_framework.renderers import JSONRenderer
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt

#Doing the views/get/delete like this beacuse it looked cool and effiecent when I was looking at code examples
MODEL_MAP = {
    "courses":   (Course,   CourseSerializer),
    "syllabi":   (Syllabus, SyllabusSerializer),
    "policys":   (PolicyPeriod, PolicyPeriodSerializer),
    "deadlines": (Deadline, DeadlineSerializer),
}

@api_view(["GET", "DELETE", "PATCH"])
@csrf_exempt #NEED TO CHANGE THIS IF NOT HOSTING ON LOCALHOST VERY BAD AND UNSAFE USED FOR TESTING/DEVELOPMENT ONLY
def gen_Function(request,model,pk):

    #Variables
    m, serializer = MODEL_MAP.get(model,(None,None))

    #Check if model is in the model map
    if not m:
        return Response({"detail": "Unknown model"}, status=404)
    
    #General GET function    
    if request.method == "GET" and pk==0:
        obj = m.objects.all()
        return Response(serializer(obj, many=True).data)
    
    obj = get_object_or_404(m, pk=pk)
        
    if request.method == "GET" and pk>0:
        return Response(serializer(obj).data)
    
    #General DELETE function
    if request.method == "DELETE":
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    #General PATCH function
    if request.method == "PATCH":
        s = CourseSerializer(obj, data=request.data, partial=True)

        if s.is_valid():
            s.save()
            return Response(s.data, status=status.HTTP_200_OK)

        print("PATCH validation errors:", s.errors)
        return Response(s.errors, status=status.HTTP_400_BAD_REQUEST)
    
    #Defult if no request somehow
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def upload_blank(request):
    s = CourseSerializer(data=request.data)

    if s.is_valid():
        s.save()
        return Response(s.data, status=status.HTTP_201_CREATED)
    
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def getData(request):
    message = "Hello World"
    return Response(message)

@api_view(['GET'])
def getTestData(request):
    test = Test.objects.all()
    serializer = TestSerializer(test, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addTest(request):
    serializer = TestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['POST'])
def upload_syllabus(request):
    ALWAYS_OVERWRITE = False # Should be set False unless you are debugging!
    if ALWAYS_OVERWRITE: print("WARNING: Parser is set to overwrite! Set ALWAYS_OVERWRITE to False in api/views.py unless you are actively debugging!")
    file = request.FILES.get('myFile')
    if file:
        cached = pdf_db.find(file)
        # Cached version does not exist or is outdated
        if ALWAYS_OVERWRITE or cached is None or cached.parser_version != syllabus_parser.VERSION:
            if cached is not None: file = cached.file # Prevent duplicate files when overwriting
            parsed = syllabus_parser.parse(file)
            template = course_template_builder.build_course(parsed, file).class_template
        else:
            template = cached.class_template
        res = CourseSerializer(template) # Represents a Course as JSON
        return Response(res.data)
    raise BadRequest('Uploaded file is not valid')
