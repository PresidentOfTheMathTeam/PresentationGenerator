textToFormat = """



"""

formatted = textToFormat

while formatted.endswith("\n"):
    formatted = formatted[:-1]

while formatted.startswith("\n"):
    formatted = formatted[1:]

while "\n\n" in formatted:
    formatted = formatted.replace("\n\n", "\n")

lines = formatted.splitlines()
fixedlines = []
for line in lines:
    while line.startswith(" "):
        line = line[1:]
    while line.endswith(" "):
        line = line[:-1]
    fixedlines.append(line)
formatted = "\n".join(fixedlines)

formatted = formatted.replace("\n","\\n")
formatted = formatted.replace("\"", "\\\"")

print("\n\n\n")
print(formatted)
print("\n\n\n")