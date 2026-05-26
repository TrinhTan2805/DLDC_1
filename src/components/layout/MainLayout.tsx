// MainLayout Component - Updated
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { DashboardHome } from '../dashboard/DashboardHome';
import { DataCollectionPage } from '../pages/DataCollectionPage';
import { ExternalDataPage } from '../pages/collection/ExternalDataPage';
import { InternalDataPage } from '../pages/collection/InternalDataPage';
import { ViewCollectedDataPage } from '../pages/collection/ViewCollectedDataPage';
import { CollectionSetupPage } from '../pages/collection/CollectionSetupPage';
import { ConnectionManagementPage } from '../pages/collection/ConnectionManagementPage';
import { LogManagement } from '../pages/collection/LogManagement';
import { DataProcessingPage } from '../pages/DataProcessingPage';
import { ProcessedDataPage } from '../pages/processing/ProcessedDataPage';
import { CategoryManagementPage } from '../pages/CategoryManagementPage';
import { ScreenFlowDiagram } from '../pages/ScreenFlowDiagram';
import CategorySetupPage from '../pages/category/CategorySetupPage';
import { CategoryAPage } from '../pages/category/CategoryAPage';
import { CategoryBPage } from '../pages/category/CategoryBPage';
import { CategoryCPage } from '../pages/category/CategoryCPage';
import { CategoryDPage } from '../pages/category/CategoryDPage';
import { CategoryEPage } from '../pages/category/CategoryEPage';
import { CategoryFPage } from '../pages/category/CategoryFPage';
import { CategoryGPage } from '../pages/category/CategoryGPage';
import { CategoryHPage } from '../pages/category/CategoryHPage';
import { CategoryIPage } from '../pages/category/CategoryIPage';
import { CategoryJPage } from '../pages/category/CategoryJPage';
import { CategoryPublishedListPage } from '../pages/category/CategoryPublishedListPage';
import { CategoryReportPage } from '../pages/category/CategoryReportPage';
import { CategoryStatisticsReportPage } from '../pages/category/CategoryStatisticsReportPage';
import { CategoryReportListPage } from '../pages/category/reports/CategoryReportListPage';
import { CategoryReportExploitationPage } from '../pages/category/reports/CategoryReportExploitationPage';
import { CategoryReportStatusPage } from '../pages/category/reports/CategoryReportStatusPage';
import { CategoryReportVersionPage } from '../pages/category/reports/CategoryReportVersionPage';
import { NewCategorySetupPage } from '../pages/new-category';
import { CategorySetupPageNew } from '../pages/category/CategorySetupPageNew';
import { OpenDataCategoryPage } from '../pages/OpenDataCategoryPage';
import { OpenDataSetupPage } from '../pages/open-data/OpenDataSetupPage';
import { OpenDataPublishedListPage } from '../pages/open-data/OpenDataPublishedListPage';
import { OpenDataReportPage } from '../pages/open-data-report/OpenDataReportPage';
import { OpenDataCategoryAPage } from '../pages/open-data-category/OpenDataCategoryAPage';
import { OpenDataCategoryBPage } from '../pages/open-data-category/OpenDataCategoryBPage';
import { OpenDataCategoryCPage } from '../pages/open-data-category/OpenDataCategoryCPage';
import { OpenDataCategoryDPage } from '../pages/open-data-category/OpenDataCategoryDPage';
import { OpenDataCategoryEPage } from '../pages/open-data-category/OpenDataCategoryEPage';
import { OpenDataCategoryFPage } from '../pages/open-data-category/OpenDataCategoryFPage';
import { OpenDataCategoryGPage } from '../pages/open-data-category/OpenDataCategoryGPage';
import { OpenDataCategoryHPage } from '../pages/open-data-category/OpenDataCategoryHPage';
import { OpenDataCategoryIPage } from '../pages/open-data-category/OpenDataCategoryIPage';
import { OpenDataCategoryJPage } from '../pages/open-data-category/OpenDataCategoryJPage';
import { QualityControlPage } from '../pages/QualityControlPage';
import { NotificationPage } from '../pages/NotificationPage';
import { MasterDataPage } from '../pages/MasterDataPage';
import { MasterDataListPage } from '../pages/master-data-list/MasterDataListPage';
import { MasterDataAPage } from '../pages/master-data-list/MasterDataAPage';
import { MasterDataBPage } from '../pages/master-data-list/MasterDataBPage';
import { MasterDataCPage } from '../pages/master-data-list/MasterDataCPage';
import { MasterDataDPage } from '../pages/master-data-list/MasterDataDPage';
import { MasterDataEPage } from '../pages/master-data-list/MasterDataEPage';
import { MasterDataFPage } from '../pages/master-data-list/MasterDataFPage';
import { MasterDataGPage } from '../pages/master-data-list/MasterDataGPage';
import { MasterDataHPage } from '../pages/master-data-list/MasterDataHPage';
import { MasterDataIPage } from '../pages/master-data-list/MasterDataIPage';
import { MasterDataJPage } from '../pages/master-data-list/MasterDataJPage';
import { MasterDataScaleManagementPage } from '../pages/master-data/MasterDataScaleManagementPage';
import { MasterDataUpdatePage } from '../pages/master-data/MasterDataUpdatePage';
import { MasterDataAPage as MasterDataUpdateAPage } from '../pages/master-data/MasterDataAPage';
import MasterDataReportsPage from '../pages/master-data/MasterDataReportsPage';
import { DataCoordinationPage } from '../pages/DataCoordinationPage';
import { ProvisionReconciliationPage } from '../pages/provisioning/DataReconciliationPage';
import { ServiceSetupPage } from '../pages/orchestration/ServiceSetupPageUpdated';
import { APIManagementPage } from '../pages/orchestration/APIManagementPage';
import { DataReconciliationAPIPage } from '../pages/orchestration/DataReconciliationAPIPage';
import { MonitoringPage } from '../pages/orchestration/MonitoringPage';
import { ServiceCategoryPage } from '../pages/orchestration/ServiceCategoryPage';
import { DataProvisionInternalPage } from '../pages/provision/DataProvisionInternalPage';
import { DataProvisionSharedPage } from '../pages/provision/DataProvisionSharedPage';
import { DataProvisionCatalogAPage } from '../pages/provision/DataProvisionCatalogAPage';
import { DataProvisionCatalogBPage } from '../pages/provision/DataProvisionCatalogBPage';
import { DataProvisionCatalogCPage } from '../pages/provision/DataProvisionCatalogCPage';
import { DataProvisionDldcAPage } from '../pages/provision/DataProvisionDldcAPage';
import { DataProvisionDldcBPage } from '../pages/provision/DataProvisionDldcBPage';
import { DataProvisionDldcCPage } from '../pages/provision/DataProvisionDldcCPage';
import { DataReconciliationPage } from '../pages/DataReconciliationPage';
import { ReconciliationSetupPage } from '../pages/ReconciliationSetupPage';
import { SystemAdminPage } from '../pages/SystemAdminPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { GroupManagementPage } from '../pages/admin/GroupManagementPage';
import { PasswordRuleConfigPage } from '../pages/admin/PasswordRuleConfigPage';
import { FunctionManagementPage } from '../pages/admin/FunctionManagementPage';
import { RoleManagementPage } from '../pages/admin/RoleManagementPage';
import { SecurityConfigPage } from '../pages/admin/SecurityConfigPage';
import { AccessLogPage } from '../pages/admin/AccessLogPage';
import { ErrorLogPage } from '../pages/admin/ErrorLogPage';
import { AccountManagementLogPage } from '../pages/admin/AccountManagementLogPage';
import { ConfigChangeLogPage } from '../pages/admin/ConfigChangeLogPage';
import { LogRetentionConfigPage } from '../pages/admin/LogRetentionConfigPage';
import { BackupPage } from '../pages/admin/BackupPage';
import { StatisticsPage } from '../pages/admin/StatisticsPage';
import { GenderCategoryPage } from '../pages/external/GenderCategoryPage';
import { EthnicCategoryPage } from '../pages/external/EthnicCategoryPage';
import { CountryNationalityPage } from '../pages/external/CountryNationalityPage';
import { ReligionCategoryPage } from '../pages/external/ReligionCategoryPage';
import { AgencyCategoryPage } from '../pages/external/AgencyCategoryPage';
import { AdministrativeUnitPage } from '../pages/external/AdministrativeUnitPage';
import { FamilyRelationshipPage } from '../pages/external/FamilyRelationshipPage';
import { IdentityDocumentPage } from '../pages/external/IdentityDocumentPage';
import { SocialAssistancePage } from '../pages/external/SocialAssistancePage';
import { PovertyInfoPage } from '../pages/external/PovertyInfoPage';
import { SinglePersonPage } from '../pages/external/SinglePersonPage';
import { ChildrenSocialProtectionPage } from '../pages/external/ChildrenSocialProtectionPage';
import { HIVPersonPage } from '../pages/external/HIVPersonPage';
import { ElderlyPersonPage } from '../pages/external/ElderlyPersonPage';
import { DisabledPersonPage } from '../pages/external/DisabledPersonPage';
import { MeritoriousPersonPage } from '../pages/external/MeritoriousPersonPage';
import { MartyrRecordPage } from '../pages/external/MartyrRecordPage';
import { MeritoriousRelativePage } from '../pages/external/MeritoriousRelativePage';
import { ChildrenInfoPage } from '../pages/external/ChildrenInfoPage';
import { CategoryGroupPage } from '../pages/external/CategoryGroupPage';
import { SocialSecurityGroupPage } from '../pages/external/SocialSecurityGroupPage';
import { MeritoriousGroupPage } from '../pages/external/MeritoriousGroupPage';
import { ChildrenGroupPage } from '../pages/external/ChildrenGroupPage';
import { CivilRegistryDatabasePage } from '../pages/external/CivilRegistryDatabasePage';
import { CourtJudgmentPage } from '../pages/external/CourtJudgmentPage';
import { CaseManagementPage } from '../pages/internal/CaseManagementPage';
import { CivilJudgmentPage } from '../pages/internal/CivilJudgmentPage';
import { SecurityMeasuresPage } from '../pages/internal/SecurityMeasuresPage';
import { LegalNationalPage } from '../pages/internal/LegalNationalPage';
import { CivilLegalCenterPage } from '../pages/internal/CivilLegalCenterPage';
import { CivilLegalInfoPage } from '../pages/internal/CivilLegalInfoPage';
import { LegalCenterPage } from '../pages/internal/LegalCenterPage';
import { FamilyBasePage } from '../pages/internal/FamilyBasePage';
import { AuctionPage } from '../pages/internal/AuctionPage';
import { InternationalPage } from '../pages/internal/InternationalPage';
import { StatisticsCollectionPage } from '../pages/internal/StatisticsCollectionPage';
import { NationalitySystemPage } from '../pages/internal/NationalitySystemPage';
import { CivilRegistryPage } from '../pages/internal/CivilRegistryPage';
import { ExternalCategoriesReconciliationPage, ExternalCourtJudgmentReconciliationPage, InternalReconciliationPage } from '../pages/reconciliation';
import { BirthCertificatePage } from '../pages/internal/BirthCertificatePage';
import { DeathCertificatePage } from '../pages/internal/DeathCertificatePage';
import { MarriageCertificatePage } from '../pages/internal/MarriageCertificatePage';
import { DivorceCertificatePage } from '../pages/internal/DivorceCertificatePage';
import { AdoptionCertificatePage } from '../pages/internal/AdoptionCertificatePage';
import { GuardianshipCertificatePage } from '../pages/internal/GuardianshipCertificatePage';
import { LegalDocumentSystemPage } from '../pages/internal/LegalDocumentSystemPage';
import { NationalAssemblyDocPage } from '../pages/internal/NationalAssemblyDocPage';
import { GovernmentDocPage } from '../pages/internal/GovernmentDocPage';
import { MojDocPage } from '../pages/internal/MojDocPage';
import { NotarySystemPage } from '../pages/internal/NotarySystemPage';
import { NotaryContractPage } from '../pages/internal/NotaryContractPage';
import { NotaryDocumentPage } from '../pages/internal/NotaryDocumentPage';
import { LegalAidSystemPage } from '../pages/internal/LegalAidSystemPage';
import { LegalAidCasePage } from '../pages/internal/LegalAidCasePage';
import { LegalAidPersonPage } from '../pages/internal/LegalAidPersonPage';
import { BusinessRegistryPage } from '../pages/internal/BusinessRegistryPage';
import { BusinessRegistrationPage } from '../pages/internal/BusinessRegistrationPage';
import { BusinessInfoPage } from '../pages/internal/BusinessInfoPage';
import { StateCompensationPage } from '../pages/internal/StateCompensationPage';
import { ProcessingCivilRegistryPage } from '../pages/processing/ProcessingCivilRegistryPage';
import { CivilRegistryProcessingPage } from '../pages/processing/CivilRegistryProcessingPage';
import { ProcessingNationalityPage } from '../pages/processing/ProcessingNationalityPage';
import { NationalityProcessingPage } from '../pages/processing/NationalityProcessingPage';
import { ProcessingJudgmentPage } from '../pages/processing/ProcessingJudgmentPage';
import { ProcessingJudgmentDbPage } from '../pages/processing/ProcessingJudgmentDbPage';
import { ProcessingSecurityPage } from '../pages/processing/ProcessingSecurityPage';
import { ProcessingSecurityDbPage } from '../pages/processing/ProcessingSecurityDbPage';
import { ProcessingInspectionPage } from '../pages/processing/ProcessingInspectionPage';
import { ProcessingNationalLawPage } from '../pages/processing/ProcessingNationalLawPage';
import { ProcessingJudicialAssistancePage } from '../pages/processing/ProcessingJudicialAssistancePage';
import { ProcessingLegalAidInfoPage } from '../pages/processing/ProcessingLegalAidInfoPage';
import { ProcessingLegalEducationPage } from '../pages/processing/ProcessingLegalEducationPage';
import { ProcessingJudicialSupportPage } from '../pages/processing/ProcessingJudicialSupportPage';
import { ProcessingAuctionPage } from '../pages/processing/ProcessingAuctionPage';
import { ProcessingCooperationDeptPage } from '../pages/processing/ProcessingCooperationDeptPage';
import { ProcessingCooperationDbPage } from '../pages/processing/ProcessingCooperationDbPage';
import { ProcessingCooperationPage } from '../pages/processing/ProcessingCooperationPage';
import { TargetDatabaseManagementPage } from '../pages/processing/TargetDatabaseManagementPage';
import { TargetDatabaseDetailPage } from '../pages/processing/TargetDatabaseDetailPage';
import { NotificationBrowser } from '../notifications/NotificationBrowser';
import { UserGuidePage } from '../pages/UserGuidePage';
import { DataManagementDetail } from '../collection/DataManagementDetail';
import { CollectionDashboard } from '../collection/CollectionDashboard';
import { UserProfileModal } from '../modals/UserProfileModal';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';
import { ChangeBackgroundModal } from '../modals/ChangeBackgroundModal';
import { AccessHistoryModal } from '../modals/AccessHistoryModal';
import { ActionHistoryModal } from '../modals/ActionHistoryModal';
import { LogoutModal } from '../modals/LogoutModal';
import { DataProvisionServiceSetupPage } from '../pages/provisioning/DataProvisionServiceSetupPage';
import { DataProvisionApiManagementPage } from '../pages/provisioning/DataProvisionApiManagementPage';
import { DataProvisionRequestPage } from '../pages/provisioning/DataProvisionRequestPage';
import { DataProvisionMonitoringPage } from '../pages/provisioning/DataProvisionMonitoringPage';
import { DataProvisionServicesPage } from '../pages/provisioning/DataProvisionServicesPage';

