# BẢNG THEO DÕI TRẠNG THÁI MÃ NGUỒN (STATUS TRACKER)

**Hướng dẫn:** 
- Đánh dấu `[x]` vào chức năng nào bạn muốn **CHỌN SỬA HÔM NAY (WIP)**. 
- Những chức năng để trống `[ ]` sẽ tự động được coi là **ĐÃ CHỐT (LOCKED 🔒)**. Tôi (AI) sẽ tuyệt đối không chỉnh sửa code, layout hay logic của các chức năng bị khóa để đảm bảo an toàn cho phiên bản giao Dev.

---

## 1. PHÂN HỆ ĐĂNG NHẬP & CORE

- `[ ]` Màn hình Đăng nhập (`pages/LoginPage.tsx`)
- `[x]` Cấu trúc Menu & Điều hướng chính (`admin/menuStructure.ts`)

---

## 2. PHÂN HỆ THU THẬP DỮ LIỆU

### Trang chính
- `[ ]` Dashboard thu thập dữ liệu nội bộ (`collection/InternalDataPage.tsx`)
- `[ ]` Dashboard thu thập dữ liệu ngoại (`collection/ExternalDataPage.tsx`)
- `[ ]` Danh sách thiết lập dịch vụ thu thập (`collection/CollectionSetupPage.tsx`)
- `[ ]` Xem dữ liệu đã thu thập (`collection/ViewCollectedDataPage.tsx`)
- `[ ]` Chi tiết dịch vụ — trang riêng (`collection/ServiceDataDetailPage.tsx`)
- `[ ]` Quản lý nhật ký thu thập (`collection/LogManagement.tsx`)

### Modals dịch vụ thu thập (`collection/ServiceModals.tsx`)
- `[ ]` Modal Thêm mới dịch vụ thu thập (`AddServiceModal`)
- `[ ]` Modal Chỉnh sửa dịch vụ thu thập (`EditServiceModal`)
- `[ ]` Modal Xóa dịch vụ (`DeleteServiceModal`)
- `[ ]` Modal Cài đặt nâng cao dịch vụ (`SettingsServiceModal`)

### Modal xem chi tiết dịch vụ (`collection/ViewServiceModal.tsx`)
- `[ ]` Tab Thông tin chung
- `[ ]` Tab Cấu hình kết nối
- `[ ]` Tab Cấu trúc (Mapping)
- `[ ]` Tab Cấu hình thu thập
- `[ ]` Tab Lịch sử hoạt động

### Quản lý hệ thống nguồn
- `[ ]` Trang quản lý hệ thống nguồn (`collection/SourceSystemManagementPage.tsx`)
- `[ ]` Modal Thêm/Sửa hệ thống nguồn (`collection/SourceSystemModal.tsx`)
- `[ ]` Modal Xem chi tiết hệ thống nguồn (`collection/SourceSystemDetailModal.tsx`)
- `[ ]` Modal Xác nhận xóa hệ thống nguồn (`collection/SourceSystemDeleteConfirmModal.tsx`)

### Quản lý Agent
- `[ ]` Trang quản lý Agent thu thập (`collection/AgentManagementPage.tsx`)
- `[ ]` Modal Thêm/Sửa Agent (`collection/AgentModal.tsx`)
- `[ ]` Modal Xem chi tiết Agent (`collection/AgentDetailModal.tsx`)
- `[ ]` Modal Xác nhận xóa Agent (`collection/AgentDeleteConfirmModal.tsx`)

### Components dùng chung trong thu thập
- `[ ]` Cấu hình kết nối (`collection/ConnectionConfigSection.tsx`)
- `[ ]` Cấu hình thu thập dữ liệu (`collection/DataCollectionConfigSection.tsx`)
- `[ ]` Nạp cấu trúc (`collection/StructureLoadingConfig.tsx`)
- `[ ]` Mapping dữ liệu nâng cao (`collection/AdvancedDataMapping.tsx`)
- `[ ]` Modal xem chi tiết dịch vụ (`collection/ServiceDetailModal.tsx`)
- `[ ]` Modal xem dịch vụ (`collection/ViewServiceModal.tsx`)
- `[ ]` Template trang CSDL (`collection/DatabasePageTemplate.tsx`)
- `[ ]` Sidebar phụ (`collection/InnerSidebar.tsx`)

---

## 3. PHÂN HỆ XỬ LÝ & CHUẨN HÓA DỮ LIỆU

