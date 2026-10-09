# Rà soát cỡ chữ / màu Nhãn – Giá trị – Placeholder (09/10/2026)

Chuẩn đối chiếu (compomennt.md mục 1, 5.2, 5.17, 5.19): Nhãn 13px/500/#020817 (bộ lọc 13px/600/#0E0D0D); Giá trị & chữ trong ô 13px/400/#020817; Placeholder 13px/#94A3B8.

Phương pháp: quét tĩnh mã nguồn các file được nạp từ main.tsx (bỏ code chết, bỏ thư viện ui/). Kết quả là ước lượng — chưa đối chiếu trên trình duyệt.

## 0. Thành phần dùng chung khác

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `common/APIConnectionFormModal.tsx` | Chưa có | 23 | 27 | 0 | 23 | Nhãn: cỡ 14px (23), không đặt độ đậm (23), màu (23) · Ô: chữ 14px (27), màu chữ (27) |
| `GrantPermissionModal.tsx` | Chưa có | 17 | 18 | 3 | 14 | Nhãn: không đặt độ đậm (17), màu (17), cỡ 14px (10), không đặt cỡ (mặc định 16px) (4), cỡ 12px (3) · Ô: chữ 14px (18), màu chữ (18) · Xem: chữ nhỏ/xám |
| `DataDetailModal.tsx` | Chưa có | 7 | 8 | 22 | 2 | Nhãn: màu (7), cỡ 12px (5), không đặt độ đậm (5), cỡ 14px (2) · Ô: màu chữ (8), chữ 14px (7), chữ 12px (1) · Xem: chữ nhỏ/xám |
| `modals/DataRequestModal.tsx` | Mở | 16 | 13 | 7 | 11 | Nhãn: cỡ 14px (16), không đặt độ đậm (16), màu (16) · Ô: màu chữ (13), không đặt cỡ (mặc định 16px) (11), chữ 14px (2) · Xem: chữ nhỏ/xám |
| `modals/APIConfigModal.tsx` | Mở | 10 | 11 | 4 | 1 | Nhãn: cỡ 14px (10), không đặt độ đậm (10), màu (10) · Ô: màu chữ (11), không đặt cỡ (mặc định 16px) (8), chữ 14px (3) · Xem: chữ nhỏ/xám |
| `modals/AddServiceModal.tsx` | Chưa có | 11 | 9 | 3 | 6 | Nhãn: cỡ 14px (11), không đặt độ đậm (11), màu (11) · Ô: màu chữ (9), không đặt cỡ (mặc định 16px) (8), chữ 14px (1) · Xem: chữ nhỏ/xám |
| `modals/EditServiceModal.tsx` | Chưa có | 9 | 8 | 4 | 6 | Nhãn: cỡ 14px (9), không đặt độ đậm (9), màu (9) · Ô: màu chữ (8), không đặt cỡ (mặc định 16px) (7), chữ 14px (1) · Xem: chữ nhỏ/xám |
| `modals/RequestDetailModal.tsx` | Chưa có | 21 | 0 | 0 | 0 | Nhãn: cỡ 14px (21), không đặt độ đậm (21), màu (21) |
| `modals/APIAccessControlModal.tsx` | Chưa có | 4 | 3 | 4 | 1 | Nhãn: cỡ 14px (4), không đặt độ đậm (4), màu (4) · Ô: không đặt cỡ (mặc định 16px) (3), màu chữ (3) · Xem: chữ nhỏ/xám |
| `pages/DataCoordinationPage.tsx` | Chưa có | 0 | 1 | 9 | 1 | Ô: không đặt cỡ (mặc định 16px) (1), màu chữ (1) · Xem: chữ nhỏ/xám |
| `modals/ReportModal.tsx` | Mở | 7 | 3 | 0 | 0 | Nhãn: cỡ 14px (7), không đặt độ đậm (7), màu (7) · Ô: không đặt cỡ (mặc định 16px) (3), màu chữ (3) |
| `modals/ProcessRequestModal.tsx` | Mở | 1 | 1 | 7 | 1 | Nhãn: cỡ 14px (1), không đặt độ đậm (1), màu (1) · Ô: chữ 14px (1), màu chữ (1) · Xem: chữ nhỏ/xám |
| `modals/ServiceDetailModal.tsx` | Khóa | 0 | 0 | 8 | 0 | Xem: chữ nhỏ/xám |
| `pages/SystemAdminPage.tsx` | Chưa có | 4 | 4 | 0 | 0 | Nhãn: không đặt cỡ (mặc định 16px) (4), không đặt độ đậm (4), màu (4) · Ô: không đặt cỡ (mặc định 16px) (4), màu chữ (4) |
| `dashboard/DashboardReportPage.tsx` | Chưa có | 0 | 5 | 2 | 0 | Ô: màu chữ (5), chữ 12px (4) · Xem: chữ nhỏ/xám |
| `modals/ChangePasswordModal.tsx` | Chưa có | 3 | 3 | 0 | 0 | Nhãn: cỡ 14px (3), không đặt độ đậm (3), màu (3) · Ô: không đặt cỡ (mặc định 16px) (3), màu chữ (3) |
| `common/SyncHistoryTable.tsx` | Chưa có | 0 | 0 | 5 | 0 | Xem: chữ nhỏ/xám |
| `common/AdvancedSearchModal.tsx` | Chưa có | 1 | 3 | 0 | 1 | Nhãn: cỡ 14px (1), không đặt độ đậm (1), màu (1) · Ô: không đặt cỡ (mặc định 16px) (3), màu chữ (3) |
| `common/APIConnectionManager.tsx` | Chưa có | 0 | 0 | 4 | 0 | Xem: chữ nhỏ/xám |
| `dashboard/DashboardHome.tsx` | Chưa có | 0 | 0 | 3 | 0 | Xem: chữ nhỏ/xám |
| `modals/APIDocumentationModal.tsx` | Chưa có | 0 | 0 | 2 | 0 | Xem: chữ nhỏ/xám |
| `admin/FunctionPermissionConfig.tsx` | Chưa có | 1 | 1 | 0 | 1 | Nhãn: không đặt cỡ (mặc định 16px) (1), không đặt độ đậm (1), màu (1) · Ô: chữ 14px (1), màu chữ (1) |
| `common/GenericDataTable.tsx` | Chưa có | 0 | 2 | 0 | 1 | Ô: màu chữ (2), không đặt cỡ (mặc định 16px) (1), chữ 14px (1) |
| `common/ErrorDetailModal.tsx` | Chưa có | 0 | 0 | 2 | 0 | Xem: chữ nhỏ/xám |
| `common/DataDetailModal.tsx` | Chưa có | 0 | 1 | 0 | 0 | Ô: chữ 14px (1), màu chữ (1) |
| `common/ImportDataModal.tsx` | Chưa có | 1 | 0 | 0 | 0 | Nhãn: không đặt cỡ (mặc định 16px) (1), không đặt độ đậm (1), màu (1) |
| `pages/internal/LegalCenterPage.tsx` | Mở | 0 | 0 | 0 | 1 |  |

