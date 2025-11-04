from django.core.files.uploadedfile import UploadedFile
import hashlib


class PDFSearcher:
    def __init__(self):


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

        return False

    @staticmethod
    def exists() -> bool:
        # Compare the UploadedFile with all collisions (call the equals method on each collision)
        return False