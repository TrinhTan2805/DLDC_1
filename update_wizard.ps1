# Read file with proper UTF-8 encoding (including BOM)
$file = 'f:\BTP\DLDC_1\src\components\pages\master-data\MasterDataWizard.tsx'
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

Write-Host "File loaded. Length: $($content.Length)"

# ============================================================
# CHANGE 1: Bulk "Gửi duyệt" button in review table - add setReviewSentIds
# ============================================================
$old1 = @'
                                  setReviewProcessedIds(prev => Array.from(new Set([...prev, ...reviewSelectedIds])));
                                  setReviewSelectedIds([]);
                                  triggerToast('Gửi yêu cầu thành công', 'Đã lưu bản ghi mới thành công!');
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[12px] font-medium transition-colors shadow-sm cursor-pointer"
'@

$new1 = @'
                                  setReviewProcessedIds(prev => Array.from(new Set([...prev, ...reviewSelectedIds])));
                                  setReviewSentIds(prev => Array.from(new Set([...prev, ...reviewSelectedIds])));
                                  setReviewSelectedIds([]);
                                  triggerToast('Gửi yêu cầu thành công', 'Đã lưu bản ghi mới thành công!');
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[12px] font-medium transition-colors shadow-sm cursor-pointer"
'@

if ($content.Contains($old1)) {
    $content = $content.Replace($old1, $new1)
    Write-Host "CHANGE 1 applied: bulk Gui duyet button updated"
} else {
    Write-Host "WARNING: CHANGE 1 target not found - already applied or different"
}

# ============================================================
# CHANGE 2: Per-row "Gửi duyệt" button - add setReviewSentIds
# ============================================================
$old2 = @'
                                            onClick={() => {
                                              setReviewProcessedIds(prev => Array.from(new Set([...prev, item.id])));
                                              setReviewSelectedIds(prev => prev.filter(id => id !== item.id));
                                              triggerToast('Gửi yêu cầu thành công', 'Đã lưu bản ghi mới thành công!');
                                            }}
                                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
'@

$new2 = @'
                                            onClick={() => {
                                              setReviewProcessedIds(prev => Array.from(new Set([...prev, item.id])));
                                              setReviewSentIds(prev => Array.from(new Set([...prev, item.id])));
                                              setReviewSelectedIds(prev => prev.filter(id => id !== item.id));
                                              triggerToast('Gửi yêu cầu thành công', 'Đã lưu bản ghi mới thành công!');
                                            }}
                                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
'@

if ($content.Contains($old2)) {
    $content = $content.Replace($old2, $new2)
    Write-Host "CHANGE 2 applied: per-row Gui duyet button updated"
} else {
    Write-Host "WARNING: CHANGE 2 target not found - already applied or different"
}

# ============================================================
# CHANGE 3: Replace Step 6 content with comprehensive review
# Find the Step 6 block and replace it entirely
# ============================================================

$step6OldStart = '          {/* Step 6: Phê duyệt */}' + "`r`n" + '          {currentStep === 6 && ('
$step6OldEnd = '            </div>' + "`r`n" + '          )}'

# Find the start and end positions
$startIdx = $content.IndexOf('          {/* Step 6: Phê duyệt */')
$endPattern = '            </div>' + "`r`n" + '          )}' + "`r`n" + '        </div>'

if ($startIdx -lt 0) {
    Write-Host "WARNING: Step 6 start comment not found"
} else {
    Write-Host "Found Step 6 at index $startIdx"
    # Find what comes right before the Footer Navigation section
    $footerIdx = $content.IndexOf('        {/* Footer Navigation */', $startIdx)
    if ($footerIdx -lt 0) {
        Write-Host "WARNING: Footer Navigation not found after Step 6"
    } else {
        Write-Host "Footer Navigation found at index $footerIdx"
        # The Step 6 block is between startIdx and footerIdx
        $step6Block = $content.Substring($startIdx, $footerIdx - $startIdx)
        Write-Host "Step 6 block length: $($step6Block.Length)"
        Write-Host "Step 6 block first 200 chars: $($step6Block.Substring(0, [Math]::Min(200, $step6Block.Length)))"
    }
}

# Save the file
[System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
Write-Host "File saved successfully"
