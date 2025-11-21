import datetime

from core.services.setup_django import setup_django
setup_django()
from parser.models import Course, Syllabus, PolicyPeriod, Deadline
from django.core.files.uploadedfile import UploadedFile
import core.services.pdf_db as pdf_db
from core.services.syllabus_parser import PDFInfo, VERSION
from dateutil import parser as dateparser
from django.utils.timezone import make_aware

def build_course(parsed: PDFInfo, file: UploadedFile) -> Syllabus:
    """
    Adds a new Syllabus entry to the database
    @param parsed: list of deadlines obtained from syllabus parser
    @param file: the uploaded Syllabus PDF
    @returns Syllabus entry
    """
    existing = pdf_db.find(file)
    if existing:
        existing.delete()
    s = Syllabus(hash=pdf_db.hash(file), file=file, parser_version=VERSION)
    c = Course(course_code=parsed.course_code, prof_email=parsed.prof_email)
    c.save()
    for date in parsed.due_dates:
        weight_float = -1
        try:
            weight_float = float(date[2].rstrip("%"))
        except ValueError:
            pass
        try:
            due = dateparser.parse(date[1], fuzzy=True)
            due = make_aware(due) # Sets the timezone of the datetime object, this is needed to be valid in DB
        except Exception:
            due = make_aware(datetime.datetime(datetime.MINYEAR, 1, 1, 0, 0, 0))

        d = Deadline(title=date[0], due_date=due, weight=weight_float, course=c)
        d.save()
    for period in parsed.late_policy:
        penalty_float = 0
        try:
            penalty_float = float(period[1].rstrip("%"))
        except ValueError:
            pass
        p = PolicyPeriod(time=period[0], penalty=penalty_float, course=c)
        p.save()
    s.class_template = c
    s.save()
    return s