### Quản lý quy tắc & CSDL đích
- `[ ]` Thiết lập quy tắc xử lý (`processing/ProcessingRuleSetupPage.tsx`)
- `[ ]` Quản lý cơ sở dữ liệu đích (`processing/TargetDatabaseManagementPage.tsx`)
- `[ ]` Chi tiết cơ sở dữ liệu đích (`processing/TargetDatabaseDetailPage.tsx`)
- `[ ]` Modal cấu hình CSDL đích (`processing/TargetDatabaseConfigModal.tsx`)
- `[ ]` Modal chi tiết CSDL đích (`processing/TargetDatabaseDetailModal.tsx`)
- `[ ]` Modal thêm/sửa CSDL đích (`processing/TargetDatabaseModal.tsx`)
- `[ ]` Modal chọn CSDL đích (`processing/SelectTargetDatabaseModal.tsx`)
- `[ ]` Xem dữ liệu đã xử lý (`processing/ProcessedDataPage.tsx`)
- `[ ]` Modal Mapping dữ liệu (`processing/DataMappingModal.tsx`)
- `[ ]` Modal gộp/tách bản ghi (`processing/MergeSplitModal.tsx`)
- `[ ]` Quản lý lịch xử lý (`processing/ScheduleManagementModal.tsx`)

### Trang xử lý từng lĩnh vực nghiệp vụ
- `[ ]` Xử lý chung (template) (`processing/GenericProcessingPage.tsx`)
- `[ ]` Xử lý Hộ tịch (`processing/ProcessingCivilRegistryPage.tsx`)
- `[ ]` Xử lý Đăng ký Quốc tịch (`processing/ProcessingNationalityPage.tsx`)
- `[ ]` Xử lý Luật sư (`processing/ProcessingLawyerPage.tsx`)
- `[ ]` Xử lý Công chứng (`processing/ProcessingNotaryPage.tsx`)
- `[ ]` Xử lý Đấu giá (`processing/ProcessingAuctionPage.tsx`)
- `[ ]` Xử lý Thi hành án (`processing/ProcessingEnforcementPage.tsx`)
- `[ ]` Xử lý An toàn tư pháp (`processing/ProcessingSecurityPage.tsx`) + CSDL (`processing/ProcessingSecurityDbPage.tsx`)
- `[ ]` Xử lý Trợ giúp pháp lý (`processing/ProcessingLegalAidPage.tsx`) + Thông tin (`processing/ProcessingLegalAidInfoPage.tsx`)
- `[ ]` Xử lý Phổ biến GDPL (`processing/ProcessingLegalEducationPage.tsx`)
- `[ ]` Xử lý Bồi thường nhà nước (`processing/ProcessingCompensationPage.tsx`)
- `[ ]` Xử lý Hợp tác quốc tế (`processing/ProcessingCooperationPage.tsx`) + CSDL (`processing/ProcessingCooperationDbPage.tsx`) + Bộ (`processing/ProcessingCooperationDeptPage.tsx`)
- `[ ]` Xử lý Tương trợ tư pháp (`processing/ProcessingJudicialAssistancePage.tsx`) + Hỗ trợ (`processing/ProcessingJudicialSupportPage.tsx`)
- `[ ]` Xử lý Hành chính tư pháp (`processing/ProcessingAdminJusticePage.tsx`)
- `[ ]` Xử lý Hộ kinh doanh (`processing/ProcessingBusinessHouseholdPage.tsx`)
- `[ ]` Xử lý Doanh nghiệp (`processing/ProcessingEnterprisePage.tsx`)
- `[ ]` Xử lý Giám định tư pháp (`processing/ProcessingForensicPage.tsx`)
- `[ ]` Xử lý Pháp luật quốc gia (`processing/ProcessingNationalLawPage.tsx`)
- `[ ]` Xử lý Phán quyết (`processing/ProcessingJudgmentPage.tsx`) + CSDL (`processing/ProcessingJudgmentDbPage.tsx`)
- `[ ]` Xử lý Thanh tra (`processing/ProcessingInspectionPage.tsx`)

---

## 4. PHÂN HỆ ĐỐI SOÁT DỮ LIỆU

### Trang chính
- `[ ]` Trang đối soát tổng hợp — theo dõi lệch từ nguồn → thu thập → xử lý → cung cấp (`pages/DataReconciliationPage.tsx`)
- `[ ]` Trang thiết lập đối soát tổng (`pages/ReconciliationSetupPage.tsx`)

### Đối soát theo loại dữ liệu
- `[ ]` Template đối soát (dùng chung cho các trang đối soát) (`reconciliation/ReconciliationTemplate.tsx`)
- `[ ]` Đối soát dữ liệu nội bộ (`reconciliation/InternalReconciliationPage.tsx`)
- `[ ]` Đối soát danh mục bên ngoài (`reconciliation/ExternalCategoriesReconciliationPage.tsx`)
- `[ ]` Đối soát bản án / quyết định TAND (`reconciliation/ExternalCourtJudgmentReconciliationPage.tsx`)

