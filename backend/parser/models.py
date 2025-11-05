from django.db import models

class Course(models.Model):
    course_code = models.CharField(max_length=7) # I think they can only be 7?
    prof_email = models.CharField(max_length=255)
    # hidden: late_policy (many)
    # hidden: deadlines (many)

    def __str__(self):
        return self.course_code

class Syllabus(models.Model):
    hash = models.CharField(max_length=32)
    file = models.FileField(upload_to='syllabi/', null=True)
    class_template = models.OneToOneField(Course, on_delete=models.SET_NULL, null=True)

class PolicyPeriod(models.Model):
    time = models.FloatField(default=0.0)
    penalty = models.FloatField(default=0.0)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='late_policy', null=True)

    def __str__(self):
        return f'{self.time}h: -{self.penalty}%'

class Deadline(models.Model):
    title = models.CharField(max_length=200)
    due_date = models.DateTimeField(auto_now_add=True)
    weight = models.FloatField(default=0.0)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='deadlines', null=True)

    def __str__(self):
        return self.title

class Test(models.Model):
    name=models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)