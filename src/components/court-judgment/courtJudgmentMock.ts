// Dữ liệu mock CSDL Bản án — sao chép nguyên trạng từ DataDetailModal.tsx (giữ nguyên dữ liệu)
export interface DetailRecord {
  id: string;
  code: string;
  name: string;
  gender: string;
  idNumber: string;
  birthDate: string;
  birthDateInWords: string;
  birthPlace: string;
  hometown: string;
  ethnicity: string;
  nationality: string;
  personalId: string;
  certificateNo: string;
  registrationDate: string;
  syncDate: string;
  type: string;
  status: string;
  approvalStatus: string;
  collectedAt: string;
  hasError?: boolean;
  errorMessage?: string;
  phone?: string;
  address?: string;
  fatherName?: string;
  fatherBirthDate?: string;
  fatherEthnicity?: string;
  fatherNationality?: string;
  fatherAddress?: string;
  fatherIdIssueDate?: string;
  fatherIdIssuePlace?: string;
  fatherIdNumber?: string;
  fatherPersonalId?: string;
  motherName?: string;
  motherBirthDate?: string;
  motherEthnicity?: string;
  motherNationality?: string;
  motherAddress?: string;
  motherIdIssueDate?: string;
  motherIdIssuePlace?: string;
  motherIdNumber?: string;
  motherPersonalId?: string;
  registrationPlace?: string;
  registrationType?: string;
  foreignCertificateNo?: string;
  foreignCertificateDate?: string;
  foreignOrganization?: string;
  foreignCountry?: string;
  declarantName?: string;
  declarantRelation?: string;
  declarantIdIssuePlace?: string;
  declarantIdIssueDate?: string;
  declarantIdNumber?: string;
  declarantPersonalId?: string;
  signDate?: string;
  signerPosition?: string;
  implementer?: string;
  notes?: string;
  errorProcessStatus?: 'sent' | 'updated' | 'pending';
  errorProcessText?: string;
  pdfUrl?: string;
}