### Tabs trong trang thiết lập đối soát
- `[ ]` Tab Thiết lập dịch vụ đối soát (`reconciliation/ReconciliationServiceSetupTab.tsx`)
- `[ ]` Tab Lịch sử đối soát (`reconciliation/ReconciliationHistoryTab.tsx`)
- `[ ]` Tab Nhật ký đối soát (`reconciliation/ReconciliationLogTab.tsx`)

### Modals đối soát
- `[ ]` Modal chi tiết bản ghi đối soát (`reconciliation/ReconciliationDetailModal.tsx`)
- `[ ]` Modal tiến trình đồng bộ thủ công (`reconciliation/ManualSyncProgressModal.tsx`)
- `[ ]` Modal thêm / sửa cấu hình dịch vụ (`reconciliation/AddServiceConfigModal.tsx`)
- `[ ]` Modal xác nhận xóa cấu hình (`reconciliation/DeleteConfirmModal.tsx`)
- `[ ]` Modal chi tiết lỗi đối soát (`reconciliation/ErrorDetailsModal.tsx`)
- `[ ]` Modal tạo gói đối soát LGSP (`modals/CreateLGSPReconciliationModal.tsx`)

### Đối soát điều phối (Orchestration)
- `[ ]` Quản lý API đối soát — điều phối dữ liệu qua LGSP/NGSP (`orchestration/DataReconciliationAPIPage.tsx`)

---

## 5. PHÂN HỆ DANH MỤC DÙNG CHUNG (DANH MỤC BTP)

### Trang chính
- `[x]` Dashboard danh mục (`category/CategoryDashboardPage.tsx`)
- `[x]` Trang danh mục tổng hợp (toàn bộ nghiệp vụ) (`category/CategoryPage.tsx`)
- `[x]` Phê duyệt danh mục (`category/CategoryApprovalPage.tsx`)
- `[x]` Thiết lập danh mục (`category/CategorySetupPage.tsx`)
- `[x]` Thiết lập danh mục (phiên bản mới) (`category/CategorySetupPageNew.tsx`)
- `[x]` Đơn vị Bộ Tư pháp (`category/CategoryMojUnitsPage.tsx`)
- `[x]` Công bố danh mục (`category/CategoryPublishPage.tsx`)
- `[x]` Danh sách đã công bố (`category/CategoryPublishedListPage.tsx`)
- `[x]` Báo cáo danh mục (`category/CategoryReportPage.tsx`)
- `[x]` Thống kê danh mục (`category/CategoryStatisticsPage.tsx`)
- `[x]` Báo cáo thống kê tổng hợp (`category/CategoryStatisticsReportPage.tsx`)

### Sub-tabs trong trang danh mục
- `[x]` Tab Phê duyệt (`category/components/tabs/ApprovalTab.tsx`)
- `[x]` Tab Thuộc tính (`category/components/tabs/AttributesTab.tsx`)
- `[x]` Tab Quan hệ thực thể (`category/components/tabs/RelationshipsTab.tsx`)
- `[x]` Tab Thiết lập (`category/components/tabs/SetupTab.tsx`)
- `[x]` Tab Lịch sử phiên bản (`category/components/tabs/VersionHistoryTab.tsx`)

### Modals danh mục
- `[x]` Modal Wizard tạo danh mục mới (`category/components/modals/CategoryWizardModal.tsx`)
- `[x]` Modal Chỉnh sửa danh mục (`category/components/modals/EditCategoryModal.tsx`)
- `[x]` Modal Xác nhận xóa (`category/components/modals/DeleteConfirmModal.tsx`)
- `[x]` Modal Gửi phê duyệt (`category/components/modals/ApprovalRequestModal.tsx`)
- `[x]` Modal Review phê duyệt (`category/components/modals/ReviewApprovalModal.tsx`)
- `[x]` Modal Phê duyệt đơn giản (`category/components/modals/SimpleApproveModal.tsx`)
- `[x]` Modal Từ chối đơn giản (`category/components/modals/SimpleRejectModal.tsx`)
- `[x]` Modal Gửi yêu cầu hết hạn (`category/components/modals/ExpireRequestModal.tsx`)
- `[x]` Modal Phê duyệt hết hạn (`category/components/modals/ExpireApproveModal.tsx`)
- `[x]` Modal Công bố (`category/components/modals/PublishModal.tsx`)
- `[x]` Modal Cấu hình công bố (`category/components/modals/PublishConfigModal.tsx`)
- `[x]` Modal Hủy công bố (`category/components/modals/UnpublishModal.tsx`)
- `[x]` Modal Tạo phiên bản mới (`category/components/modals/CreateVersionModal.tsx`)
- `[x]` Modal Khôi phục phiên bản (`category/components/modals/RestoreVersionModal.tsx`)
- `[x]` Modal Lưu trữ bản ghi (`category/components/modals/ArchiveRecordModal.tsx`)
- `[x]` Modal Form thuộc tính (`category/components/modals/AttributeFormModal.tsx`)
- `[x]` Modal Form bản ghi (`category/components/modals/RecordFormModal.tsx`)
- `[x]` Modal Xóa đơn vị BTP (`category/components/modals/MojUnitDeleteConfirmModal.tsx`)

