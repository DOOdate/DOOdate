from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view
from parser.models import Test
from .serializers import *
from core.services import pdf_db, syllabus_parser, course_template_builder
from django.core.files.uploadedfile import UploadedFile
from django.core.serializers import serialize
from django.core.exceptions import BadRequest
from rest_framework.renderers import JSONRenderer


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
    file = request.FILES.get('myFile')
    if file:
        cached = pdf_db.find(file)
        if cached is None or cached.parser_version != syllabus_parser.VERSION:
            par = syllabus_parser.parse(file)
            template = course_template_builder.build_course(par, file).class_template
        else:
            template = cached.class_template
        res = CourseSerializer(template)
        return Response(res.data)
    raise BadRequest('Uploaded file is not valid')
