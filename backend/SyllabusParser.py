from pypdf import PdfReader
class SyllabusParser:
    _DATES = ("week", "lecture", "lab", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov",
             "dec", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "tba", "tbd")
    _DELIVERABLES = ("quiz", "assignment", "lab", "midterm", "final", "exam", "deliverable", "submission", "report")
    _PUNCTUATION = ".,:;"
    _MAX_TITLE_LENGTH = 24

    def __init__(self):
        self._reader = None

    def parse(self, file: str) -> list:
        self._reader = PdfReader(file)
        due_dates = []

        for page in self._reader.pages:
            text = page.extract_text()
            lines = text.split("\n")
            for line in lines:
                contains_date = False
                info = ["", None, ""]
                line = line.strip().lower()
                weight_index = line.find("%")
                if weight_index != -1:
                    i = weight_index
                    while i-1 >= 0 and line[i-1].isdigit() or line[i-1].isspace():
                        i -= 1
                    info[2] = line[i:weight_index].strip() + "%"
                    line = line.replace(line[i:weight_index]+"%", "")
                for el in self._DATES:
                    index = line.find(el)
                    if index != -1:
                        if el == "tbd" or el == "tba":
                            info[1] = "TBD"
                            line = line.replace(el, "")
                            contains_date = True
                            break
                        else:
                            i = self._guess_end_of_word(line, index + len(el))
                            while i < len(line) and not line[i].isalpha():
                                i += 1
                            if any(ch.isdigit() for ch in line[index:i]):
                                contains_date = True
                                tmp = line[index:i].strip(self._PUNCTUATION)
                                line = line.replace(tmp, "")
                                info[1] = tmp.strip()
                                break
                info[0] = line.strip().strip(self._PUNCTUATION)
                for deliverable in self._DELIVERABLES:
                    i = line.find(deliverable)
                    if i != -1:
                        pre = line[i-1] if i-1 >= 0 else ""
                        post = line[len(deliverable) + i] if len(deliverable) + i < len(line) else ""
                        # Do not count as a deliverable if it is in plural form
                        if post == "s" or (len(deliverable) + i+1 < len(line) and (post == "e" and line[len(deliverable) + i+1] == "s")):
                            continue
                        if (pre == "" or not pre.isalpha()) and (post == "" or not post.isalpha()):
                            break
                else:
                    continue
                if contains_date and len(info[0]) < self._MAX_TITLE_LENGTH:
                    if len(due_dates) > 0:
                        if due_dates[-1] != info: due_dates.append(info)
                    else:
                        due_dates.append(info)

        return due_dates

    @staticmethod
    def _guess_end_of_word(line: str, start_index: int) -> int:
        end_of_word_indicators = (" ", ",", ".")
        offsets = []
        for ch in end_of_word_indicators:
            t = line.find(ch, start_index)
            offsets.append(len(line) if t == -1 else t)
        return min(offsets)


if __name__ == "__main__":
    parser = SyllabusParser()
    l = parser.parse("3.pdf")
    print(l)