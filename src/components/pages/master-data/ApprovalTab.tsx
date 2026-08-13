import { useState, useEffect, ChangeEvent } from 'react';
import { CheckCircle2, XCircle, Clock, Database, Eye, AlertCircle, Search, Info, Table2, GitMerge, Share2, Hash } from 'lucide-react';
import { BaseModal } from '../../common/BaseModal';

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

const relTypeColors: Record<RelType, string> = {
  '1-1': 'bg-teal-50 text-teal-700 border-teal-200',
  '1-n': 'bg-blue-50 text-blue-700 border-blue-200',
  'n-1': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'n-n': 'bg-purple-50 text-purple-700 border-purple-200',
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

const statusBadgeClass: Record<ApprovalStatus, string> = {
  pending: 'bg-orange-50 text-orange-600 border-orange-200',
  approved: 'bg-green-50 text-green-700 border-green-200',
  rejected: 'bg-red-50 text-red-600 border-red-200'
};

const statusLabels: Record<ApprovalStatus, string> = {
  pending: 'Chờ phê duyệt',
  approved: 'Đã phê duyệt',
  rejected: 'Từ chối'
};

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

  // Search
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const pendingCount = records.filter(r => r.status === 'pending').length;
  const approvedCount = records.filter(r => r.status === 'approved').length;
  const rejectedCount = records.filter(r => r.status === 'rejected').length;
  const totalCount = records.length;

  const filteredRecords = records.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const q = searchTerm.trim().toLowerCase();
    const matchesSearch = !q || r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  useEffect(() => { setCurrentPage(1); setSelectedIds([]); }, [filterStatus, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
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
      alert('Vui lòng nhập lý do từ chối');
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
    alert(`✅ Đã ${actionText} thành công ${targetIds.length} bản ghi!`);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div>
        <h2 className="text-[18px] font-bold text-slate-800">Phê duyệt dữ liệu chủ</h2>
        <p className="text-[13px] text-slate-500 mt-0.5">Lãnh đạo nghiệp vụ xem xét và phê duyệt các bộ dữ liệu chủ chờ phê duyệt</p>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-[13px] text-slate-600">
            Đã chọn: <span className="font-semibold text-blue-600">{selectedIds.length}</span> bản ghi
          </span>
          <button
            onClick={() => handleQuickApprove(selectedIds)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[13px]"
          >
            <CheckCircle2 className="w-4 h-4" />
            Phê duyệt nhanh
          </button>
          <button
            onClick={() => handleQuickReject(selectedIds)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-[13px]"
          >
            <XCircle className="w-4 h-4" />
            Từ chối nhanh
          </button>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-orange-700">Chờ phê duyệt</p>
              <p className="text-2xl text-orange-900">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-green-700">Đã phê duyệt</p>
              <p className="text-2xl text-green-900">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-red-700">Từ chối</p>
              <p className="text-2xl text-red-900">{rejectedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[13px] text-blue-700">Tổng dữ liệu chủ</p>
              <p className="text-2xl text-blue-900">{totalCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Status Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              title="Tìm kiếm bộ dữ liệu chủ"
              placeholder="Tìm kiếm theo mã, tên bộ dữ liệu chủ..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { key: 'all' as const, label: `Tất cả (${totalCount})`, activeClass: 'bg-slate-700 text-white border-slate-700' },
              { key: 'pending' as const, label: `Chờ phê duyệt (${pendingCount})`, activeClass: 'bg-orange-500 text-white border-orange-500' },
              { key: 'approved' as const, label: `Đã phê duyệt (${approvedCount})`, activeClass: 'bg-green-600 text-white border-green-600' },
              { key: 'rejected' as const, label: `Từ chối (${rejectedCount})`, activeClass: 'bg-red-500 text-white border-red-500' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => setFilterStatus(opt.key)}
                className={`px-3 py-2 text-[13px] rounded-lg border transition-all font-medium cursor-pointer ${filterStatus === opt.key
                  ? opt.activeClass
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    title="Chọn tất cả"
                    checked={pendingIds.length > 0 && selectedIds.length === pendingIds.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">STT</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Mã</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Tên dữ liệu chủ</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Loại dữ liệu</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Cơ quan quản lý</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Ngày gửi</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Người gửi</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Trạng thái</th>
                <th className="px-4 py-3 text-left text-[13px] font-semibold text-slate-500 whitespace-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-[13px]">Không có dữ liệu chủ nào trong trạng thái này</p>
                  </td>
                </tr>
              ) : (
                paginatedRecords.map((record, index) => (
                  <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      {record.status === 'pending' && (
                        <input
                          type="checkbox"
                          title="Chọn bản ghi"
                          checked={selectedIds.includes(record.id)}
                          onChange={() => toggleSelectOne(record.id)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{(currentPage - 1) * pageSize + index + 1}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-700">{record.code}</td>
                    <td className="px-4 py-3 text-[13px] font-semibold text-slate-800">{record.name}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{dataTypeLabels[record.dataType]}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{record.managingAgency}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{record.submittedDate}</td>
                    <td className="px-4 py-3 text-[13px] text-slate-600">{record.submittedBy}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[13px] border whitespace-nowrap ${statusBadgeClass[record.status]}`}>
                        {statusLabels[record.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetail(record)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => record.status === 'pending' && handleApprove(record)}
                          disabled={record.status !== 'pending'}
                          className={`p-1 rounded transition-colors ${record.status === 'pending' ? 'text-green-600 hover:bg-green-50 cursor-pointer' : 'text-slate-300 cursor-not-allowed'
                            }`}
                          title={record.status === 'pending' ? 'Phê duyệt' : 'Đã xử lý'}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => record.status === 'pending' && handleReject(record)}
                          disabled={record.status !== 'pending'}
                          className={`p-1 rounded transition-colors ${record.status === 'pending' ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-slate-300 cursor-not-allowed'
                            }`}
                          title={record.status === 'pending' ? 'Từ chối' : 'Đã xử lý'}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredRecords.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-[13px] font-medium">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-normal">Hiển thị</span>
              <select
                aria-label="Số bản ghi trên trang"
                value={pageSize}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white text-[13px] cursor-pointer font-medium"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-slate-600 font-normal">bản ghi/trang</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-slate-600 font-normal">
                {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, filteredRecords.length)} / {filteredRecords.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 border rounded-xl font-medium text-[13px] transition-colors cursor-pointer ${currentPage === page ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl text-slate-600 text-[13px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors font-medium cursor-pointer"
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <BaseModal
        isOpen={showDetailModal && !!selectedRecord}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết dữ liệu chủ"
        subtitle={selectedRecord ? `${selectedRecord.code} · ${selectedRecord.name}` : undefined}
        maxWidth="max-w-4xl"
        customHeaderIcon={<Eye className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />}
        footer={
          <button
            onClick={() => setShowDetailModal(false)}
            className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Đóng
          </button>
        }
      >
        {selectedRecord && (
            <div className="space-y-6">
              {/* Tabs */}
              <div className="flex gap-6 border-b border-slate-200 -mt-2">
                <button
                  onClick={() => setDetailTab('general')}
                  className={`pb-3 pt-1 text-[13px] transition-colors border-b-2 flex items-center gap-1.5 ${detailTab === 'general' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <Info className="w-4 h-4" /> Thông tin chung
                </button>
                <button
                  onClick={() => setDetailTab('attributes')}
                  className={`pb-3 pt-1 text-[13px] transition-colors border-b-2 flex items-center gap-1.5 ${detailTab === 'attributes' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <Table2 className="w-4 h-4" /> Thuộc tính
                </button>
                <button
                  onClick={() => setDetailTab('merge')}
                  className={`pb-3 pt-1 text-[13px] transition-colors border-b-2 flex items-center gap-1.5 ${detailTab === 'merge' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <GitMerge className="w-4 h-4" /> Quy tắc hợp nhất
                </button>
                <button
                  onClick={() => setDetailTab('relations')}
                  className={`pb-3 pt-1 text-[13px] transition-colors border-b-2 flex items-center gap-1.5 ${detailTab === 'relations' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <Share2 className="w-4 h-4" /> Quan hệ
                </button>
                <button
                  onClick={() => setDetailTab('identifier')}
                  className={`pb-3 pt-1 text-[13px] transition-colors border-b-2 flex items-center gap-1.5 ${detailTab === 'identifier' ? 'border-blue-600 text-blue-600 font-medium' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <Hash className="w-4 h-4" /> Định danh
                </button>
              </div>

              {detailTab === 'general' && (
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-[13px] text-slate-900 mb-3">Thông tin cơ bản</h4>
                    <div className="grid grid-cols-2 gap-4 text-[13px]">
                      <div>
                        <span className="text-slate-500">Mã thực thể:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.code}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Tên dữ liệu chủ:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.name}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Loại thực thể:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{dataTypeLabels[selectedRecord.dataType]}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Phạm vi sử dụng:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{scopeTypeLabels[selectedRecord.scope]}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Đơn vị chủ quản:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.managingAgency}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Trạng thái vòng đời:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{lifecycleStatusLabels[selectedRecord.lifecycleStatus]}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Tên CSDL/Hệ thống:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.systemName || '—'}</p>
                      </div>
                      <div>
                        <span className="text-slate-500 inline-flex items-center gap-1.5">
                          Ngày hiệu lực:
                          <span className="relative inline-flex items-center group">
                            <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-72 bg-slate-900 text-white text-xs rounded-lg p-3 z-10 shadow-lg leading-relaxed normal-case">
                              Thời gian hiệu lực sẽ được gán với từng bản ghi trong thực thể dữ liệu chủ, hiệu lực của bản ghi có thể chỉnh sửa khi thực hiện rà soát bản ghi.
                              <span className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900" />
                            </span>
                          </span>
                        </span>
                        <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.effectiveDate || '—'}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Nguồn dữ liệu đăng ký:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.sources.length > 0 ? selectedRecord.sources.map(s => s.name).join(', ') : '—'}</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Mô tả đối tượng:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Submission Info */}
                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="text-[13px] text-slate-900 mb-3">Thông tin gửi phê duyệt</h4>
                    <div className="grid grid-cols-2 gap-4 text-[13px] mb-3">
                      <div>
                        <span className="text-slate-500">Người gửi:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.submittedBy}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Ngày gửi:</span>
                        <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.submittedDate}</p>
                      </div>
                    </div>
                    <div className="text-[13px]">
                      <span className="text-slate-500">Nội dung gửi duyệt:</span>
                      <p className="text-[13px] text-slate-900 mt-1 bg-slate-50 border border-slate-200 rounded p-3">
                        {selectedRecord.history.find(h => h.action === 'submitted')?.comment || '—'}
                      </p>
                    </div>
                  </div>

                  {/* Review Info */}
                  {selectedRecord.reviewedBy && (
                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="text-[13px] text-slate-900 mb-3">Thông tin phê duyệt</h4>
                      <div className="grid grid-cols-2 gap-4 text-[13px] mb-3">
                        <div>
                          <span className="text-slate-500">Người phê duyệt:</span>
                          <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.reviewedBy}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Ngày phê duyệt:</span>
                          <p className="text-[13px] text-slate-900 mt-1">{selectedRecord.reviewedDate}</p>
                        </div>
                      </div>
                      {selectedRecord.reviewComment && (
                        <div className="text-[13px]">
                          <span className="text-slate-500">Nhận xét:</span>
                          <p className="text-[13px] text-slate-900 mt-1 bg-slate-50 border border-slate-200 rounded p-3">
                            {selectedRecord.reviewComment}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* History Timeline */}
                  <div className="border-t border-slate-200 pt-6">
                    <h4 className="text-[13px] text-slate-900 mb-3">Lịch sử cập nhật ({selectedRecord.history.length})</h4>
                    <div className="space-y-3">
                      {selectedRecord.history.map((h, index) => (
                        <div key={h.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${h.action === 'approved' ? 'bg-green-100' :
                              h.action === 'rejected' ? 'bg-red-100' :
                                'bg-blue-100'
                              }`}>
                              {h.action === 'approved' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                                h.action === 'rejected' ? <XCircle className="w-4 h-4 text-red-600" /> :
                                  <Clock className="w-4 h-4 text-blue-600" />}
                            </div>
                            {index < selectedRecord.history.length - 1 && (
                              <div className="w-0.5 h-8 bg-slate-300" />
                            )}
                          </div>
                          <div className="flex-1 pb-3">
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-[13px] text-slate-900">
                                {h.action === 'submitted' ? 'Gửi phê duyệt' :
                                  h.action === 'approved' ? 'Đã phê duyệt' :
                                    h.action === 'rejected' ? 'Từ chối' : 'Cập nhật'}
                              </span>
                              <span className="text-[13px] text-slate-500">• {h.performedDate}</span>
                            </div>
                            <p className="text-[13px] text-slate-700 mb-1">Bởi: <strong>{h.performedBy}</strong></p>
                            {h.comment && (
                              <p className="text-[13px] text-slate-600 bg-white border border-slate-200 rounded p-2 mt-2">
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
                    <h4 className="text-[13px] text-slate-900">Các trường dữ liệu</h4>
                    <span className="text-[13px] text-blue-600">{selectedRecord.fields.length} trường</span>
                  </div>
                  {selectedRecord.fields.length === 0 ? (
                    <p className="text-[13px] text-slate-500 text-center py-4">Chưa có trường dữ liệu nào</p>
                  ) : (
                    <div className="border border-slate-200 rounded-lg overflow-x-auto">
                      <table className="w-full text-[13px] approval-detail-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-3 py-2 text-left text-[13px] text-slate-600 font-medium">Thuộc tính</th>
                            {selectedRecord.sources.map(src => (
                              <th key={src.id} className="px-3 py-2 text-left text-[13px] text-slate-600 font-medium">{src.name}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedRecord.fields.map(f => (
                            <tr key={f.fieldName}>
                              <td className="px-3 py-2">
                                <span className="text-[13px] text-slate-900 font-bold">{f.displayName}</span>
                                <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{f.fieldName}</code>
                              </td>
                              {selectedRecord.sources.map(src => (
                                <td key={src.id} className="px-3 py-2 text-[13px] text-slate-700">{selectedRecord.mapping[f.fieldName]?.[src.id] || '—'}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Gom nguồn 1:n — chỉ hiện khi có ít nhất 1 nguồn độ mịn 1:n */}
                  {selectedRecord.sources.filter(s => s.grain === '1:n').length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden mt-6">
                      <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                        <h4 className="text-[13px] font-semibold text-slate-700">Gom nguồn 1:n</h4>
                        <span className="text-[13px] px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-medium">
                          {selectedRecord.sources.filter(s => s.grain === '1:n').length} nguồn 1:n
                        </span>
                      </div>
                      <div className="p-4 space-y-4">
                        <p className="text-[13px] text-slate-500">Với nguồn có độ mịn 1:n, chọn quy tắc gom nhiều bản ghi thành một giá trị cho từng thuộc tính</p>
                        {selectedRecord.sources.filter(s => s.grain === '1:n').map(src => (
                          <div key={src.id} className="border border-slate-200 rounded-lg overflow-hidden">
                            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100">
                              <span className="text-[13px] font-semibold text-emerald-800">Nguồn (1:n): {src.name}</span>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-[13px] approval-detail-table">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                    <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Thuộc tính</th>
                                    <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Rule gom</th>
                                    <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Cột mốc thời gian</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {selectedRecord.fields.map(f => {
                                    const gr = selectedRecord.groupRules?.[src.id]?.[f.fieldName];
                                    return (
                                      <tr key={f.fieldName}>
                                        <td className="px-3 py-2">
                                          <span className="text-[13px] font-medium text-slate-700">{f.displayName}</span>
                                          <code className="ml-1.5 text-[13px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{f.fieldName}</code>
                                        </td>
                                        <td className="px-3 py-2 text-[13px] text-slate-700">{gr ? groupRuleLabels[gr.ruleType] : '—'}</td>
                                        <td className="px-3 py-2 text-[13px] text-slate-500">{gr?.timeColumn || '—'}</td>
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
                    <p className="text-[13px] text-red-600">Chưa thiết lập quy tắc định danh</p>
                  ) : (() => {
                    const ic = selectedRecord.identifierConfig;
                    const sep = ic.separator === 'none' ? '' : ic.separator;
                    const genCode = (n: number) => [ic.prefix, String(n).padStart(ic.digits, '0'), ic.suffix].filter(Boolean).join(sep) || '—';
                    return (
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                            <p className="text-[13px] font-semibold text-slate-700">Cấu trúc mã định danh</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div><span className="text-[13px] text-slate-500">Tiền tố:</span><p className="text-[13px] text-slate-900 mt-1">{ic.prefix || '(không có)'}</p></div>
                              <div><span className="text-[13px] text-slate-500">Hậu tố:</span><p className="text-[13px] text-slate-900 mt-1">{ic.suffix || '(không có)'}</p></div>
                              <div><span className="text-[13px] text-slate-500">Ký tự phân cách:</span><p className="text-[13px] text-slate-900 mt-1">{separatorLabels[ic.separator]}</p></div>
                              <div><span className="text-[13px] text-slate-500">Độ dài số thứ tự:</span><p className="text-[13px] text-slate-900 mt-1">{ic.digits} chữ số</p></div>
                            </div>
                          </div>

                          <div className="border border-slate-200 rounded-lg p-4 bg-white space-y-3">
                            <p className="text-[13px] font-semibold text-slate-700">Số tự tăng</p>
                            <div className="grid grid-cols-2 gap-3">
                              <div><span className="text-[13px] text-slate-500">Bắt đầu từ:</span><p className="text-[13px] text-slate-900 mt-1">{ic.startFrom}</p></div>
                              <div><span className="text-[13px] text-slate-500">Bước tăng:</span><p className="text-[13px] text-slate-900 mt-1">{ic.increment}</p></div>
                            </div>
                          </div>

                          <div className="border border-slate-200 rounded-lg p-4 bg-white">
                            <p className="text-[13px] font-medium text-slate-700">Kiểm tra trùng lặp khi tạo mới</p>
                            <p className={`text-[13px] mt-1 font-medium ${ic.checkDuplicate ? 'text-green-700' : 'text-slate-500'}`}>{ic.checkDuplicate ? 'Bật' : 'Tắt'}</p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-4">
                            <p className="text-[13px] font-semibold text-blue-900">Mẫu mã định danh</p>
                            <div className="bg-white border border-blue-200 rounded-lg px-4 py-6 text-center">
                              <code className="text-[13px] font-mono font-bold text-blue-700 tracking-widest">{genCode(ic.startFrom)}</code>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center py-1 border-b border-blue-100">
                                <span className="text-[13px] text-slate-600">Mã thứ 1:</span>
                                <code className="text-[13px] font-mono font-semibold text-slate-800">{genCode(ic.startFrom)}</code>
                              </div>
                              <div className="flex justify-between items-center py-1 border-b border-blue-100">
                                <span className="text-[13px] text-slate-600">Mã thứ 2:</span>
                                <code className="text-[13px] font-mono font-semibold text-slate-800">{genCode(ic.startFrom + ic.increment)}</code>
                              </div>
                              <div className="flex justify-between items-center py-1">
                                <span className="text-[13px] text-slate-600">Mã thứ 3:</span>
                                <code className="text-[13px] font-mono font-semibold text-slate-800">{genCode(ic.startFrom + ic.increment * 2)}</code>
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
                  <div className="border border-slate-200 rounded-lg bg-white p-4">
                    <div>
                      <p className="text-[13px] font-medium text-slate-700 mb-1.5">Ngưỡng tự động gộp (≥)</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-slate-900">{selectedRecord.mergeSummary.autoThreshold}%</span>
                        <span className="text-[13px] text-slate-400">Điểm khớp từ ngưỡng này trở lên sẽ được gộp tự động</span>
                      </div>
                    </div>
                  </div>

                  {/* Bảng quy tắc so khớp — chỉ xem */}
                  <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                      <p className="text-[13px] font-semibold text-slate-700">Quy tắc so khớp</p>
                      <p className="text-[13px] text-slate-500">Xác định khi nào hai bản ghi từ hai nguồn được coi là cùng một thực thể</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-[13px] approval-detail-table">
                        <thead className="bg-slate-50 border-b border-slate-200">
                          <tr>
                            <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Trường đối chiếu</th>
                            <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Kiểu so khớp</th>
                            <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Thuật toán</th>
                            <th className="px-3 py-2 text-center text-[13px] font-medium text-slate-600">Ngưỡng (%)</th>
                            <th className="px-3 py-2 text-center text-[13px] font-medium text-slate-600">Trọng số (%)</th>
                            <th className="px-3 py-2 text-center text-[13px] font-medium text-slate-600">Điều kiện</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedRecord.matchingRules.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-4 py-6 text-center text-[13px] text-slate-400">Chưa có quy tắc so khớp</td>
                            </tr>
                          ) : (
                            selectedRecord.matchingRules.map(rule => {
                              const fieldLabel = selectedRecord.fields.find(f => f.fieldName === rule.fieldName)?.displayName || rule.fieldName;
                              return (
                                <tr key={rule.id}>
                                  <td className="px-3 py-2 text-[13px] text-slate-900">{fieldLabel}</td>
                                  <td className="px-3 py-2 text-[13px] text-slate-700">{matchMethodLabels[rule.method]}</td>
                                  <td className="px-3 py-2 text-[13px] text-slate-700">{rule.method === 'fuzzy' && rule.algorithm ? fuzzyAlgorithmLabels[rule.algorithm] : '—'}</td>
                                  <td className="px-3 py-2 text-center text-[13px] text-slate-700">{rule.method === 'fuzzy' ? rule.fuzzyThreshold : '—'}</td>
                                  <td className="px-3 py-2 text-center text-[13px] text-slate-700">{rule.weight}</td>
                                  <td className="px-3 py-2 text-center text-[13px] text-slate-500">{rule.operator || '—'}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Trường hard-block — chỉ xem */}
                  <div className="border border-slate-200 rounded-lg bg-white p-4 space-y-3">
                    <div>
                      <p className="text-[13px] font-semibold text-slate-700">Trường hard-block</p>
                      <p className="text-[13px] text-slate-500">Nếu các trường này khác nhau, hai bản ghi chắc chắn KHÔNG phải cùng thực thể (loại khỏi so khớp)</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {selectedRecord.hardBlockFields.length === 0 ? (
                        <span className="text-[13px] text-slate-400">Không có trường hard-block nào</span>
                      ) : (
                        selectedRecord.hardBlockFields.map(fieldName => (
                          <span key={fieldName} className="inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[13px] font-medium">
                            {selectedRecord.fields.find(f => f.fieldName === fieldName)?.displayName || fieldName}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Hợp nhất giá trị (Survivorship) — chỉ xem */}
                  <div className="border border-slate-200 rounded-lg bg-white overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                      <p className="text-[13px] font-semibold text-slate-700">Hợp nhất giá trị (Survivorship)</p>
                      <p className="text-[13px] text-slate-500">Với mỗi trường, giá trị nào sẽ tồn tại trong bản ghi chủ cuối cùng</p>
                    </div>
                    {selectedRecord.survivorRules.length === 0 ? (
                      <p className="text-[13px] text-slate-400 text-center py-6">Không có quy tắc hợp nhất giá trị</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-[13px] approval-detail-table">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Trường</th>
                              <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Chiến lược</th>
                              <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Nguồn dữ liệu</th>
                              <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Xử lý null</th>
                              <th className="px-3 py-2 text-left text-[13px] font-medium text-slate-600">Khi hết vẫn trống</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedRecord.survivorRules.map(rule => (
                              <tr key={rule.fieldName}>
                                <td className="px-3 py-2 text-[13px] text-slate-900">
                                  {selectedRecord.fields.find(f => f.fieldName === rule.fieldName)?.displayName || rule.fieldName}
                                </td>
                                <td className="px-3 py-2 text-[13px] text-slate-700">{conflictStrategyLabels[rule.conflictStrategy]}</td>
                                <td className="px-3 py-2 text-[13px] text-slate-700">
                                  {rule.conflictStrategy === 'source'
                                    ? (selectedRecord.sources.find(s => s.id === rule.primarySource)?.name || '—')
                                    : (rule.priorityOrder || []).map(sid => selectedRecord.sources.find(s => s.id === sid)?.name || sid).join(' → ')}
                                </td>
                                <td className="px-3 py-2 text-[13px] text-slate-700">{nullHandlingLabels[rule.nullHandling]}</td>
                                <td className="px-3 py-2 text-[13px] text-slate-700">{onEmptyLabels[rule.onEmpty]}</td>
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
                    <span className="text-[13px] text-blue-600">{selectedRecord.relationships.length} quan hệ</span>
                  </div>
                  {selectedRecord.relationships.length === 0 ? (
                    <p className="text-[13px] text-slate-500 text-center py-4">Chưa thiết lập quan hệ nào</p>
                  ) : (
                    <div className="border border-slate-200 rounded-lg overflow-x-auto">
                      <table className="w-full border-collapse text-left text-[13px] approval-detail-table">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-4 py-3 font-semibold text-slate-500 text-center w-12">STT</th>
                            <th className="px-4 py-3 font-semibold text-slate-500">Thực thể đích</th>
                            <th className="px-4 py-3 font-semibold text-slate-500 text-center w-24">Loại</th>
                            <th className="px-4 py-3 font-semibold text-slate-500">Khóa nguồn</th>
                            <th className="px-4 py-3 font-semibold text-slate-500">Khóa đích</th>
                            <th className="px-4 py-3 font-semibold text-slate-500">Trường hiển thị / Bảng liên kết</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedRecord.relationships.map((rel, idx) => (
                            <tr key={rel.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-4 py-3 text-center text-slate-500 font-medium">{idx + 1}</td>
                              <td className="px-4 py-3">
                                <span className="font-medium text-slate-800">{rel.targetEntityName}</span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded border text-[13px] font-semibold ${relTypeColors[rel.type]}`}>{rel.type}</span>
                              </td>
                              <td className="px-4 py-3 font-mono text-slate-600">{rel.sourceKey || '—'}</td>
                              <td className="px-4 py-3 font-mono text-slate-600">{rel.targetKey || '—'}</td>
                              <td className="px-4 py-3 text-slate-600">
                                {rel.type === 'n-n' ? (
                                  rel.mappingTable ? <code className="text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-mono">{rel.mappingTable}</code> : <span className="text-slate-400">—</span>
                                ) : (
                                  rel.displayField ? <code className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">{rel.displayField}</code> : <span className="text-slate-400">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
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
        customHeaderIcon={approvalAction === 'approve'
          ? <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
          : <XCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
        }
        footer={
          <>
            <button
              onClick={() => setShowApprovalForm(false)}
              className="px-4 py-2 text-[13px] text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmitApproval}
              className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white rounded-lg transition-colors ${approvalAction === 'approve'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
                }`}
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
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
                {targetRecords.map(r => (
                  <p key={r.id} className="text-sm text-slate-700">
                    <strong>{r.name}</strong> <span className="text-slate-500">({r.code})</span>
                  </p>
                ))}
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1">
                  {approvalAction === 'approve' ? 'Nhận xét (tùy chọn)' : 'Lý do từ chối'}
                  {approvalAction === 'reject' && <span className="text-red-600"> *</span>}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    approvalAction === 'approve'
                      ? 'Nhập nhận xét của bạn...'
                      : 'Vui lòng nhập lý do từ chối để người quản trị có thể chỉnh sửa...'
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {approvalAction === 'approve' ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-green-900">
                        Sau khi phê duyệt, dữ liệu chủ sẽ được kích hoạt và có thể sử dụng trong hệ thống.
                      </p>
                      <p className="text-sm text-green-700 mt-1">
                        Thông báo sẽ được gửi đến người quản trị tương ứng.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-900">
                        Sau khi từ chối, dữ liệu chủ sẽ được trả về cho người quản trị để chỉnh sửa.
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        Thông báo kèm lý do từ chối sẽ được gửi đến người quản trị tương ứng.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
      </BaseModal>
    </div>
  );
}