## 1. Core / Bố cục / Chung

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `notifications/NotificationBrowser.tsx` | Chưa có | 21 | 23 | 4 | 10 | Nhãn: không đặt cỡ (mặc định 16px) (21), không đặt độ đậm (21), màu (21) · Ô: không đặt cỡ (mặc định 16px) (23), màu chữ (23) · Xem: chữ nhỏ/xám |
| `layout/TopBar.tsx` | Chưa có | 15 | 11 | 3 | 0 | Nhãn: cỡ 14px (15), không đặt độ đậm (15), màu (15) · Ô: không đặt cỡ (mặc định 16px) (11), màu chữ (11) · Xem: chữ nhỏ/xám |
| `modals/SendNotificationModal.tsx` | Chưa có | 14 | 9 | 1 | 7 | Nhãn: không đặt độ đậm (14), màu (14), cỡ 12px (9), cỡ 14px (5) · Ô: chữ 14px (9), màu chữ (9) · Xem: chữ nhỏ/xám |
| `modals/NotificationDetailModal.tsx` | Chưa có | 11 | 0 | 0 | 0 | Nhãn: không đặt độ đậm (11), màu (11), cỡ 14px (7), không đặt cỡ (mặc định 16px) (4) |
| `pages/LoginPage.tsx` | Khóa | 2 | 2 | 0 | 2 | Nhãn: cỡ 14px (2), màu (2) · Ô: chữ 14px (2), màu chữ (2) |
| `layout/Sidebar.tsx` | Mở | 0 | 0 | 0 | 1 |  |
| `pages/NotificationPage.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `pages/UserGuidePage.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |

## 2. Thu thập dữ liệu

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `collection/AddDataCollectionForm.tsx` | Mở | 52 | 51 | 0 | 20 | Nhãn: cỡ 16px (52), màu (52) · Ô: màu chữ (51), không đặt cỡ (mặc định 16px) (45), chữ 16px (6) |
| `collection/EditDataCollectionForm.tsx` | Chưa có | 18 | 17 | 0 | 9 | Nhãn: cỡ 16px (18), không đặt độ đậm (18), màu (18), uppercase (2) · Ô: chữ 16px (17), màu chữ (17) |
| `collection/DataManagementDetail.tsx` | Chưa có | 18 | 17 | 0 | 7 | Nhãn: cỡ 16px (18), không đặt độ đậm (18), màu (18) · Ô: chữ 16px (17), màu chữ (17) |
| `collection/AddDataSourceForm.tsx` | Chưa có | 16 | 16 | 0 | 14 | Nhãn: cỡ 16px (16), không đặt độ đậm (16), màu (16) · Ô: chữ 16px (16), màu chữ (16) |
| `collection/EditAPIMethodForm.tsx` | Chưa có | 14 | 16 | 0 | 4 | Nhãn: cỡ 16px (14), không đặt độ đậm (14), màu (14) · Ô: chữ 16px (16), màu chữ (16) |
| `collection/AddAPIMethodForm.tsx` | Chưa có | 14 | 16 | 0 | 11 | Nhãn: cỡ 16px (14), không đặt độ đậm (14), màu (14) · Ô: chữ 16px (16), màu chữ (16) |
| `collection/SendDataForm.tsx` | Mở | 14 | 14 | 0 | 8 | Nhãn: không đặt cỡ (mặc định 16px) (14), không đặt độ đậm (14), màu (14) · Ô: màu chữ (14), không đặt cỡ (mặc định 16px) (13), chữ 16px (1) |
| `collection/ConnectionConfig.tsx` | Chưa có | 11 | 11 | 0 | 6 | Nhãn: không đặt cỡ (mặc định 16px) (11), không đặt độ đậm (11), màu (11) · Ô: không đặt cỡ (mặc định 16px) (11), màu chữ (11) |
| `collection/ViewDataCollectionDetail.tsx` | Chưa có | 19 | 0 | 0 | 0 | Nhãn: cỡ 16px (19), không đặt độ đậm (19), màu (19), uppercase (19) |
| `collection/AdvancedSearchModal.tsx` | Chưa có | 9 | 8 | 0 | 0 | Nhãn: cỡ 16px (9), không đặt độ đậm (9), màu (9) · Ô: chữ 16px (8), màu chữ (8) |
| `pages/collection/DataCollectionConfigSection.tsx` | Mở | 5 | 8 | 0 | 0 | Nhãn: màu (5) · Ô: màu chữ (8) |
| `collection/AddDataCollectionModal.tsx` | Chưa có | 5 | 5 | 0 | 1 | Nhãn: cỡ 16px (5), màu (5), đậm 600 (1) · Ô: chữ 16px (5), màu chữ (5) |
| `collection/EditDataCollectionModal.tsx` | Chưa có | 4 | 4 | 0 | 2 | Nhãn: cỡ 16px (4), màu (4) · Ô: chữ 16px (4), màu chữ (4) |
| `collection/CollectionActivityLog.tsx` | Chưa có | 0 | 7 | 0 | 1 | Ô: chữ 16px (7), màu chữ (7) |
| `pages/collection/StructureLoadingConfig.tsx` | Mở | 0 | 6 | 0 | 3 | Ô: màu chữ (6) |
| `collection/DataValidationPanel.tsx` | Chưa có | 3 | 3 | 0 | 0 | Nhãn: không đặt cỡ (mặc định 16px) (3), không đặt độ đậm (3), màu (3) · Ô: không đặt cỡ (mặc định 16px) (3), màu chữ (3) |
| `collection/ViewDataRecordsList.tsx` | Chưa có | 0 | 1 | 4 | 1 | Ô: chữ 16px (1), màu chữ (1) · Xem: chữ nhỏ/xám |
| `pages/collection/ServiceDataDetailPage.tsx` | Mở | 0 | 5 | 0 | 1 | Ô: màu chữ (5) |
| `collection/DeleteDataConfirmModal.tsx` | Chưa có | 4 | 0 | 0 | 0 | Nhãn: cỡ 16px (4), không đặt độ đậm (4), màu (4), uppercase (4) |
| `collection/DataCollectionList.tsx` | Chưa có | 0 | 4 | 0 | 1 | Ô: chữ 16px (4), màu chữ (4) |
| `pages/collection/ServiceModals.tsx` | Khóa | 0 | 2 | 2 | 6 | Ô: màu chữ (2) · Xem: chữ nhỏ/xám |
| `collection/NotificationManagement.tsx` | Chưa có | 2 | 2 | 0 | 2 | Nhãn: không đặt cỡ (mặc định 16px) (2), không đặt độ đậm (2), màu (2) · Ô: không đặt cỡ (mặc định 16px) (2), màu chữ (2) |
| `collection/ResponseTracking.tsx` | Chưa có | 2 | 2 | 0 | 0 | Nhãn: không đặt cỡ (mặc định 16px) (2), không đặt độ đậm (2), màu (2) · Ô: không đặt cỡ (mặc định 16px) (2), màu chữ (2) |
| `collection/CollectionDashboard.tsx` | Chưa có | 2 | 1 | 0 | 0 | Nhãn: màu (2) · Ô: màu chữ (1) |
| `pages/collection/collectionUi.tsx` | Chưa có | 0 | 3 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (2), màu chữ (2), chữ 14px (1) |
| `pages/collection/ExternalDataPage.tsx` | Khóa | 0 | 3 | 0 | 1 | Ô: chữ 16px (3), màu chữ (3) |
| `pages/collection/InternalDataPage.tsx` | Khóa | 0 | 3 | 0 | 1 | Ô: chữ 16px (3), màu chữ (3) |
| `pages/collection/CollectionSetupPage.tsx` | Mở | 1 | 1 | 1 | 1 | Nhãn: màu (1) · Ô: màu chữ (1) · Xem: chữ nhỏ/xám |
| `pages/collection/ViewServiceModal.tsx` | Khóa | 0 | 3 | 0 | 2 | Ô: màu chữ (3) |
| `collection/APIMethodsList.tsx` | Chưa có | 0 | 2 | 0 | 1 | Ô: chữ 16px (2), màu chữ (2) |
| `pages/collection/AdvancedDataMapping.tsx` | Khóa | 0 | 2 | 0 | 1 | Ô: màu chữ (2), chữ 11px (1) |
| `collection/DataFieldClassification.tsx` | Chưa có | 0 | 2 | 0 | 0 | Ô: chữ 16px (2), màu chữ (2) |
| `collection/OverviewCombined.tsx` | Chưa có | 0 | 2 | 0 | 1 | Ô: chữ 16px (2), màu chữ (2) |
| `data-collection/DataTableViewer.tsx` | Chưa có | 0 | 1 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (1), màu chữ (1) |
| `collection/ValidationDetailsModal.tsx` | Chưa có | 0 | 1 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (1), màu chữ (1) |
| `pages/collection/ViewCollectedDataPage.tsx` | Mở | 0 | 1 | 0 | 1 | Ô: màu chữ (1) |
| `pages/collection/InnerSidebar.tsx` | Mở | 1 | 0 | 0 | 1 | Nhãn: cỡ 12px (1), màu (1) |
| `pages/collection/ConnectionConfigSection.tsx` | Khóa | 0 | 0 | 0 | 18 |  |
| `pages/collection/LogManagement.tsx` | Mở | 0 | 0 | 0 | 1 |  |
| `pages/collection/SourceSystemManagementPage.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/collection/SourceSystemModal.tsx` | Khóa | 0 | 0 | 0 | 6 |  |
| `pages/collection/AgentManagementPage.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/collection/AgentModal.tsx` | Khóa | 0 | 0 | 0 | 4 |  |
| `pages/collection/UnitManagementPage.tsx` | Chưa có | 0 | 0 | 0 | 3 |  |