// Page configuration for titles and descriptions
const pageConfig: Record<string, { title: string; description: string }> = {
  'admin-function-config': {
    title: 'Cấu hình quyền thao tác',
    description: 'Thiết lập quyền thao tác cho các chức năng'
  },
  'admin-roles': {
    title: 'Quản lý vai trò',
    description: 'Quản lý và phân quyền vai trò người dùng trong hệ thống'
  },
  dashboard: {
    title: 'Tổng quan hệ thống',
    description: 'Theo dõi tổng quan hoạt động và thống kê hệ thống kho dữ liệu DLDC'
  },
  'provisioning-service-setup': {
    title: 'Thiết lập điều phối dữ liệu',
    description: 'Thiết lập, phê duyệt và công khai dịch vụ cung cấp dữ liệu'
  },
  'provisioning-api-management': {
    title: 'Quản lý API cung cấp & đối soát',
    description: 'Danh mục API, Phân quyền truy cập và Quản lý phiên bản'
  },
  'provisioning-data-request': {
    title: 'Cung cấp dữ liệu theo yêu cầu',
    description: 'Tiếp nhận yêu cầu, kết xuất và công bố dữ liệu thụ động'
  },
  'provisioning-monitoring': {
    title: 'Kiểm soát & giám sát cung cấp',
    description: 'Giám sát luồng dữ liệu và Báo cáo thống kê dịch vụ'
  },
  'provisioning-catalog-internal': {
    title: 'Dữ liệu danh mục nội ngành',
    description: 'Danh mục dịch vụ cung cấp dữ liệu nội ngành'
  },
  'provisioning-catalog-shared': {
    title: 'Dữ liệu dùng chung',
    description: 'Danh mục dịch vụ cung cấp dữ liệu dùng chung'
  },
  'provisioning-catalog-open': {
    title: 'Dữ liệu mở',
    description: 'Danh mục dịch vụ cung cấp dữ liệu mở'
  },
  'provisioning-catalog-master': {
    title: 'Dữ liệu chủ',
    description: 'Danh mục dịch vụ cung cấp dữ liệu chủ'
  },
  'provisioning-shared-hotich': { title: 'CSDL Hộ tịch điện tử', description: 'Cung cấp dữ liệu CSDL Hộ tịch điện tử' },
  'provisioning-shared-quoctich': { title: 'Hệ thống quản lý Bộ Tư Pháp hồ sơ quốc tịch', description: 'Cung cấp dữ liệu Hệ thống quản lý Bộ Tư Pháp hồ sơ quốc tịch' },
  'provisioning-shared-tha': { title: 'Cơ sở dữ liệu thi hành án dân sự', description: 'Cung cấp dữ liệu Cơ sở dữ liệu thi hành án dân sự' },
  'provisioning-shared-bpbd': { title: 'Cơ sở dữ liệu về biện pháp bảo đảm', description: 'Cung cấp dữ liệu Cơ sở dữ liệu về biện pháp bảo đảm' },
  'provisioning-shared-qgpl': { title: 'CSDL quốc gia về pháp luật', description: 'Cung cấp dữ liệu CSDL quốc gia về pháp luật' },
  'provisioning-shared-tttp': { title: 'Cơ sở dữ liệu tương trợ tư pháp về dân sự', description: 'Cung cấp dữ liệu Cơ sở dữ liệu tương trợ tư pháp về dân sự' },
  'provisioning-shared-tgpl': { title: 'Hệ thống thông tin trợ giúp pháp lý', description: 'Cung cấp dữ liệu Hệ thống thông tin trợ giúp pháp lý' },
  'provisioning-shared-pbgd': { title: 'CSDL phổ biến, giáo dục pháp luật', description: 'Cung cấp dữ liệu CSDL phổ biến, giáo dục pháp luật và hoà giải cơ sở' },
  'provisioning-shared-dgts': { title: 'CSDL quản lý đấu giá tài sản', description: 'Cung cấp dữ liệu CSDL quản lý đấu giá tài sản' },
  'provisioning-shared-htqt': { title: 'CSDL Hợp tác quốc tế', description: 'Cung cấp dữ liệu CSDL Hợp tác quốc tế' },

  'provisioning-internal-banan': { title: 'CSDL Thông tin Bản án', description: 'Cung cấp dữ liệu CSDL Thông tin Bản án' },
  'provisioning-internal-danhmuc': { title: 'Danh mục nội ngành', description: 'Cung cấp dữ liệu Danh mục' },
  'provisioning-internal-bhxh': { title: 'BHXH và Giảm nghèo', description: 'Cung cấp dữ liệu BHXH và Giảm nghèo' },
  'provisioning-internal-ncc': { title: 'Người có công', description: 'Cung cấp dữ liệu Người có công' },
  'provisioning-internal-treem': { title: 'Trẻ em', description: 'Cung cấp dữ liệu Trẻ em' },

  'provisioning-open': { title: 'Dữ liệu mở', description: 'Danh mục dịch vụ cung cấp dữ liệu mở' },
  'provisioning-master': { title: 'Dữ liệu chủ', description: 'Danh mục dịch vụ cung cấp dữ liệu chủ' },

  'reconciliation-catalog': {
    title: 'Danh mục tiến trình đối soát',
    description: 'Quản lý và giám sát các tiến trình đối soát dữ liệu cung cấp'
  },
  'collection-dashboard': {
    title: 'Dashboard - Quản lý thu thập',
    description: 'Theo dõi tổng quan hoạt động thu thập dữ liệu'
  },
  'category-setup': {
    title: 'Thiết lập danh mục',
    description: 'Thiết lập và quản lý danh mục dữ liệu'
  },
  'collection-setup': {
    title: 'Thiết lập thu thập',
    description: 'Thiết lập thu thập CSDL trong và ngoài ngành'
  },
  'collection-source-system': {
    title: 'Quản lý hệ thống nguồn',
    description: 'Quản lý danh sách và thông tin các hệ thống nguồn cung cấp dữ liệu'
  },
  'collection-agent': {
    title: 'Quản trị Agent',
    description: 'Quản lý danh sách các agent thu thập dữ liệu và trạng thái hoạt động'
  },
  'collection-reconciliation-setup': {
    title: 'Thiết lập đối soát',
    description: 'Thiết lập các quy tắc và cấu hình đối soát dữ liệu thu thập'
  },
  'collection-reconciliation-management': {
    title: 'Quản lý đối soát',
    description: 'Quản lý và theo dõi quá trình đối soát dữ liệu thu thập'
  },
  'data-provision-reconciliation': {
    title: 'Đối soát dữ liệu cung cấp',
    description: 'Thiết lập các quy tắc và cấu hình đối soát dữ liệu cung cấp'
  },
  'open-data-setup': {
    title: 'Thiết lập danh mục dữ liệu mở',
    description: 'Cấu hình và thiết lập các danh mục dữ liệu mở phục vụ công khai, chia sẻ'
  },
  'open-data-category-list': {
    title: 'Danh sách danh mục dữ liệu mở',
    description: 'Quản lý và theo dõi các danh mục dữ liệu mở được công khai'
  },
  'open-data-category-a': {
    title: 'Danh mục dữ liệu mở A',
    description: 'Quản lý chi tiết danh mục dữ liệu mở A'
  },
  'category-a': {
    title: 'Biên tập danh mục A',
    description: 'Quản lý chi tiết Biên tập danh mục A'
  },
  'category-report': {
    title: 'Khai thác tìm kiếm',
    description: 'Tìm kiếm và xuất báo cáo thống kê danh mục'
  },
  'open-data-published-list': {
    title: 'Danh sách dữ liệu mở công bố',
    description: 'Danh sách các dữ liệu mở đã được công bố công khai theo Nghị định 47/2020/NĐ-CP'
  },
  'open-data-report': {
    title: 'Báo cáo thống kê dữ liệu mở',
    description: 'Tìm ki��m, thống kê và phân tích dữ liệu mở'
  },
  'master-data-reports': {
    title: 'Báo cáo tìm kiếm dữ liệu chủ',
    description: 'Tra cứu, báo cáo sử dụng và theo dõi vòng đời dữ liệu chủ'
  },
  'master-data-scale-management': {
    title: 'Quản lý quy mô dữ liệu chủ',
    description: 'Quản lý và thiết lập quy mô dữ liệu chủ'
  },
  'master-data-update': {
    title: 'Cập nhật dữ liệu chủ',
    description: 'Cập nhật và xử lý dữ liệu chủ'
  },
  'master-data-update-a': {
    title: 'CSDL A',
    description: 'Xử lý dữ liệu từ CSDL A'
  },
  'target-database-management': {
    title: 'Quản lý CSDL đích',
    description: 'Quản lý danh sách kết nối và cấu trúc các cơ sở dữ liệu đích'
  },
  'target-database-detail': {
    title: 'Chi tiết CSDL đích',
    description: 'Xem chi tiết thông tin và cấu trúc của cơ sở dữ liệu đích'
  }
};

