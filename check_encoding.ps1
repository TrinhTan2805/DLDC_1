$bytes = [System.IO.File]::ReadAllBytes('f:\BTP\DLDC_1\src\components\pages\master-data\MasterDataWizard.tsx')
$b0 = $bytes[0].ToString('X2')
$b1 = $bytes[1].ToString('X2')
$b2 = $bytes[2].ToString('X2')
Write-Host "BOM: $b0 $b1 $b2"
Write-Host "File size: $($bytes.Length)"

# Search for reviewSentIds in bytes
$search = [System.Text.Encoding]::UTF8.GetBytes('reviewSentIds')
$found = $false
for ($i = 0; $i -lt ($bytes.Length - $search.Length); $i++) {
    $match = $true
    for ($j = 0; $j -lt $search.Length; $j++) {
        if ($bytes[$i + $j] -ne $search[$j]) { $match = $false; break }
    }
    if ($match) { Write-Host "Found reviewSentIds at byte position $i"; $found = $true; break }
}
if (-not $found) { Write-Host "reviewSentIds NOT found in file bytes" }