## 3. Xử lý & Chuẩn hóa

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `pages/processing/GenericProcessingPage.tsx` | Mở | 27 | 39 | 2 | 8 | Nhãn: màu (27), cỡ 11px (26), uppercase (26), đậm 700 (22) · Ô: màu chữ (39) · Xem: chữ nhỏ/xám |
| `processing/RuleManagementModal.tsx` | Chưa có | 27 | 27 | 0 | 14 | Nhãn: cỡ 12px (27), màu (27), không đặt độ đậm (24) · Ô: chữ 14px (27), màu chữ (27) |
| `processing/APIConnectionForm.tsx` | Chưa có | 23 | 28 | 0 | 23 | Nhãn: cỡ 14px (23), không đặt độ đậm (23), màu (23) · Ô: chữ 14px (28), màu chữ (28) |
| `pages/processing/TargetDatabaseDetailPage.tsx` | Khóa | 0 | 18 | 2 | 7 | Ô: màu chữ (18) · Xem: chữ nhỏ/xám |
| `pages/processing/TargetDatabaseConfigModal.tsx` | Khóa | 8 | 8 | 0 | 6 | Nhãn: cỡ 11px (8), đậm 700 (8), màu (8), uppercase (8) · Ô: màu chữ (8) |
| `pages/processing/ScheduleManagementModal.tsx` | Mở | 5 | 8 | 0 | 1 | Nhãn: màu (5) · Ô: màu chữ (8) |
| `processing/ProcessingConfigManager.tsx` | Chưa có | 5 | 4 | 4 | 2 | Nhãn: không đặt độ đậm (5), màu (5), cỡ 12px (4), cỡ 14px (1) · Ô: màu chữ (4), chữ 14px (3), không đặt cỡ (mặc định 16px) (1) · Xem: chữ nhỏ/xám |
| `pages/processing/MergeSplitModal.tsx` | Khóa | 5 | 7 | 0 | 4 | Nhãn: đậm 700 (5), màu (5), cỡ 12px (4) · Ô: màu chữ (7), chữ 14px (6) |
| `processing/EditRecordModal.tsx` | Chưa có | 6 | 2 | 2 | 2 | Nhãn: cỡ 12px (6), không đặt độ đậm (6), màu (6) · Ô: chữ 14px (2), màu chữ (2) · Xem: chữ nhỏ/xám |
| `processing/ConfigDetailModal.tsx` | Chưa có | 0 | 0 | 7 | 0 | Xem: chữ nhỏ/xám |
| `processing/ErrorListModal.tsx` | Chưa có | 0 | 3 | 2 | 1 | Ô: chữ 14px (3), màu chữ (3) · Xem: chữ nhỏ/xám |
| `pages/processing/DataMappingModal.tsx` | Khóa | 0 | 3 | 1 | 3 | Ô: màu chữ (3) · Xem: chữ nhỏ/xám |
| `processing/WarningDataList.tsx` | Chưa có | 0 | 3 | 1 | 1 | Ô: chữ 14px (3), màu chữ (3) · Xem: chữ nhỏ/xám |
| `pages/processing/ProcessedDataPage.tsx` | Khóa | 0 | 1 | 2 | 1 | Ô: không đặt cỡ (mặc định 16px) (1), màu chữ (1) · Xem: chữ nhỏ/xám |
| `processing/ExecutorManagementModal.tsx` | Chưa có | 0 | 3 | 0 | 3 | Ô: chữ 14px (3), màu chữ (3) |
| `pages/processing/SelectTargetDatabaseModal.tsx` | Khóa | 1 | 0 | 1 | 0 | Nhãn: không đặt cỡ (mặc định 16px) (1), không đặt độ đậm (1), màu (1) · Xem: chữ nhỏ/xám |
| `processing/DataClassificationModal.tsx` | Chưa có | 0 | 2 | 0 | 0 | Ô: chữ 12px (2), màu chữ (2) |
| `pages/processing/TargetDatabaseManagementPage.tsx` | Khóa | 0 | 0 | 1 | 1 | Xem: chữ nhỏ/xám |
| `pages/processing/TargetDatabaseModal.tsx` | Khóa | 0 | 0 | 0 | 7 |  |

## 4. Đối soát dữ liệu

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `pages/orchestration/DataReconciliationAPIPage.tsx` | Khóa | 28 | 18 | 7 | 6 | Nhãn: cỡ 12px (28), không đặt độ đậm (28), màu (28) · Ô: chữ 14px (18), màu chữ (18) · Xem: chữ nhỏ/xám |
| `modals/CreateLGSPReconciliationModal.tsx` | Khóa | 18 | 18 | 0 | 6 | Nhãn: cỡ 14px (18), không đặt độ đậm (18), màu (18) · Ô: chữ 14px (18), màu chữ (18) |
| `pages/ReconciliationSetupPage.tsx` | Khóa | 0 | 5 | 14 | 4 | Ô: chữ 14px (5), màu chữ (5) · Xem: chữ nhỏ/xám |
| `pages/DataReconciliationPage.tsx` | Khóa/Mở | 0 | 2 | 8 | 1 | Ô: chữ 14px (2), màu chữ (2) · Xem: chữ nhỏ/xám |
| `pages/provisioning/modals/ProvisionReconciliationApiModal.tsx` | Mở | 0 | 5 | 0 | 2 | Ô: không đặt cỡ (mặc định 16px) (5), màu chữ (5) |
| `pages/provisioning/modals/ProvisionReconciliationDetailsModal.tsx` | Mở | 0 | 0 | 2 | 0 | Xem: chữ nhỏ/xám |
| `pages/reconciliation/ReconciliationDetailModal.tsx` | Khóa | 0 | 0 | 2 | 0 | Xem: chữ nhỏ/xám |
| `pages/provisioning/DataReconciliationPage.tsx` | Khóa/Mở | 0 | 1 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (1), màu chữ (1) |
| `pages/reconciliation/ReconciliationTemplate.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/reconciliation/ReconciliationServiceSetupTab.tsx` | Mở | 0 | 0 | 0 | 1 |  |
| `pages/reconciliation/ReconciliationLogTab.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/reconciliation/ReconciliationHistoryTab.tsx` | Khóa | 0 | 0 | 0 | 1 |  |