export const COURT_JUDGMENT_RECORDS: DetailRecord[] = [
  { 
    id: '1', 
    code: 'REC-2025-001', 
    name: 'Nguyễn Văn An', 
    gender: 'Nam',
    idNumber: '001234567890', 
    birthDate: '15/05/1985', 
    birthDateInWords: 'Ngày 15 tháng 5 năm 1985',
    birthPlace: 'Hà Nội',
    hometown: 'Hà Nội',
    ethnicity: 'Kinh',
    nationality: 'Việt Nam',
    personalId: '001234567890',
    certificateNo: '001234567890',
    registrationDate: '15/05/1985',
    syncDate: '19/12/2025 15:30:00',
    type: 'Mới', 
    status: 'Hợp lệ',
    approvalStatus: 'Đã đồng bộ',
    collectedAt: '19/12/2025 15:30:00',
    pdfUrl: '/phieu_y_kien.pdf',
    fatherName: 'Nguyễn Văn Bình',
    fatherBirthDate: '01/01/1950',
    fatherEthnicity: 'Kinh',
    fatherNationality: 'Việt Nam',
    fatherAddress: 'Hà Nội',
    fatherIdIssueDate: '01/01/2000',
    fatherIdIssuePlace: 'Hà Nội',
    fatherIdNumber: '001234567890',
    fatherPersonalId: '001234567890',
    motherName: 'Trần Thị Cúc',
    motherBirthDate: '01/01/1950',
    motherEthnicity: 'Kinh',
    motherNationality: 'Việt Nam',
    motherAddress: 'Hà Nội',
    motherIdIssueDate: '01/01/2000',
    motherIdIssuePlace: 'Hà Nội',
    motherIdNumber: '001234567890',
    motherPersonalId: '001234567890'
  },
  { 
    id: '2', 
    code: 'REC-2025-002', 
    name: 'Trần Thị Bình', 
    gender: 'Nữ',
    idNumber: '001234567891', 
    birthDate: '20/08/1990', 
    birthDateInWords: 'Ngày 20 tháng 8 năm 1990',
    birthPlace: 'Hà Nội',
    hometown: 'Hà Nội',
    ethnicity: 'Kinh',
    nationality: 'Việt Nam',
    personalId: '001234567891',
    certificateNo: '001234567891',
    registrationDate: '20/08/1990',
    syncDate: '19/12/2025 15:30:02',
    type: 'Mới', 
    status: 'Hợp lệ',
    approvalStatus: 'Đã đồng bộ',
    collectedAt: '19/12/2025 15:30:02',
    fatherName: 'Trần Văn Dũng',
    fatherBirthDate: '01/01/1950',
    fatherEthnicity: 'Kinh',
    fatherNationality: 'Việt Nam',
    fatherAddress: 'Hà Nội',
    fatherIdIssueDate: '01/01/2000',
    fatherIdIssuePlace: 'Hà Nội',
    fatherIdNumber: '001234567890',
    fatherPersonalId: '001234567890',
    motherName: 'Lê Thị Em',
    motherBirthDate: '01/01/1950',
    motherEthnicity: 'Kinh',
    motherNationality: 'Việt Nam',
    motherAddress: 'Hà Nội',
    motherIdIssueDate: '01/01/2000',
    motherIdIssuePlace: 'Hà Nội',
    motherIdNumber: '001234567890',
    motherPersonalId: '001234567890'
  },
  { 
    id: '3', 
    code: 'REC-2025-003', 
    name: 'Lê Văn Cường', 
    gender: 'Nam',
    idNumber: '001234567892', 
    birthDate: '31/13/2023', 
    birthDateInWords: 'Ngày 31 tháng 13 năm 2023',
    birthPlace: 'Hà Nội',
    hometown: 'Hà Nội',
    ethnicity: 'Kinh',
    nationality: 'Việt Nam',
    personalId: '001234567892',
    certificateNo: '001234567892',
    registrationDate: '31/13/2023',
    syncDate: '19/12/2025 15:30:05',
    type: 'Mới', 
    status: 'Lỗi định dạng',
    approvalStatus: 'Đã gửi lại hệ thống nguồn',
    collectedAt: '19/12/2025 15:30:05',
    hasError: true,
    errorMessage: 'Sai định dạng ngày tháng',
    pdfUrl: '/phieu_y_kien.pdf',
    fatherName: 'Lê Văn Hùng',
    fatherBirthDate: '01/01/1950',
    fatherEthnicity: 'Kinh',
    fatherNationality: 'Việt Nam',
    fatherAddress: 'Hà Nội',
    fatherIdIssueDate: '01/01/2000',
    fatherIdIssuePlace: 'Hà Nội',
    fatherIdNumber: '001234567890',
    fatherPersonalId: '001234567890',
    motherName: 'Phạm Thị Lan',
    motherBirthDate: '01/01/1950',
    motherEthnicity: 'Kinh',
    motherNationality: 'Việt Nam',
    motherAddress: 'Hà Nội',
    motherIdIssueDate: '01/01/2000',
    motherIdIssuePlace: 'Hà Nội',
    motherIdNumber: '001234567890',
    motherPersonalId: '001234567890',
    errorProcessStatus: 'sent',
    errorProcessText: 'Đã gửi hệ thống nguồn'
  },
  { 
    id: '4', 
    code: 'REC-2025-004', 
    name: 'Phạm Thị Dung', 
    gender: 'Nữ',
    idNumber: '001234567893', 
    birthDate: '10/03/1988', 
    birthDateInWords: 'Ngày 10 tháng 3 năm 1988',
    birthPlace: 'Hà Nội',
    hometown: 'Hà Nội',
    ethnicity: 'Kinh',
    nationality: 'Việt Nam',
    personalId: '001234567893',
    certificateNo: '001234567893',
    registrationDate: '10/03/1988',
    syncDate: '19/12/2025 15:30:07',
    type: 'Mới', 
    status: 'Lỗi định dạng',
    approvalStatus: 'Đã cập nhật lại',
    collectedAt: '19/12/2025 15:30:07',
    hasError: true,
    errorMessage: 'Sai định dạng điện thoại',
    fatherName: 'Phạm Văn Khoa',
    fatherBirthDate: '01/01/1950',
    fatherEthnicity: 'Kinh',
    fatherNationality: 'Việt Nam',
    fatherAddress: 'Hà Nội',
    fatherIdIssueDate: '01/01/2000',
    fatherIdIssuePlace: 'Hà Nội',
    fatherIdNumber: '001234567890',
    fatherPersonalId: '001234567890',
    motherName: 'Hoàng Thị Mai',
    motherBirthDate: '01/01/1950',
    motherEthnicity: 'Kinh',
    motherNationality: 'Việt Nam',
    motherAddress: 'Hà Nội',
    motherIdIssueDate: '01/01/2000',
    motherIdIssuePlace: 'Hà Nội',
    motherIdNumber: '001234567890',
    motherPersonalId: '001234567890',
    errorProcessStatus: 'updated',
    errorProcessText: 'Đã cập nhật lại'
  },
  { 
    id: '5', 
    code: 'REC-2025-005', 
    name: 'Hoàng Văn Em', 
    gender: 'Nam',
    idNumber: '001234567894', 
    birthDate: '25/11/1992', 
    birthDateInWords: 'Ngày 25 tháng 11 năm 1992',
    birthPlace: 'Hà Nội',
    hometown: 'Hà Nội',
    ethnicity: 'Kinh',
    nationality: 'Việt Nam',
    personalId: '001234567894',
    certificateNo: '001234567894',
    registrationDate: '25/11/1992',
    syncDate: '19/12/2025 15:30:10',
    type: 'Cập nhật', 
    status: 'Hợp lệ',
    approvalStatus: 'Đã đồng bộ',
    collectedAt: '19/12/2025 15:30:10',
    pdfUrl: '/phieu_y_kien.pdf',
    fatherName: 'Hoàng Văn Nam',
    fatherBirthDate: '01/01/1950',
    fatherEthnicity: 'Kinh',
    fatherNationality: 'Việt Nam',
    fatherAddress: 'Hà Nội',
    fatherIdIssueDate: '01/01/2000',
    fatherIdIssuePlace: 'Hà Nội',
    fatherIdNumber: '001234567890',
    fatherPersonalId: '001234567890',
    motherName: 'Vũ Thị Oanh',
    motherBirthDate: '01/01/1950',
    motherEthnicity: 'Kinh',
    motherNationality: 'Việt Nam',
    motherAddress: 'Hà Nội',
    motherIdIssueDate: '01/01/2000',
    motherIdIssuePlace: 'Hà Nội',
    motherIdNumber: '001234567890',
    motherPersonalId: '001234567890'
  },
  { 
    id: '6', 
    code: 'REC-2025-006', 
    name: 'Vũ Thị Hoa', 
    gender: 'Nữ',
    idNumber: '001234567895', 
    birthDate: '18/07/1995', 
    birthDateInWords: 'Ngày 18 tháng 7 năm 1995',
    birthPlace: 'Hà Nội',
    hometown: 'Hà Nội',
    ethnicity: 'Kinh',
    nationality: 'Việt Nam',
    personalId: '001234567895',
    certificateNo: '001234567895',
    registrationDate: '18/07/1995',
    syncDate: '19/12/2025 15:30:12',
    type: 'Mới', 
    status: 'Hợp lệ',
    approvalStatus: 'Đã đồng bộ',
    collectedAt: '19/12/2025 15:30:12',
    fatherName: 'Vũ Văn Phong',
    fatherBirthDate: '01/01/1950',
    fatherEthnicity: 'Kinh',
    fatherNationality: 'Việt Nam',
    fatherAddress: 'Hà Nội',
    fatherIdIssueDate: '01/01/2000',
    fatherIdIssuePlace: 'Hà Nội',
    fatherIdNumber: '001234567890',
    fatherPersonalId: '001234567890',
    motherName: 'Đỗ Thị Quỳnh',
    motherBirthDate: '01/01/1950',
    motherEthnicity: 'Kinh',
    motherNationality: 'Việt Nam',
    motherAddress: 'Hà Nội',
    motherIdIssueDate: '01/01/2000',
    motherIdIssuePlace: 'Hà Nội',
    motherIdNumber: '001234567890',
    motherPersonalId: '001234567890'
  },
  { 
    id: '7', 
    code: 'REC-2025-007', 
    name: 'Đỗ Văn Kiên', 
    gender: 'Nam',
    idNumber: 'abc12345', 
    birthDate: '05/02/1987', 
    birthDateInWords: 'Ngày 05 tháng 2 năm 1987',
    birthPlace: 'Hà Nội',
    hometown: 'Hà Nội',
    ethnicity: 'Kinh',
    nationality: 'Việt Nam',
    personalId: 'abc12345',
    certificateNo: 'abc12345',
    registrationDate: '05/02/1987',
    syncDate: '19/12/2025 15:30:15',
    type: 'Mới', 
    status: 'Lỗi định dạng',
    approvalStatus: 'Đã cập nhật lại',
    collectedAt: '19/12/2025 15:30:15',
    hasError: true,
    errorMessage: 'Sai định dạng',
    fatherName: 'Đỗ Văn Sơn',
    fatherBirthDate: '01/01/1950',
    fatherEthnicity: 'Kinh',
    fatherNationality: 'Việt Nam',
    fatherAddress: 'Hà Nội',
    fatherIdIssueDate: '01/01/2000',
    fatherIdIssuePlace: 'Hà Nội',
    fatherIdNumber: '001234567890',
    fatherPersonalId: '001234567890',
    motherName: 'Nguyễn Thị Tâm',
    motherBirthDate: '01/01/1950',
    motherEthnicity: 'Kinh',
    motherNationality: 'Việt Nam',
    motherAddress: 'Hà Nội',
    motherIdIssueDate: '01/01/2000',
    motherIdIssuePlace: 'Hà Nội',
    motherIdNumber: '001234567890',
    motherPersonalId: '001234567890',
    errorProcessStatus: 'updated',
    errorProcessText: 'Đã cập nhật lại'
  },
];
