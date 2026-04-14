# Đánh giá chức năng Popup của các nút bấm (Button Audit)

Dưới đây là danh sách phân tích các nút bấm trên các màn hình chính. Các nút đã được kiểm tra xem có gọi Popup (thông qua `setShow...Modal(true)` hoặc tương tự) hay chưa.

## Màn hình: CategoryApprovalPage.tsx (module: category)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Trình duyệt danh mục** | `() => setShowSubmitModal(true)` | ✅ Dùng trạng thái React Modal |
| **{tab === 'pending' && } {tab === 'approved' && } {** | `() => setSelectedTab(tab)` | ❌ Chưa có Popup / Trực tiếp |
| **Gửi trình duyệt** | `() => { setSelectedRequest(request); setShowSendTo...` | ❌ Chưa có Popup / Trực tiếp |
| **Đóng** | `() => { setShowSubmitModal(false); setSelectedCate...` | ℹ️ Dùng để đóng Modal |
| **{selectedCategories.length === filteredCategories.** | `handleSelectAll` | ❌ Chưa có Popup / Trực tiếp |
| **Tạo danh mục mới** | `() => setShowCreateModal(true)` | ✅ Dùng trạng thái React Modal |
| **Hủy** | `() => { setShowSubmitModal(false); setSelectedCate...` | ℹ️ Dùng để đóng Modal |
| **Trình duyệt ({selectedCategories.length})** | `handleSubmitSelected` | ❌ Chưa có Popup / Trực tiếp |
| **Đóng** | `() => setShowCreateModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowCreateModal(false)` | ℹ️ Dùng để đóng Modal |
| **Tạo và trình duyệt** | `handleCreateAndSubmit` | ❌ Chưa có Popup / Trực tiếp |
| **Đóng** | `() => { setShowSendToReviewerModal(false); setSele...` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => { setShowSendToReviewerModal(false); setSele...` | ℹ️ Dùng để đóng Modal |
| **Gửi trình duyệt** | `handleSendToReviewer` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: CategoryPage.tsx (module: category)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Danh sách** | `() => setActiveTab('setup')` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt** | `() => setActiveTab('approval')` | ❌ Chưa có Popup / Trực tiếp |
| **Thu thập số liệu thống kê** | `() => setActiveTab('stats')` | ❌ Chưa có Popup / Trực tiếp |
| **Lịch sử cập nhật** | `() => setActiveTab('version-history')` | ❌ Chưa có Popup / Trực tiếp |
| **Nhập từ Excel** | `() => setShowImportModal(true)` | ✅ Dùng trạng thái React Modal |
| **Thêm bản ghi mới** | `() => setShowAddModal(true)` | ✅ Dùng trạng thái React Modal |
| **Xem chi tiết** | `() => { setSelectedCategory(category); setShowDeta...` | ❌ Chưa có Popup / Trực tiếp |
| **Thêm cột mới** | `() => { setSelectedCategory(category); setShowAddF...` | ❌ Chưa có Popup / Trực tiếp |
| **Chỉnh sửa cấu trúc** | `() => { setSelectedCategory(category); setEditedCa...` | ❌ Chưa có Popup / Trực tiếp |
| **Ngừng áp dụng bản ghi** | `() => { setSelectedCategory(category); setShowArch...` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt hàng loạt** | `handleBulkApprove` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối hàng loạt** | `handleBulkReject` | ❌ Chưa có Popup / Trực tiếp |
| **Xem chi tiết** | `() => handleViewApprovalDetail(request)` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt** | `() => handleApprove(request.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối** | `() => handleReject(request.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Đóng** | `() => setShowAddModal(false)` | ℹ️ Dùng để đóng Modal |
| **Thêm trường** | `() => { setNewFieldData({ name: '', dataType: 'TEX...` | ❌ Chưa có Popup / Trực tiếp |
| **Chỉnh sửa** | `() => { setNewFieldData({ name: field.name, dataTy...` | ❌ Chưa có Popup / Trực tiếp |
| **Xóa trường** | `() => { setNewCategoryFields(newCategoryFields.fil...` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `() => setShowAddModal(false)` | ℹ️ Dùng để đóng Modal |
| **Đóng** | `() => { setShowDetailModal(false); setSelectedCate...` | ℹ️ Dùng để đóng Modal |
| **Đóng** | `() => { setShowEditModal(false); setSelectedCatego...` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => { setShowEditModal(false); setSelectedCatego...` | ℹ️ Dùng để đóng Modal |
| **Lưu thay đổi** | `() => { // Direct save for users with permission s...` | ❌ Chưa có Popup / Trực tiếp |
| **a.id === editedCategoryData.approver); setSuccessN** | `() => { // Validate approver selection if (!edited...` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowAddFieldModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowAddFieldModal(false)` | ℹ️ Dùng để đóng Modal |
| **Thêm trường** | `() => { setNewCategoryFields([...newCategoryFields...` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowFieldFormModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowFieldFormModal(false)` | ℹ️ Dùng để đóng Modal |
| **field.name.toLowerCase() === newFieldData.name.toL** | `() => { // Validation const errors: { [key: string...` | ❌ Chưa có Popup / Trực tiếp |
| **Nút điều khiển tự do (Icon)** | `handleCancelImport` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `handleCancelImport` | ❌ Chưa có Popup / Trực tiếp |
| **0} className="px-4 py-2 bg-green-600 text-white ro** | `handleImportConfirm` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowApprovalDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Đóng** | `() => setShowApprovalDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Từ chối** | `() => { handleReject(selectedApprovalRequest.id); ...` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt** | `() => { handleApprove(selectedApprovalRequest.id);...` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `() => { setShowApprovalModal(false); setApprovalCo...` | ℹ️ Dùng để đóng Modal |
| **Xác nhận phê duyệt** | `confirmApproval` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `() => { setShowRejectModal(false); setApprovalComm...` | ℹ️ Dùng để đóng Modal |
| **Xác nhận từ chối** | `confirmReject` | ❌ Chưa có Popup / Trực tiếp |
| **Đóng thông báo** | `() => setShowSuccessNotification(false)` | ℹ️ Dùng để đóng Modal |

## Màn hình: CategoryPublishedListPage.tsx (module: category)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Xem chi tiết** | `() => handleViewDetail(item)` | ❌ Chưa có Popup / Trực tiếp |
| **{fmt}** | `() => handleDownload(item, fmt)` | ❌ Chưa có Popup / Trực tiếp |
| **×** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Tải {fmt}** | `() => handleDownload(selectedData, fmt)` | ❌ Chưa có Popup / Trực tiếp |
| **Đóng** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |

## Màn hình: CategoryReportPage.tsx (module: category)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Đặt lại** | `() => { setSearchKeyword(''); setFilterCategory('a...` | ❌ Chưa có Popup / Trực tiếp |
| **Xuất Excel** | `handleExportExcel` | ❌ Chưa có Popup / Trực tiếp |
| **Xuất PDF** | `handleExportPDF` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: CategorySetupPage.tsx (module: category)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **{tab.label}** | `() => setActiveTab(tab.id as TabType)` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: CategoryStatisticsPage.tsx (module: category)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Xuất PDF** | `handleExportPDF` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: CategoryStatisticsReportPage.tsx (module: category)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Tìm kiếm và lọc** | `() => setActiveTab('search')` | ❌ Chưa có Popup / Trực tiếp |
| **Báo cáo thống kê** | `() => setActiveTab('statistics')` | ❌ Chưa có Popup / Trực tiếp |
| **Báo cáo phân loại** | `() => setActiveTab('classification')` | ❌ Chưa có Popup / Trực tiếp |
| **Thống kê lượt truy cập** | `() => setActiveTab('access')` | ❌ Chưa có Popup / Trực tiếp |
| **Đặt lại** | `() => { setSearchKeyword(''); setFilterCategory('a...` | ❌ Chưa có Popup / Trực tiếp |
| **Xuất Excel** | `handleExportExcel` | ❌ Chưa có Popup / Trực tiếp |
| **Xuất PDF** | `handleExportPDF` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: ApprovalTab.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Tất cả ({records.length})** | `() => setFilterStatus('all')` | ❌ Chưa có Popup / Trực tiếp |
| **Chờ phê duyệt ({pendingCount})** | `() => setFilterStatus('pending')` | ❌ Chưa có Popup / Trực tiếp |
| **Đã phê duyệt ({approvedCount})** | `() => setFilterStatus('approved')` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối ({rejectedCount})** | `() => setFilterStatus('rejected')` | ❌ Chưa có Popup / Trực tiếp |
| **Xem chi tiết** | `() => handleViewDetail(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt** | `() => handleApprove(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối** | `() => handleReject(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Lịch sử cập nhật ({record.history.length}) {isExpa** | `() => setExpandedHistory(isExpanded ? null : recor...` | ❌ Chưa có Popup / Trực tiếp |
| **Hành động** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Đóng** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hành động** | `() => setShowApprovalForm(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowApprovalForm(false)` | ℹ️ Dùng để đóng Modal |
| **{approvalAction === 'approve' ? ( <> Xác nhận phê** | `handleSubmitApproval` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: AttributesManagementTab.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **{selectedEntityData ? ( {selectedEntityData.code}** | `() => setComboboxOpen(!comboboxOpen)` | ❌ Chưa có Popup / Trực tiếp |
| **{entity.code} - {entity.name} {selectedEntity ===** | `() => { setSelectedEntity(entity.id); setComboboxO...` | ❌ Chưa có Popup / Trực tiếp |
| **Thêm thuộc tính** | `() => setShowForm(true)` | ✅ Dùng trạng thái React Modal |
| **v{attribute.version}** | `() => handleViewHistory(attribute.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Chỉnh sửa** | `() => handleEdit(attribute)` | ❌ Chưa có Popup / Trực tiếp |
| **Xóa** | `() => handleDelete(attribute.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `handleCloseForm` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `handleCloseForm` | ❌ Chưa có Popup / Trực tiếp |
| **{editingAttribute ? 'Cập nhật' : 'Tạo mới'}** | `handleSubmit` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowVersionHistory(false)` | ℹ️ Dùng để đóng Modal |
| **Đóng** | `() => setShowVersionHistory(false)` | ℹ️ Dùng để đóng Modal |

## Màn hình: EntityRelationshipsTab.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Thêm quan hệ mới** | `() => setShowForm(true)` | ✅ Dùng trạng thái React Modal |
| **Chỉnh sửa** | `() => handleEdit(relationship)` | ❌ Chưa có Popup / Trực tiếp |
| **Xóa** | `() => handleDelete(relationship.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `handleCloseForm` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `handleCloseForm` | ❌ Chưa có Popup / Trực tiếp |
| **{editingRelationship ? 'Cập nhật' : 'Lưu quan hệ'}** | `handleSubmit` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: HistoryTab.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **📋 Danh sách** | `() => setViewMode('list')` | ❌ Chưa có Popup / Trực tiếp |
| **📅 Timeline** | `() => setViewMode('timeline')` | ❌ Chưa có Popup / Trực tiếp |
| **Xuất báo cáo** | `handleExportReport` | ❌ Chưa có Popup / Trực tiếp |
| **Xem chi tiết bản ghi** | `() => { setSelectedDetailRecord({ recordCode: reco...` | ❌ Chưa có Popup / Trực tiếp |
| **So sánh với phiên bản {selectedHistory[index - 1].** | `() => { setCompareVersions({ v1: item.version, v2:...` | ❌ Chưa có Popup / Trực tiếp |
| **Khôi phục version này** | `() => { setRestoreRecordCode(selectedRecordCode); ...` | ❌ Chưa có Popup / Trực tiếp |
| **✕ Đóng** | `() => { setShowCompareModal(false); setCompareVers...` | ℹ️ Dùng để đóng Modal |
| **✕ Đóng** | `() => setSelectedDetailRecord(null)` | ❌ Chưa có Popup / Trực tiếp |
| **📅 Xem Timeline** | `() => { handleViewTimeline(selectedDetailRecord.re...` | ❌ Chưa có Popup / Trực tiếp |
| **Đóng** | `() => setSelectedDetailRecord(null)` | ❌ Chưa có Popup / Trực tiếp |
| **✕ Đóng** | `() => { setShowRestoreModal(false); setRestoreReco...` | ℹ️ Dùng để đóng Modal |
| **Hủy bỏ** | `() => { setShowRestoreModal(false); setRestoreReco...` | ℹ️ Dùng để đóng Modal |
| **h.version === selectedRestoreVersion)?.date}` ); s** | `() => { const confirmed = window.confirm( `♻️ XÁC ...` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: MasterDataAPage.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Danh sách dữ liệu** | `() => setActiveTab('list')` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt dữ liệu** | `() => setActiveTab('approval')` | ❌ Chưa có Popup / Trực tiếp |
| **Lịch sử xử lý** | `() => setActiveTab('history')` | ❌ Chưa có Popup / Trực tiếp |
| **Trình duyệt** | `() => { if (selectedRecords.size === 0) { alert('V...` | ❌ Chưa có Popup / Trực tiếp |
| **Công khai** | `() => { if (selectedRecords.size === 0) { alert('V...` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy công khai** | `() => { if (selectedRecords.size === 0) { alert('V...` | ❌ Chưa có Popup / Trực tiếp |
| **Khôi phục** | `handleRestore` | ❌ Chưa có Popup / Trực tiếp |
| **Bỏ chọn tất cả** | `() => setSelectedRecords(new Set())` | ❌ Chưa có Popup / Trực tiếp |
| **{getApprovalStatusText(record.approvalStatus)}** | `() => { if (record.approvalStatus === 'pending') {...` | ❌ Chưa có Popup / Trực tiếp |
| **Xem chi tiết** | `() => setSelectedRecord(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Khôi phục** | `() => handleRestore(record.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Xóa** | `() => handleDelete(record.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Chi tiết nguồn** | `() => setSelectedRecord(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt** | `() => setApprovalRecord(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối** | `() => setApprovalRecord(record)` | ❌ Chưa có Popup / Trực tiếp |
| **✕ Đóng** | `() => { setShowSubmitModal(false); setSelectedAppr...` | ℹ️ Dùng để đóng Modal |
| **Hủy bỏ** | `() => { setShowSubmitModal(false); setSelectedAppr...` | ℹ️ Dùng để đóng Modal |
| **Gửi phê duyệt ngay** | `() => { if (!selectedApprover) { alert('⚠️ Vui lòn...` | ❌ Chưa có Popup / Trực tiếp |
| **✕ Đóng** | `() => setShowPublishModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy bỏ** | `() => setShowPublishModal(false)` | ℹ️ Dùng để đóng Modal |
| **{ const selectedData = data.filter(r => selectedRe** | `() => { handlePublish(); setShowPublishModal(false...` | ℹ️ Dùng để đóng Modal |
| **✕ Đóng** | `() => setShowUnpublishModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy bỏ** | `() => setShowUnpublishModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy công khai ngay** | `() => { handleUnpublish(); setShowUnpublishModal(f...` | ℹ️ Đóng/Mở Modal |
| **✕ Đóng** | `() => { setShowRestoreModal(false); setRestoreReco...` | ℹ️ Dùng để đóng Modal |
| **v{version} {version === 4 && '25/12/2024'} {versio** | `() => { const newVersions = new Map(selectedRestor...` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy bỏ** | `() => { setShowRestoreModal(false); setRestoreReco...` | ℹ️ Dùng để đóng Modal |
| **Khôi phục ngay** | `() => { let summary = '♻️ XÁC NHẬN KHÔI PHỤC PHIÊN...` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: MasterDataApprovalPage.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Trình duyệt mới** | `() => setShowSubmitModal(true)` | ✅ Dùng trạng thái React Modal |
| **Chờ duyệt ({stats.pending})** | `() => setSelectedTab('pending')` | ❌ Chưa có Popup / Trực tiếp |
| **Đã duyệt ({stats.approved})** | `() => setSelectedTab('approved')` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối ({stats.rejected})** | `() => setSelectedTab('rejected')` | ❌ Chưa có Popup / Trực tiếp |
| **Tất cả ({stats.total})** | `() => setSelectedTab('all')` | ❌ Chưa có Popup / Trực tiếp |
| **Xem chi tiết** | `() => { setSelectedRecord(approval); setShowDetail...` | ❌ Chưa có Popup / Trực tiếp |
| **Gửi trình duyệt** | `() => { setSelectedRecord(approval); setShowSendTo...` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt** | `() => { setSelectedRecord(approval); setApprovalTy...` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối** | `() => { setSelectedRecord(approval); setApprovalTy...` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowSubmitModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowSubmitModal(false)` | ℹ️ Dùng để đóng Modal |
| **Trình duyệt** | `() => setShowSubmitModal(false)` | ℹ️ Dùng để đóng Modal |
| **Nút Đóng (Icon X)** | `() => { setShowSendToReviewerModal(false); setSele...` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => { setShowSendToReviewerModal(false); setSele...` | ℹ️ Dùng để đóng Modal |
| **Gửi trình duyệt** | `handleSendToReviewer` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Đóng** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Nút Đóng (Icon X)** | `() => setShowApprovalModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowApprovalModal(false)` | ℹ️ Dùng để đóng Modal |
| **{approvalType === 'approve' ? : } {approvalType ==** | `() => { alert(`Đã ${approvalType === 'approve' ? '...` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: MasterDataManagementPage.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Quản lý dữ liệu** | `() => setActiveTab('management')` | ❌ Chưa có Popup / Trực tiếp |
| **Tra cứu** | `() => setActiveTab('search')` | ❌ Chưa có Popup / Trực tiếp |
| **Báo cáo** | `() => setActiveTab('report')` | ❌ Chưa có Popup / Trực tiếp |
| **Lịch sử** | `() => setActiveTab('history')` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: MasterDataPublishPage.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Gỡ công khai** | `() => { setSelectedData(data); setShowUnpublishMod...` | ❌ Chưa có Popup / Trực tiếp |
| **Công khai** | `() => { setSelectedData(data); setShowPublishModal...` | ℹ️ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `() => setShowPublishModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowPublishModal(false)` | ℹ️ Dùng để đóng Modal |
| **Công khai** | `() => setShowPublishModal(false)` | ℹ️ Dùng để đóng Modal |
| **Nút Đóng (Icon X)** | `() => setShowUnpublishModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowUnpublishModal(false)` | ℹ️ Dùng để đóng Modal |
| **Gỡ công khai** | `() => setShowUnpublishModal(false)` | ℹ️ Dùng để đóng Modal |

## Màn hình: MasterDataReportsPage.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Tra cứu dữ liệu chủ** | `() => setActiveTab('search')` | ❌ Chưa có Popup / Trực tiếp |
| **Báo cáo sử dụng dữ liệu chủ** | `() => setActiveTab('usage')` | ❌ Chưa có Popup / Trực tiếp |
| **Báo cáo vòng đời dữ liệu** | `() => setActiveTab('lifecycle')` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowFilters(false)` | ℹ️ Dùng để đóng Modal |
| **Xóa bộ lọc** | `handleResetFilters` | ❌ Chưa có Popup / Trực tiếp |
| **Tìm kiếm** | `handleSearch` | ❌ Chưa có Popup / Trực tiếp |
| **Hiển thị bộ lọc** | `() => setShowFilters(true)` | ✅ Dùng trạng thái React Modal |
| **In** | `handlePrint` | ❌ Chưa có Popup / Trực tiếp |
| **Excel** | `handleExportExcel` | ❌ Chưa có Popup / Trực tiếp |
| **PDF** | `handleExportPDF` | ❌ Chưa có Popup / Trực tiếp |
| **Xem chi tiết** | `() => handleViewDetail(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Xuất Excel** | `handleExportExcel` | ❌ Chưa có Popup / Trực tiếp |
| **Xuất PDF** | `handleExportPDF` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: MasterDataScaleManagementPage.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Thiết lập DL chủ** | `() => setActiveTab('setup')` | ❌ Chưa có Popup / Trực tiếp |
| **Thiết lập thuộc tính** | `() => setActiveTab('attributes')` | ❌ Chưa có Popup / Trực tiếp |
| **Thiết lập quy tắc hợp nhất** | `() => setActiveTab('merge-rules')` | ❌ Chưa có Popup / Trực tiếp |
| **Thiết lập quan hệ thực thể** | `() => setActiveTab('relationships')` | ❌ Chưa có Popup / Trực tiếp |
| **Quy tắc định danh duy nhất** | `() => setActiveTab('identifier-rules')` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt** | `() => setActiveTab('approval')` | ❌ Chưa có Popup / Trực tiếp |
| **Tạo mới (Wizard 5 bước)** | `() => setShowWizard(true)` | ✅ Dùng trạng thái React Modal |
| **Thêm mới nhanh** | `() => setShowForm(true)` | ✅ Dùng trạng thái React Modal |
| **Nút bấm** | `() => handleEdit(entity)` | ❌ Chưa có Popup / Trực tiếp |
| **Nút bấm** | `() => handleDelete(entity.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Nút bấm** | `handleCloseForm` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `handleCloseForm` | ❌ Chưa có Popup / Trực tiếp |
| **{editingEntity ? 'Cập nhật' : 'Tạo mới'}** | `handleSubmit` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: MasterDataSetupPage.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Thêm cấu hình mới** | `() => setShowAddModal(true)` | ✅ Dùng trạng thái React Modal |
| **Chỉnh sửa** | `() => { setSelectedConfig(config); setFormData(con...` | ❌ Chưa có Popup / Trực tiếp |
| **Xóa** | `() => { setSelectedConfig(config); setShowDeleteMo...` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowAddModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowAddModal(false)` | ℹ️ Dùng để đóng Modal |
| **Lưu** | `() => setShowAddModal(false)` | ℹ️ Dùng để đóng Modal |
| **Nút Đóng (Icon X)** | `() => setShowEditModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowEditModal(false)` | ℹ️ Dùng để đóng Modal |
| **Cập nhật** | `() => setShowEditModal(false)` | ℹ️ Dùng để đóng Modal |
| **Nút Đóng (Icon X)** | `() => setShowDeleteModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowDeleteModal(false)` | ℹ️ Dùng để đóng Modal |
| **Xóa** | `() => setShowDeleteModal(false)` | ℹ️ Dùng để đóng Modal |

## Màn hình: MasterDataUpdateReviewTab.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Danh sách dữ liệu** | `() => setActiveTab('list')` | ❌ Chưa có Popup / Trực tiếp |
| **Cấu hình xử lý dữ liệu** | `() => setActiveTab('config')` | ❌ Chưa có Popup / Trực tiếp |
| **Danh sách dữ liệu cảnh báo** | `() => setActiveTab('warning')` | ❌ Chưa có Popup / Trực tiếp |
| **Lịch sử xử lý** | `() => setActiveTab('history')` | ❌ Chưa có Popup / Trực tiếp |
| **Gửi phê duyệt** | `handleSendApproval` | ❌ Chưa có Popup / Trực tiếp |
| **Công khai** | `handlePublish` | ❌ Chưa có Popup / Trực tiếp |
| **Bỏ chọn tất cả** | `() => setSelectedRecords(new Set())` | ❌ Chưa có Popup / Trực tiếp |
| **Xem chi tiết** | `() => setSelectedRecord(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Khôi phục** | `() => handleRestore(record.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Xóa** | `() => handleDelete(record.id)` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: MasterDataUpdateTab.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Rà soát** | `() => setActiveSubTab('review')` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt** | `() => setActiveSubTab('approval')` | ❌ Chưa có Popup / Trực tiếp |
| **Theo dõi lịch sử thay đổi** | `() => setActiveSubTab('history')` | ❌ Chưa có Popup / Trực tiếp |
| **Quản lý phiên bản** | `() => setActiveSubTab('version')` | ❌ Chưa có Popup / Trực tiếp |
| **Công khai** | `() => setActiveSubTab('publish')` | ❌ Chưa có Popup / Trực tiếp |
| **{isExpanded ? : }** | `() => setExpandedHistory(isExpanded ? null : recor...` | ❌ Chưa có Popup / Trực tiếp |
| **{record.visibility === 'public' ? ( <> Công khai )** | `() => toggleVisibility(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Gỡ công khai** | `() => handlePublish(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Công khai** | `() => handlePublish(record)` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowReviewModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowReviewModal(false)` | ℹ️ Dùng để đóng Modal |
| **{reviewAction === 'approve' ? ( <> Xác nhận phê du** | `handleSubmitReview` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: MergeRulesManagementTab.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Thêm quy tắc mới** | `() => setShowForm(true)` | ✅ Dùng trạng thái React Modal |
| **Kiểm thử** | `() => handleTestRule(rule)` | ❌ Chưa có Popup / Trực tiếp |
| **Nút điều khiển tự do (Icon)** | `() => handleToggleStatus(rule.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Chỉnh sửa** | `() => handleEdit(rule)` | ❌ Chưa có Popup / Trực tiếp |
| **Xóa** | `() => handleDelete(rule.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `handleCloseForm` | ❌ Chưa có Popup / Trực tiếp |
| **Thêm nguồn** | `handleAddSource` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Xóa (Icon Trash)** | `() => handleDeleteSource(index)` | ❌ Chưa có Popup / Trực tiếp |
| **Thêm quy tắc so khớp** | `handleAddMatchRule` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Xóa (Icon Trash)** | `() => handleDeleteMatchRule(rule.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Thêm quy tắc trích rút** | `handleAddExtractRule` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Xóa (Icon Trash)** | `() => handleDeleteExtractRule(rule.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `handleCloseForm` | ❌ Chưa có Popup / Trực tiếp |
| **{editingRule ? 'Cập nhật' : 'Lưu quy tắc'}** | `handleSubmit` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowTestModal(false)` | ℹ️ Dùng để đóng Modal |
| **Đóng** | `() => setShowTestModal(false)` | ℹ️ Dùng để đóng Modal |

## Màn hình: UniqueIdentifierRulesTab.tsx (module: master-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Thêm quy tắc mới** | `() => setShowForm(true)` | ✅ Dùng trạng thái React Modal |
| **Sao chép** | `() => copyToClipboard(rule.example)` | ❌ Chưa có Popup / Trực tiếp |
| **Chỉnh sửa** | `() => handleEdit(rule)` | ❌ Chưa có Popup / Trực tiếp |
| **Xóa** | `() => handleDelete(rule.id)` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `handleCloseForm` | ❌ Chưa có Popup / Trực tiếp |
| **Làm mới** | `() => handleFormChange({ ...formData ` | ❌ Chưa có Popup / Trực tiếp |
| **Sao chép** | `() => copyToClipboard(generatedExample)` | ❌ Chưa có Popup / Trực tiếp |
| **{duplicateCheck.checking ? 'Đang kiểm tra...' : 'K** | `handleCheckDuplicate` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `handleCloseForm` | ❌ Chưa có Popup / Trực tiếp |
| **{editingRule ? 'Cập nhật' : 'Lưu quy tắc'}** | `handleSubmit` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: OpenDataApprovalPage.tsx (module: open-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Trình duyệt mới** | `() => setShowSubmitModal(true)` | ✅ Dùng trạng thái React Modal |
| **Chờ duyệt ({stats.pending})** | `() => setSelectedTab('pending')` | ❌ Chưa có Popup / Trực tiếp |
| **Đã phê duyệt ({stats.approved})** | `() => setSelectedTab('approved')` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối ({stats.rejected})** | `() => setSelectedTab('rejected')` | ❌ Chưa có Popup / Trực tiếp |
| **Tất cả ({stats.total})** | `() => setSelectedTab('all')` | ❌ Chưa có Popup / Trực tiếp |
| **Xem chi tiết** | `() => { setSelectedRequest(request); setShowDetail...` | ❌ Chưa có Popup / Trực tiếp |
| **Gửi trình duyệt** | `() => { setSelectedRequest(request); setShowSendTo...` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt** | `() => { setSelectedRequest(request); setApprovalTy...` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối** | `() => { setSelectedRequest(request); setApprovalTy...` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowSubmitModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowSubmitModal(false)` | ℹ️ Dùng để đóng Modal |
| **Trình duyệt** | `() => setShowSubmitModal(false)` | ℹ️ Dùng để đóng Modal |
| **Nút Đóng (Icon X)** | `() => { setShowSendToReviewerModal(false); setSele...` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => { setShowSendToReviewerModal(false); setSele...` | ℹ️ Dùng để đóng Modal |
| **Gửi trình duyệt** | `handleSendToReviewer` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Đóng** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Nút Đóng (Icon X)** | `() => setShowApprovalModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowApprovalModal(false)` | ℹ️ Dùng để đóng Modal |
| **{approvalType === 'approve' ? : } {approvalType ==** | `() => { alert(`Đã ${approvalType === 'approve' ? '...` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: OpenDataPublishedListPage.tsx (module: open-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Xem chi tiết** | `() => handleViewDetail(item)` | ❌ Chưa có Popup / Trực tiếp |
| **{fmt}** | `() => handleDownload(item, fmt)` | ❌ Chưa có Popup / Trực tiếp |
| **×** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Tải {fmt}** | `() => handleDownload(selectedData, fmt)` | ❌ Chưa có Popup / Trực tiếp |
| **Đóng** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |

## Màn hình: OpenDataPublishPage.tsx (module: open-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Xem chi tiết** | `() => { setSelectedDataset(dataset); setShowDetail...` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |
| **Đóng** | `() => setShowDetailModal(false)` | ℹ️ Dùng để đóng Modal |

## Màn hình: OpenDataReportPage.tsx (module: open-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Tìm kiếm** | `() => setActiveTab('search')` | ❌ Chưa có Popup / Trực tiếp |
| **Báo cáo** | `() => setActiveTab('report')` | ❌ Chưa có Popup / Trực tiếp |
| **Đặt lại** | `() => { setSearchKeyword(''); setSearchCategory('a...` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: OpenDataSetupPage.tsx (module: open-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Quản lý danh mục {categories.length}** | `() => setActiveTab('management')` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt {approvalList.length}** | `() => setActiveTab('approval')` | ❌ Chưa có Popup / Trực tiếp |
| **Lịch sử thay đổi {historyList.length}** | `() => setActiveTab('history')` | ❌ Chưa có Popup / Trực tiếp |
| **Tất cả {approvalList.length}** | `() => setApprovalFilterTab('all')` | ❌ Chưa có Popup / Trực tiếp |
| **Chờ phê duyệt {approvalStats.pending}** | `() => setApprovalFilterTab('pending')` | ❌ Chưa có Popup / Trực tiếp |
| **Đã phê duyệt {approvalStats.approved}** | `() => setApprovalFilterTab('approved')` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối {approvalStats.rejected}** | `() => setApprovalFilterTab('rejected')` | ❌ Chưa có Popup / Trực tiếp |
| **Xem chi tiết** | `() => handleView(category)` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối** | `() => handleReject(category)` | ❌ Chưa có Popup / Trực tiếp |
| **Phê duyệt** | `() => handleApprove(category)` | ❌ Chưa có Popup / Trực tiếp |
| **Thêm danh mục mới** | `handleAdd` | ❌ Chưa có Popup / Trực tiếp |
| **Xem chi tiết** | `() => handleView(record as any)` | ❌ Chưa có Popup / Trực tiếp |
| **Tải xuống** | `() => alert(`Tải xuống phiên bản ${record.version` | ❌ Chưa có Popup / Trực tiếp |
| **Khôi phục** | `() => alert(`Khôi phục về phiên bản ${record.versi...` | ❌ Chưa có Popup / Trực tiếp |
| **{category.name} {category.description}** | `() => handleCategoryClick(category)` | ❌ Chưa có Popup / Trực tiếp |
| **Chỉnh sửa** | `() => handleEdit(category)` | ❌ Chưa có Popup / Trực tiếp |
| **Xóa** | `() => handleDelete(category)` | ❌ Chưa có Popup / Trực tiếp |
| **Trình duyệt** | `() => handleSubmitForApproval(category)` | ❌ Chưa có Popup / Trực tiếp |
| **Duyệt** | `() => handleApprove(category)` | ❌ Chưa có Popup / Trực tiếp |
| **Từ chối duyệt** | `() => handleReject(category)` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowAddModal(false)` | ℹ️ Dùng để đóng Modal |
| **Chọn tất cả** | `() => { const allFieldIds = mockTableFields[formDa...` | ❌ Chưa có Popup / Trực tiếp |
| **Bỏ chọn tất cả** | `() => setFormData({ ...formData, selectedFields: [...` | ❌ Chưa có Popup / Trực tiếp |
| **Xóa file** | `() => setAttachedFiles(attachedFiles.filter((_, i)...` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `() => setShowAddModal(false)` | ℹ️ Dùng để đóng Modal |
| **Lưu** | `handleSaveAdd` | ❌ Chưa có Popup / Trực tiếp |
| **Gửi phê duyệt** | `handleSendApproval` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowViewModal(false)` | ℹ️ Dùng để đóng Modal |
| **Đóng** | `() => setShowViewModal(false)` | ℹ️ Dùng để đóng Modal |
| **Nút Đóng (Icon X)** | `() => setShowEditModal(false)` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => setShowEditModal(false)` | ℹ️ Dùng để đóng Modal |
| **Lưu** | `handleSaveEdit` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `() => setShowDeleteModal(false)` | ℹ️ Dùng để đóng Modal |
| **Xóa** | `confirmDelete` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => { setShowApprovalModal(false); setApprovalNo...` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => { setShowApprovalModal(false); setApprovalNo...` | ℹ️ Dùng để đóng Modal |
| **Phê duyệt** | `confirmApprovalAction` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => { setShowApprovalModal(false); setRejectReas...` | ℹ️ Dùng để đóng Modal |
| **Hủy** | `() => { setShowApprovalModal(false); setRejectReas...` | ℹ️ Dùng để đóng Modal |
| **Từ chối** | `confirmApprovalAction` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `() => { setShowApprovalModal(false); setSelectedAp...` | ℹ️ Dùng để đóng Modal |
| **Gửi phê duyệt** | `confirmApprovalAction` | ❌ Chưa có Popup / Trực tiếp |

## Màn hình: OpenDataUpdateRulesPage.tsx (module: open-data)

| Tên nút / Chức năng | Hành động (Action) | Trạng thái Popup |
|---|---|---|
| **Thêm quy tắc mới** | `handleAdd` | ❌ Chưa có Popup / Trực tiếp |
| **Chạy ngay** | `() => handleRunNow(rule)` | ❌ Chưa có Popup / Trực tiếp |
| **Lịch sử chạy** | `() => { setSelectedRule(rule); setShowHistoryModal...` | ℹ️ Đóng/Mở Modal |
| **Xem chi tiết** | `() => { setSelectedRule(rule); setShowViewModal(tr...` | ℹ️ Đóng/Mở Modal |
| **Nút Đóng (Icon X)** | `() => setShowAddModal(false)` | ℹ️ Dùng để đóng Modal |
| **Chọn tất cả** | `() => { const allFields = mockTableFields[formData...` | ❌ Chưa có Popup / Trực tiếp |
| **Bỏ chọn tất cả** | `() => setFormData({ ...formData, selectedFields: [...` | ❌ Chưa có Popup / Trực tiếp |
| **+ Thêm** | `handleAddEmail` | ❌ Chưa có Popup / Trực tiếp |
| **Nút điều khiển tự do (Icon)** | `() => handleRemoveEmail(email)` | ❌ Chưa có Popup / Trực tiếp |
| **Xem trước** | `handlePreview` | ❌ Chưa có Popup / Trực tiếp |
| **Hủy** | `() => setShowAddModal(false)` | ℹ️ Dùng để đóng Modal |
| **Lưu** | `handleSaveDraft` | ❌ Chưa có Popup / Trực tiếp |
| **Lưu & Kích hoạt** | `handleSaveAndActivate` | ❌ Chưa có Popup / Trực tiếp |
| **Nút Đóng (Icon X)** | `() => setShowHistoryModal(false)` | ℹ️ Dùng để đóng Modal |

