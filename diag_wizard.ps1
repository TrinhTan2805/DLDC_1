# Read the file with correct encoding
$content = [System.IO.File]::ReadAllText('f:\BTP\DLDC_1\src\components\pages\master-data\MasterDataWizard.tsx', [System.Text.Encoding]::UTF8)

Write-Host "File loaded, length: $($content.Length)"
Write-Host "reviewSentIds count: $($content.Split('reviewSentIds').Count - 1)"
Write-Host "setReviewSentIds count: $($content.Split('setReviewSentIds').Count - 1)"

# Find the specific pattern for bulk "Gui duyet" button - add setReviewSentIds
# Pattern 1: Bulk Gửi duyệt button (the one using reviewSelectedIds in emerald color)
$oldBulkSend = @"
                                  setReviewProcessedIds(prev => Array.from(new Set([...prev, ...reviewSelectedIds])));
                                  setReviewSelectedIds([]);
                                  triggerToast('G
"@

if ($content.Contains('setReviewSentIds')) {
    Write-Host "setReviewSentIds already present - checking for updates needed"
} else {
    Write-Host "setReviewSentIds NOT present - needs to be added"
}

# Check for the emerald button specifically
$emeraldSearch = "bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[12px] font-medium transition-colors shadow-sm"
$count = ($content.Split($emeraldSearch).Count - 1)
Write-Host "emerald button occurrences (review bulk): $count"
