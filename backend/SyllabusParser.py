from pypdf import PdfReader
class SyllabusParser:
    _DATES = ("week", "lecture", "lab", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov",
             "dec", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "tba", "tbd")
    _DELIVERABLES = ("quiz", "assignment", "lab", "midterm", "final", "exam", "deliverable", "submission")

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
                line = line.replace(info[2], "")
                for el in self._DATES:
                    index = line.find(el)
                    if index != -1:
                        if el == "tbd" or el == "tba":
                            info[1] = "TBD"
                            line = line.replace(el, "")
                        else:
                            i = self._guess_end_of_word(line, index + len(el))
                            while i < len(line) and not line[i].isalpha():
                                i += 1
                            if any(ch.isdigit() for ch in line[index:i]): contains_date = True
                            else: break
                            info[1] = line[index:i].strip()
                            line = line.replace(line[index:i], "")
                info[0] = line.strip()
                for deliverable in self._DELIVERABLES:
                    i = line.find(deliverable)
                    if i != -1:
                        pre = line[i-1] if i-1 >= 0 else ""
                        post = line[len(deliverable) + i+1] if len(deliverable) + i+1 < len(line) else ""
                        if (pre == "" or not pre.isalpha()) and (post == "" or not post.isalpha()):
                            break
                else:
                    continue
                if contains_date:
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