## 5. Danh mục dùng chung

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `pages/CategoryManagementPage.tsx` | Mở | 16 | 22 | 42 | 8 | Nhãn: cỡ 14px (16), không đặt độ đậm (16), màu (16) · Ô: màu chữ (22), không đặt cỡ (mặc định 16px) (12), chữ 14px (10) · Xem: chữ nhỏ/xám |
| `pages/OpenDataCategoryPage.tsx` | Mở | 38 | 23 | 9 | 12 | Nhãn: cỡ 14px (38), không đặt độ đậm (38), màu (38) · Ô: không đặt cỡ (mặc định 16px) (23), màu chữ (23) · Xem: chữ nhỏ/xám |
| `pages/category/CategorySetupPageNew.tsx` | Mở | 24 | 22 | 0 | 10 | Nhãn: không đặt độ đậm (24), màu (24), cỡ 14px (19), cỡ 12px (5) · Ô: chữ 14px (22), màu chữ (22) |
| `pages/new-category/NewCategorySetupPage.tsx` | Chưa có | 6 | 12 | 23 | 2 | Nhãn: cỡ 12px (6), không đặt độ đậm (6), màu (6) · Ô: chữ 14px (12), màu chữ (12) · Xem: chữ nhỏ/xám |
| `pages/open-data-category/OpenDataCategorySetupPage.tsx` | Mở | 6 | 12 | 23 | 2 | Nhãn: cỡ 12px (6), không đặt độ đậm (6), màu (6) · Ô: chữ 14px (12), màu chữ (12) · Xem: chữ nhỏ/xám |
| `pages/category/CategoryStatisticsReportPage.tsx` | Mở | 9 | 10 | 0 | 1 | Nhãn: cỡ 14px (9), màu (9), không đặt độ đậm (5) · Ô: chữ 14px (10), màu chữ (10) |
| `pages/category/components/tabs/VersionHistoryTab.tsx` | Mở/Khóa | 4 | 7 | 5 | 0 | Nhãn: đậm 400 (4), màu (4), uppercase (4) · Ô: màu chữ (7) · Xem: chữ nhỏ/xám |
| `pages/category/CategoryPublishedListPage.tsx` | Mở | 10 | 3 | 0 | 1 | Nhãn: cỡ 14px (10), không đặt độ đậm (10), màu (10) · Ô: chữ 14px (3), màu chữ (3) |
| `pages/category/components/modals/EditCategoryModal.tsx` | Mở | 6 | 6 | 0 | 0 | Nhãn: đậm 700 (6), màu (6) · Ô: màu chữ (6) |
| `pages/open-data-category/OpenDataCategoryPage.tsx` | Mở | 1 | 7 | 2 | 14 | Nhãn: không đặt cỡ (mặc định 16px) (1), không đặt độ đậm (1), màu (1) · Ô: màu chữ (7) · Xem: chữ nhỏ/xám |
| `pages/orchestration/ServiceCategoryPage.tsx` | Khóa | 0 | 3 | 4 | 1 | Ô: chữ 14px (3), màu chữ (3) · Xem: chữ nhỏ/xám |
| `pages/category/components/modals/PublishConfigModal.tsx` | Mở | 5 | 1 | 0 | 0 | Nhãn: màu (5), không đặt cỡ (mặc định 16px) (3), không đặt độ đậm (3), cỡ 14px (2) · Ô: chữ 14px (1), màu chữ (1) |
| `pages/category/components/modals/UnpublishModal.tsx` | Mở | 4 | 1 | 0 | 1 | Nhãn: màu (4), không đặt cỡ (mặc định 16px) (3), không đặt độ đậm (3) · Ô: màu chữ (1) |
| `pages/category/components/modals/PublishModal.tsx` | Mở | 1 | 1 | 2 | 1 | Nhãn: đậm 600 (1), màu (1) · Ô: màu chữ (1) · Xem: chữ nhỏ/xám |
| `pages/category/components/modals/RestoreVersionModal.tsx` | Khóa | 2 | 2 | 0 | 1 | Nhãn: đậm 600 (2), màu (2) · Ô: màu chữ (2) |
| `pages/category/CategoryPage.tsx` | Mở/Khóa | 1 | 0 | 2 | 19 | Nhãn: không đặt cỡ (mặc định 16px) (1), không đặt độ đậm (1), màu (1) · Xem: chữ nhỏ/xám |
| `pages/category/CategorySetupPage.tsx` | Mở | 0 | 0 | 2 | 0 | Xem: chữ nhỏ/xám |
| `pages/category/components/tabs/RelationshipsTab.tsx` | Mở/Khóa | 0 | 0 | 1 | 4 | Xem: chữ nhỏ/xám |
| `pages/category/reports/CategoryReportListPage.tsx` | Mở | 0 | 1 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (1), màu chữ (1) |
| `pages/category/reports/CategoryReportExploitationPage.tsx` | Mở | 0 | 1 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (1), màu chữ (1) |
| `pages/category/reports/CategoryReportStatusPage.tsx` | Mở | 0 | 1 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (1), màu chữ (1) |
| `pages/category/components/tabs/SetupTab.tsx` | Mở | 0 | 0 | 0 | 1 |  |
| `pages/category/components/tabs/AttributesTab.tsx` | Mở | 0 | 0 | 0 | 6 |  |
| `pages/category/components/modals/ApprovalRequestModal.tsx` | Khóa | 0 | 0 | 0 | 2 |  |
| `pages/category/components/tabs/ApprovalTab.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/category/components/modals/CategoryWizardModal.tsx` | Mở | 0 | 0 | 0 | 4 |  |
| `pages/category/components/modals/AttributeFormModal.tsx` | Khóa | 0 | 0 | 0 | 4 |  |
| `pages/category/components/modals/ReviewApprovalModal.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/category/components/modals/SimpleApproveModal.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/category/components/modals/SimpleRejectModal.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/category/components/modals/BulkApproveModal.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `pages/category/components/modals/BulkRejectModal.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `pages/category/components/modals/ExpireRequestModal.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/category/components/modals/ExpireApproveModal.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/category/components/modals/CategoryInfoViewModal.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `pages/category/components/modals/CategoryStructureViewModal.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `pages/category/components/modals/CategoryVersionChangeModal.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `pages/category/CategoryMojUnitsPage.tsx` | Mở | 0 | 0 | 0 | 3 |  |
| `pages/category/components/modals/CreateVersionModal.tsx` | Mở | 0 | 0 | 0 | 2 |  |
| `pages/category/components/modals/RecordFormModal.tsx` | Khóa | 0 | 0 | 0 | 3 |  |
| `pages/category/components/modals/UpdateApprovalModal.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `pages/category/CategoryReportPage.tsx` | Mở | 0 | 0 | 0 | 1 |  |
| `pages/category/reports/CategoryReportVersionPage.tsx` | Mở | 0 | 0 | 0 | 1 |  |
| `pages/open-data-category/components/tabs/FilesTab.tsx` | Khóa | 0 | 0 | 0 | 3 |  |
| `category-group/CategoryGroupSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |

## 6–7. Dữ liệu ngoại / nội bộ (CSDL nghiệp vụ)

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `social-security/SocialSecuritySearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `meritorious/MeritoriousSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `children/ChildrenSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `civil-registry/CivilRegistryInfoSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 2 |  |
| `court-judgment/CourtJudgmentView.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `nationality-acquisition/NationalityInfoSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `civil-judgment/CivilJudgmentInfoSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `security-measures/SecurityMeasuresInfoSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `legal-national/LegalNationalSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `civil-legal-center/CivilLegalCenterInfoSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `civil-legal-info/CivilLegalInfoSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `family-base/FamilyBaseSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `auction/AuctionSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |
| `international/InternationalSearchFilter.tsx` | Chưa có | 0 | 0 | 0 | 1 |  |

