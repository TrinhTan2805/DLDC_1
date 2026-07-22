#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to update MasterDataWizard.tsx:
1. Update bulk "Gửi duyệt" button to also set reviewSentIds
2. Update per-row "Gửi duyệt" button to also set reviewSentIds
3. Update Step 6 with comprehensive review summary
"""

import re

file_path = r'f:\BTP\DLDC_1\src\components\pages\master-data\MasterDataWizard.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"File loaded, length: {len(content)}")

# Check if reviewSentIds is already declared
if 'reviewSentIds' in content:
    print("reviewSentIds already declared")
else:
    print("WARNING: reviewSentIds not found")

# Count occurrences of key patterns
print(f"setReviewSentIds occurrences: {content.count('setReviewSentIds')}")
print(f"reviewSentIds occurrences: {content.count('reviewSentIds')}")

# Check the bulk button "Gửi duyệt" area - look for the emerald button with reviewSelectedIds
# Find the line numbers
lines = content.split('\n')
for i, line in enumerate(lines, 1):
    if 'reviewSelectedIds' in line and 'setReviewProcessedIds' in line:
        print(f"Line {i}: {line[:100]}")
    if 'setReviewSentIds' in line:
        print(f"Line {i} (setReviewSentIds): {line[:100]}")
