import easyocr

# Create a reader for English
reader = easyocr.Reader(['en'])

# Run OCR on an image
results = reader.readtext('prescription-template.png')

# Print out detected text
final_text = ""
for (bbox, text, prob) in results:
    final_text += f"{text} \n"