## 8. Dữ liệu chủ (Master Data)

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `pages/MasterDataPage.tsx` | Khóa | 23 | 14 | 18 | 10 | Nhãn: cỡ 14px (23), không đặt độ đậm (23), màu (23) · Ô: không đặt cỡ (mặc định 16px) (14), màu chữ (14) · Xem: chữ nhỏ/xám |
| `masterdata/PublishMasterDataModal.tsx` | Chưa có | 7 | 7 | 9 | 3 | Nhãn: cỡ 14px (7), không đặt độ đậm (7), màu (7) · Ô: không đặt cỡ (mặc định 16px) (7), màu chữ (7) · Xem: chữ nhỏ/xám |
| `pages/master-data-list/MasterDataListPage.tsx` | Khóa | 0 | 5 | 10 | 1 | Ô: chữ 14px (5), màu chữ (5) · Xem: chữ nhỏ/xám |
| `pages/master-data/MasterDataWizard.tsx` | Mở | 5 | 0 | 8 | 16 | Nhãn: cỡ 12px (5), không đặt độ đậm (5), màu (5) · Xem: chữ nhỏ/xám |
| `masterdata/RelationshipModal.tsx` | Chưa có | 6 | 6 | 0 | 3 | Nhãn: cỡ 14px (6), không đặt độ đậm (6), màu (6) · Ô: không đặt cỡ (mặc định 16px) (6), màu chữ (6) |
| `pages/master-data/UniqueIdentifierRulesTab.tsx` | Khóa | 0 | 0 | 12 | 4 | Xem: chữ nhỏ/xám |
| `masterdata/MergeRuleModal.tsx` | Chưa có | 5 | 5 | 0 | 3 | Nhãn: cỡ 14px (5), không đặt độ đậm (5), màu (5) · Ô: không đặt cỡ (mặc định 16px) (5), màu chữ (5) |
| `masterdata/UpdateMasterDataModal.tsx` | Chưa có | 3 | 0 | 6 | 0 | Nhãn: cỡ 14px (3), không đặt độ đậm (3), màu (3) · Xem: chữ nhỏ/xám |
| `masterdata/AttributeManagementModal.tsx` | Chưa có | 4 | 4 | 0 | 3 | Nhãn: cỡ 14px (4), không đặt độ đậm (4), màu (4) · Ô: không đặt cỡ (mặc định 16px) (4), màu chữ (4) |
| `masterdata/IdentifierRuleModal.tsx` | Chưa có | 4 | 4 | 0 | 1 | Nhãn: cỡ 14px (4), không đặt độ đậm (4), màu (4) · Ô: không đặt cỡ (mặc định 16px) (4), màu chữ (4) |
| `pages/master-data-list/MasterDataPage.tsx` | Khóa | 0 | 2 | 3 | 1 | Ô: chữ 14px (2), màu chữ (2) · Xem: chữ nhỏ/xám |
| `pages/master-data/EntityRelationshipsTab.tsx` | Khóa | 0 | 0 | 4 | 3 | Xem: chữ nhỏ/xám |
| `pages/master-data/MasterDataUpdateItemPage.tsx` | Mở | 0 | 0 | 3 | 6 | Xem: chữ nhỏ/xám |
| `pages/master-data/MasterDataScaleManagementPage.tsx` | Khóa | 0 | 0 | 0 | 6 |  |
| `pages/master-data/AttributesManagementTab.tsx` | Khóa | 0 | 0 | 0 | 6 |  |
| `pages/master-data/MergeRulesManagementTab.tsx` | Khóa | 0 | 0 | 0 | 2 |  |
| `pages/master-data/ApprovalTab.tsx` | Khóa | 0 | 0 | 0 | 2 |  |
| `pages/master-data/MasterDataReportsPage.tsx` | Mở | 0 | 0 | 0 | 1 |  |