interface MainLayoutProps {
  onLogout?: () => void;
}

export function MainLayout({ onLogout }: MainLayoutProps = {}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPagePath = location.pathname.substring(1);
  const currentPage = currentPagePath || 'dashboard';

  const setCurrentPage = (page: string) => navigate(`/${page}`);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangeBackgroundModal, setShowChangeBackgroundModal] = useState(false);
  const [showAccessHistoryModal, setShowAccessHistoryModal] = useState(false);
  const [showActionHistoryModal, setShowActionHistoryModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  // User role - for demo purposes, set to 'leader' to show publish tab
  const userRole: 'leader' | 'staff' | 'admin' = 'leader';

  const basePage = currentPage.startsWith('target-database-detail-') ? 'target-database-detail' : currentPage;
  const currentPageConfig = pageConfig[basePage] || pageConfig.dashboard;

  useEffect(() => {
    (window as any).navigateToPage = (pageId: string) => {
      setCurrentPage(pageId);
    };
  }, [navigate]);

  const handleUserMenuClick = (action: 'profile' | 'change-password' | 'change-background' | 'access-history' | 'action-history' | 'logout') => {
    switch (action) {
      case 'profile':
        setShowProfileModal(true);
        break;
      case 'change-password':
        setShowChangePasswordModal(true);
        break;
      case 'change-background':
        setShowChangeBackgroundModal(true);
        break;
      case 'access-history':
        setShowAccessHistoryModal(true);
        break;
      case 'action-history':
        setShowActionHistoryModal(true);
        break;
      case 'logout':
        setShowLogoutModal(true);
        break;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          title={currentPageConfig.title}
          description={currentPageConfig.description}
          onUserMenuClick={handleUserMenuClick}
          currentPage={currentPage}
          breadcrumb={getBreadcrumbPath(currentPage)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-6">
            {currentPage === 'dashboard' && <DashboardHome />}
            {currentPage === 'collection-dashboard' && <CollectionDashboard />}
            {currentPage === 'screen-flow-diagram' && <ScreenFlowDiagram />}
            {currentPage === 'collection' && <DataCollectionPage />}
            {/* view-collected-data mapping removed - clicking it now only toggles dropdown */}
            {(currentPage === 'collection-setup' || currentPage.startsWith('collection-setup/')) && (
              <CollectionSetupPage
                onNavigate={setCurrentPage}
                activeTab={currentPage === 'collection-setup/version' ? 'version' : 'service-setup'}
                onTabChange={(tab) => setCurrentPage(`collection-setup/${tab === 'version' ? 'version' : 'service-setup'}`)}
              />
            )}
            {currentPage === 'collection-log' && <LogManagement />}
            {(currentPage === 'connection-management' || currentPage.startsWith('connection-management/')) && (
              <ConnectionManagementPage
                activeTab={currentPage === 'connection-management/agents' ? 'agents' : 'source-systems'}
                onTabChange={(tab) => setCurrentPage(`connection-management/${tab === 'agents' ? 'agents' : 'source-systems'}`)}
              />
            )}
            {currentPage === 'collection-reconciliation' && <ReconciliationSetupPage />}
            {currentPage === 'collection-reconciliation-setup' && <ReconciliationSetupPage />}
            {currentPage === 'collection-reconciliation-management' && <DataReconciliationPage />}
            {currentPage === 'processing' && <DataProcessingPage />}
            {currentPage === 'processing-external' && <DataProcessingPage initialCategory="Dữ liệu ngoài ngành" />}
            {currentPage === 'processing-internal' && <DataProcessingPage initialCategory="Dữ liệu trong ngành" />}
            {currentPage === 'processed-data' && <ProcessedDataPage title="Dữ liệu đã xử lý" dataType="Toàn cục" />}
            {currentPage === 'target-database-management' && <TargetDatabaseManagementPage />}
            {currentPage.startsWith('target-database-detail-') && <TargetDatabaseDetailPage databaseId={currentPage.replace('target-database-detail-', '')} />}
            {currentPage === 'category' && <CategoryManagementPage />}
            {currentPage === 'category-setup' && <CategorySetupPage userRole={userRole} />}
            {currentPage === 'category-a' && <CategoryAPage />}
            {currentPage === 'category-b' && <CategoryBPage />}
            {currentPage === 'category-c' && <CategoryCPage />}
            {currentPage === 'category-d' && <CategoryDPage />}
            {currentPage === 'category-e' && <CategoryEPage />}
            {currentPage === 'category-f' && <CategoryFPage />}
            {currentPage === 'category-g' && <CategoryGPage />}
            {currentPage === 'category-h' && <CategoryHPage />}
            {currentPage === 'category-i' && <CategoryIPage />}
            {currentPage === 'category-j' && <CategoryJPage />}
            {currentPage === 'category-published-list' && <CategoryPublishedListPage />}
            {currentPage === 'category-report' && <CategoryReportPage />}
            {currentPage === 'category-report-list' && <CategoryReportListPage />}
            {currentPage === 'category-report-exploitation' && <CategoryReportExploitationPage />}
            {currentPage === 'category-report-status' && <CategoryReportStatusPage />}
            {currentPage === 'category-report-version' && <CategoryReportVersionPage />}
            {currentPage === 'category-statistics-report' && <CategoryStatisticsReportPage />}
            {currentPage === 'new-category-setup' && <NewCategorySetupPage />}
            {currentPage === 'open-data' && <OpenDataCategoryPage />}
            {currentPage === 'open-data-setup' && <OpenDataSetupPage onNavigate={setCurrentPage} />}
            {currentPage === 'open-data-published-list' && <OpenDataPublishedListPage />}
            {currentPage === 'open-data-category-a' && <OpenDataCategoryAPage />}
            {currentPage === 'open-data-category-b' && <OpenDataCategoryBPage />}
            {currentPage === 'open-data-category-c' && <OpenDataCategoryCPage />}
            {currentPage === 'open-data-category-d' && <OpenDataCategoryDPage />}
            {currentPage === 'open-data-category-e' && <OpenDataCategoryEPage />}
            {currentPage === 'open-data-category-f' && <OpenDataCategoryFPage />}
            {currentPage === 'open-data-category-g' && <OpenDataCategoryGPage />}
            {currentPage === 'open-data-category-h' && <OpenDataCategoryHPage />}
            {currentPage === 'open-data-category-i' && <OpenDataCategoryIPage />}
            {currentPage === 'open-data-category-j' && <OpenDataCategoryJPage />}
            {currentPage === 'open-data-report' && <OpenDataReportPage onBack={() => setCurrentPage('open-data')} />}
            {currentPage === 'open-data-category-setup' && <CategorySetupPageNew />}
            {currentPage === 'quality' && <QualityControlPage />}
            {currentPage === 'notifications' && <NotificationPage />}
            {currentPage === 'master-data' && <MasterDataPage />}
            {currentPage === 'master-data-list-setup' && <MasterDataListPage />}
            {currentPage === 'master-data-a' && <MasterDataAPage />}
            {currentPage === 'master-data-b' && <MasterDataBPage />}
            {currentPage === 'master-data-c' && <MasterDataCPage />}
            {currentPage === 'master-data-d' && <MasterDataDPage />}
            {currentPage === 'master-data-e' && <MasterDataEPage />}
            {currentPage === 'master-data-f' && <MasterDataFPage />}
            {currentPage === 'master-data-g' && <MasterDataGPage />}
            {currentPage === 'master-data-h' && <MasterDataHPage />}
            {currentPage === 'master-data-i' && <MasterDataIPage />}
            {currentPage === 'master-data-j' && <MasterDataJPage />}
            {currentPage === 'master-data-scale-management' && <MasterDataScaleManagementPage />}
            {currentPage === 'master-data-update' && <MasterDataUpdatePage />}
            {currentPage === 'master-data-update-a' && <MasterDataUpdateAPage />}
            {currentPage === 'master-data-update-b' && <ProcessingNationalityPage />}
            {currentPage === 'master-data-update-c' && <ProcessingJudgmentPage />}
            {currentPage === 'master-data-reports' && <MasterDataReportsPage />}
            {currentPage === 'provisioning-service-setup' && <DataProvisionServiceSetupPage />}
            {currentPage === 'provisioning-api-management' && <DataProvisionApiManagementPage />}
            {currentPage === 'provisioning-data-request' && <DataProvisionRequestPage />}
            {currentPage === 'provisioning-monitoring' && <DataProvisionMonitoringPage />}
            {currentPage === 'provisioning-catalog-internal' && <DataProvisionServicesPage category="internal" title="Dữ liệu danh mục nội ngành" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu danh mục nội ngành" />}
            {currentPage === 'provisioning-catalog-shared' && <DataProvisionServicesPage category="shared" title="Dữ liệu dùng chung" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu dùng chung" />}

            {currentPage === 'provisioning-shared-hotich' && <DataProvisionServicesPage category="shared" group="CSDL Hộ tịch điện tử" title="CSDL Hộ tịch điện tử" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu CSDL Hộ tịch điện tử" />}
            {currentPage === 'provisioning-shared-quoctich' && <DataProvisionServicesPage category="shared" group="Hệ thống quản lý Bộ Tư Pháp hồ sơ quốc tịch" title="Hệ thống quản lý Bộ Tư Pháp hồ sơ quốc tịch" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu Hệ thống quản lý Bộ Tư Pháp hồ sơ quốc tịch" />}
            {currentPage === 'provisioning-shared-tha' && <DataProvisionServicesPage category="shared" group="Cơ sở dữ liệu thi hành án dân sự" title="Cơ sở dữ liệu thi hành án dân sự" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu Cơ sở dữ liệu thi hành án dân sự" />}
            {currentPage === 'provisioning-shared-bpbd' && <DataProvisionServicesPage category="shared" group="Cơ sở dữ liệu về biện pháp bảo đảm" title="Cơ sở dữ liệu về biện pháp bảo đảm" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu Cơ sở dữ liệu về biện pháp bảo đảm" />}
            {currentPage === 'provisioning-shared-qgpl' && <DataProvisionServicesPage category="shared" group="CSDL quốc gia về pháp luật" title="CSDL quốc gia về pháp luật" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu CSDL quốc gia về pháp luật" />}
            {currentPage === 'provisioning-shared-tttp' && <DataProvisionServicesPage category="shared" group="Cơ sở dữ liệu tương trợ tư pháp về dân sự" title="Cơ sở dữ liệu tương trợ tư pháp về dân sự" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu Cơ sở dữ liệu tương trợ tư pháp về dân sự" />}
            {currentPage === 'provisioning-shared-tgpl' && <DataProvisionServicesPage category="shared" group="Hệ thống thông tin trợ giúp pháp lý" title="Hệ thống thông tin trợ giúp pháp lý" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu Hệ thống thông tin trợ giúp pháp lý" />}
            {currentPage.match(/^reconciliation-\d+$/) && <ProvisionReconciliationPage processId={currentPage.replace('reconciliation-', '')} />}
            {currentPage === 'provisioning-shared-pbgd' && <DataProvisionServicesPage category="shared" group="CSDL phổ biến, giáo dục pháp luật và hoà giải cơ sở" title="CSDL phổ biến, giáo dục pháp luật và hoà giải cơ sở" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu CSDL phổ biến, giáo dục pháp luật và hoà giải cơ sở" />}
            {currentPage === 'provisioning-shared-dgts' && <DataProvisionServicesPage category="shared" group="CSDL quản lý đấu giá tài sản" title="CSDL quản lý đấu giá tài sản" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu CSDL quản lý đấu giá tài sản" />}
            {currentPage === 'provisioning-shared-htqt' && <DataProvisionServicesPage category="shared" group="CSDL Hợp tác quốc tế" title="CSDL Hợp tác quốc tế" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu CSDL Hợp tác quốc tế" />}

            {currentPage === 'provisioning-internal-banan' && <DataProvisionServicesPage category="internal" group="CSDL Thông tin Bản án" title="CSDL Thông tin Bản án" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu CSDL Thông tin Bản án" />}
            {currentPage === 'provisioning-internal-danhmuc' && <DataProvisionServicesPage category="internal" group="Danh mục" title="Danh mục" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu Danh mục" />}
            {currentPage === 'provisioning-internal-bhxh' && <DataProvisionServicesPage category="internal" group="BHXH và Giảm nghèo" title="BHXH và Giảm nghèo" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu BHXH và Giảm nghèo" />}
            {currentPage === 'provisioning-internal-ncc' && <DataProvisionServicesPage category="internal" group="Người có công" title="Người có công" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu Người có công" />}
            {currentPage === 'provisioning-internal-treem' && <DataProvisionServicesPage category="internal" group="Trẻ em" title="Trẻ em" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu Trẻ em" />}

            {currentPage === 'provisioning-catalog-open' && <DataProvisionServicesPage category="open" title="Dữ liệu mở" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu mở" />}
            {currentPage === 'provisioning-catalog-master' && <DataProvisionServicesPage category="master" title="Dữ liệu chủ" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu chủ" />}
            {currentPage === 'provisioning-open' && <DataProvisionServicesPage category="open" title="Dữ liệu mở" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu mở" />}
            {currentPage === 'provisioning-master' && <DataProvisionServicesPage category="master" title="Dữ liệu chủ" description="Quản lý và cấu hình các dịch vụ cung cấp dữ liệu chủ" />}
            {currentPage === 'orchestration' && <DataCoordinationPage />}
            {currentPage === 'orchestration-service-setup' && <ServiceSetupPage />}
            {currentPage === 'orchestration-api-management' && <APIManagementPage />}
            {currentPage === 'orchestration-reconciliation-api' && <DataReconciliationAPIPage />}
            {currentPage === 'orchestration-monitoring' && <MonitoringPage />}
            {currentPage === 'orchestration-service-category' && <ServiceCategoryPage />}
            {currentPage === 'data-provision-internal' && <DataProvisionInternalPage />}
            {currentPage === 'data-provision-shared' && <DataProvisionSharedPage />}
            {currentPage === 'data-provision-catalog-a' && <DataProvisionCatalogAPage />}
            {currentPage === 'data-provision-catalog-b' && <DataProvisionCatalogBPage />}
            {currentPage === 'data-provision-catalog-c' && <DataProvisionCatalogCPage />}
            {currentPage === 'data-provision-dldc-a' && <DataProvisionDldcAPage />}
            {currentPage === 'data-provision-dldc-b' && <DataProvisionDldcBPage />}
            {currentPage === 'data-provision-dldc-c' && <DataProvisionDldcCPage />}
            {currentPage === 'data-provision-reconciliation' && <ReconciliationSetupPage />}
            {currentPage === 'reconciliation' && <DataReconciliationPage />}
            {currentPage === 'admin' && <SystemAdminPage />}
            {currentPage === 'admin-users' && <UserManagementPage />}
            {(currentPage === 'admin-groups' || currentPage.startsWith('admin-groups-')) && <GroupManagementPage currentPage={currentPage} />}
            {currentPage === 'admin-password-rules' && <PasswordRuleConfigPage />}
            {currentPage === 'admin-functions' && <FunctionManagementPage />}
            {currentPage === 'admin-roles' && <RoleManagementPage />}
            {currentPage === 'admin-function-config' && <SystemAdminPage initialTab="function-config" />}
            {currentPage === 'admin-config' && <SecurityConfigPage />}
            {currentPage === 'admin-access-log' && <AccessLogPage />}
            {currentPage === 'admin-error-log' && <ErrorLogPage />}
            {currentPage === 'admin-account-log' && <AccountManagementLogPage />}
            {currentPage === 'admin-config-log' && <ConfigChangeLogPage />}
            {currentPage === 'admin-log-retention' && <LogRetentionConfigPage />}
            {currentPage === 'admin-backup' && <BackupPage />}
            {currentPage === 'admin-statistics' && <StatisticsPage />}
            {currentPage === 'security-config' && <SecurityConfigPage />}
            {currentPage === 'gender-category' && <GenderCategoryPage />}
            {currentPage === 'ethnic-category' && <EthnicCategoryPage />}
            {currentPage === 'country-nationality' && <CountryNationalityPage />}
            {currentPage === 'religion-category' && <ReligionCategoryPage />}
            {currentPage === 'agency-category' && <AgencyCategoryPage />}
            {currentPage === 'administrative-unit' && <AdministrativeUnitPage />}
            {currentPage === 'family-relationship' && <FamilyRelationshipPage />}
            {currentPage === 'identity-document' && <IdentityDocumentPage />}
            {currentPage === 'social-assistance' && <SocialAssistancePage />}
            {currentPage === 'poverty-info' && <PovertyInfoPage />}
            {currentPage === 'single-person' && <SinglePersonPage />}
            {currentPage === 'children-social-protection' && <ChildrenSocialProtectionPage />}
            {currentPage === 'hiv-person' && <HIVPersonPage />}
            {currentPage === 'elderly-person' && <ElderlyPersonPage />}
            {currentPage === 'disabled-person' && <DisabledPersonPage />}
            {currentPage === 'meritorious-person' && <MeritoriousPersonPage />}
            {currentPage === 'martyr-record' && <MartyrRecordPage />}
            {currentPage === 'meritorious-relative' && <MeritoriousRelativePage />}
            {currentPage === 'children-info' && <ChildrenInfoPage />}
            {currentPage === 'civil-registry-database' && <CivilRegistryDatabasePage />}
            {currentPage === 'nationality-system' && <NationalitySystemPage />}
            {currentPage === 'civil-registry' && <CivilRegistryPage />}
            {currentPage === 'birth-certificate' && <BirthCertificatePage />}
            {currentPage === 'death-certificate' && <DeathCertificatePage />}
            {currentPage === 'marriage-certificate' && <MarriageCertificatePage />}
            {currentPage === 'divorce-certificate' && <DivorceCertificatePage />}
            {currentPage === 'adoption-certificate' && <AdoptionCertificatePage />}
            {currentPage === 'guardianship-certificate' && <GuardianshipCertificatePage />}
            {currentPage === 'legal-document-system' && <LegalDocumentSystemPage />}
            {currentPage === 'national-assembly-doc' && <NationalAssemblyDocPage />}
            {currentPage === 'government-doc' && <GovernmentDocPage />}
            {currentPage === 'moj-doc' && <MojDocPage />}
            {currentPage === 'notary-system' && <NotarySystemPage />}
            {currentPage === 'notary-contract' && <NotaryContractPage />}
            {currentPage === 'notary-document' && <NotaryDocumentPage />}
            {currentPage === 'legal-aid-system' && <LegalAidSystemPage />}
            {currentPage === 'legal-aid-case' && <LegalAidCasePage />}
            {currentPage === 'legal-aid-person' && <LegalAidPersonPage />}
            {currentPage === 'business-registry' && <BusinessRegistryPage />}
            {currentPage === 'business-registration' && <BusinessRegistrationPage />}
            {currentPage === 'business-info' && <BusinessInfoPage />}
            {currentPage === 'state-compensation' && <StateCompensationPage />}
            {currentPage === 'processing-civil-registry' && <ProcessingCivilRegistryPage />}
            {currentPage === 'processing-nationality' && <ProcessingNationalityPage />}
            {currentPage === 'processing-judgment' && <ProcessingJudgmentPage />}
            {currentPage === 'processing-judgment-db' && <ProcessingJudgmentDbPage />}
            {currentPage === 'processing-security' && <ProcessingSecurityPage />}
            {currentPage === 'processing-security-db' && <ProcessingSecurityDbPage />}
            {currentPage === 'processing-inspection' && <ProcessingInspectionPage />}
            {currentPage === 'processing-national-law' && <ProcessingNationalLawPage />}
            {currentPage === 'processing-judicial-assistance' && <ProcessingJudicialAssistancePage />}
            {currentPage === 'processing-legal-aid-info' && <ProcessingLegalAidInfoPage />}
            {currentPage === 'processing-legal-education' && <ProcessingLegalEducationPage />}
            {currentPage === 'processing-judicial-support' && <ProcessingJudicialSupportPage />}
            {currentPage === 'processing-auction' && <ProcessingAuctionPage />}
            {currentPage === 'processing-cooperation-dept' && <ProcessingCooperationDeptPage />}
            {currentPage === 'processing-cooperation-db' && <ProcessingCooperationDbPage />}
            {currentPage === 'processing-cooperation' && <ProcessingCooperationPage />}

            {/* Processing - Internal Data (Dữ liệu trong ngành) */}
            {currentPage === 'processing-registry' && <ProcessedDataPage title="HT quản lý hồ sơ QT" dataType="Hồ sơ QT" />}
            {currentPage === 'processing-civil-judgment' && <ProcessedDataPage title="CSDL thi hành án dân sự" dataType="Thi hành án" />}
            {currentPage === 'processing-security-measures' && <ProcessedDataPage title="CSDL về biện pháp BD" dataType="Biện pháp bảo đảm" />}
            {currentPage === 'processing-legal-national' && <ProcessedDataPage title="CSDL quốc gia về PL" dataType="Pháp luật quốc gia" />}
            {currentPage === 'processing-civil-legal-center' && <ProcessedDataPage title="CSDL TT Tư Pháp dân sự" dataType="Tư pháp dân sự" />}
            {currentPage === 'processing-civil-legal-info' && <ProcessedDataPage title="HTTT trợ giúp pháp lý" dataType="Pháp lý dân sự" />}
            {currentPage === 'processing-legal-center' && <ProcessedDataPage title="Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở" dataType="Trợ giúp pháp lý" />}
            {currentPage === 'processing-family-base' && <ProcessedDataPage title="CSDL PB, GĐ và HG cơ sở" dataType="Hòa giải cơ sở" />}
            {currentPage === 'processing-international' && <ProcessedDataPage title="CSDL Hợp tác quốc tế" dataType="Hợp tác quốc tế" />}

            {/* Processing - Civil Registry Certificates */}
            {currentPage === 'processing-birth-certificate' && <ProcessedDataPage title="Giấy khai sinh" dataType="khai sinh" />}
            {currentPage === 'processing-death-certificate' && <ProcessedDataPage title="Giấy khai tử" dataType="khai tử" />}
            {currentPage === 'processing-marriage-certificate' && <ProcessedDataPage title="Giấy đăng ký kết hôn" dataType="kết hôn" />}
            {currentPage === 'processing-divorce-certificate' && <ProcessedDataPage title="Giấy đăng ký ly hôn" dataType="ly hôn" />}
            {currentPage === 'processing-adoption-certificate' && <ProcessedDataPage title="Giấy đăng ký nhận con nuôi" dataType="nhận con nuôi" />}
            {currentPage === 'processing-guardianship-certificate' && <ProcessedDataPage title="Giấy đăng ký giám hộ" dataType="giám hộ" />}

            {currentPage === 'notification-browser' && <NotificationBrowser />}
            {currentPage === 'user-guide' && <UserGuidePage />}
            {currentPage === 'user-guide-search' && <UserGuidePage />}
            {currentPage === 'user-guide-faq' && <UserGuidePage />}
            {currentPage === 'user-guide-video' && <UserGuidePage />}
            {currentPage === 'user-guide-documents' && <UserGuidePage />}

            {/* Data Info A-J */}
            {currentPage === 'data-info-a' && <DataManagementDetail dataName="Dữ liệu A" dataId="data-info-a" />}
            {currentPage === 'data-info-b' && <DataManagementDetail dataName="Dữ liệu B" dataId="data-info-b" />}
            {currentPage === 'data-info-c' && <DataManagementDetail dataName="Dữ liệu C" dataId="data-info-c" />}
            {currentPage === 'data-info-d' && <DataManagementDetail dataName="Dữ liệu D" dataId="data-info-d" />}
            {currentPage === 'data-info-e' && <DataManagementDetail dataName="Dữ liệu E" dataId="data-info-e" />}
            {currentPage === 'data-info-f' && <DataManagementDetail dataName="Dữ liệu F" dataId="data-info-f" />}
            {currentPage === 'data-info-g' && <DataManagementDetail dataName="Dữ liệu G" dataId="data-info-g" />}
            {currentPage === 'data-info-h' && <DataManagementDetail dataName="Dữ liệu H" dataId="data-info-h" />}
            {currentPage === 'data-info-i' && <DataManagementDetail dataName="Dữ liệu I" dataId="data-info-i" />}
            {currentPage === 'data-info-j' && <DataManagementDetail dataName="Dữ liệu J" dataId="data-info-j" />}

            {/* Category Management A-J */}
            {currentPage === 'category-management-a' && <DataManagementDetail dataName="Biên tập danh mục A" dataId="category-management-a" />}
            {currentPage === 'category-management-b' && <DataManagementDetail dataName="Danh mục B" dataId="category-management-b" />}
            {currentPage === 'category-management-c' && <DataManagementDetail dataName="Danh mục C" dataId="category-management-c" />}
            {currentPage === 'category-management-d' && <DataManagementDetail dataName="Danh mục D" dataId="category-management-d" />}
            {currentPage === 'category-management-e' && <DataManagementDetail dataName="Danh mục E" dataId="category-management-e" />}
            {currentPage === 'category-management-f' && <DataManagementDetail dataName="Danh mục F" dataId="category-management-f" />}
            {currentPage === 'category-management-g' && <DataManagementDetail dataName="Danh mục G" dataId="category-management-g" />}
            {currentPage === 'category-management-h' && <DataManagementDetail dataName="Danh mục H" dataId="category-management-h" />}
            {currentPage === 'category-management-i' && <DataManagementDetail dataName="Danh mục I" dataId="category-management-i" />}
            {currentPage === 'category-management-j' && <DataManagementDetail dataName="Danh mục J" dataId="category-management-j" />}

            {/* External Data */}
            {currentPage === 'external-children-info' && <ChildrenInfoPage />}
            {currentPage === 'external-court-judgment' && <CourtJudgmentPage />}
            {currentPage === 'external-category-group' && <CategoryGroupPage />}
            {currentPage === 'external-social-security' && <SocialSecurityGroupPage />}
            {currentPage === 'external-meritorious-group' && <MeritoriousGroupPage />}
            {currentPage === 'external-children-group' && <ChildrenGroupPage />}

            {/* Processing External Data - CSDL Ngoài ngành */}
            {currentPage === 'processing-external-court-judgment' && <CourtJudgmentPage mode="xử lý" />}
            {currentPage === 'processing-external-category-group' && <CategoryGroupPage mode="xử lý" />}
            {currentPage === 'processing-external-social-security' && <SocialSecurityGroupPage mode="xử lý" />}
            {currentPage === 'processing-external-meritorious-group' && <MeritoriousGroupPage mode="xử lý" />}
            {currentPage === 'processing-external-children-group' && <ChildrenGroupPage mode="xử lý" />}
            {currentPage === 'external-gender-category' && <GenderCategoryPage />}
            {currentPage === 'external-ethnic-category' && <EthnicCategoryPage />}
            {currentPage === 'external-country-nationality' && <CountryNationalityPage />}
            {currentPage === 'external-religion-category' && <ReligionCategoryPage />}
            {currentPage === 'external-agency-category' && <AgencyCategoryPage />}
            {currentPage === 'external-administrative-unit' && <AdministrativeUnitPage />}
            {currentPage === 'external-family-relationship' && <FamilyRelationshipPage />}
            {currentPage === 'external-identity-document' && <IdentityDocumentPage />}
            {currentPage === 'external-social-assistance' && <SocialAssistancePage />}
            {currentPage === 'external-poverty-info' && <PovertyInfoPage />}
            {currentPage === 'external-single-person' && <SinglePersonPage />}
            {currentPage === 'external-children-social-protection' && <ChildrenSocialProtectionPage />}
            {currentPage === 'external-hiv-person' && <HIVPersonPage />}
            {currentPage === 'external-elderly-person' && <ElderlyPersonPage />}
            {currentPage === 'external-disabled-person' && <DisabledPersonPage />}
            {currentPage === 'external-meritorious-person' && <MeritoriousPersonPage />}
            {currentPage === 'external-martyr-record' && <MartyrRecordPage />}
            {currentPage === 'external-meritorious-relative' && <MeritoriousRelativePage />}

            {/* Data Info */}
            {currentPage === 'data-info-civil-registry' && <CivilRegistryDatabasePage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'data-info-case-management' && <CaseManagementPage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'data-info-civil-judgment' && <CivilJudgmentPage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'data-info-security-measures' && <SecurityMeasuresPage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'data-info-legal-national' && <LegalNationalPage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'data-info-civil-legal-center' && <CivilLegalCenterPage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'data-info-civil-legal-info' && <CivilLegalInfoPage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'data-info-legal-center' && <LegalCenterPage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'data-info-family-base' && <FamilyBasePage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'data-info-auction' && <AuctionPage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'data-info-international' && <InternationalPage onBack={() => setCurrentPage('view-collected-data')} />}
            {currentPage === 'collection-statistics' && <StatisticsCollectionPage onBack={() => setCurrentPage('view-collected-data')} />}

            {/* Processing Data Info - CSDL Trong ngành */}
            {currentPage === 'processing-data-info-civil-registry' && <CivilRegistryProcessingPage />}
            {currentPage === 'processing-data-info-case-management' && <NationalityProcessingPage />}
            {currentPage === 'processing-data-info-civil-judgment' && <CivilJudgmentPage mode="xử lý" />}
            {currentPage === 'processing-data-info-security-measures' && <SecurityMeasuresPage mode="xử lý" />}
            {currentPage === 'processing-data-info-legal-national' && <LegalNationalPage mode="xử lý" />}
            {currentPage === 'processing-data-info-civil-legal-center' && <CivilLegalCenterPage mode="xử lý" />}
            {currentPage === 'processing-data-info-civil-legal-info' && <CivilLegalInfoPage mode="xử lý" />}
            {currentPage === 'processing-data-info-legal-center' && <LegalCenterPage mode="xử lý" />}
            {currentPage === 'processing-data-info-family-base' && <FamilyBasePage mode="xử lý" />}
            {currentPage === 'processing-data-info-auction' && <AuctionPage mode="xử lý" />}
            {currentPage === 'processing-data-info-international' && <InternationalPage mode="xử lý" />}
            {currentPage === 'processing-collection-statistics' && <StatisticsCollectionPage mode="xử lý" />}

            {/* Reconciliation Pages */}
            {currentPage === 'reconciliation-external-categories' && <ExternalCategoriesReconciliationPage />}
            {currentPage === 'reconciliation-external-court-judgment' && <ExternalCourtJudgmentReconciliationPage />}
            {currentPage === 'reconciliation-internal-civil-registry' && <InternalReconciliationPage databaseName="CSDL Hộ tịch điện tử" databaseCode="HOTICH" />}
            {currentPage === 'reconciliation-internal-registry' && <InternalReconciliationPage databaseName="HT quản lý hồ sơ QT" databaseCode="QLHS" />}
            {currentPage === 'reconciliation-internal-civil-judgment' && <InternalReconciliationPage databaseName="CSDL thi hành án dân sự" databaseCode="THADS" />}
            {currentPage === 'reconciliation-internal-security-measures' && <InternalReconciliationPage databaseName="CSDL về biện pháp BD" databaseCode="BPBD" />}
            {currentPage === 'reconciliation-internal-legal-national' && <InternalReconciliationPage databaseName="CSDL quốc gia về PL" databaseCode="QGPL" />}
            {currentPage === 'reconciliation-internal-civil-legal-center' && <InternalReconciliationPage databaseName="CSDL TT Tư Pháp dân sự" databaseCode="TTPDS" />}
            {currentPage === 'reconciliation-internal-civil-legal-info' && <InternalReconciliationPage databaseName="HTTT trợ giúp pháp lý" databaseCode="TTTGPLDS" />}
            {currentPage === 'reconciliation-internal-legal-center' && <InternalReconciliationPage databaseName="Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở" databaseCode="TGPL" />}
            {currentPage === 'reconciliation-internal-family-base' && <InternalReconciliationPage databaseName="CSDL PB, GĐ và HG cơ sở" databaseCode="PBGDCS" />}
            {currentPage === 'reconciliation-internal-auction' && <InternalReconciliationPage databaseName="CSDL quản lý đấu giá TS" databaseCode="DAUGTS" />}
            {currentPage === 'reconciliation-internal-international' && <InternalReconciliationPage databaseName="CSDL Hợp tác quốc tế" databaseCode="HTQT" />}
            {currentPage === 'reconciliation-internal-statistics' && <InternalReconciliationPage databaseName="Thu thập số liệu thống kê" databaseCode="SLTK" />}
            {currentPage === 'reconciliation-internal-notary' && <InternalReconciliationPage databaseName="HTTT các tổ chức hành nghề công chứng" databaseCode="CONGCHUNG" />}
            {currentPage === 'reconciliation-internal-authentication' && <InternalReconciliationPage databaseName="CSDL chứng thực" databaseCode="CHUNGTHUC" />}

            {/* Data Provision - CSDL Trong ngành */}
            {currentPage === 'provision-data-info-civil-registry' && <CivilRegistryDatabasePage context="chia sẻ" />}
            {currentPage === 'provision-data-info-case-management' && <CaseManagementPage context="chia sẻ" />}
            {currentPage === 'provision-data-info-civil-judgment' && <CivilJudgmentPage context="chia sẻ" />}
            {currentPage === 'provision-data-info-security-measures' && <SecurityMeasuresPage context="chia sẻ" />}
            {currentPage === 'provision-data-info-legal-national' && <LegalNationalPage context="chia sẻ" />}
            {currentPage === 'provision-data-info-civil-legal-center' && <CivilLegalCenterPage context="chia sẻ" />}
            {currentPage === 'provision-data-info-civil-legal-info' && <CivilLegalInfoPage context="chia sẻ" />}
            {currentPage === 'provision-data-info-legal-center' && <LegalCenterPage context="chia sẻ" />}
            {currentPage === 'provision-data-info-family-base' && <FamilyBasePage context="chia sẻ" />}
            {currentPage === 'provision-data-info-auction' && <AuctionPage context="chia sẻ" />}
            {currentPage === 'provision-data-info-international' && <InternationalPage context="chia sẻ" />}
            {currentPage === 'provision-collection-statistics' && <StatisticsCollectionPage context="chia sẻ" />}

            {/* Data Provision - CSDL Ngoài ngành */}
            {currentPage === 'provision-external-court-judgment' && <CourtJudgmentPage context="chia sẻ" />}
            {currentPage === 'provision-external-category-group' && <CategoryGroupPage context="chia sẻ" />}
            {currentPage === 'provision-external-social-security' && <SocialSecurityGroupPage context="chia sẻ" />}
            {currentPage === 'provision-external-meritorious-group' && <MeritoriousGroupPage context="chia sẻ" />}
            {currentPage === 'provision-external-children-group' && <ChildrenGroupPage context="chia sẻ" />}
          </div>
        </main>
      </div>

      {/* User Modals */}
      <UserProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <ChangePasswordModal isOpen={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} />
      <ChangeBackgroundModal isOpen={showChangeBackgroundModal} onClose={() => setShowChangeBackgroundModal(false)} />
      <AccessHistoryModal isOpen={showAccessHistoryModal} onClose={() => setShowAccessHistoryModal(false)} />
      <ActionHistoryModal isOpen={showActionHistoryModal} onClose={() => setShowActionHistoryModal(false)} />
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          if (onLogout) {
            onLogout();
          } else {
            alert('Đăng xuất thành công!');
          }
        }}
      />
    </div>
  );
}

// Helper function to get breadcrumb path
const getBreadcrumbPath = (pageId: string): string[] => {
  if (pageId === 'connection-management' || pageId.startsWith('connection-management/')) {
    return ['Quản trị & vận hành', 'Danh mục đơn vị cấp dl', 'Quản lý kết nối', pageId === 'connection-management/agents' ? 'Trạm kết nối' : 'Hệ thống nguồn'];
  }
  if (pageId === 'collection-setup' || pageId.startsWith('collection-setup/')) {
    return ['Quản lý thu thập', 'Thiết lập thu thập', pageId === 'collection-setup/version' ? 'Quản lý nhật ký' : 'Thiết lập dịch vụ'];
  }
  const breadcrumbMap: Record<string, string[]> = {
    // Provisioning
    'provisioning-service-setup': ['Cung cấp dữ liệu', 'Thiết lập điều phối dữ liệu'],
    'provisioning-api-management': ['Cung cấp dữ liệu', 'Quản lý API cung cấp & đối soát'],
    'provisioning-data-request': ['Cung cấp dữ liệu', 'Cung cấp dữ liệu theo yêu cầu'],
    'provisioning-monitoring': ['Cung cấp dữ liệu', 'Kiểm soát & giám sát cung cấp'],
    // Dashboard
    'dashboard': ['Tổng quan hệ thống'],

    // Collection
    'collection-dashboard': ['Quản lý thu thập', 'Dashboard'],
    'collection-setup': ['Quản lý thu thập', 'Thiết lập thu thập'],
    'collection-source-system': ['Quản lý thu thập', 'Quản lý hệ thống nguồn'],
    'collection-agent': ['Quản lý thu thập', 'Quản trị Agent'],
    'data-info': ['Quản lý thu thập', 'Xem dữ liệu thu thập'],
    'data-info-civil-registry': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Hộ tịch điện tử'],
    'data-info-case-management': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'HT quản lý hồ sơ QT'],
    'data-info-civil-judgment': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL thi hành án dân sự'],
    'data-info-security-measures': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL về biện pháp BD'],
    'data-info-legal-national': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL quốc gia về PL'],
    'data-info-civil-legal-center': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL TT Tư Pháp dân sự'],
    'data-info-civil-legal-info': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'HT trợ giúp pháp lý'],
    'data-info-legal-center': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở'],
    'data-info-family-base': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL PB, GĐ và HG cơ sở'],
    'data-info-auction': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL quản lý đấu giá TS'],
    'data-info-international': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Hợp tác quốc tế'],
    'collection-statistics': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Thống kê thu thập'],
    'category-management': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'Quản lý danh mục'],
    'category-management-a': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'Quản lý danh mục', 'Biên tập danh mục A'],

    'external-court-judgment': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Thông tin Bản án, quyết định từ TAND tối cah'],
    'external-category-group': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Nhóm danh mục'],
    'external-social-security': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Nhóm bảo hiểm xã hội'],
    'external-meritorious-group': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Nhóm người có công'],
    'external-children-group': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Nhóm trẻ em'],
    'external-gender-category': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Danh mục giới tính'],
    'external-ethnic-category': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Danh mục và mã các dân tộc'],
    'external-country-nationality': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Danh mục và mã Quốc gia, Quốc tịch'],
    'external-religion-category': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Danh mục và mã các Tôn giáo'],
    'external-agency-category': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Danh mục cơ quan'],
    'external-administrative-unit': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Danh mục đơn vị hành chính'],
    'external-family-relationship': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Danh mục và mã mối quan hệ trong gia đình'],
    'external-identity-document': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Danh mục mã giấy tờ tùy thân'],
    'external-social-assistance': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL BTXH & GN - Hưởng trợ giúp XH'],
    'external-poverty-info': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL BTXH & GN - Thông tin người nghèo, cận nghèo'],
    'external-single-person': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL BTXH & GN - Người đơn thân'],
    'external-children-social-protection': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL BTXH & GN - Trẻ em là đối tượng BTXH'],
    'external-hiv-person': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL BTXH & GN - Người có HIV'],
    'external-elderly-person': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL BTXH & GN - Người cao tuổi'],
    'external-disabled-person': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL BTXH & GN - Thông tin về người khuyết tật'],
    'external-meritorious-person': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Người có công - Hồ sơ công nhận người có công'],
    'external-martyr-record': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Người có công - Hồ sơ liệt sĩ'],
    'external-meritorious-relative': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Ngời có công - Hồ sơ công nhận thân nhân người có công'],
    'external-children-info': ['Quản lý thu thập', 'Xem dữ liệu thu thập', 'CSDL Trẻ em - Trẻ em'],
    'collection-reconciliation': ['Quản lý thu thập', 'Đối soát dữ liệu'],

    // Reconciliation - External Ministry
    'reconciliation-external-ministry': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ ngoài ngành'],
    'reconciliation-external-categories': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ ngoài ngành', 'Đối soát tổng hợp các danh mục từ Bộ ngành ngoài (qua Trung tâm dữ liệu Quốc gia)'],
    'reconciliation-external-court-judgment': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ ngoài ngành', 'Đối soát tổng hợp dữ liệu về Thông tin Bản án, quyết định'],

    // Reconciliation - Internal Ministry
    'reconciliation-internal-ministry': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành'],
    'reconciliation-internal-civil-registry': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'CSDL Hộ tịch điện tử'],
    'reconciliation-internal-registry': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'HT quản lý hồ sơ QT (3)'],
    'reconciliation-internal-civil-judgment': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'CSDL thi hành án dân sự (16)'],
    'reconciliation-internal-security-measures': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'CSDL về biện pháp BD (4)'],
    'reconciliation-internal-legal-national': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'CSDL quốc gia về PL (5)'],
    'reconciliation-internal-civil-legal-center': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'CSDL TT Tư Pháp dân sự (2)'],
    'reconciliation-internal-civil-legal-info': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'HTTT trợ giúp pháp lý (6)'],
    'reconciliation-internal-legal-center': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở'],
    'reconciliation-internal-family-base': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'CSDL PB, GĐ và HG cơ sở (16)'],
    'reconciliation-internal-auction': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'CSDL quản lý đấu giá TS (24)'],
    'reconciliation-internal-international': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liu từ Bộ trong ngành', 'CSDL Hợp tác quốc tế (6)'],
    'reconciliation-internal-statistics': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'Thu thập số liệu thống kê'],
    'reconciliation-internal-notary': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'HTTT các tổ chức hành nghề công chứng'],
    'reconciliation-internal-authentication': ['Quản lý thu thập', 'Đối soát dữ liệu', 'Đối soát dữ liệu từ Bộ trong ngành', 'CSDL chứng thực'],

    // Processing
    'processed-data': ['Xử lý dữ liệu', 'Dữ liệu đã xử lý'],
    'processing-internal-data': ['Xử lý dữ liệu', 'CSDL Trong ngành'],
    'processing-data-info-civil-registry': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'CSDL Hộ tịch điện tử'],
    'processing-data-info-case-management': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'HT quản lý hồ sơ QT'],
    'processing-data-info-civil-judgment': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'CSDL thi hành án dân sự'],
    'processing-data-info-security-measures': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'CSDL về biện pháp BD'],
    'processing-data-info-legal-national': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'CSDL quốc gia về PL'],
    'processing-data-info-civil-legal-center': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'CSDL TT Tư Pháp dân sự'],
    'processing-data-info-civil-legal-info': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'HT trợ giúp pháp lý'],
    'processing-data-info-legal-center': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở'],
    'processing-data-info-family-base': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'CSDL PB, GĐ và HG cơ sở'],
    'processing-data-info-auction': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'CSDL quản lý đấu giá TS'],
    'processing-data-info-international': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'CSDL Hợp tác quốc tế'],
    'processing-collection-statistics': ['Xử lý dữ liệu', 'CSDL Trong ngành', 'Thu thập số liệu thống kê'],
    'processing-civil-registry': ['Xử lý dữ liệu', 'Dữ liệu trong ngành', 'CSDL A'],
    'processing-external-data': ['Xử lý dữ liệu', 'CSDL Ngoài ngành'],
    'processing-external-court-judgment': ['Xử lý dữ liệu', 'CSDL Ngoài ngành', 'CSDL Thông tin Bản án'],
    'processing-external-category-group': ['Xử lý dữ liệu', 'CSDL Ngoài ngành', 'Danh mục'],
    'processing-external-social-security': ['Xử lý dữ liệu', 'CSDL Ngoài ngành', 'BHXH và Giảm nghèo'],
    'processing-external-meritorious-group': ['Xử lý dữ liệu', 'CSDL Ngoài ngành', 'Người có công'],
    'processing-external-children-group': ['Xử lý dữ liệu', 'CSDL Ngoài ngành', 'Trẻ em'],

    // Category
    'category-setup': ['Quản lý danh mục', 'Thiết lập danh mục'],
    'category-list': ['Quản lý danh mục', 'Biên tập danh mục'],
    'category-a': ['Quản lý danh mục', 'Biên tập danh mục', 'Biên tập danh mục A'],
    'category-published-list': ['Quản lý danh mục', 'Công khai danh mục'],
    'category-report-group': ['Quản lý danh mục', 'Thống kê danh mục'],
    'category-report': ['Quản lý danh mục', 'Thống kê danh mục', 'Khai thác báo cáo'],
    'category-report-list': ['Quản lý danh mục', 'Thống kê danh mục', 'Báo cáo thống kê danh sách danh mục'],
    'category-report-exploitation': ['Quản lý danh mục', 'Thống kê danh mục', 'Báo cáo tình trạng khai thác danh mục'],
    'category-report-status': ['Quản lý danh mục', 'Thống kê danh mục', 'Báo cáo trạng thái danh mục'],
    'category-report-version': ['Quản lý danh mục', 'Thống kê danh mục', 'Báo cáo phiên bản danh mục'],

    // Open Data
    'open-data-setup': ['Dữ liệu mở', 'Quản lý danh mục'],
    'open-data-category-list': ['Dữ liệu mở', 'Biên tập danh mục'],
    'open-data-category-a': ['Dữ liệu mở', 'Biên tập danh mục', 'Biên tập danh mục A'],
    'open-data-published-list': ['Dữ liệu mở', 'Công bố dữ liệu mở'],
    'open-data-report': ['Dữ liệu mở', 'Thống kê dữ liệu mở'],

    // Master Data
    'master-data-scale-management': ['Quản lý dữ liệu chủ', 'Quản lý quy mô dữ liệu chủ'],
    'master-data-update': ['Quản lý dữ liệu chủ', 'Cập nhật dữ liệu chủ'],
    'master-data-update-a': ['Quản lý dữ liệu chủ', 'Cập nhật dữ liệu chủ', 'Dữ liệu chủ A'],
    'master-data-reports': ['Quản lý dữ liệu chủ', 'Báo cáo tìm kiếm dữ liệu chủ'],

    // Orchestration
    'orchestration-service-setup': ['Điều phối dữ liệu', 'Thiết lập dịch vụ'],
    'orchestration-api-management': ['Điều phối dữ liệu', 'API cung cấp dữ liệu'],
    'orchestration-reconciliation-api': ['Điều phối dữ liệu', 'API đối soát dữ liệu'],

    // Data Provision - CSDL Trong ngành
    'provision-internal': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành'],
    'provision-data-info-civil-registry': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'CSDL Hộ tịch điện tử'],
    'provision-data-info-case-management': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'HT quản lý hồ sơ QT'],
    'provision-data-info-civil-judgment': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'CSDL thi hành án dân sự'],
    'provision-data-info-security-measures': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'CSDL về biện pháp BD'],
    'provision-data-info-legal-national': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'CSDL quốc gia về PL'],
    'provision-data-info-civil-legal-center': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'CSDL TT Tư Pháp dân sự'],
    'provision-data-info-civil-legal-info': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'HT trợ giúp pháp lý'],
    'provision-data-info-legal-center': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'Phần mềm tk ngành tư pháp phục vụ chia sẻ dữ liệu mở'],
    'provision-data-info-family-base': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'CSDL PB, GĐ và HG cơ sở'],
    'provision-data-info-auction': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'CSDL quản lý đấu giá TS'],
    'provision-data-info-international': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'CSDL Hợp tác quốc tế'],
    'provision-collection-statistics': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Trong ngành', 'Thu thập số liệu thống kê'],

    // Data Provision - CSDL Ngoài ngành
    'provision-external': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Ngoài ngành'],
    'provision-external-court-judgment': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Ngoài ngành', 'CSDL Thông tin Bản án'],
    'provision-external-category-group': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Ngoài ngành', 'Danh mục'],
    'provision-external-social-security': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Ngoài ngành', 'BHXH và Giảm nghèo'],
    'provision-external-meritorious-group': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Ngoài ngành', 'Người có công'],
    'provision-external-children-group': ['Điều phối dữ liệu', 'Dịch vụ cung cấp dữ liệu', 'CSDL Ngoài ngành', 'Trẻ em'],

    // Admin
    'connection-management': ['Quản trị & vận hành', 'Danh mục đơn vị cấp dữ liệu', 'Quản lý kết nối'],
    'target-database-management': ['Quản trị & vận hành', 'Danh mục đơn vị cấp dữ liệu', 'Quản lý CSDL đích'],
    'admin-users': ['Quản trị & vận hành', 'Quản trị người dùng', 'Quản lý người dùng'],
    'admin-groups': ['Quản trị & vận hành', 'Quản trị người dùng', 'Quản lý nhóm người dùng'],
    'admin-functions': ['Quản trị & vận hành', 'Quản trị người dùng', 'Danh sách chức năng'],
    'admin-config': ['Quản trị & vận hành', 'Cấu hình hệ thống', 'Thiết lập cấu hình hệ thống'],
    'admin-password-rules': ['Quản trị & vận hành', 'Cấu hình hệ thống', 'Thiết lập quy tắc đặt mật khẩu'],
    'admin-backup': ['Quản trị & vận hành', 'Cấu hình hệ thống', 'Sao lưu dự phòng'],
    'admin-access-log': ['Quản trị & vận hành', 'Quản lý nhật ký', 'Nhật ký truy cập'],
    'admin-error-log': ['Quản trị & vận hành', 'Quản lý nhật ký', 'Nhật ký các lỗi phát sinh'],
    'admin-account-log': ['Quản trị & vận hành', 'Quản lý nhật ký', 'Nhật ký quản lý tài khoản'],
    'admin-config-log': ['Quản trị & vận hành', 'Quản lý nhật ký', 'Nhật ký thay đổi cấu hình'],
    'admin-statistics': ['Quản trị & vận hành', 'Thống kê & báo cáo', 'Xem biểu đồ thống kê'],

    // Notifications
    'notifications': ['Quản lý thông báo'],

    // User Guide
    'user-guide': ['Hướng dẫn sử dụng'],
  };

  if (pageId.startsWith('target-database-detail-')) {
    return ['Quản trị & vận hành', 'Quản lý CSDL đích', 'Chi tiết CSDL đích'];
  }

  return breadcrumbMap[pageId] || [pageConfig[pageId]?.title || 'Trang chủ'];
};