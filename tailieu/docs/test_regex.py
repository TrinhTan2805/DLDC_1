import re

text = '<img src="https://placehold.co/24x24/2563eb/2563eb.png" alt="Primary" style="border-radius:4px" />'
combined_pattern = re.compile(r'(!\[(?P<md_alt>.*?)\]\((?P<md_url>.*?)\))|(<img\s+[^>]*src="(?P<html_url>[^"]+)"[^>]*>)')

match = combined_pattern.search(text)
if match:
    print(f"Match found: {match.group('html_url')}")
else:
    print("No match found")
