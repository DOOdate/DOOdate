from core.services.setup_django import setup_django
setup_django()
from parser.models import Course, Syllabus, PolicyPeriod, Deadline
from django.core.files.uploadedfile import UploadedFile
import core.services.pdf_db as pdf_db
from core.services.syllabus_parser import PDFInfo, VERSION
from core.services import date_parsing

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
        t = date['title'] if 'title' in date else 'Unknown Assignment'
        u = date_parsing.str_to_datetime(date['due_date']) if 'due_date' in date else date_parsing.INVALID
        w = date['weight'] if 'weight' in date else -1
        d = Deadline(title=t, due_date=u, weight=w, course=c)
        d.save()
    for period in parsed.late_policy:
        t = period['time'] if 'time' in period else -1
        n = period['penalty'] if 'penalty' in period else -1
        p = PolicyPeriod(time=t, penalty=n, course=c)
        p.save()
    s.class_template = c
    s.save()
    return s