## 9. Cung cấp dữ liệu

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `pages/orchestration/ServiceSetupPageUpdated.tsx` | Mở | 28 | 31 | 17 | 7 | Nhãn: không đặt độ đậm (28), màu (28), cỡ 14px (11), cỡ 12px (10) · Ô: màu chữ (31), chữ 14px (21) · Xem: chữ nhỏ/xám |
| `pages/orchestration/AddProvisionServiceModal.tsx` | Mở | 22 | 34 | 1 | 22 | Nhãn: cỡ 14px (22), màu (22), không đặt độ đậm (13) · Ô: chữ 14px (34), màu chữ (34) · Xem: chữ nhỏ/xám |
| `pages/orchestration/APIManagementPage.tsx` | Khóa | 21 | 3 | 17 | 1 | Nhãn: cỡ 12px (21), không đặt độ đậm (21), màu (21) · Ô: chữ 14px (3), màu chữ (3) · Xem: chữ nhỏ/xám |
| `pages/orchestration/APIFormFields.tsx` | Khóa | 12 | 15 | 0 | 12 | Nhãn: cỡ 14px (12), không đặt độ đậm (12), màu (12) · Ô: chữ 14px (15), màu chữ (15) |
| `pages/provision/DataProvisionSharedPage.tsx` | Khóa | 15 | 4 | 6 | 2 | Nhãn: cỡ 14px (15), không đặt độ đậm (15), màu (15) · Ô: chữ 14px (4), màu chữ (4) · Xem: chữ nhỏ/xám |
| `pages/provision/DataProvisionInternalPage.tsx` | Khóa | 8 | 2 | 5 | 1 | Nhãn: cỡ 14px (8), không đặt độ đậm (8), màu (8) · Ô: chữ 14px (2), màu chữ (2) · Xem: chữ nhỏ/xám |
| `pages/provisioning/modals/ProvisionServiceModal.tsx` | Mở | 0 | 15 | 0 | 7 | Ô: màu chữ (15), không đặt cỡ (mặc định 16px) (14) |
| `pages/orchestration/APITestModal.tsx` | Khóa | 4 | 7 | 2 | 6 | Nhãn: cỡ 12px (4), không đặt độ đậm (4), màu (4) · Ô: chữ 14px (7), màu chữ (7) · Xem: chữ nhỏ/xám |
| `pages/provisioning/modals/ProvisionRequestExportModal.tsx` | Mở | 0 | 13 | 0 | 3 | Ô: màu chữ (13), không đặt cỡ (mặc định 16px) (12) |
| `pages/provisioning/modals/ProvisionApiModal.tsx` | Mở | 0 | 9 | 0 | 8 | Ô: không đặt cỡ (mặc định 16px) (9), màu chữ (9) |
| `pages/provision/DataProvisionDldcAPage.tsx` | Khóa | 0 | 2 | 6 | 2 | Ô: chữ 14px (2), màu chữ (2) · Xem: chữ nhỏ/xám |
| `pages/provisioning/DataProvisionServiceSetupPage.tsx` | Mở | 0 | 8 | 0 | 2 | Ô: không đặt cỡ (mặc định 16px) (8), màu chữ (8) |
| `pages/provisioning/modals/ProvisionDataRequestModal.tsx` | Mở | 2 | 6 | 0 | 3 | Nhãn: màu (2), không đặt cỡ (mặc định 16px) (1), không đặt độ đậm (1) · Ô: không đặt cỡ (mặc định 16px) (6), màu chữ (6) |
| `pages/provisioning/DataProvisionApiManagementPage.tsx` | Mở | 0 | 7 | 0 | 2 | Ô: không đặt cỡ (mặc định 16px) (7), màu chữ (7) |
| `pages/orchestration/MonitoringPage.tsx` | Mở/Khóa | 0 | 2 | 4 | 1 | Ô: chữ 14px (2), màu chữ (2) · Xem: chữ nhỏ/xám |
| `pages/provisioning/modals/ProvisionAccessControlModal.tsx` | Mở | 0 | 4 | 1 | 2 | Ô: không đặt cỡ (mặc định 16px) (4), màu chữ (4) · Xem: chữ nhỏ/xám |
| `pages/provisioning/DataProvisionMonitoringPage.tsx` | Mở | 1 | 3 | 0 | 0 | Nhãn: không đặt độ đậm (1), màu (1) · Ô: không đặt cỡ (mặc định 16px) (3), màu chữ (3) |
| `pages/provisioning/modals/ProvisionAccountModal.tsx` | Chưa có | 0 | 3 | 0 | 2 | Ô: không đặt cỡ (mặc định 16px) (3), màu chữ (3) |
| `pages/provisioning/modals/ProvisionRequestHandoverModal.tsx` | Mở | 1 | 2 | 0 | 2 | Nhãn: không đặt cỡ (mặc định 16px) (1), không đặt độ đậm (1), màu (1) · Ô: không đặt cỡ (mặc định 16px) (2), màu chữ (2) |
| `pages/orchestration/ApprovalReviewModal.tsx` | Khóa | 1 | 1 | 0 | 0 | Nhãn: cỡ 14px (1), đậm 600 (1), màu (1) · Ô: chữ 14px (1), màu chữ (1) |
| `pages/provision/DataProvisionCatalogAPage.tsx` | Khóa | 0 | 2 | 0 | 2 | Ô: chữ 14px (2), màu chữ (2) |
| `pages/provisioning/modals/ProvisionServiceApprovalModal.tsx` | Mở | 0 | 2 | 0 | 2 | Ô: không đặt cỡ (mặc định 16px) (2), màu chữ (2) |
| `pages/provisioning/modals/SubmitApprovalModal.tsx` | Mở | 0 | 2 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (2), màu chữ (2) |
| `pages/provisioning/DataProvisionRequestPage.tsx` | Mở | 0 | 2 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (2), màu chữ (2) |
| `pages/provisioning/modals/ProvisionExportReportModal.tsx` | Mở | 0 | 2 | 0 | 0 | Ô: không đặt cỡ (mặc định 16px) (2), màu chữ (2) |
| `pages/provisioning/modals/SharedFieldsConfigModal.tsx` | Mở | 0 | 2 | 0 | 0 | Ô: không đặt cỡ (mặc định 16px) (2), màu chữ (2) |
| `pages/provision/DataProvisionCatalogBPage.tsx` | Khóa | 0 | 1 | 0 | 1 | Ô: chữ 14px (1), màu chữ (1) |
| `pages/provision/DataProvisionCatalogCPage.tsx` | Khóa | 0 | 1 | 0 | 1 | Ô: chữ 14px (1), màu chữ (1) |
| `pages/provisioning/modals/ApiVersionCompareModal.tsx` | Mở | 0 | 0 | 1 | 0 | Xem: chữ nhỏ/xám |
| `pages/provisioning/tabs/AuditLogsTab.tsx` | Mở | 0 | 1 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (1), màu chữ (1) |
| `pages/provisioning/DataProvisionServicesPage.tsx` | Mở | 0 | 1 | 0 | 1 | Ô: không đặt cỡ (mặc định 16px) (1), màu chữ (1) |
| `pages/provisioning/modals/ProvisionServicePublishModal.tsx` | Mở | 0 | 0 | 0 | 1 |  |
| `pages/provisioning/modals/ProvisionRequestApprovalModal.tsx` | Mở | 0 | 0 | 0 | 1 |  |
| `pages/provisioning/modals/ProvisionServiceUnpublishModal.tsx` | Mở | 0 | 0 | 0 | 1 |  |

