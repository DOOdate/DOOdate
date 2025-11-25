from llama_cloud_services import LlamaExtract
import os
from llama_cloud import ExtractConfig, ExtractMode
from pydantic import BaseModel, Field
from django.core.files.uploadedfile import UploadedFile
import io
from datetime import datetime
import asyncio
import tempfile


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

async def parse(file):
    global extractor
    if not extractor:
        if not os.path.exists('secret.env'):
            raise FileNotFoundError('You must add your llama cloud API key to secret.env in backend/')
        with open('secret.env', 'r', encoding='utf-8-sig') as f:
            key = f.read()
        extractor = LlamaExtract(key)

    config = ExtractConfig(extraction_mode=ExtractMode.BALANCED)
    id = file if isinstance(file, str) else file.name
    st = datetime.now()
    print('Extracting on ' + id + ' at ' + st.isoformat())
    # The extractor appears to require a filesystem path. If we were given
    # an UploadedFile or a file-like object, write it to a temporary file
    # and pass the path to the extractor. If `file` is already a path
    # string, pass it directly.
    temp_path = None
    try:
        # If file is a path string, use it directly
        if isinstance(file, str) and os.path.exists(file):
            file_path = file
        else:
            # Ensure we can read bytes (UploadedFile or BytesIO)
            if hasattr(file, 'read'):
                file.seek(0)
                content = file.read()
            else:
                # Fallback: try treating as path-like
                file_path = str(file)
                if not os.path.exists(file_path):
                    raise FileNotFoundError(f'File not found: {file_path}')
            if 'file_path' not in locals():
                suffix = ''
                if hasattr(file, 'name') and isinstance(file.name, str):
                    _, ext = os.path.splitext(file.name)
                    suffix = ext
                tmp = tempfile.NamedTemporaryFile(delete=False, suffix=suffix)
                try:
                    tmp.write(content)
                    tmp.flush()
                    tmp.close()
                except Exception:
                    tmp.close()
                    raise
                temp_path = tmp.name
                file_path = temp_path

        # Required because extractor is not built for async
        result = await asyncio.to_thread(extractor.extract, Syllabus, config, file_path)
    finally:
        if temp_path is not None:
            try:
                os.remove(temp_path)
            except Exception:
                pass
    print('Completed extraction on ' + id + ' at ' + datetime.now().isoformat() + f' ({datetime.now() - st} elapsed)')
    return result.data or {}

# parse('static/pdf_samples/3.pdf')
