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
        fields = ['id', 'time', 'penalty']


class DeadlineSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = Deadline
        fields = ['id', 'title', 'due_date', 'weight']
        extra_kwargs = {
            "course": {"read_only": True},
        }

class CourseSerializer(serializers.ModelSerializer):
    late_policy = PolicyPeriodSerializer(many=True)
    deadlines = DeadlineSerializer(many=True)

    class Meta:
        model = Course
        fields = ['id', 'course_code', 'prof_email', 'late_policy', 'deadlines']
    
    def update(self, instance, validated_data):
        deadlines_data = validated_data.pop("deadlines", None)

        #Add later
        late_policy_data = validated_data.pop("late_policy", None)

        instance.course_code = validated_data.get("course_code", instance.course_code)
        instance.prof_email = validated_data.get("prof_email", instance.prof_email)
        instance.save()

        if deadlines_data is not None:
            
            existing_id_deadlines = {d.id: d for d in instance.deadlines.all()}

            for d_data in deadlines_data:
                d_id = d_data.get("id", None)

                if d_id is not None and d_id in existing_id_deadlines:

                    deadline = existing_id_deadlines[d_id]
                    for attr, value in d_data.items():
                        if attr != "id":
                            setattr(deadline, attr, value)
                    deadline.save()

                else:
                    Deadline.objects.create(course=instance, **d_data)

        return instance
    
    def create(self, validated_data):
        deadlines_data = validated_data.pop("deadlines", [])
        late_policy_data = validated_data.pop("late_policy", [])
        course = Course.objects.create(**validated_data)

        for p_data in late_policy_data:
            PolicyPeriod.objects.create(course=course, **p_data)

        for d_data in deadlines_data:
            Deadline.objects.create(course=course, **d_data)

        return course
                
