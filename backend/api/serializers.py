from rest_framework import serializers
from parser.models import *

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = '__all__'

class SyllabusSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Syllabus
        fields = '__all__'

class PolicyPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PolicyPeriod
        fields = '__all__'


class DeadlineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Deadline
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    late_policy = PolicyPeriodSerializer(many=True, read_only=True)
    deadlines = DeadlineSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = '__all__'