### Báo cáo danh mục
- `[x]` Báo cáo danh sách (`category/reports/CategoryReportListPage.tsx`)
- `[x]` Báo cáo trạng thái (`category/reports/CategoryReportStatusPage.tsx`)
- `[x]` Báo cáo khai thác (`category/reports/CategoryReportExploitationPage.tsx`)
- `[x]` Báo cáo phiên bản (`category/reports/CategoryReportVersionPage.tsx`)

---

## 6. PHÂN HỆ DỮ LIỆU NGOẠI (CƠ QUAN NGOÀI BỘ)

- `[ ]` Hộ tịch & Dân chính (`external/CivilRegistryDatabasePage.tsx`)
- `[ ]` Nhóm đối tượng chính sách xã hội (`external/SocialSecurityGroupPage.tsx`)
- `[ ]` Nhóm người có công (`external/MeritoriousGroupPage.tsx`)
- `[ ]` Nhóm trẻ em (`external/ChildrenGroupPage.tsx`)
- `[ ]` Nhóm danh mục (`external/CategoryGroupPage.tsx`)
- `[ ]` Phán quyết tòa án (`external/CourtJudgmentPage.tsx`)
- `[ ]` Người khuyết tật (`external/DisabledPersonPage.tsx`)
- `[ ]` Người cao tuổi (`external/ElderlyPersonPage.tsx`)
- `[ ]` Người nhiễm HIV (`external/HIVPersonPage.tsx`)
- `[ ]` Liệt sĩ (`external/MartyrRecordPage.tsx`)
- `[ ]` Người có công (`external/MeritoriousPersonPage.tsx`)
- `[ ]` Thân nhân người có công (`external/MeritoriousRelativePage.tsx`)
- `[ ]` Hộ nghèo (`external/PovertyInfoPage.tsx`)
- `[ ]` Trợ cấp xã hội (`external/SocialAssistancePage.tsx`)
- `[ ]` Đơn thân (`external/SinglePersonPage.tsx`)
- `[ ]` Trẻ em được bảo vệ (`external/ChildrenSocialProtectionPage.tsx`)
- `[ ]` Thông tin trẻ em (`external/ChildrenInfoPage.tsx`)
- `[ ]` Giấy tờ tùy thân (`external/IdentityDocumentPage.tsx`)
- `[ ]` Đơn vị hành chính (`external/AdministrativeUnitPage.tsx`)
- `[ ]` Danh mục cơ quan (`external/AgencyCategoryPage.tsx`)
- `[ ]` Dân tộc (`external/EthnicCategoryPage.tsx`)
- `[ ]` Giới tính (`external/GenderCategoryPage.tsx`)
- `[ ]` Tôn giáo (`external/ReligionCategoryPage.tsx`)
- `[ ]` Quan hệ gia đình (`external/FamilyRelationshipPage.tsx`)
- `[ ]` Quốc tịch / Quốc gia (`external/CountryNationalityPage.tsx`)

---

## 7. PHÂN HỆ DỮ LIỆU NGHIỆP VỤ NỘI BỘ BTP

