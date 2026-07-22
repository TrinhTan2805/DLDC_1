$file = 'f:\BTP\DLDC_1\src\components\pages\master-data\MasterDataWizard.tsx'
$lines = Get-Content $file
$newLines = [System.Collections.ArrayList]@()

$i = 0
while ($i -lt $lines.Count) {
    $line = $lines[$i]
    # Check if this is one of the duplicate lines (near unmatchedPage)
    if ($line -match "const \[reviewProcessedIds, setReviewProcessedIds\] = useState" -and $i -gt 670 -and $i -lt 690) {
        # Skip this line and the next (unmatchedProcessedIds duplicate)
        $i++
        $i++
        continue
    }
    [void]$newLines.Add($line)
    $i++
}

Set-Content -Encoding UTF8 $file $newLines
Write-Host "Done. Total lines: $($newLines.Count)"
