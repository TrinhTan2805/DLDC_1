import { useState, useEffect, ChangeEvent, type ReactNode } from 'react';
import { CheckCircle2, XCircle, Clock, Database, Eye, AlertCircle, Search, Info, Table2, GitMerge, Share2, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { BaseModal } from '../../common/BaseModal';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip';
import { Badge, TruncatedText, RowIconAction, Pagination, tabClass, BTN_PRIMARY, BTN_OUTLINE, BTN_DESTRUCTIVE, SEARCH_INPUT_CLS, SEARCH_BTN_CLS, LABEL_CLS, REQUIRED_MARK, FIELD_LABEL, FIELD_VALUE, SECTION_TITLE, TOOLTIP_CLS, normalizeSearch } from '../collection/collectionUi';

type ApprovalStatus = 'pending' | 'approved' | 'rejected';
type DataType = 'standard' | 'reference' | 'transactional';
type ScopeType = 'national' | 'ministry' | 'provincial' | 'internal';
type LifecycleStatus = 'draft' | 'active' | 'inactive' | 'archived';
type SourceKind = 'table' | 'view' | 'query';
type SourceGrain = '1:1' | '1:n';
type RelType = '1-1' | '1-n' | 'n-1' | 'n-n';
type SeparatorType = 'none' | '-' | '.' | '/';
type GroupRuleType = 'latest' | 'most_frequent' | 'max' | 'min';

interface ApprovalRecordSource {
  id: string;
  name: string;
  kind: SourceKind;
  grain: SourceGrain;
}

interface ApprovalRecordField {
  fieldName: string;
  displayName: string;
}

interface ApprovalRecordIdentifierConfig {
  prefix: string;
  suffix: string;
  separator: SeparatorType;
  digits: number;
  startFrom: number;
  increment: number;
  checkDuplicate: boolean;
}

interface ApprovalRecordMergeSummary {
  autoThreshold: number;
  reviewThreshold: number;
}

type MatchMethod = 'exact' | 'fuzzy';
type FuzzyAlgorithm = 'jaro_winkler' | 'levenshtein' | 'phonetic';
type ConflictStrategy = 'source' | 'priority';
type NullHandling = 'next' | 'skip';
type OnEmpty = 'required' | 'warn' | 'allow';

interface ApprovalRecordMatchingRule {
  id: string;
  fieldName: string;
  method: MatchMethod;
  algorithm?: FuzzyAlgorithm;
  fuzzyThreshold?: number;
  weight: number;
  normalize: boolean;
  operator?: 'AND' | 'OR';
}

interface ApprovalRecordSurvivorRule {
  fieldName: string;
  conflictStrategy: ConflictStrategy;
  primarySource?: string;
  priorityOrder?: string[];
  nullHandling: NullHandling;
  onEmpty: OnEmpty;
}

interface ApprovalRecordRelationship {
  id: string;
  targetEntityName: string;
  type: RelType;
  sourceKey: string;
  targetKey: string;
  displayField?: string;
  mappingTable?: string;
}

interface ApprovalRecord {
  id: string;
  code: string;
  name: string;
  dataType: DataType;
  scope: ScopeType;
  systemName?: string;
  // Ngày hiệu lực mặc định gán cho các bản ghi của thực thể, có thể chỉnh sửa khi rà soát bản ghi
  effectiveDate?: string;
  lifecycleStatus: LifecycleStatus;
  managingAgency: string;
  submittedBy: string;
  submittedDate: string;
  status: ApprovalStatus;
  description: string;
  sources: ApprovalRecordSource[];
  fields: ApprovalRecordField[];
  mapping: Record<string, Record<string, string>>;
  groupRules?: Record<string, Record<string, { ruleType: GroupRuleType; timeColumn?: string }>>;
  identifierConfig?: ApprovalRecordIdentifierConfig;
  matchingRules: ApprovalRecordMatchingRule[];
  hardBlockFields: string[];
  survivorRules: ApprovalRecordSurvivorRule[];
  mergeSummary: ApprovalRecordMergeSummary;
  relationships: ApprovalRecordRelationship[];
  reviewedBy?: string;
  reviewedDate?: string;
  reviewComment?: string;
  history: ApprovalHistory[];
}

interface ApprovalHistory {
  id: string;
  action: 'submitted' | 'approved' | 'rejected' | 'updated';
  performedBy: string;
  performedDate: string;
  comment?: string;
}

const mockApprovalRecords: ApprovalRecord[] = [
  {
    id: '1',
    code: 'MD-CITIZEN-001',
    name: 'Bộ dữ liệu chủ Công dân',
    dataType: 'standard',
    scope: 'national',
    systemName: 'CSDL quốc gia về dân cư',
    effectiveDate: '2024-01-01',
    lifecycleStatus: 'active',
    managingAgency: 'Cục Hộ tịch - Quốc tịch - Chứng thực',
    submittedBy: 'Nguyễn Văn A',
    submittedDate: '20/12/2024 14:30',
    status: 'pending',
    description: 'Dữ liệu chuẩn về công dân Việt Nam bao gồm thông tin cá nhân như họ tên, ngày sinh, số CCCD, nơi cư trú theo quy định của Luật CCCD 2023',
    sources: [
      { id: 'src-hotich', name: 'Hộ tịch', kind: 'table', grain: '1:1' },
      { id: 'src-cccd', name: 'CCCD', kind: 'table', grain: '1:1' },
    ],
    fields: [
      { fieldName: 'ho_ten', displayName: 'Họ và tên' },
      { fieldName: 'ngay_sinh', displayName: 'Ngày sinh' },
      { fieldName: 'gioi_tinh', displayName: 'Giới tính' },
      { fieldName: 'so_dinh_danh', displayName: 'Số định danh cá nhân' },
      { fieldName: 'so_cccd', displayName: 'Số CCCD' },
      { fieldName: 'que_quan', displayName: 'Quê quán' },
      { fieldName: 'dan_toc', displayName: 'Dân tộc' },
      { fieldName: 'ton_giao', displayName: 'Tôn giáo' },
      { fieldName: 'quoc_tich', displayName: 'Quốc tịch' },
      { fieldName: 'dia_chi_thuong_tru', displayName: 'Địa chỉ thường trú' },
      { fieldName: 'dia_chi_tam_tru', displayName: 'Địa chỉ tạm trú' },
      { fieldName: 'ho_ten_cha', displayName: 'Họ tên cha' },
      { fieldName: 'ho_ten_me', displayName: 'Họ tên mẹ' },
      { fieldName: 'tinh_trang_hon_nhan', displayName: 'Tình trạng hôn nhân' },
      { fieldName: 'ngay_cap_cccd', displayName: 'Ngày cấp CCCD' },
    ],
    mapping: {
      ho_ten: { 'src-hotich': 'HoTen', 'src-cccd': 'HoVaTen' },
      ngay_sinh: { 'src-hotich': 'NgaySinh', 'src-cccd': 'NgaySinh' },
      gioi_tinh: { 'src-hotich': 'GioiTinh', 'src-cccd': 'GioiTinh' },
      so_dinh_danh: { 'src-hotich': 'SoDinhDanh', 'src-cccd': '' },
      so_cccd: { 'src-hotich': '', 'src-cccd': 'SoCCCD' },
      que_quan: { 'src-hotich': 'NoiSinh', 'src-cccd': 'QueQuan' },
      dan_toc: { 'src-hotich': 'DanToc', 'src-cccd': '' },
      ton_giao: { 'src-hotich': 'TonGiao', 'src-cccd': '' },
      quoc_tich: { 'src-hotich': 'QuocTich', 'src-cccd': '' },
      dia_chi_thuong_tru: { 'src-hotich': '', 'src-cccd': 'ThuongTru' },
      dia_chi_tam_tru: { 'src-hotich': '', 'src-cccd': 'TamTru' },
      ho_ten_cha: { 'src-hotich': 'HoTenCha', 'src-cccd': '' },
      ho_ten_me: { 'src-hotich': 'HoTenMe', 'src-cccd': '' },
      tinh_trang_hon_nhan: { 'src-hotich': 'TinhTrangHonNhan', 'src-cccd': '' },
      ngay_cap_cccd: { 'src-hotich': '', 'src-cccd': 'NgayCap' },
    },
    identifierConfig: { prefix: 'CD', suffix: '', separator: '-', digits: 8, startFrom: 1, increment: 1, checkDuplicate: true },
    matchingRules: [
      { id: 'mr1-1', fieldName: 'so_dinh_danh', method: 'exact', weight: 50, normalize: false, operator: 'AND' },
      { id: 'mr1-2', fieldName: 'ho_ten', method: 'fuzzy', algorithm: 'jaro_winkler', fuzzyThreshold: 85, weight: 30, normalize: true, operator: 'AND' },
      { id: 'mr1-3', fieldName: 'ngay_sinh', method: 'exact', weight: 20, normalize: false },
    ],
    hardBlockFields: ['so_dinh_danh'],
    survivorRules: [
      { fieldName: 'ho_ten', conflictStrategy: 'priority', priorityOrder: ['src-hotich', 'src-cccd'], nullHandling: 'next', onEmpty: 'required' },
      { fieldName: 'dia_chi_thuong_tru', conflictStrategy: 'source', primarySource: 'src-cccd', nullHandling: 'next', onEmpty: 'warn' },
      { fieldName: 'ngay_sinh', conflictStrategy: 'priority', priorityOrder: ['src-hotich', 'src-cccd'], nullHandling: 'skip', onEmpty: 'required' },
    ],
    mergeSummary: { autoThreshold: 85, reviewThreshold: 70 },
    relationships: [
      { id: 'r1-1', targetEntityName: 'Bộ dữ liệu chủ Tổ chức', type: 'n-1', sourceKey: 'ho_ten_cha', targetKey: 'nguoi_dai_dien', displayField: 'ten_to_chuc' },
      { id: 'r1-2', targetEntityName: 'Bộ dữ liệu chủ Đơn vị hành chính', type: 'n-1', sourceKey: 'dia_chi_thuong_tru', targetKey: 'ma_don_vi_hanh_chinh', displayField: 'ten_don_vi' },
    ],
    history: [
      {
        id: 'h1',
        action: 'submitted',
        performedBy: 'Nguyễn Văn A',
        performedDate: '20/12/2024 14:30',
        comment: 'Gửi phê duyệt bộ dữ liệu chủ Công dân'
      }
    ]
  },
  {
    id: '2',
    code: 'MD-ORG-001',
    name: 'Bộ dữ liệu chủ Tổ chức',
    dataType: 'standard',
    scope: 'national',
    systemName: 'Hệ thống đăng ký kinh doanh quốc gia',
    lifecycleStatus: 'active',
    managingAgency: 'Cục Đăng ký kinh doanh',
    submittedBy: 'Trần Thị B',
    submittedDate: '18/12/2024 10:15',
    status: 'pending',
    description: 'Thông tin doanh nghiệp, tổ chức, cơ quan nhà nước bao gồm tên, mã số thuế, địa chỉ, người đại diện',
    sources: [
      { id: 'src-dkkd', name: 'ĐKKD', kind: 'table', grain: '1:1' },
      { id: 'src-btdp', name: 'Bổ trợ tư pháp', kind: 'view', grain: '1:n' },
    ],
    fields: [
      { fieldName: 'ma_so_thue', displayName: 'Mã số thuế' },
      { fieldName: 'ten_to_chuc', displayName: 'Tên tổ chức' },
      { fieldName: 'loai_hinh', displayName: 'Loại hình' },
      { fieldName: 'dia_chi', displayName: 'Địa chỉ' },
      { fieldName: 'nguoi_dai_dien', displayName: 'Người đại diện' },
      { fieldName: 'ngay_thanh_lap', displayName: 'Ngày thành lập' },
      { fieldName: 'von_dieu_le', displayName: 'Vốn điều lệ' },
      { fieldName: 'nganh_nghe', displayName: 'Ngành nghề kinh doanh' },
      { fieldName: 'trang_thai', displayName: 'Trạng thái hoạt động' },
      { fieldName: 'so_dien_thoai', displayName: 'Số điện thoại' },
      { fieldName: 'email', displayName: 'Email liên hệ' },
      { fieldName: 'co_quan_chu_quan', displayName: 'Cơ quan chủ quản' },
    ],
    mapping: {
      ma_so_thue: { 'src-dkkd': 'MaSoThue', 'src-btdp': '' },
      ten_to_chuc: { 'src-dkkd': 'TenDoanhNghiep', 'src-btdp': 'TenToChuc' },
      loai_hinh: { 'src-dkkd': 'LoaiHinh', 'src-btdp': '' },
      dia_chi: { 'src-dkkd': 'DiaChi', 'src-btdp': 'DiaChi' },
      nguoi_dai_dien: { 'src-dkkd': 'NguoiDaiDien', 'src-btdp': '' },
      ngay_thanh_lap: { 'src-dkkd': 'NgayDangKy', 'src-btdp': '' },
      von_dieu_le: { 'src-dkkd': 'VonDieuLe', 'src-btdp': '' },
      nganh_nghe: { 'src-dkkd': 'NganhNghe', 'src-btdp': '' },
      trang_thai: { 'src-dkkd': 'TrangThai', 'src-btdp': '' },
      so_dien_thoai: { 'src-dkkd': '', 'src-btdp': 'SoDienThoai' },
      email: { 'src-dkkd': '', 'src-btdp': 'Email' },
      co_quan_chu_quan: { 'src-dkkd': '', 'src-btdp': 'CoQuanChuQuan' },
    },
    groupRules: {
      'src-btdp': {
        ma_so_thue: { ruleType: 'latest', timeColumn: 'NgayCapNhat' },
        ten_to_chuc: { ruleType: 'latest', timeColumn: 'NgayCapNhat' },
        loai_hinh: { ruleType: 'most_frequent' },
        dia_chi: { ruleType: 'latest', timeColumn: 'NgayCapNhat' },
        nguoi_dai_dien: { ruleType: 'latest', timeColumn: 'NgayCapNhat' },
        ngay_thanh_lap: { ruleType: 'min' },
        von_dieu_le: { ruleType: 'max' },
        nganh_nghe: { ruleType: 'most_frequent' },
        trang_thai: { ruleType: 'latest', timeColumn: 'NgayCapNhat' },
        so_dien_thoai: { ruleType: 'latest', timeColumn: 'NgayCapNhat' },
        email: { ruleType: 'latest', timeColumn: 'NgayCapNhat' },
        co_quan_chu_quan: { ruleType: 'most_frequent' },
      },
    },
    identifierConfig: { prefix: 'TC', suffix: '', separator: '-', digits: 6, startFrom: 1, increment: 1, checkDuplicate: true },
    matchingRules: [
      { id: 'mr2-1', fieldName: 'ma_so_thue', method: 'exact', weight: 70, normalize: false, operator: 'AND' },
      { id: 'mr2-2', fieldName: 'ten_to_chuc', method: 'fuzzy', algorithm: 'jaro_winkler', fuzzyThreshold: 80, weight: 30, normalize: true },
    ],
    hardBlockFields: ['ma_so_thue'],
    survivorRules: [
      { fieldName: 'ten_to_chuc', conflictStrategy: 'source', primarySource: 'src-dkkd', nullHandling: 'next', onEmpty: 'required' },
      { fieldName: 'dia_chi', conflictStrategy: 'priority', priorityOrder: ['src-btdp', 'src-dkkd'], nullHandling: 'next', onEmpty: 'warn' },
      { fieldName: 'nguoi_dai_dien', conflictStrategy: 'source', primarySource: 'src-dkkd', nullHandling: 'skip', onEmpty: 'allow' },
    ],
    mergeSummary: { autoThreshold: 80, reviewThreshold: 65 },
    relationships: [
      { id: 'r2-1', targetEntityName: 'Bộ dữ liệu chủ Công dân', type: '1-n', sourceKey: 'nguoi_dai_dien', targetKey: 'ho_ten', displayField: 'ho_ten' },
    ],
    history: [
      {
        id: 'h2',
        action: 'submitted',
        performedBy: 'Trần Thị B',
        performedDate: '18/12/2024 10:15',
        comment: 'Gửi phê duyệt bộ dữ liệu chủ Tổ chức'
      }
    ]
  },
  {
    id: '3',
    code: 'MD-DOC-001',
    name: 'Bộ dữ liệu chủ Văn bản pháp luật',
    dataType: 'reference',
    scope: 'ministry',
    systemName: 'Cơ sở dữ liệu quốc gia về văn bản pháp luật',
    lifecycleStatus: 'active',
    managingAgency: 'Bộ Tư pháp',
    submittedBy: 'Lê Văn C',
    submittedDate: '15/12/2024 16:45',
    status: 'approved',
    description: 'Danh mục văn bản pháp luật, nghị định, thông tư, quyết định',
    sources: [
      { id: 'src-vbqppl', name: 'CSDL Văn bản QPPL', kind: 'table', grain: '1:1' },
      { id: 'src-congbao', name: 'Công báo điện tử', kind: 'view', grain: '1:1' },
    ],
    fields: [
      { fieldName: 'so_hieu_vb', displayName: 'Số hiệu văn bản' },
      { fieldName: 'ten_van_ban', displayName: 'Tên văn bản' },
      { fieldName: 'loai_van_ban', displayName: 'Loại văn bản' },
      { fieldName: 'co_quan_ban_hanh', displayName: 'Cơ quan ban hành' },
      { fieldName: 'ngay_ban_hanh', displayName: 'Ngày ban hành' },
      { fieldName: 'ngay_hieu_luc', displayName: 'Ngày hiệu lực' },
      { fieldName: 'ngay_het_hieu_luc', displayName: 'Ngày hết hiệu lực' },
      { fieldName: 'trang_thai_hieu_luc', displayName: 'Trạng thái hiệu lực' },
      { fieldName: 'linh_vuc', displayName: 'Lĩnh vực' },
      { fieldName: 'nguoi_ky', displayName: 'Người ký' },
      { fieldName: 'chuc_vu_nguoi_ky', displayName: 'Chức vụ người ký' },
      { fieldName: 'so_trang', displayName: 'Số trang' },
      { fieldName: 'file_dinh_kem', displayName: 'File đính kèm' },
      { fieldName: 'van_ban_can_cu', displayName: 'Văn bản căn cứ' },
      { fieldName: 'van_ban_thay_the', displayName: 'Văn bản thay thế' },
      { fieldName: 'van_ban_lien_quan', displayName: 'Văn bản liên quan' },
      { fieldName: 'tom_tat_noi_dung', displayName: 'Tóm tắt nội dung' },
      { fieldName: 'tu_khoa', displayName: 'Từ khóa' },
      { fieldName: 'ngon_ngu', displayName: 'Ngôn ngữ' },
      { fieldName: 'phan_loai_mat', displayName: 'Phân loại mật' },
    ],
    mapping: {
      so_hieu_vb: { 'src-vbqppl': 'SoHieuVB', 'src-congbao': 'SoHieuVB' },
      ten_van_ban: { 'src-vbqppl': 'TenVanBan', 'src-congbao': 'TieuDe' },
      loai_van_ban: { 'src-vbqppl': 'LoaiVanBan', 'src-congbao': '' },
      co_quan_ban_hanh: { 'src-vbqppl': 'CoQuanBanHanh', 'src-congbao': '' },
      ngay_ban_hanh: { 'src-vbqppl': 'NgayBanHanh', 'src-congbao': 'NgayDang' },
      ngay_hieu_luc: { 'src-vbqppl': 'NgayHieuLuc', 'src-congbao': '' },
      ngay_het_hieu_luc: { 'src-vbqppl': 'NgayHetHieuLuc', 'src-congbao': '' },
      trang_thai_hieu_luc: { 'src-vbqppl': 'TrangThai', 'src-congbao': '' },
      linh_vuc: { 'src-vbqppl': 'LinhVuc', 'src-congbao': '' },
      nguoi_ky: { 'src-vbqppl': 'NguoiKy', 'src-congbao': '' },
      chuc_vu_nguoi_ky: { 'src-vbqppl': 'ChucVu', 'src-congbao': '' },
      so_trang: { 'src-vbqppl': 'SoTrang', 'src-congbao': '' },
      file_dinh_kem: { 'src-vbqppl': 'FileDinhKem', 'src-congbao': 'FilePDF' },
      van_ban_can_cu: { 'src-vbqppl': 'VanBanCanCu', 'src-congbao': '' },
      van_ban_thay_the: { 'src-vbqppl': 'VanBanThayThe', 'src-congbao': '' },
      van_ban_lien_quan: { 'src-vbqppl': 'VanBanLienQuan', 'src-congbao': '' },
      tom_tat_noi_dung: { 'src-vbqppl': 'TomTat', 'src-congbao': '' },
      tu_khoa: { 'src-vbqppl': 'TuKhoa', 'src-congbao': '' },
      ngon_ngu: { 'src-vbqppl': 'NgonNgu', 'src-congbao': '' },
      phan_loai_mat: { 'src-vbqppl': 'PhanLoaiMat', 'src-congbao': '' },
    },
    identifierConfig: { prefix: 'VB', suffix: '', separator: '/', digits: 6, startFrom: 1, increment: 1, checkDuplicate: true },
    matchingRules: [
      { id: 'mr3-1', fieldName: 'so_hieu_vb', method: 'exact', weight: 60, normalize: false, operator: 'AND' },
      { id: 'mr3-2', fieldName: 'ten_van_ban', method: 'fuzzy', algorithm: 'levenshtein', fuzzyThreshold: 85, weight: 20, normalize: true, operator: 'AND' },
      { id: 'mr3-3', fieldName: 'ngay_ban_hanh', method: 'exact', weight: 10, normalize: false, operator: 'AND' },
      { id: 'mr3-4', fieldName: 'co_quan_ban_hanh', method: 'exact', weight: 10, normalize: false },
    ],
    hardBlockFields: ['so_hieu_vb'],
    survivorRules: [
      { fieldName: 'ten_van_ban', conflictStrategy: 'source', primarySource: 'src-vbqppl', nullHandling: 'next', onEmpty: 'required' },
      { fieldName: 'ngay_hieu_luc', conflictStrategy: 'priority', priorityOrder: ['src-vbqppl', 'src-congbao'], nullHandling: 'next', onEmpty: 'warn' },
    ],
    mergeSummary: { autoThreshold: 90, reviewThreshold: 75 },
    relationships: [
      { id: 'r3-1', targetEntityName: 'Bộ dữ liệu chủ Đơn vị hành chính', type: 'n-1', sourceKey: 'co_quan_ban_hanh', targetKey: 'ma_don_vi_hanh_chinh', displayField: 'ten_don_vi' },
      { id: 'r3-2', targetEntityName: 'Bộ dữ liệu chủ Công dân', type: 'n-1', sourceKey: 'nguoi_ky', targetKey: 'ho_ten', displayField: 'ho_ten' },
      { id: 'r3-3', targetEntityName: 'Bộ dữ liệu chủ Tổ chức', type: '1-n', sourceKey: 'so_hieu_vb', targetKey: 'ma_so_thue', displayField: 'ten_to_chuc' },
    ],
    reviewedBy: 'Phó Cục trưởng Nguyễn Xuân D',
    reviewedDate: '16/12/2024 09:20',
    reviewComment: 'Đã xem xét kỹ lưỡng. Cấu trúc dữ liệu hợp lý, quy tắc hợp nhất và định danh đầy đủ. Phê duyệt.',
    history: [
      {
        id: 'h3-1',
        action: 'submitted',
        performedBy: 'Lê Văn C',
        performedDate: '15/12/2024 16:45',
        comment: 'Gửi phê duyệt bộ dữ liệu chủ Văn bản pháp luật'
      },
      {
        id: 'h3-2',
        action: 'approved',
        performedBy: 'Phó Cục trưởng Nguyễn Xuân D',
        performedDate: '16/12/2024 09:20',
        comment: 'Đã xem xét kỹ lưỡng. Cấu trúc dữ liệu hợp lý, quy tắc hợp nhất và định danh đầy đủ. Phê duyệt.'
      }
    ]
  },
  {
    id: '4',
    code: 'MD-ADMIN-001',
    name: 'Bộ dữ liệu chủ Đơn vị hành chính',
    dataType: 'reference',
    scope: 'national',
    systemName: '',
    lifecycleStatus: 'draft',
    managingAgency: 'Bộ Nội vụ',
    submittedBy: 'Phạm Thị D',
    submittedDate: '10/12/2024 11:00',
    status: 'rejected',
    description: 'Danh mục 63 tỉnh/thành phố, quận/huyện, phường/xã của Việt Nam',
    sources: [
      { id: 'src-noivu', name: 'Danh mục ĐVHC Bộ Nội vụ', kind: 'table', grain: '1:1' },
    ],
    fields: [
      { fieldName: 'ma_don_vi_hanh_chinh', displayName: 'Mã đơn vị hành chính' },
      { fieldName: 'ten_don_vi', displayName: 'Tên đơn vị' },
      { fieldName: 'cap_hanh_chinh', displayName: 'Cấp hành chính' },
      { fieldName: 'ma_tinh', displayName: 'Mã tỉnh' },
      { fieldName: 'ma_huyen', displayName: 'Mã huyện' },
      { fieldName: 'ma_xa', displayName: 'Mã xã' },
      { fieldName: 'dan_so', displayName: 'Dân số' },
      { fieldName: 'dien_tich', displayName: 'Diện tích' },
    ],
    mapping: {
      ma_don_vi_hanh_chinh: { 'src-noivu': 'MaDVHC' },
      ten_don_vi: { 'src-noivu': 'TenDonVi' },
      cap_hanh_chinh: { 'src-noivu': 'CapHanhChinh' },
      ma_tinh: { 'src-noivu': 'MaTinh' },
      ma_huyen: { 'src-noivu': 'MaHuyen' },
      ma_xa: { 'src-noivu': 'MaXa' },
      dan_so: { 'src-noivu': 'DanSo' },
      dien_tich: { 'src-noivu': 'DienTich' },
    },
    matchingRules: [
      { id: 'mr4-1', fieldName: 'ma_don_vi_hanh_chinh', method: 'exact', weight: 100, normalize: false },
    ],
    hardBlockFields: [],
    survivorRules: [],
    mergeSummary: { autoThreshold: 75, reviewThreshold: 60 },
    relationships: [],
    reviewedBy: 'Phó Cục trưởng Nguyễn Xuân D',
    reviewedDate: '11/12/2024 14:30',
    reviewComment: 'Thiếu quy tắc định danh duy nhất. Cần bổ sung quy tắc hợp nhất từ các nguồn khác nhau. Vui lòng hoàn thiện và gửi lại.',
    history: [
      {
        id: 'h4-1',
        action: 'submitted',
        performedBy: 'Phạm Thị D',
        performedDate: '10/12/2024 11:00',
        comment: 'Gửi phê duyệt bộ dữ liệu chủ Đơn vị hành chính'
      },
      {
        id: 'h4-2',
        action: 'rejected',
        performedBy: 'Phó Cục trưởng Nguyễn Xuân D',
        performedDate: '11/12/2024 14:30',
        comment: 'Thiếu quy tắc định danh duy nhất. Cần bổ sung quy tắc hợp nhất từ các nguồn khác nhau. Vui lòng hoàn thiện và gửi lại.'
      }
    ]
  }
];

const dataTypeLabels: Record<DataType, string> = {
  standard: 'Dữ liệu chuẩn',
  reference: 'Dữ liệu tham chiếu',
  transactional: 'Dữ liệu giao dịch'
};

const scopeTypeLabels: Record<ScopeType, string> = {
  national: 'Cấp quốc gia',
  ministry: 'Cấp bộ',
  provincial: 'Cấp tỉnh/thành',
  internal: 'Nội bộ',
};

const lifecycleStatusLabels: Record<LifecycleStatus, string> = {
  draft: 'Đang soạn thảo',
  active: 'Đã hiệu lực',
  inactive: 'Ngừng sử dụng',
  archived: 'Đã lưu trữ',
};

// Variant Badge chuẩn theo loại quan hệ
const relTypeColors: Record<RelType, string> = {
  '1-1': 'emerald',
  '1-n': 'blue',
  'n-1': 'indigo',
  'n-n': 'purple',
};

const groupRuleLabels: Record<GroupRuleType, string> = {
  latest: 'Bản ghi mới nhất',
  most_frequent: 'Xuất hiện nhiều nhất',
  max: 'Lớn nhất',
  min: 'Nhỏ nhất',
};

const matchMethodLabels: Record<MatchMethod, string> = {
  exact: 'Khớp tuyệt đối',
  fuzzy: 'Khớp gần đúng',
};

const fuzzyAlgorithmLabels: Record<FuzzyAlgorithm, string> = {
  jaro_winkler: 'Tương đồng chuỗi',
  levenshtein: 'Khoảng cách chỉnh sửa',
  phonetic: 'Ngữ âm',
};

const conflictStrategyLabels: Record<ConflictStrategy, string> = {
  source: 'Theo nguồn',
  priority: 'Độ ưu tiên',
};

const nullHandlingLabels: Record<NullHandling, string> = {
  next: 'Nguồn kế',
  skip: 'Bỏ qua',
};

const onEmptyLabels: Record<OnEmpty, string> = {
  required: 'Bắt buộc',
  warn: 'Cảnh báo',
  allow: 'Cho phép trống',
};

const separatorLabels: Record<SeparatorType, string> = {
  none: 'Không có',
  '-': 'Gạch ngang (-)',
  '.': 'Dấu chấm (.)',
  '/': 'Gạch chéo (/)',
};

// Variant Badge chuẩn theo trạng thái phê duyệt
const statusBadgeClass: Record<ApprovalStatus, string> = {
  pending: 'orange',
  approved: 'green',
  rejected: 'red'
};

const statusLabels: Record<ApprovalStatus, string> = {
  pending: 'Chờ phê duyệt',
  approved: 'Đã phê duyệt',
  rejected: 'Từ chối'
};

// Bảng chuẩn (mục 5.3)
const TH = 'px-3 py-[13px] leading-4 font-bold text-black whitespace-nowrap text-[13px]';
const TD = 'px-3 py-1 text-[13px] text-black';
const TR = 'h-12 bg-white border-b border-[#E0E0E0] hover:bg-[#F8FAFC] transition-colors';
const TABLE_CLS = 'w-full border-collapse collection-table approval-detail-table text-[13px]';
const CHECKBOX_CLS = 'w-4 h-4 accent-blue-600 rounded cursor-pointer align-middle';
const TEXTAREA_CLS = 'w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#020817] bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none';
// Thẻ nhóm + tiêu đề nhóm trong modal chi tiết
const GROUP_CARD = 'rounded-2xl border border-[#E2E8F0] bg-white';
const GROUP_TITLE = 'text-[14px] font-medium text-[#020817]';
const GROUP_DESC = 'text-[13px] text-[#64748B] mt-0.5';
// Nút lọc nhanh dạng chip: đang chọn nền #EAF3FF viền #BFDBFE chữ #155DFC; thường = BTN_OUTLINE
const chipClass = (active: boolean) => active ? `${BTN_OUTLINE} !bg-[#EAF3FF] !border-[#BFDBFE] !text-[#155DFC]` : BTN_OUTLINE;

// Cặp nhãn – giá trị chỉ đọc (mục 5.17)
function InfoField({ label, children, className = '' }: { label: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <div className={FIELD_LABEL}>{label}</div>
      <div className={`${FIELD_VALUE} mt-1 break-words`}>{children}</div>
    </div>
  );
}

// Ngày + giờ hiển thị 2 dòng (giờ màu #64748B)
function DateTimeCell({ value }: { value: string }) {
  const [d, ...t] = (value || '').split(' ');
  const time = t.join(' ');
  return (
    <div className="leading-[18px]">
      <div>{d}</div>
      {time && <div className="text-[#64748B]">{time}</div>}
    </div>
  );
}

export function ApprovalTab() {
  const [records, setRecords] = useState<ApprovalRecord[]>(mockApprovalRecords);
  const [selectedRecord, setSelectedRecord] = useState<ApprovalRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailTab, setDetailTab] = useState<'general' | 'attributes' | 'merge' | 'relations' | 'identifier'>('general');
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject'>('approve');
  const [comment, setComment] = useState('');
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | 'all'>('all');

  // Bulk actions
  const [bulkTargetIds, setBulkTargetIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Search — searchInput: giá trị đang gõ; searchTerm: giá trị đã áp dụng (chỉ cập nhật khi bấm Tìm kiếm / Enter)
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const runSearch = () => setSearchTerm(searchInput);

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const pendingCount = records.filter(r => r.status === 'pending').length;
  const approvedCount = records.filter(r => r.status === 'approved').length;
  const rejectedCount = records.filter(r => r.status === 'rejected').length;
  const totalCount = records.length;

  const filteredRecords = records.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const q = normalizeSearch(searchTerm);
    const matchesSearch = !q || normalizeSearch(r.code).includes(q) || normalizeSearch(r.name).includes(q);
    return matchesStatus && matchesSearch;
  });

  useEffect(() => { setCurrentPage(1); setSelectedIds([]); }, [filterStatus, searchTerm]);

  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const pendingIds = filteredRecords.filter(r => r.status === 'pending').map(r => r.id);

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(prev => prev.length === pendingIds.length ? [] : pendingIds);
  };

  const handleViewDetail = (record: ApprovalRecord) => {
    setSelectedRecord(record);
    setDetailTab('general');
    setShowDetailModal(true);
  };

  const handleApprove = (record: ApprovalRecord) => {
    setSelectedRecord(record);
    setBulkTargetIds([]);
    setApprovalAction('approve');
    setComment('');
    setShowApprovalForm(true);
  };

  const handleReject = (record: ApprovalRecord) => {
    setSelectedRecord(record);
    setBulkTargetIds([]);
    setApprovalAction('reject');
    setComment('');
    setShowApprovalForm(true);
  };

  const handleQuickApprove = (ids: string[]) => {
    setSelectedRecord(null);
    setBulkTargetIds(ids);
    setApprovalAction('approve');
    setComment('');
    setShowApprovalForm(true);
  };

  const handleQuickReject = (ids: string[]) => {
    setSelectedRecord(null);
    setBulkTargetIds(ids);
    setApprovalAction('reject');
    setComment('');
    setShowApprovalForm(true);
  };

  const targetRecords = bulkTargetIds.length > 0
    ? records.filter(r => bulkTargetIds.includes(r.id))
    : selectedRecord ? [selectedRecord] : [];

  const handleSubmitApproval = () => {
    const targetIds = targetRecords.map(r => r.id);
    if (targetIds.length === 0) return;

    if (approvalAction === 'reject' && !comment.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }

    const now = new Date();
    const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedRecords = records.map(r => {
      if (!targetIds.includes(r.id)) return r;
      const newHistory: ApprovalHistory = {
        id: `h-${Date.now()}-${r.id}`,
        action: approvalAction === 'approve' ? 'approved' : 'rejected',
        performedBy: 'Phó Cục trưởng Nguyễn Xuân D', // Current user
        performedDate: dateStr,
        comment: comment || undefined
      };
      return {
        ...r,
        status: (approvalAction === 'approve' ? 'approved' : 'rejected') as ApprovalStatus,
        reviewedBy: 'Phó Cục trưởng Nguyễn Xuân D',
        reviewedDate: dateStr,
        reviewComment: comment,
        history: [...r.history, newHistory]
      };
    });

    setRecords(updatedRecords);
    setShowApprovalForm(false);
    setSelectedRecord(null);
    setBulkTargetIds([]);
    setSelectedIds([]);
    setComment('');

    const actionText = approvalAction === 'approve' ? 'phê duyệt' : 'từ chối';
    toast.success(`Đã ${actionText} thành công ${targetIds.length} bản ghi!`);
  };

  const statCards = [
    { label: 'Chờ phê duyệt', value: pendingCount, icon: Clock, bg: 'bg-orange-50', fg: 'text-orange-600' },
    { label: 'Đã phê duyệt', value: approvedCount, icon: CheckCircle2, bg: 'bg-green-50', fg: 'text-green-600' },
    { label: 'Từ chối', value: rejectedCount, icon: XCircle, bg: 'bg-red-50', fg: 'text-red-600' },
    { label: 'Tổng dữ liệu chủ', value: totalCount, icon: Database, bg: 'bg-blue-50', fg: 'text-blue-600' },
  ];

  const detailTabs = [
    { key: 'general' as const, label: 'Thông tin chung', icon: Info },
    { key: 'attributes' as const, label: 'Thuộc tính', icon: Table2 },
    { key: 'merge' as const, label: 'Quy tắc hợp nhất', icon: GitMerge },
    { key: 'relations' as const, label: 'Quan hệ', icon: Share2 },
    { key: 'identifier' as const, label: 'Định danh', icon: Hash },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-[16px] font-semibold text-[#020817]">Phê duyệt dữ liệu chủ</h2>
          <p className="text-[13px] text-[#64748B] mt-0.5">Lãnh đạo nghiệp vụ xem xét và phê duyệt các bộ dữ liệu chủ chờ phê duyệt</p>
        </div>

        {/* Bulk action bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-[#475569]">
              Đã chọn: <span className="font-medium text-blue-600">{selectedIds.length}</span> bản ghi
            </span>
            <button
              type="button"
              onClick={() => handleQuickApprove(selectedIds)}
              className={BTN_PRIMARY}
            >
              <CheckCircle2 className="w-4 h-4" />
              Phê duyệt nhanh
            </button>
            <button
              type="button"
              onClick={() => handleQuickReject(selectedIds)}
              className={BTN_DESTRUCTIVE}
            >
              <XCircle className="w-4 h-4" />
              Từ chối nhanh
            </button>
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border border-[#E2E8F0] p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon className={`w-5 h-5 ${card.fg}`} />
                </div>
                <div>
                  <div className="text-[16px] text-[#64748B]">{card.label}</div>
                  <div className="text-[16px] font-semibold text-[#0F172A] tabular-nums">{card.value}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Status Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 flex items-center gap-1.5">
          <input
            type="text"
            aria-label="Tìm kiếm bộ dữ liệu chủ"
            title="Tìm kiếm bộ dữ liệu chủ"
            placeholder="Tìm kiếm theo mã, tên bộ dữ liệu chủ..."
            value={searchInput}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            className={SEARCH_INPUT_CLS}
          />
          <button
            type="button"
            aria-label="Tìm kiếm"
            title="Tìm kiếm"
            onClick={runSearch}
            className={SEARCH_BTN_CLS}
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { key: 'all' as const, label: `Tất cả (${totalCount})` },
            { key: 'pending' as const, label: `Chờ phê duyệt (${pendingCount})` },
            { key: 'approved' as const, label: `Đã phê duyệt (${approvedCount})` },
            { key: 'rejected' as const, label: `Từ chối (${rejectedCount})` },
          ].map(opt => (
            <button
              key={opt.key}
              type="button"
              aria-pressed={filterStatus === opt.key}
              onClick={() => setFilterStatus(opt.key)}
              className={chipClass(filterStatus === opt.key)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse collection-table text-[13px]">
            <thead className="bg-[#F8FAFC]">
              <tr className="h-[42px] border-b border-[#E0E0E0]">
                <th className={`${TH} text-center w-12`}>
                  <input
                    type="checkbox"
                    title="Chọn tất cả"
                    aria-label="Chọn tất cả"
                    checked={pendingIds.length > 0 && selectedIds.length === pendingIds.length}
                    onChange={toggleSelectAll}
                    className={CHECKBOX_CLS}
                  />
                </th>
                <th className={`${TH} text-center w-14`}>STT</th>
                <th className={`${TH} text-left`}>Mã</th>
                <th className={`${TH} text-left`}>Tên dữ liệu chủ</th>
                <th className={`${TH} text-left`}>Loại dữ liệu</th>
                <th className={`${TH} text-left`}>Cơ quan quản lý</th>
                <th className={`${TH} text-left`}>Ngày gửi</th>
                <th className={`${TH} text-left`}>Người gửi</th>
                <th className={`${TH} text-left`}>Trạng thái</th>
                <th className={`${TH} text-center w-[120px] sticky right-0 bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <AlertCircle className="w-12 h-12 text-[#CBD5E1] stroke-[1.5] mx-auto mb-3" />
                    <p className="text-[13px] text-[#64748B]">Không có dữ liệu chủ nào trong trạng thái này</p>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record, index) => {
                  const isPending = record.status === 'pending';
                  return (
                    <tr key={record.id} className={`group ${TR}`}>
                      <td className={`${TD} text-center`}>
                        {isPending && (
                          <input
                            type="checkbox"
                            title="Chọn bản ghi"
                            aria-label="Chọn bản ghi"
                            checked={selectedIds.includes(record.id)}
                            onChange={() => toggleSelectOne(record.id)}
                            className={CHECKBOX_CLS}
                          />
                        )}
                      </td>
                      <td className={`${TD} text-center`}>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={record.code} /></td>
                      <td className={`${TD} max-w-[360px]`}><TruncatedText text={record.name} /></td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={dataTypeLabels[record.dataType]} /></td>
                      <td className={`${TD} max-w-[260px]`}><TruncatedText text={record.managingAgency} /></td>
                      <td className={`${TD} whitespace-nowrap`}><DateTimeCell value={record.submittedDate} /></td>
                      <td className={`${TD} max-w-[200px]`}><TruncatedText text={record.submittedBy} /></td>
                      <td className={TD}>
                        <Badge label={statusLabels[record.status]} variant={statusBadgeClass[record.status]} />
                      </td>
                      <td className={`${TD} text-center sticky right-0 bg-white group-hover:bg-[#F8FAFC] shadow-[-1px_0_0_#E2E8F0]`}>
                        <div className="flex items-center justify-center gap-1">
                          <RowIconAction label="Xem chi tiết" onClick={() => handleViewDetail(record)}>
                            <Eye className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction
                            label="Phê duyệt"
                            onClick={() => { if (isPending) handleApprove(record); }}
                            disabledReason={isPending ? undefined : 'Đã xử lý'}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </RowIconAction>
                          <RowIconAction
                            label="Từ chối"
                            onClick={() => { if (isPending) handleReject(record); }}
                            disabledReason={isPending ? undefined : 'Đã xử lý'}
                          >
                            <XCircle className="w-4 h-4" />
                          </RowIconAction>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filteredRecords.length > 0 && (
          <Pagination
            className="border-t border-[#E2E8F0]"
            currentPage={currentPage}
            totalItems={filteredRecords.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </div>

      {/* Detail Modal */}
      <BaseModal
        isOpen={showDetailModal && !!selectedRecord}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết dữ liệu chủ"
        subtitle={selectedRecord ? `${selectedRecord.code} · ${selectedRecord.name}` : undefined}
        maxWidth="max-w-4xl"
        footer={
          <button
            type="button"
            onClick={() => setShowDetailModal(false)}
            className={BTN_OUTLINE}
          >
            Đóng
          </button>
        }
      >
        {selectedRecord && (
          <div className="space-y-6 text-left">
            {/* Tabs */}
            <div className="flex items-center border-b border-[#E2E8F0] -mt-2 overflow-x-auto">
              {detailTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setDetailTab(tab.key)}
                    className={`${tabClass(detailTab === tab.key)} whitespace-nowrap`}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            {detailTab === 'general' && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h4 className={SECTION_TITLE}>Thông tin cơ bản</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <InfoField label="Mã thực thể:">{selectedRecord.code}</InfoField>
                    <InfoField label="Tên dữ liệu chủ:">{selectedRecord.name}</InfoField>
                    <InfoField label="Loại thực thể:">{dataTypeLabels[selectedRecord.dataType]}</InfoField>
                    <InfoField label="Phạm vi sử dụng:">{scopeTypeLabels[selectedRecord.scope]}</InfoField>
                    <InfoField label="Đơn vị chủ quản:">{selectedRecord.managingAgency}</InfoField>
                    <InfoField label="Trạng thái vòng đời:">{lifecycleStatusLabels[selectedRecord.lifecycleStatus]}</InfoField>
                    <InfoField label="Tên CSDL/Hệ thống:">{selectedRecord.systemName || '—'}</InfoField>
                    <InfoField
                      label={
                        <span className="inline-flex items-center gap-1.5">
                          Ngày hiệu lực:
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" aria-label="Giải thích ngày hiệu lực" className="inline-flex text-[#94A3B8] hover:text-[#475569] cursor-help rounded outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                                <Info className="w-4 h-4" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" sideOffset={4} className={`${TOOLTIP_CLS} w-72 font-normal leading-relaxed`}>
                              Thời gian hiệu lực sẽ được gán với từng bản ghi trong thực thể dữ liệu chủ, hiệu lực của bản ghi có thể chỉnh sửa khi thực hiện rà soát bản ghi.
                            </TooltipContent>
                          </Tooltip>
                        </span>
                      }
                    >
                      {selectedRecord.effectiveDate || '—'}
                    </InfoField>
                    <InfoField label="Nguồn dữ liệu đăng ký:">{selectedRecord.sources.length > 0 ? selectedRecord.sources.map(s => s.name).join(', ') : '—'}</InfoField>
                    <InfoField label="Mô tả đối tượng:" className="col-span-2">{selectedRecord.description}</InfoField>
                  </div>
                </div>

                {/* Submission Info */}
                <div className="border-t border-[#E2E8F0] pt-6">
                  <h4 className={SECTION_TITLE}>Thông tin gửi phê duyệt</h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">
                    <InfoField label="Người gửi:">{selectedRecord.submittedBy}</InfoField>
                    <InfoField label="Ngày gửi:">{selectedRecord.submittedDate}</InfoField>
                  </div>
                  <div className={FIELD_LABEL}>Nội dung gửi duyệt:</div>
                  <p className={`${FIELD_VALUE} mt-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3`}>
                    {selectedRecord.history.find(h => h.action === 'submitted')?.comment || '—'}
                  </p>
                </div>

                {/* Review Info */}
                {selectedRecord.reviewedBy && (
                  <div className="border-t border-[#E2E8F0] pt-6">
                    <h4 className={SECTION_TITLE}>Thông tin phê duyệt</h4>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-4">
                      <InfoField label="Người phê duyệt:">{selectedRecord.reviewedBy}</InfoField>
                      <InfoField label="Ngày phê duyệt:">{selectedRecord.reviewedDate}</InfoField>
                    </div>
                    {selectedRecord.reviewComment && (
                      <>
                        <div className={FIELD_LABEL}>Nhận xét:</div>
                        <p className={`${FIELD_VALUE} mt-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3`}>
                          {selectedRecord.reviewComment}
                        </p>
                      </>
                    )}
                  </div>
                )}

                {/* History Timeline */}
                <div className="border-t border-[#E2E8F0] pt-6">
                  <h4 className={SECTION_TITLE}>Lịch sử cập nhật ({selectedRecord.history.length})</h4>
                  <div className="space-y-3">
                    {selectedRecord.history.map((h, index) => (
                      <div key={h.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${h.action === 'approved' ? 'bg-green-50' :
                            h.action === 'rejected' ? 'bg-red-50' :
                              'bg-blue-50'
                            }`}>
                            {h.action === 'approved' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                              h.action === 'rejected' ? <XCircle className="w-4 h-4 text-red-600" /> :
                                <Clock className="w-4 h-4 text-blue-600" />}
                          </div>
                          {index < selectedRecord.history.length - 1 && (
                            <div className="w-0.5 h-8 bg-[#E2E8F0]" />
                          )}
                        </div>
                        <div className="flex-1 pb-3 min-w-0">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-[13px] font-medium text-[#020817]">
                              {h.action === 'submitted' ? 'Gửi phê duyệt' :
                                h.action === 'approved' ? 'Đã phê duyệt' :
                                  h.action === 'rejected' ? 'Từ chối' : 'Cập nhật'}
                            </span>
                            <span className="text-[13px] text-[#64748B]">• {h.performedDate}</span>
                          </div>
                          <p className="text-[13px] text-[#475569] mb-1">Bởi: <span className="font-medium text-[#020817]">{h.performedBy}</span></p>
                          {h.comment && (
                            <p className="text-[13px] text-[#020817] bg-white border border-[#E2E8F0] rounded-lg p-2 mt-2">
                              {h.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {detailTab === 'attributes' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={GROUP_TITLE}>Các trường dữ liệu</h4>
                  <Badge label={`${selectedRecord.fields.length} trường`} variant="blue" />
                </div>
                {selectedRecord.fields.length === 0 ? (
                  <p className="text-[13px] text-[#64748B] text-center py-4">Chưa có trường dữ liệu nào</p>
                ) : (
                  <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-x-auto">
                    <table className={TABLE_CLS}>
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px] border-b border-[#E0E0E0]">
                          <th className={`${TH} text-left`}>Thuộc tính</th>
                          {selectedRecord.sources.map(src => (
                            <th key={src.id} className={`${TH} text-left`}>{src.name}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.fields.map(f => (
                          <tr key={f.fieldName} className={TR}>
                            <td className={`${TD} max-w-[280px] leading-[18px]`}>
                              <TruncatedText text={f.displayName} />
                              <TruncatedText text={f.fieldName} className="text-[#64748B]" />
                            </td>
                            {selectedRecord.sources.map(src => (
                              <td key={src.id} className={`${TD} max-w-[200px]`}>
                                <TruncatedText text={selectedRecord.mapping[f.fieldName]?.[src.id] || '—'} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Gom nguồn 1:n — chỉ hiện khi có ít nhất 1 nguồn độ mịn 1:n */}
                {selectedRecord.sources.filter(s => s.grain === '1:n').length > 0 && (
                  <div className={`${GROUP_CARD} overflow-hidden mt-6`}>
                    <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between gap-3">
                      <h4 className={GROUP_TITLE}>Gom nguồn 1:n</h4>
                      <Badge label={`${selectedRecord.sources.filter(s => s.grain === '1:n').length} nguồn 1:n`} variant="emerald" />
                    </div>
                    <div className="p-4 space-y-4">
                      <p className="text-[13px] text-[#64748B]">Với nguồn có độ mịn 1:n, chọn quy tắc gom nhiều bản ghi thành một giá trị cho từng thuộc tính</p>
                      {selectedRecord.sources.filter(s => s.grain === '1:n').map(src => (
                        <div key={src.id} className="border border-[#E2E8F0] rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                            <span className="text-[13px] font-medium text-[#020817]">Nguồn (1:n): {src.name}</span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className={TABLE_CLS}>
                              <thead className="bg-[#F8FAFC]">
                                <tr className="h-[42px] border-b border-[#E0E0E0]">
                                  <th className={`${TH} text-left`}>Thuộc tính</th>
                                  <th className={`${TH} text-left`}>Rule gom</th>
                                  <th className={`${TH} text-left`}>Cột mốc thời gian</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedRecord.fields.map(f => {
                                  const gr = selectedRecord.groupRules?.[src.id]?.[f.fieldName];
                                  return (
                                    <tr key={f.fieldName} className={TR}>
                                      <td className={`${TD} max-w-[280px] leading-[18px]`}>
                                        <TruncatedText text={f.displayName} />
                                        <TruncatedText text={f.fieldName} className="text-[#64748B]" />
                                      </td>
                                      <td className={TD}>{gr ? groupRuleLabels[gr.ruleType] : '—'}</td>
                                      <td className={`${TD} ${gr?.timeColumn ? '' : 'text-[#64748B]'}`}>{gr?.timeColumn || '—'}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {detailTab === 'identifier' && (
              <div>
                {!selectedRecord.identifierConfig ? (
                  <p className="text-[13px] text-[#DC2626]">Chưa thiết lập quy tắc định danh</p>
                ) : (() => {
                  const ic = selectedRecord.identifierConfig;
                  const sep = ic.separator === 'none' ? '' : ic.separator;
                  const genCode = (n: number) => [ic.prefix, String(n).padStart(ic.digits, '0'), ic.suffix].filter(Boolean).join(sep) || '—';
                  return (
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className={`${GROUP_CARD} p-4 space-y-4`}>
                          <p className={GROUP_TITLE}>Cấu trúc mã định danh</p>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <InfoField label="Tiền tố:">{ic.prefix || '(không có)'}</InfoField>
                            <InfoField label="Hậu tố:">{ic.suffix || '(không có)'}</InfoField>
                            <InfoField label="Ký tự phân cách:">{separatorLabels[ic.separator]}</InfoField>
                            <InfoField label="Độ dài số thứ tự:">{ic.digits} chữ số</InfoField>
                          </div>
                        </div>

                        <div className={`${GROUP_CARD} p-4 space-y-4`}>
                          <p className={GROUP_TITLE}>Số tự tăng</p>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <InfoField label="Bắt đầu từ:"><span className="tabular-nums">{ic.startFrom}</span></InfoField>
                            <InfoField label="Bước tăng:"><span className="tabular-nums">{ic.increment}</span></InfoField>
                          </div>
                        </div>

                        <div className={`${GROUP_CARD} p-4`}>
                          <p className={FIELD_LABEL}>Kiểm tra trùng lặp khi tạo mới</p>
                          <div className="mt-1">
                            <Badge label={ic.checkDuplicate ? 'Bật' : 'Tắt'} variant={ic.checkDuplicate ? 'green' : 'slate'} />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="border border-[#BFDBFE] rounded-2xl p-4 bg-[#EAF3FF] space-y-4">
                          <p className={GROUP_TITLE}>Mẫu mã định danh</p>
                          <div className="bg-white border border-[#BFDBFE] rounded-lg px-4 py-6 text-center">
                            <span className="text-[16px] font-semibold text-blue-600 tracking-wider">{genCode(ic.startFrom)}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-1 border-b border-[#BFDBFE]">
                              <span className="text-[13px] text-[#475569]">Mã thứ 1:</span>
                              <span className="text-[13px] font-medium text-[#020817]">{genCode(ic.startFrom)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-[#BFDBFE]">
                              <span className="text-[13px] text-[#475569]">Mã thứ 2:</span>
                              <span className="text-[13px] font-medium text-[#020817]">{genCode(ic.startFrom + ic.increment)}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                              <span className="text-[13px] text-[#475569]">Mã thứ 3:</span>
                              <span className="text-[13px] font-medium text-[#020817]">{genCode(ic.startFrom + ic.increment * 2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {detailTab === 'merge' && (
              <div className="space-y-4">
                {/* Ngưỡng — chỉ xem, không cấu hình */}
                <div className={`${GROUP_CARD} p-4`}>
                  <p className={`${FIELD_LABEL} mb-1`}>Ngưỡng tự động gộp (≥)</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-medium text-[#020817] tabular-nums">{selectedRecord.mergeSummary.autoThreshold}%</span>
                    <span className="text-[13px] text-[#64748B]">Điểm khớp từ ngưỡng này trở lên sẽ được gộp tự động</span>
                  </div>
                </div>

                {/* Bảng quy tắc so khớp — chỉ xem */}
                <div className={`${GROUP_CARD} overflow-hidden`}>
                  <div className="px-4 py-3 border-b border-[#E2E8F0]">
                    <p className={GROUP_TITLE}>Quy tắc so khớp</p>
                    <p className={GROUP_DESC}>Xác định khi nào hai bản ghi từ hai nguồn được coi là cùng một thực thể</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className={TABLE_CLS}>
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px] border-b border-[#E0E0E0]">
                          <th className={`${TH} text-left`}>Trường đối chiếu</th>
                          <th className={`${TH} text-left`}>Kiểu so khớp</th>
                          <th className={`${TH} text-left`}>Thuật toán</th>
                          <th className={`${TH} text-right`}>Ngưỡng (%)</th>
                          <th className={`${TH} text-right`}>Trọng số (%)</th>
                          <th className={`${TH} text-center`}>Điều kiện</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.matchingRules.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-[13px] text-[#64748B]">Chưa có quy tắc so khớp</td>
                          </tr>
                        ) : (
                          selectedRecord.matchingRules.map(rule => {
                            const fieldLabel = selectedRecord.fields.find(f => f.fieldName === rule.fieldName)?.displayName || rule.fieldName;
                            return (
                              <tr key={rule.id} className={TR}>
                                <td className={`${TD} max-w-[220px]`}><TruncatedText text={fieldLabel} /></td>
                                <td className={TD}>{matchMethodLabels[rule.method]}</td>
                                <td className={TD}>{rule.method === 'fuzzy' && rule.algorithm ? fuzzyAlgorithmLabels[rule.algorithm] : '—'}</td>
                                <td className={`${TD} text-right tabular-nums`}>{rule.method === 'fuzzy' ? rule.fuzzyThreshold : '—'}</td>
                                <td className={`${TD} text-right tabular-nums`}>{rule.weight}</td>
                                <td className={`${TD} text-center ${rule.operator ? '' : 'text-[#64748B]'}`}>{rule.operator || '—'}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Trường hard-block — chỉ xem */}
                <div className={`${GROUP_CARD} p-4 space-y-3`}>
                  <div>
                    <p className={GROUP_TITLE}>Trường hard-block</p>
                    <p className={GROUP_DESC}>Nếu các trường này khác nhau, hai bản ghi chắc chắn KHÔNG phải cùng thực thể (loại khỏi so khớp)</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedRecord.hardBlockFields.length === 0 ? (
                      <span className="text-[13px] text-[#64748B]">Không có trường hard-block nào</span>
                    ) : (
                      selectedRecord.hardBlockFields.map(fieldName => (
                        <Badge
                          key={fieldName}
                          label={selectedRecord.fields.find(f => f.fieldName === fieldName)?.displayName || fieldName}
                          variant="blue"
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Hợp nhất giá trị (Survivorship) — chỉ xem */}
                <div className={`${GROUP_CARD} overflow-hidden`}>
                  <div className="px-4 py-3 border-b border-[#E2E8F0]">
                    <p className={GROUP_TITLE}>Hợp nhất giá trị (Survivorship)</p>
                    <p className={GROUP_DESC}>Với mỗi trường, giá trị nào sẽ tồn tại trong bản ghi chủ cuối cùng</p>
                  </div>
                  {selectedRecord.survivorRules.length === 0 ? (
                    <p className="text-[13px] text-[#64748B] text-center py-6">Không có quy tắc hợp nhất giá trị</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className={TABLE_CLS}>
                        <thead className="bg-[#F8FAFC]">
                          <tr className="h-[42px] border-b border-[#E0E0E0]">
                            <th className={`${TH} text-left`}>Trường</th>
                            <th className={`${TH} text-left`}>Chiến lược</th>
                            <th className={`${TH} text-left`}>Nguồn dữ liệu</th>
                            <th className={`${TH} text-left`}>Xử lý null</th>
                            <th className={`${TH} text-left`}>Khi hết vẫn trống</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRecord.survivorRules.map(rule => (
                            <tr key={rule.fieldName} className={TR}>
                              <td className={`${TD} max-w-[220px]`}>
                                <TruncatedText text={selectedRecord.fields.find(f => f.fieldName === rule.fieldName)?.displayName || rule.fieldName} />
                              </td>
                              <td className={TD}>{conflictStrategyLabels[rule.conflictStrategy]}</td>
                              <td className={`${TD} max-w-[260px]`}>
                                <TruncatedText
                                  text={rule.conflictStrategy === 'source'
                                    ? (selectedRecord.sources.find(s => s.id === rule.primarySource)?.name || '—')
                                    : (rule.priorityOrder || []).map(sid => selectedRecord.sources.find(s => s.id === sid)?.name || sid).join(' → ')}
                                />
                              </td>
                              <td className={TD}>{nullHandlingLabels[rule.nullHandling]}</td>
                              <td className={TD}>{onEmptyLabels[rule.onEmpty]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {detailTab === 'relations' && (
              <div>
                <div className="flex items-center justify-end mb-3">
                  <Badge label={`${selectedRecord.relationships.length} quan hệ`} variant="blue" />
                </div>
                {selectedRecord.relationships.length === 0 ? (
                  <p className="text-[13px] text-[#64748B] text-center py-4">Chưa thiết lập quan hệ nào</p>
                ) : (
                  <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-x-auto">
                    <table className={TABLE_CLS}>
                      <thead className="bg-[#F8FAFC]">
                        <tr className="h-[42px] border-b border-[#E0E0E0]">
                          <th className={`${TH} text-center w-14`}>STT</th>
                          <th className={`${TH} text-left`}>Thực thể đích</th>
                          <th className={`${TH} text-left w-24`}>Loại</th>
                          <th className={`${TH} text-left`}>Khóa nguồn</th>
                          <th className={`${TH} text-left`}>Khóa đích</th>
                          <th className={`${TH} text-left`}>Trường hiển thị / Bảng liên kết</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRecord.relationships.map((rel, idx) => {
                          const linkValue = rel.type === 'n-n' ? rel.mappingTable : rel.displayField;
                          return (
                            <tr key={rel.id} className={TR}>
                              <td className={`${TD} text-center`}>{idx + 1}</td>
                              <td className={`${TD} max-w-[260px]`}><TruncatedText text={rel.targetEntityName} /></td>
                              <td className={TD}>
                                <Badge label={rel.type} variant={relTypeColors[rel.type]} />
                              </td>
                              <td className={`${TD} max-w-[200px]`}><TruncatedText text={rel.sourceKey || '—'} /></td>
                              <td className={`${TD} max-w-[200px]`}><TruncatedText text={rel.targetKey || '—'} /></td>
                              <td className={`${TD} max-w-[220px]`}>
                                {linkValue
                                  ? <TruncatedText text={linkValue} />
                                  : <span className="text-[#64748B]">—</span>}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </BaseModal>

      {/* Approval Form Modal (đơn lẻ hoặc nhanh nhiều bản ghi) */}
      <BaseModal
        isOpen={showApprovalForm && targetRecords.length > 0}
        onClose={() => setShowApprovalForm(false)}
        title={approvalAction === 'approve' ? 'Phê duyệt dữ liệu chủ' : 'Từ chối dữ liệu chủ'}
        subtitle={targetRecords.length > 1 ? `${targetRecords.length} bản ghi` : undefined}
        maxWidth="max-w-2xl"
        footer={
          <>
            <button
              type="button"
              onClick={() => setShowApprovalForm(false)}
              className={BTN_OUTLINE}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSubmitApproval}
              className={approvalAction === 'approve' ? BTN_PRIMARY : BTN_DESTRUCTIVE}
            >
              {approvalAction === 'approve' ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Xác nhận phê duyệt
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Xác nhận từ chối
                </>
              )}
            </button>
          </>
        }
      >
        <div className="space-y-4 text-left">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 max-h-40 overflow-y-auto custom-scrollbar space-y-2">
            {targetRecords.map(r => (
              <p key={r.id} className="text-[13px] text-[#020817]">
                <span className="font-medium">{r.name}</span> <span className="text-[#64748B]">({r.code})</span>
              </p>
            ))}
          </div>

          <div>
            <label htmlFor="md-approval-comment" className={LABEL_CLS}>
              {approvalAction === 'approve' ? 'Nhận xét (tùy chọn)' : 'Lý do từ chối'}
              {approvalAction === 'reject' && <span className={REQUIRED_MARK}> *</span>}
            </label>
            <textarea
              id="md-approval-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                approvalAction === 'approve'
                  ? 'Nhập nhận xét của bạn...'
                  : 'Vui lòng nhập lý do từ chối để người quản trị có thể chỉnh sửa...'
              }
              rows={4}
              className={TEXTAREA_CLS}
            />
          </div>

          {approvalAction === 'approve' ? (
            <div className="flex items-start gap-2 p-3 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              <div className="text-[13px]">
                <p className="text-[#020817]">
                  Sau khi phê duyệt, dữ liệu chủ sẽ được kích hoạt và có thể sử dụng trong hệ thống.
                </p>
                <p className="text-[#475569] mt-1">
                  Thông báo sẽ được gửi đến người quản trị tương ứng.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2 p-3 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="text-[13px]">
                <p className="text-[#020817]">
                  Sau khi từ chối, dữ liệu chủ sẽ được trả về cho người quản trị để chỉnh sửa.
                </p>
                <p className="text-[#475569] mt-1">
                  Thông báo kèm lý do từ chối sẽ được gửi đến người quản trị tương ứng.
                </p>
              </div>
            </div>
          )}
        </div>
      </BaseModal>
    </div>
  );
}
