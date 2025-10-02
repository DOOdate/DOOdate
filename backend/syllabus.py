from pypdf import PdfReader


# CONFIG
filename = "3.pdf" # change to change what pdf is read


dates = ["week", "lecture", "lab", "jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "tba", "tbd"]
deliverablesub = ["quiz", "assignment", "lab", "midterm", "final", "exam", "deliverable", "submission"]


reader = PdfReader("./backend/" + filename)
number_of_pages = len(reader.pages)
for page in reader.pages:
    extracted = page.extract_text()
    listpdf = extracted.split("\n")
    for line in listpdf:
        line = line.lower()
        for el in dates:
            index = line.find(el)
            if index != -1:
                after = line[index + len(el):index + len(el) + 8]
                if any(ch.isdigit() for ch in after) or el == "tbd" or el == "tba":
                    for sub in deliverablesub:
                        if sub in line:
                            print(sub + " in line: " + line)

# 10/9/22
#10-9-22