- `[ ]` Luật sư & Trung tâm tư vấn pháp lý (`internal/LegalCenterPage.tsx`)
- `[ ]` Hộ tịch nội bộ (`internal/CivilRegistryPage.tsx`)
- `[ ]` Công chứng (`internal/NotarySystemPage.tsx`)
- `[ ]` Hợp đồng công chứng (`internal/NotaryContractPage.tsx`)
- `[ ]` Văn bản công chứng (`internal/NotaryDocumentPage.tsx`)
- `[ ]` Đấu giá tài sản (`internal/AuctionPage.tsx`)
- `[ ]` Biện pháp bảo đảm thi hành án (`internal/SecurityMeasuresPage.tsx`)
- `[ ]` Trợ giúp pháp lý (`internal/LegalAidSystemPage.tsx`)
- `[ ]` Vụ việc trợ giúp pháp lý (`internal/LegalAidCasePage.tsx`)
- `[ ]` Người được trợ giúp pháp lý (`internal/LegalAidPersonPage.tsx`)
- `[ ]` Quốc tịch (`internal/NationalitySystemPage.tsx`)
- `[ ]` Hợp tác quốc tế (`internal/InternationalPage.tsx`)
- `[ ]` Pháp luật quốc gia (`internal/LegalNationalPage.tsx`)
- `[ ]` Hệ thống văn bản pháp luật (`internal/LegalDocumentSystemPage.tsx`)
- `[ ]` Văn bản pháp luật BTP (`internal/MojDocPage.tsx`)
- `[ ]` Văn bản Quốc hội (`internal/NationalAssemblyDocPage.tsx`)
- `[ ]` Văn bản Nhà nước (`internal/GovernmentDocPage.tsx`)
- `[ ]` Thống kê chuyên ngành (`internal/StatisticsCollectionPage.tsx`)
- `[ ]` Phán quyết dân sự (`internal/CivilJudgmentPage.tsx`)
- `[ ]` Thông tin pháp lý dân sự (`internal/CivilLegalInfoPage.tsx`)
- `[ ]` Trung tâm pháp lý dân sự (`internal/CivilLegalCenterPage.tsx`)
- `[ ]` Đăng ký kinh doanh (`internal/BusinessRegistryPage.tsx`)
- `[ ]` Đăng ký thành lập (`internal/BusinessRegistrationPage.tsx`)
- `[ ]` Thông tin doanh nghiệp (`internal/BusinessInfoPage.tsx`)
- `[ ]` Hồ sơ gia đình (`internal/FamilyBasePage.tsx`)
- `[ ]` Quản lý vụ án (`internal/CaseManagementPage.tsx`)
- `[ ]` Bồi thường nhà nước (`internal/StateCompensationPage.tsx`)
- `[ ]` Giấy khai sinh (`internal/BirthCertificatePage.tsx`)
- `[ ]` Giấy đăng ký kết hôn (`internal/MarriageCertificatePage.tsx`)
- `[ ]` Giấy ly hôn (`internal/DivorceCertificatePage.tsx`)
- `[ ]` Giấy khai tử (`internal/DeathCertificatePage.tsx`)
- `[ ]` Giấy nhận nuôi con nuôi (`internal/AdoptionCertificatePage.tsx`)
- `[ ]` Giấy giám hộ (`internal/GuardianshipCertificatePage.tsx`)

---

## 8. PHÂN HỆ DỮ LIỆU CHỦ (MASTER DATA)

### Trang chính
- `[x]` Quản lý Master Data tổng (`master-data/MasterDataManagementPage.tsx`)
- `[x]` Trang Master Data chính (`master-data/MasterDataAPage.tsx`)
- `[x]` Thiết lập Master Data (`master-data/MasterDataSetupPage.tsx`)
- `[x]` Phê duyệt Master Data (`master-data/MasterDataApprovalPage.tsx`)
- `[x]` Công bố Master Data (`master-data/MasterDataPublishPage.tsx`)
- `[x]` Báo cáo Master Data (`master-data/MasterDataReportsPage.tsx`)
- `[x]` Quản lý quy mô / tỉ lệ (`master-data/MasterDataScaleManagementPage.tsx`)
- `[x]` Wizard tạo Master Data (`master-data/MasterDataWizard.tsx`)
- `[x]` Trang cập nhật Master Data (`master-data/MasterDataUpdatePage.tsx`)

### Tabs trong trang Master Data
- `[x]` Tab Quản lý thuộc tính (`master-data/AttributesManagementTab.tsx`)
- `[x]` Tab Quan hệ thực thể (`master-data/EntityRelationshipsTab.tsx`)
- `[x]` Tab Quy tắc gộp (`master-data/MergeRulesManagementTab.tsx`)
- `[x]` Tab Quy tắc định danh (`master-data/UniqueIdentifierRulesTab.tsx`)
- `[x]` Tab Lịch sử thay đổi (`master-data/HistoryTab.tsx`)
- `[x]` Tab Cập nhật dữ liệu (`master-data/MasterDataUpdateTab.tsx`)
- `[x]` Tab Review cập nhật (`master-data/MasterDataUpdateReviewTab.tsx`)
- `[x]` Tab Phê duyệt (`master-data/ApprovalTab.tsx`)

### Danh sách Master Data (theo lĩnh vực)
- `[x]` Trang danh sách tổng hợp (`master-data-list/MasterDataListPage.tsx`)
- `[x]` Trang Master Data tổng (`master-data-list/MasterDataPage.tsx`)
- `[x]` Master Data A–J (`master-data-list/MasterDataAPage.tsx` đến `MasterDataJPage.tsx`)

---

## 9. PHÂN HỆ CUNG CẤP DỮ LIỆU (DATA PROVISION)

