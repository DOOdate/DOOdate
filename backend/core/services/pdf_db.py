from setup_django import setup_django
setup_django()
from django.core.files.uploadedfile import UploadedFile
import hashlib
from parser.models import Syllabus, Course

class PDFSearcher:
    @staticmethod
    def find(pdf : UploadedFile) -> Course | None:
        file_hash = PDFHasher.hash(pdf)
        matches = Syllabus.objects.filter(hash=file_hash)
        if len(matches) == 0: return None
        # Assume for now that there is no hash collision
        return matches[0]

class PDFHasher:
    @staticmethod
    def hash(pdf : UploadedFile) -> str:
        hasher = hashlib.md5() # md5 for fast hashing but low security (should be fine)
        for chunk in pdf.chunks():
            hasher.update(chunk)
        return hasher.hexdigest()

    @staticmethod
    def equals(a, b) -> bool:
        # Need to compare an UploadedFile type to however we store the file in the database

        # Probability of hash collision is astronomically low, but can be induced by malicious users. Is this something we should worry about?

        return a == b

    @staticmethod
    def exists() -> bool:
        # Compare the UploadedFile with all collisions (call the equals method on each collision)
        return False
