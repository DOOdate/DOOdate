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
        fields = ['id', 'course_code', 'prof_email', 'colour', 'late_policy', 'deadlines']
    
    def update(self, instance, validated_data):
        deadlines_data = validated_data.pop("deadlines", None)
        late_policy_data = validated_data.pop("late_policy", None)

        instance.course_code = validated_data.get("course_code", instance.course_code)
        instance.prof_email = validated_data.get("prof_email", instance.prof_email)
        instance.save()

            
        existing_id_deadlines = {d.id: d for d in instance.deadlines.all()}
        sent_ids_deadlines = []

        for d_data in deadlines_data:
            d_id = d_data.get("id", None)

            if d_id is not None and d_id in existing_id_deadlines:

                deadline = existing_id_deadlines[d_id]
                for attr, value in d_data.items():
                    setattr(deadline, attr, value)
                deadline.save()
                sent_ids_deadlines.append(d_id)

            else:
                new_deadline = Deadline.objects.create(course=instance, **d_data)
                new_d_id = new_deadline.id
                sent_ids_deadlines.append(new_d_id)
            
        existing_id_late_policy = {p.id: p for p in instance.late_policy.all()}
        sent_ids_late_policy = []

        for p_data in late_policy_data:
            p_id = p_data.get("id", None)

            if p_id is not None and p_id in existing_id_late_policy:

                latePolicy = existing_id_late_policy[p_id]
                for attr, value in p_data.items():
                        setattr(latePolicy, attr, value)
                latePolicy.save()
                sent_ids_late_policy.append(p_id)

            else:
                new_late_policy = PolicyPeriod.objects.create(course=instance, **p_data)
                new_p_id = new_late_policy.id
                sent_ids_late_policy.append(new_p_id)

        for d in instance.deadlines.all():
            if d.id not in sent_ids_deadlines:
                d.delete()
        
        for p in instance.late_policy.all():
            if p.id not in sent_ids_late_policy:
                p.delete()

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
                