### Trang chính
- `[ ]` Dashboard Cung cấp dữ liệu (`provisioning/DataProvisionDashboard.tsx`)
- `[ ]` Quản lý API cung cấp dữ liệu (`provisioning/DataProvisionApiManagementPage.tsx`)
- `[ ]` Thiết lập dịch vụ cung cấp (`provisioning/DataProvisionServiceSetupPage.tsx`)
- `[ ]` Danh sách dịch vụ cung cấp (`provisioning/DataProvisionServicesPage.tsx`)
- `[ ]` Giám sát cung cấp dữ liệu (`provisioning/DataProvisionMonitoringPage.tsx`)
- `[ ]` Yêu cầu sử dụng dữ liệu (`provisioning/DataProvisionRequestPage.tsx`)
- `[ ]` Xem tài liệu API (`provisioning/PreviewApiDocsPage.tsx`)
- `[ ]` Đối soát cung cấp (`provisioning/DataReconciliationPage.tsx`)

### Components & Tabs
- `[ ]` Bảng dữ liệu dịch vụ (`provisioning/components/ServiceDataTable.tsx`)
- `[ ]` Tab Tài liệu API (`provisioning/tabs/ApiDocumentationTab.tsx`)
- `[ ]` Tab Nhật ký kiểm toán (`provisioning/tabs/AuditLogsTab.tsx`)

### Modals cung cấp dữ liệu
- `[ ]` Modal API cung cấp (thêm/sửa) (`provisioning/modals/ProvisionApiModal.tsx`)
- `[ ]` Modal Chi tiết API cung cấp (`provisioning/modals/ProvisionApiDetailModal.tsx`)
- `[ ]` Modal Dịch vụ cung cấp (thêm/sửa) (`provisioning/modals/ProvisionServiceModal.tsx`)
- `[ ]` Modal Phê duyệt dịch vụ (`provisioning/modals/ProvisionServiceApprovalModal.tsx`)
- `[ ]` Modal Công bố dịch vụ (`provisioning/modals/ProvisionServicePublishModal.tsx`)
- `[ ]` Modal Hủy công bố dịch vụ (`provisioning/modals/ProvisionServiceUnpublishModal.tsx`)
- `[ ]` Modal Chi tiết công bố dịch vụ (`provisioning/modals/ProvisionServicePublicDetailsModal.tsx`)
- `[ ]` Modal Yêu cầu dữ liệu (`provisioning/modals/ProvisionDataRequestModal.tsx`)
- `[ ]` Modal Phê duyệt yêu cầu (`provisioning/modals/ProvisionRequestApprovalModal.tsx`)
- `[ ]` Modal Xuất khẩu yêu cầu (`provisioning/modals/ProvisionRequestExportModal.tsx`)
- `[ ]` Modal Bàn giao yêu cầu (`provisioning/modals/ProvisionRequestHandoverModal.tsx`)
- `[ ]` Modal Chi tiết bàn giao (`provisioning/modals/ProvisionHandoverDetailModal.tsx`)
- `[ ]` Modal Kiểm soát truy cập (`provisioning/modals/ProvisionAccessControlModal.tsx`)
- `[ ]` Modal Đối soát API (`provisioning/modals/ProvisionReconciliationApiModal.tsx`)
- `[ ]` Modal Chi tiết đối soát (`provisioning/modals/ProvisionReconciliationDetailsModal.tsx`)
- `[ ]` Modal Gửi phê duyệt (`provisioning/modals/SubmitApprovalModal.tsx`)
- `[ ]` Modal Xuất báo cáo (`provisioning/modals/ProvisionExportReportModal.tsx`)
- `[ ]` Modal Kiểm soát truy cập (`provisioning/modals/AccessControlModal.tsx`)
- `[ ]` Modal Chọn API (`provisioning/modals/ApiSelectionModal.tsx`)
- `[ ]` Modal So sánh phiên bản API (`provisioning/modals/ApiVersionCompareModal.tsx`)
- `[ ]` Modal Trường tính toán (`provisioning/modals/CalculatedFieldModal.tsx`)
- `[ ]` Modal Thiết kế gói dữ liệu (`provisioning/modals/PacketDesignModal.tsx`)
- `[ ]` Modal Cấu hình trường chia sẻ (`provisioning/modals/SharedFieldsConfigModal.tsx`)
- `[ ]` Modal Chi tiết bản ghi (`provisioning/modals/RecordDetailModal.tsx`)

### Trang cung cấp theo dạng (provision/)
- `[ ]` Cung cấp danh mục A (`provision/DataProvisionCatalogAPage.tsx`)
- `[ ]` Cung cấp danh mục B (`provision/DataProvisionCatalogBPage.tsx`)
- `[ ]` Cung cấp danh mục C (`provision/DataProvisionCatalogCPage.tsx`)
- `[ ]` Cung cấp DLDC A (`provision/DataProvisionDldcAPage.tsx`)
- `[ ]` Cung cấp nội bộ (`provision/DataProvisionInternalPage.tsx`)
- `[ ]` Cung cấp chia sẻ (`provision/DataProvisionSharedPage.tsx`)
- `[ ]` Cung cấp danh mục nội bộ (`provision/InternalCatalogProvisionPage.tsx`)

