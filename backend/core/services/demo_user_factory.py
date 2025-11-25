from core.services import setup_django
setup_django.setup_django()
from parser.models import Course, User, Deadline, PolicyPeriod

COURSE_TEMPLATE_IDS = [22, 24, 32, 33]

def new_user() -> User:
    u = User()
    u.save()
    for courseid in COURSE_TEMPLATE_IDS:
        clone_course(Course.objects.get(id=courseid), u)
    u.save()
    return u


def clone_course(c: Course, u: User) -> Course:
    print('cloning: ' + c.__str__())
    nc = Course(course_code=c.course_code, prof_email=c.prof_email, colour=c.colour, user_id=u.id if u else None)
    nc.save()
    for assignment in Deadline.objects.filter(course_id=c.id):
        a = Deadline(title=assignment.title, due_date=assignment.due_date, weight=assignment.weight, course=nc)
        a.save()
    for late in PolicyPeriod.objects.filter(course_id=c.id):
        p = PolicyPeriod(time=late.time, penalty=late.penalty, course=nc)
        p.save()
    nc.save()
    u.save()
    return nc
