# Script thay thế "Bộ Tư pháp"

## Danh sách file cần xử lý:

### 1. Collection files (8 files)
- ✅ /components/collection/APIMethodsList.tsx - Thay thành "Thu thập trong nội bộ" và "Hệ thống trong nội bộ"
- ✅ /components/collection/AddDataCollectionForm.tsx - Thay "Các cơ quan bên ngoài Bộ Tư pháp" → "Các cơ quan bên ngoài" và "Hệ thống trong Bộ Tư pháp" → "Hệ thống trong nội bộ"
- ✅ /components/collection/EditDataCollectionForm.tsx - Thay "Thu thập từ các Hệ thống trong nội bộ Bộ Tư pháp" → "Thu thập từ các Hệ thống trong nội bộ"
- ✅ /components/collection/NotificationManagement.tsx - Thay "Kho DLDC - Bộ Tư pháp" → "Kho DLDC"
- ✅ /components/collection/ViewDataCollectionDetail.tsx - Thay "bên ngoài Bộ Tư pháp" → "bên ngoài" và "nội bộ Bộ Tư pháp" → "nội bộ"

### 2. Page files (10+ files)
- ✅ /components/pages/CategoryManagementPage.tsx - Thay "Bộ Tư pháp" trong managingUnit và options thành "Đơn vị A/B/C"
- ✅ /components/pages/OpenDataCategoryPage.tsx - Thay "Bộ trưởng Bộ Tư pháp" → "" (xóa cụm từ này trong mô tả)
- ✅ /components/pages/DataCleaningManagementPage.tsx - Thay "các đơn vị thuộc Bộ Tư pháp" → "các đơn vị trong nội bộ"
- ✅ /components/pages/DataCoordinationPage.tsx - Thay "các đơn vị thuộc Bộ Tư pháp" → "các đơn vị" và xóa "của Bộ trưởng Bộ Tư pháp"
- ✅ /components/pages/DataSharingPage.tsx - Thay "Các đơn vị thuộc Bộ Tư pháp" → "Các đơn vị trong nội bộ"

### 3. Internal pages (3 files)
- ✅ /components/pages/internal/LegalDocumentSystemPage.tsx - Xóa "Bộ Tư pháp" trong option và data
- ✅ /components/pages/internal/MojDocPage.tsx - Thay "Văn bản Bộ Tư pháp" → "Văn bản chuyên ngành"
- ✅ /components/pages/collection/InternalDataPage.tsx - Thay "thuộc Bộ Tư pháp" → "trong nội bộ"

### 4. External pages (1 file)
- ✅ /components/pages/external/AgencyCategoryPage.tsx - Xóa dòng "Bộ Tư pháp" trong mockData

### 5. Layout & Common (3 files)
- ✅ /components/layout/MainLayout.tsx - Thay "Tài liệu Bộ Tư pháp" → "Tài liệu chuyên ngành"
- ✅ /components/pages/UserGuidePage.tsx - Thay "của Bộ Tư pháp" → "" và "Bộ Tư pháp" → "cơ quan chủ quản"
- ✅ /components/category/SetupCategoryList.tsx - Đã xử lý

### 6. Processing files (3 files)
- ✅ /components/processing/DataSourceTypeSelector.tsx - Thay "Các đơn vị thuộc Bộ Tư pháp" → "Các đơn vị trong nội bộ"
- ✅ /components/processing/EditDataClassificationModal.tsx - Thay "các quy định của Bộ Tư pháp" → "các quy định hiện hành"
- ✅ /components/processing/RuleTemplateManager.tsx - Thay "các đơn vị thuộc Bộ Tư pháp" → "các đơn vị trong nội bộ"

### 7. User files (1 file)
- ✅ /components/user/UserProfileModal.tsx - Thay "Bộ Tư pháp" → "Đơn vị A"