### Điều phối API (orchestration/)
- `[ ]` Quản lý API (`orchestration/APIManagementPage.tsx`)
- `[ ]` Modal Test API (`orchestration/APITestModal.tsx`)
- `[ ]` Form các trường API (`orchestration/APIFormFields.tsx`)
- `[ ]` Modal Thêm dịch vụ cung cấp (`orchestration/AddProvisionServiceModal.tsx`)
- `[ ]` Modal Review phê duyệt (`orchestration/ApprovalReviewModal.tsx`)
- `[ ]` Thiết lập dịch vụ (phiên bản cập nhật) (`orchestration/ServiceSetupPageUpdated.tsx`)
- `[ ]` Danh mục dịch vụ (`orchestration/ServiceCategoryPage.tsx`)
- `[ ]` Giám sát API / dịch vụ (`orchestration/MonitoringPage.tsx`)

---

## 10. PHÂN HỆ DỮ LIỆU MỞ (OPEN DATA)

### Thiết lập & Quản lý
- `[ ]` Thiết lập danh mục dữ liệu mở (`open-data/OpenDataSetupPage.tsx`)
  - Tab Quản lý danh mục
  - Tab Metadata
  - Tab Giấy phép
  - Tab Phê duyệt
  - Tab Lịch sử

### Công bố & Yêu cầu
- `[ ]` Yêu cầu công bố & Danh sách đề xuất (`open-data/OpenDataPublishedListPage.tsx`)
- `[ ]` Phê duyệt dữ liệu mở (`open-data/OpenDataApprovalPage.tsx`)
- `[ ]` Công bố dữ liệu mở (`open-data/OpenDataPublishPage.tsx`)

### Quy tắc & Thống kê
- `[ ]` Quy tắc cập nhật dữ liệu mở (`open-data/OpenDataUpdateRulesPage.tsx`)
- `[ ]` Thống kê dữ liệu mở (`open-data/OpenDataStatisticsPage.tsx`)
- `[ ]` Báo cáo dữ liệu mở (`open-data/OpenDataReportPage.tsx`)
- `[ ]` Báo cáo dữ liệu mở (chi tiết) (`open-data-report/OpenDataReportPage.tsx`)

### Cổng công khai
- `[ ]` Cổng thông tin dữ liệu mở công khai (`open-data/OpenDataPublicPortal.tsx`)

### Danh mục dữ liệu mở (open-data-category/)
- `[ ]` Trang danh mục dữ liệu mở công khai (`open-data-category/OpenDataCategoryPage.tsx`)
- `[ ]` Thiết lập danh mục dữ liệu mở (`open-data-category/OpenDataCategorySetupPage.tsx`)
- `[ ]` Danh mục A–J (`open-data-category/OpenDataCategoryAPage.tsx` đến `OpenDataCategoryJPage.tsx`)

### Components danh mục mở
- `[ ]` Thanh hành động (`open-data-category/components/OpenDataCategoryActions.tsx`)
- `[ ]` Bộ lọc tìm kiếm (`open-data-category/components/OpenDataCategoryFilters.tsx`)
- `[ ]` Thanh tab (`open-data-category/components/OpenDataCategoryTabBar.tsx`)
- `[ ]` Grid danh mục (`open-data-category/components/tabs/OpenDataCategoryGrid.tsx`)
- `[ ]` Phân trang (`open-data-category/components/tabs/OpenDataCategoryPagination.tsx`)
- `[ ]` Tab Tệp đính kèm (`open-data-category/components/tabs/FilesTab.tsx`)
- `[ ]` Tab Lịch sử phiên bản (`open-data-category/components/tabs/VersionHistoryTab.tsx`)

---

## 11. PHÂN HỆ QUẢN TRỊ HỆ THỐNG

### Quản lý người dùng & phân quyền
- `[ ]` Quản lý người dùng (`admin/UserManagementPage.tsx`)
- `[ ]` Quản lý nhóm & phân quyền (`admin/GroupManagementPage.tsx`)
- `[ ]` Quản lý vai trò (`admin/RoleManagementPage.tsx`)
- `[ ]` Quản lý chức năng hệ thống (`admin/FunctionManagementPage.tsx`)
- `[ ]` Danh sách chức năng (`admin/FunctionListPage.tsx`)

