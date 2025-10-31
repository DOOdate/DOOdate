from rest_framework.response import Response
from rest_framework.decorators import api_view
from parser.models import Test
from .serializers import TestSerializer


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