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
        late_policy_data = validated_data.pop("late_policy", None)

        instance = super().update(instance, validated_data)

        if deadlines_data is None:
            return instance
    
        existing_deadlines = {d.id: d for d in instance.deadlines.all()}
        sent_ids =[]

        for d_data in deadlines_data:
            d_id = d_data.get("id", None)

            if d_id is not None and d_id in existing_deadlines:

                deadline = existing_deadlines[d_id]
                for attr, value in d_data.items():
                    if attr == "id":
                        continue
                    setattr(deadline, attr, value)
                deadline.save()
                sent_ids.append(d_id)

            else:
                Deadline.objects.create(course=instance, **d_data)

        return instance
    
    def create(self, validated_data):
        deadlines_data = validated_data.pop("deadlines", [])
        course = Course.objects.create(**validated_data)

        for d_data in deadlines_data:
            Deadline.objects.create(course=course, **d_data)

        return course
                