## 10. Dữ liệu mở

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `pages/open-data/OpenDataPublishPage.tsx` | Khóa | 9 | 1 | 4 | 0 | Nhãn: cỡ 12px (9), không đặt độ đậm (9), màu (9) · Ô: chữ 14px (1), màu chữ (1) · Xem: chữ nhỏ/xám |
| `pages/open-data/OpenDataPublishedListPage.tsx` | Khóa | 3 | 0 | 2 | 12 | Nhãn: không đặt độ đậm (3) · Xem: chữ nhỏ/xám |
| `pages/open-data/OpenDataPublicPortal.tsx` | Khóa | 0 | 2 | 0 | 1 | Ô: màu chữ (2), không đặt cỡ (mặc định 16px) (1), chữ 14px (1) |
| `pages/open-data/OpenDataSetupPage.tsx` | Mở | 1 | 0 | 0 | 16 | Nhãn: không đặt cỡ (mặc định 16px) (1), không đặt độ đậm (1), màu (1) |
| `pages/open-data-report/OpenDataReportPage.tsx` | Khóa | 0 | 0 | 0 | 1 |  |

## 11. Quản trị hệ thống

| File | Trạng thái | Nhãn sai | Ô nhập sai (chữ) | Tên trường Xem chi tiết sai | Placeholder chưa #94A3B8 | Lỗi chính |
|---|---|---|---|---|---|---|
| `user/ImportExcelModal.tsx` | Chưa có | 7 | 7 | 0 | 0 | Nhãn: cỡ 14px (7), không đặt độ đậm (7), màu (7) · Ô: không đặt cỡ (mặc định 16px) (7), màu chữ (7) |
| `user/ResetPasswordModal.tsx` | Mở | 1 | 1 | 3 | 0 | Nhãn: cỡ 14px (1), không đặt độ đậm (1), màu (1) · Ô: chữ 14px (1), màu chữ (1) · Xem: chữ nhỏ/xám |
| `pages/admin/RoleManagementPage.tsx` | Khóa | 0 | 0 | 4 | 5 | Xem: chữ nhỏ/xám |
| `pages/admin/GroupManagementPage.tsx` | Khóa | 0 | 0 | 3 | 8 | Xem: chữ nhỏ/xám |
| `pages/admin/SecurityConfigPage.tsx` | Khóa | 0 | 0 | 1 | 0 | Xem: chữ nhỏ/xám |
| `pages/admin/StatisticsPage.tsx` | Mở/Khóa | 0 | 0 | 1 | 0 | Xem: chữ nhỏ/xám |
| `pages/admin/SystemNotificationManagementPage.tsx` | Chưa có | 0 | 0 | 0 | 3 |  |
| `pages/admin/UserManagementPage.tsx` | Khóa | 0 | 0 | 0 | 6 |  |
| `pages/admin/FunctionManagementPage.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/admin/AccessLogPage.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/admin/LoginLogPage.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/admin/ErrorLogPage.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/admin/AccountManagementLogPage.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/admin/ConfigChangeLogPage.tsx` | Khóa | 0 | 0 | 0 | 1 |  |
| `pages/admin/LogRetentionConfigPage.tsx` | Khóa | 0 | 0 | 0 | 4 |  |

## Tổng

241 file · 892 nhãn · 991 ô nhập (chữ) · 428 tên trường Xem chi tiết · 713 placeholder.
