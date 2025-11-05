from rest_framework.response import Response
from rest_framework.decorators import api_view
from parser.models import Test
from .serializers import TestSerializer
from ..core.services import pdf_db, syllabus_parser
from django.core.files.uploadedfile import UploadedFile


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
def uploadSyllabus(request):
    file = request.FILES.get('myFile')
    if file:
        cached = pdf_db.find(file)
        if cached is None:
            res = syllabus_parser.parse(file)
            # Add res to the database
            # Serialize res as JSON
            return Response(res)
        return Response(cached)
