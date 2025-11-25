# Use of AI in this project
This project uses large language models (LLMs) to extract information from uploaded course syllabi into a useable format. This was done to ensure users would get the most accurate possible results, with the fewest innacuracies as possible. If users cannot trust that the extracted information is comprehensive, it defeats the purpose of parsing the syllabus in the first place as users would have to manually enter assignmnet and late policy information into the app in order to feel confident.

## The LLM
We use the LlamaCloud API to extract information from syllabi, which in turn uses OpenAI's ChatGPT as the engine to parse the uploaded document.

## Privacy
LlamaCloud guarantees that uploaded data is kept private and only used to return the results, never for training.
https://developers.llamaindex.ai/python/cloud/llamaextract/privacy/ (Nov. 25, 2025)

## Cost
The cost for the LlamaExtract API is $0.01 USD per page. The syllabi we used for testing ranged from 3-17 pages with a median of 10 pages, so the average cost to parse a syllabus is about $0.10 USD. This is only the cost for each unique syllabus, as each syllabus is only parsed once the first time it is sent to our server, then the results are cached for the next time a different user uploads the same syllabus.