### Cấu hình hệ thống
- `[ ]` Cấu hình hệ thống (`admin/SystemConfigPage.tsx`)
- `[ ]` Cấu hình bảo mật (`admin/SecurityConfigPage.tsx`)
- `[ ]` Cấu hình quy tắc mật khẩu (`admin/PasswordRuleConfigPage.tsx`)
- `[ ]` Cấu hình lưu trữ nhật ký (`admin/LogRetentionConfigPage.tsx`)
- `[ ]` Sao lưu & Phục hồi (`admin/BackupPage.tsx`)

### Nhật ký hệ thống
- `[ ]` Nhật ký truy cập (`admin/AccessLogPage.tsx`)
- `[ ]` Nhật ký đăng nhập (`admin/LoginLogPage.tsx`)
- `[ ]` Nhật ký lỗi hệ thống (`admin/ErrorLogPage.tsx`)
- `[ ]` Nhật ký thay đổi cấu hình (`admin/ConfigChangeLogPage.tsx`)
- `[ ]` Nhật ký quản lý tài khoản (`admin/AccountManagementLogPage.tsx`)
- `[ ]` Lịch sử hoạt động người dùng (`admin/UserActivityHistoryPage.tsx`)

### Thống kê
- `[ ]` Thống kê hệ thống (`admin/StatisticsPage.tsx`)

---

**Cam kết của AI:** Chỉ phân tích và thay đổi mã nguồn của những tệp liên quan trực tiếp đến các ô đã được bạn đánh dấu `[x]`. Mọi khu vực khác sẽ được đóng băng nguyên trạng!

---

## 12. QUY TẮC PHỐI HỢP DÀNH CHO TEAM (BAO GỒM DEV, PM VÀ AI)

Để đảm bảo source code không bị giẫm chân lên nhau khi có nhiều Dev và AI cùng tham gia, toàn bộ dự án thống nhất tuân thủ quy trình 4 bước sau:

**A. Đối với Project Manager (Người điều phối & Giao việc cho AI):**
1. **Chia để trị:** Mỗi tính năng giao cho Dev hoặc AI đều phải độc lập nhất có thể.
2. **Khóa File (Locking):** Khi Dev A đang làm tính năng X, PM không được phép đánh dấu `[x]` tính năng X trong file `stauts.md` để yêu cầu AI sửa. Tính năng nào giao cho con người thì AI phải tránh ra và ngược lại.
3. **Quản lý AI:** Chỉ mở `[x]` cho AI làm những task bạn trực tiếp giám sát. Sau khi AI làm xong và code chạy tốt, phải gỡ dấu `[x]` về `[ ]` để "khóa" chức năng đó lại, ngăn AI tự động sửa lây lan trong các phiên làm việc sau.

**B. Đối với Developer (Human Dev):**
1. **Branching (Chia nhánh Git):** Không bao giờ code trực tiếp trên nhánh `main`. Mỗi người nhận task phải tạo nhánh riêng (ví dụ: `feature/ten-chuc-nang`).
2. **Kế thừa AI:** Nếu Dev cần phát triển tiếp một tính năng do AI vừa làm, Dev phải tạo nhánh mới từ nhánh AI vừa commit.
3. **Pull Request (PR):** Mọi code đẩy lên (cả của Dev và code do AI sinh ra) đều phải tạo PR và có người review chéo trước khi merge vào bản chính.

**C. Đối với Trợ lý AI (Antigravity):**
1. **Tôn trọng `stauts.md` tuyệt đối:** Không bao giờ đọc, phân tích, hay sửa đổi bất kỳ tệp code nào không thuộc các tính năng đang có dấu `[x]`. 
2. **Hỏi trước khi vượt rào:** Nếu trong quá trình code tính năng `[x]` mà phát hiện cần phải chỉnh sửa một file chung (đang bị khóa `[ ]`), AI bắt buộc phải dừng lại và xin phép PM mở khóa.
3. **Dừng ngay khi có tác động lan rộng:** Nếu trong quá trình thực hiện tính năng `[x]`, AI phát hiện rằng việc chỉnh sửa có thể **ảnh hưởng trực tiếp hoặc gián tiếp** đến bất kỳ tính năng đã bị khóa `[ ]` nào khác (dù chỉ là file dùng chung, component chung, type/interface chung, hay logic phụ thuộc), AI **bắt buộc phải dừng ngay lập tức**, không tự ý thực hiện, và **thông báo rõ ràng cho PM** về: (a) file/thành phần bị ảnh hưởng, (b) tính năng đang bị khóa có liên quan, (c) phương án xử lý đề xuất — để PM quyết định có mở khóa hay không trước khi tiếp tục.
4. **Báo cáo trung thực:** Mọi dòng code AI sinh ra hoặc sửa đổi đều phải được ghi chép vào `docs/log/log_update.md` để Human Dev có thể nắm được AI đã làm gì.

*(Chúng ta chốt nguyên tắc này nhé!)*
