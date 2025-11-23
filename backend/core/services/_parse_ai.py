from llama_cloud_services import LlamaExtract
import os
from llama_cloud import ExtractConfig, ExtractMode
from pydantic import BaseModel, Field


class Assignment(BaseModel):
    title: str = Field(description='The title of the assignment')
    due_date: str = Field(description='The due date of the assignment')
    weight: float = Field(description='The weight of the assignment as a percent')


class LatePolicy(BaseModel):
    time: float = Field(description='The number of hours after the due time until this penalty applies')
    penalty: float = Field(description='The percent penalty incurred')


class Syllabus(BaseModel):
    assignments: list[Assignment] = Field(description='A list of assignments')
    late_policy: list[LatePolicy] = Field(description='An array of penalties that apply after amounts of hours past the due date for assignments')


extractor = None

def parse(file):
    global extractor
    if not extractor:
        if not os.path.exists('secret.env'):
            raise FileNotFoundError('You must add your llama cloud API key to secret.env in backend/')
        with open('secret.env', 'r', encoding='utf-8-sig') as f:
            key = f.read()
        extractor = LlamaExtract(key)

    config = ExtractConfig(extraction_mode=ExtractMode.BALANCED)

    result = extractor.extract(Syllabus, config, file)
    return result.data

# parse('static/pdf_samples/3.pdf')
