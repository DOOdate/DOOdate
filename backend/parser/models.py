from django.db import models

class Syllabus(models.Model):
    """
    # Unimplemented
    late_policy = models.CharField(max_length=200)
    prof_email = models.CharField(max_length=255) # do we want to include this?
    """

class Deadline(models.Model):
    assignment_title = models.CharField(max_length=200)
    due_date = models.DateTimeField(auto_now_add=True)
    weight_percent = models.FloatField(default=0.0)
    syllabus = models.ForeignKey(Syllabus, on_delete=models.CASCADE, related_name='deadlines')

    def __str__(self):
        return self.assignment_title\

class Test(models.Model):
    name=models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)