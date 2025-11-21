from pypdf import PdfReader
from re import search, Match

_DATES = ("week", "lecture", "lab", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov",
         "dec", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "tba", "tbd")
_DELIVERABLES = ("quiz", "assignment", "lab", "midterm", "final", "exam", "deliverable", "submission", "report")
_PUNCTUATION = ".,:;"
_MAX_TITLE_LENGTH = 24 # Unused
_COURSE_CODE_PATTERN = r"\b([A-Z]|[a-z]){3} ?[0-9]{4}"


# Remember to increment this whenever the parser is changed
# It indicates that a syllabus needs to be reparsed by the new parser
VERSION = 1

class PDFInfo:
    def __init__(self, course_code: str, prof_email: str, late_policy: list, due_dates: list):
        self.course_code = course_code
        self.prof_email = prof_email
        self.late_policy = late_policy
        self.due_dates = due_dates

def parse(file: str) -> PDFInfo:
    reader = PdfReader(file)
    course_code = None
    prof_email = None
    due_dates = []
    for page in reader.pages:
        text = page.extract_text()
        lines = text.split("\n")
        for line in lines:
            contains_date = False # Event must contain date to be added to list of due dates
            # [Title, Date, Weight]
            info = ["", "", ""]
            line = line.strip().lower()

            # Assume that the first string to match course code format is the course code
            if course_code is None:
                course_code = _match_course_code(line)
            # Assume that the first email is the professor's
            if prof_email is None:
                prof_email = _parse_email(line)

            # Find the first instance of a percent symbol
            weight_index = line.find("%")
            if weight_index != -1:
                i = weight_index
                # This accounts for format like "3 %" with space before % symbol
                if i-1 >= 0 and line[i-1].isspace(): i-=1
                # Backtrack through the string as long as the previous character is a number or decimal symbol (. and ,)
                while i-1 >= 0 and line[i-1].isdigit() or line[i-1] in ('.', ','):
                    i -= 1
                # Add our read number value to the weight index of info
                info[2] = line[i:weight_index].strip() + "%"
                # Remove the weight substring from the line
                line = line.replace(line[i:weight_index]+"%", "")
            # Searching for dates
            for el in _DATES:
                index = line.find(el)
                if index != -1:
                    if el == "tbd" or el == "tba":
                        # Set date as TBD and remove from string
                        info[1] = "TBD"
                        line = line.replace(el, "")
                        # Break out of the loop early since this line contains a date
                        contains_date = True
                        break
                    else:
                        i = _guess_end_of_word(line, index + len(el))
                        # Include any numbers or symbols directly following the word
                        # Ex: "Lab 1 week 4" -> "week" -> "week 4"
                        while i < len(line) and not line[i].isalpha():
                            i += 1
                        # The date keyword must be followed by a number to count
                        if any(ch.isdigit() for ch in line[index:i]):
                            contains_date = True
                            tmp = line[index:i].strip(_PUNCTUATION)
                            line = line.replace(tmp, "")
                            info[1] = tmp.strip()
                            break
            # The entire line with the weight and date removed is now set as the title of the event
            # Strip whitespace and punctuation and convert to title case
            info[0] = line.strip().strip(_PUNCTUATION).title()
            # We only count this event if a deliverable is in the title
            for deliverable in _DELIVERABLES:
                i = line.find(deliverable)
                if i != -1:
                    # Get the characters before and after the deliverable to make sure it is not contained within another word
                    # Ex: the word "Slabs" should not count even though it contains "lab"
                    pre = line[i-1] if i-1 >= 0 else ""
                    post = line[len(deliverable) + i] if len(deliverable) + i < len(line) else ""
                    # Do not count as a deliverable if it is in plural form
                    if post == "s" or (len(deliverable) + i+1 < len(line) and (post == "e" and line[len(deliverable) + i+1] == "s")):
                        continue
                    if (pre == "" or not pre.isalpha()) and (post == "" or not post.isalpha()):
                        break
            else:
                continue
            if contains_date:
                # Check for duplicate events
                if len(due_dates) > 0:
                    if due_dates[-1] != info: due_dates.append(info)
                else:
                    due_dates.append(info)

    return PDFInfo(
        "" if course_code is None else course_code,
       "" if prof_email is None else prof_email,
       [],
       due_dates
    )


def _guess_end_of_word(line: str, start_index: int) -> int:
    """
    Given a string and a starting index, attempts to return the first index after the word ends
    :param line: the string to parse
    :param start_index: where to start searching
    :return: first string index after the word ends
    """
    end_of_word_indicators = (" ", ",", ".")
    offsets = []
    for ch in end_of_word_indicators:
        t = line.find(ch, start_index)
        # If an end of word indicator is not in the string, we can assume this is the last word in the string
        offsets.append(len(line) if t == -1 else t)
    # The minimum distance to the end of word indicator is the true end of word
    return min(offsets)


def _parse_email(line: str) -> str | None:
    # Lazy validation
    # Assume a string is an email address if there is an @ symbol with no space characters directly adjacent.
    # The email address will be determined by all characters to the left and right of the @ until a space character
    at_indx = line.find('@')
    if at_indx != -1:
        if at_indx-1 >= 0 and line[at_indx-1] == ' ': return None
        if at_indx+1 < len(line) and line[at_indx+1] == ' ': return None
        left = ''
        right = ''
        i = at_indx-1
        while i >= 0 and line[i] != ' ':
            i -= 1
        left = line[i+1:at_indx]
        i = at_indx+1
        while i < len(line) and line[i] != ' ':
            i += 1
        right = line[at_indx:i]
        return left + right
    return None


def _match_course_code(line: str) -> str | None:
    match = search(_COURSE_CODE_PATTERN, line)
    if match:
        return match.group()
    return None


# Testing purposes
if __name__ == "__main__":
    l = parse("../../static/pdf_samples/3.pdf")
    print(l)