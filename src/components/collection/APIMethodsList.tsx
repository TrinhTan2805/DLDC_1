import { Search, Filter, Download, Plus, Eye, Edit2, Trash2, FileText, Database } from 'lucide-react';
import React, { useState } from 'react';
import { ViewAPIMethodDetail } from './ViewAPIMethodDetail';
import { EditAPIMethodForm } from './EditAPIMethodForm';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { AddDataCollectionForm } from './AddDataCollectionForm';
import { ViewDataCollectionDetail } from './ViewDataCollectionDetail';
import { EditDataCollectionForm } from './EditDataCollectionForm';
import { DeleteDataConfirmModal } from './DeleteDataConfirmModal';
import { ViewDataRecordsList } from './ViewDataRecordsList';
import { AdvancedSearchModal } from './AdvancedSearchModal';

interface APIMethodsListProps {
  onAddNew: () => void;
}

const apiMethods = [
  {
    id: 1,
    name: 'API Thu thập dữ liệu dân số',
    method: 'GET',
    ministry: 'Bộ Nội vụ',
    database: 'CSDL Quốc gia về Dân cư',
    endpoint: 'https://api.moha.gov.vn/v1/population',
    frequency: 'Hằng tháng',
    status: 'active'
  },
  {
    id: 2,
    name: 'API Thống kê giáo dục',
    method: 'POST',
    ministry: 'Bộ Giáo dục và Đào tạo',
    database: 'CSDL Giáo dục Quốc gia',
    endpoint: 'https://api.moet.gov.vn/v2/education-sta...',
    frequency: 'Hằng quý',
    status: 'active'
  },
  {
    id: 3,
    name: 'API Dữ liệu y tế',
    method: 'GET',
    ministry: 'Bộ Y tế',
    database: 'CSDL Quản lý Y tế',
    endpoint: 'https://api.moh.gov.vn/v1/health-data',
    frequency: 'Hằng tuần',
    status: 'inactive'
  }
];

// Data Collection List
interface DataItem {
  id: number;
  stt: number;
  department: string;
  dataName: string;
  dataType: string;
  description: string;
  frequency: string;
  format: string;
  status: 'collected' | 'pending' | 'not-started';
  priority: 'high' | 'medium' | 'low';
  lastUpdate: string;
  category: 'external' | 'internal'; // external = ngoài BTP, internal = trong BTP
}

const dataCollectionList: DataItem[] = [
  // Thu thập từ Bộ ngoài (21 nguồn)
  { id: 1, stt: 1, category: 'external', department: 'Tòa án nhân dân tối cao', dataName: 'Thông tin Bản án, quyết định từ Tòa án nhân dân tối cao', dataType: 'Tòa án', description: 'Dữ liệu bản án và quyết định từ TANDTC', frequency: 'Hằng ngày', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '06/12/2025' },
  { id: 2, stt: 2, category: 'external', department: 'Cục Thống kê Trung ương', dataName: 'Danh mục giới tính', dataType: 'Danh mục', description: 'Danh mục chuẩn về giới tính', frequency: 'Hng năm', format: 'JSON', status: 'collected', priority: 'medium', lastUpdate: '01/01/2025' },
  { id: 3, stt: 3, category: 'external', department: 'Ủy ban Dân tộc', dataName: 'Danh mục và mã các dân tộc', dataType: 'Danh mục', description: 'Danh mục 54 dân tộc Việt Nam', frequency: 'Hằng năm', format: 'JSON', status: 'collected', priority: 'medium', lastUpdate: '01/01/2025' },
  { id: 4, stt: 4, category: 'external', department: 'Bộ Ngoại giao', dataName: 'Danh mục và mã Quốc gia, Quốc tịch', dataType: 'Danh mục', description: 'Danh mục quốc gia và quốc tịch', frequency: 'Hằng năm', format: 'JSON', status: 'collected', priority: 'medium', lastUpdate: '01/01/2025' },
  { id: 5, stt: 5, category: 'external', department: 'Ban Tôn giáo Chính phủ', dataName: 'Danh mục và mã các Tôn giáo', dataType: 'Danh mục', description: 'Danh mục các tôn giáo được công nhận', frequency: 'Hằng năm', format: 'JSON', status: 'collected', priority: 'medium', lastUpdate: '01/01/2025' },
  { id: 6, stt: 6, category: 'external', department: 'Văn phòng Chính phủ', dataName: 'Danh mục cơ quan', dataType: 'Danh mục', description: 'Danh mục các cơ quan nhà nước', frequency: 'Hằng quý', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '01/10/2025' },
  { id: 7, stt: 7, category: 'external', department: 'Cục Thống kê Trung ương', dataName: 'Danh mục đơn vị hành chính', dataType: 'Danh mục', description: 'Danh mục tỉnh, huyện, xã toàn quốc', frequency: 'Hằng quý', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '01/10/2025' },
  { id: 8, stt: 8, category: 'external', department: 'Bộ Nội vụ', dataName: 'Danh mục và mã mối quan hệ trong gia đình', dataType: 'Danh mục', description: 'Danh mục mối quan hệ gia đình', frequency: 'Hằng năm', format: 'JSON', status: 'collected', priority: 'low', lastUpdate: '01/01/2025' },
  { id: 9, stt: 9, category: 'external', department: 'Bộ Công an', dataName: 'Danh mục mã giấy tờ tùy thân', dataType: 'Danh mục', description: 'Danh mục các loại giấy tờ tùy thân', frequency: 'Hằng năm', format: 'JSON', status: 'collected', priority: 'medium', lastUpdate: '01/01/2025' },
  { id: 10, stt: 10, category: 'external', department: 'Bộ Lao động - Thương binh và Xã hội', dataName: 'Bảo trợ xã hội và giảm nghèo - Hưởng trợ giúp xã hội', dataType: 'Bảo trợ XH', description: 'Danh sách người hưởng trợ giúp xã hội', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 11, stt: 11, category: 'external', department: 'Bộ Lao động - Thương binh và Xã hội', dataName: 'Bảo trợ xã hội và giảm nghèo - Thông tin người nghèo, cận nghèo', dataType: 'Bảo trợ XH', description: 'Dữ liệu hộ nghèo, cận nghèo', frequency: 'Hằng quý', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '01/10/2025' },
  { id: 12, stt: 12, category: 'external', department: 'Bộ Lao động - Thương binh và Xã hội', dataName: 'Bảo trợ xã hội và giảm nghèo - Người đơn thân', dataType: 'Bảo trợ XH', description: 'Thông tin người đơn thân cần hỗ trợ', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 13, stt: 13, category: 'external', department: 'Bộ Lao động - Thương binh và Xã hội', dataName: 'Bảo trợ xã hội và giảm nghèo - Trẻ em là đối tượng bảo trợ xã hội', dataType: 'Bảo trợ XH', description: 'Trẻ em cần bảo trợ xã hội', frequency: 'Hằng tháng', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 14, stt: 14, category: 'external', department: 'Bộ Y tế', dataName: 'Bảo trợ xã hội và giảm nghèo - Người có HIV', dataType: 'Bảo trợ XH', description: 'Người nhiễm HIV cần hỗ trợ', frequency: 'Hằng tháng', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 15, stt: 15, category: 'external', department: 'Bộ Lao động - Thương binh và Xã hội', dataName: 'Bảo trợ xã hội và giảm nghèo - Người cao tuổi', dataType: 'Bảo trợ XH', description: 'Người cao tuổi cần chăm sóc', frequency: 'Hằng tháng', format: 'JSON', status: 'collected', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 16, stt: 16, category: 'external', department: 'Bộ Lao động - Thương binh và Xã hội', dataName: 'Bảo trợ xã hội và giảm nghèo - Thông tin về người khuyết tật', dataType: 'Bảo trợ XH', description: 'Người khuyết tật cần hỗ trợ', frequency: 'Hằng tháng', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 17, stt: 17, category: 'external', department: 'Bộ Lao động - Thương binh và Xã hội', dataName: 'Người có công - Hồ sơ công nhận người có công', dataType: 'Người có công', description: 'Hồ sơ công nhận người có công với cách mạng', frequency: 'Hằng tháng', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 18, stt: 18, category: 'external', department: 'Bộ Lao động - Thương binh và Xã hội', dataName: 'Người có công - Hồ sơ liệt sĩ', dataType: 'Người có công', description: 'Hồ sơ liệt sĩ và gia đình liệt sĩ', frequency: 'Hằng tháng', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 19, stt: 19, category: 'external', department: 'Bộ Lao động - Thương binh và Xã hội', dataName: 'Người có công - Hồ sơ công nhận thân nhân người có công', dataType: 'Người có công', description: 'Hồ sơ thân nhân người có công', frequency: 'Hằng tháng', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 20, stt: 20, category: 'external', department: 'Bộ Lao động - Thương binh và Xã hội', dataName: 'Trẻ em - Thông tin trẻ em', dataType: 'Trẻ em', description: 'Thông tin quản lý trẻ em toàn quốc', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'medium', lastUpdate: '01/12/2025' },

  // Thu thập trong nội bộ
  { id: 21, stt: 1, category: 'internal', department: 'Đơn vị A', dataName: 'CSDL A', dataType: 'Biên tập danh mục A', description: 'Mô tả dữ liệu A', frequency: 'Hằng ngày', format: 'JSON', status: 'collected', priority: 'high', lastUpdate: '06/12/2025' },

  // Thu thập số liệu thống kê từ Phần mềm thống kê ngành Tư pháp (22 lĩnh vực)
  { id: 32, stt: 12, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Xây dựng văn bản quy phạm pháp luật', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Xây dựng văn bản QPPL theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 33, stt: 13, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Kiểm tra văn bản quy phạm pháp luật', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Kiểm tra văn bản QPPL theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 34, stt: 14, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Rà soát văn bản quy phạm pháp luật', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Rà soát văn bản QPPL theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 35, stt: 15, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Tổ chức và người làm công tác pháp chế', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Tổ chức và người làm công tác pháp chế theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 36, stt: 16, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Phổ biến, giáo dục pháp luật', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Phổ biến, giáo dục pháp luật theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'not-started', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 37, stt: 17, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Hòa giải ở cơ sở', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Hòa giải ở cơ sở theo Thông tư của Bộ trưởng BTP quy định về hoạt đng thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'not-started', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 38, stt: 18, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Chuẩn tiếp cận pháp luật', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Chuẩn tiếp cận pháp luật theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'not-started', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 39, stt: 19, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Hộ tịch', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Hộ tịch theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 40, stt: 20, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Chứng thực', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Chứng thực theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 41, stt: 21, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Lý lịch tư pháp', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Lý lịch tư pháp theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 42, stt: 22, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Nuôi con nuôi', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Nuôi con nuôi theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'not-started', priority: 'low', lastUpdate: '01/12/2025' },
  { id: 43, stt: 23, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Trợ giúp pháp lý', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Trợ giúp pháp lý theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 44, stt: 24, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Đăng ký giao dịch bảo đảm', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Đăng ký giao dịch bảo đảm theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 45, stt: 25, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Luật sư', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Luật sư theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 46, stt: 26, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Công chứng', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Công chứng theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'high', lastUpdate: '01/12/2025' },
  { id: 47, stt: 27, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Giám định tư pháp', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Giám định tư pháp theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'not-started', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 48, stt: 28, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Đấu giá tài sản', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Đấu giá tài sản theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'not-started', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 49, stt: 29, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Trọng tài thương mại', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Trọng tài thương mại theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'not-started', priority: 'low', lastUpdate: '01/12/2025' },
  { id: 50, stt: 30, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Hòa giải thương mại', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Hòa giải thương mại theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'not-started', priority: 'low', lastUpdate: '01/12/2025' },
  { id: 51, stt: 31, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Quản lý thanh lý tài sản', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Quản lý thanh lý tài sản theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'not-started', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 52, stt: 32, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Số liệu thống kê lĩnh vực Tương trợ tư pháp', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê trong lĩnh vực Tương trợ tư pháp theo Thông tư của Bộ trưởng BTP quy định về hoạt động thống kê ngành Tư pháp', frequency: 'Hằng tháng', format: 'JSON', status: 'not-started', priority: 'medium', lastUpdate: '01/12/2025' },
  { id: 53, stt: 33, category: 'internal', department: 'Phần mềm thống kê ngành Tư pháp', dataName: 'Dữ liệu mở ngành Tư pháp', dataType: 'Thống kê', description: 'Thu thập số liệu thống kê từ Phần mềm thống kê ngành Tư pháp phục vụ chia sẻ dữ liệu mở theo Quyết định số 1459/QĐ-BTP ngày 15/05/2025', frequency: 'Hằng tháng', format: 'JSON', status: 'pending', priority: 'high', lastUpdate: '01/12/2025' },
];

export function APIMethodsList({ onAddNew }: APIMethodsListProps) {
  const [viewMethod, setViewMethod] = useState<any>(null);
  const [editMethod, setEditMethod] = useState<any>(null);
  const [deleteMethod, setDeleteMethod] = useState<any>(null);
  const [searchData, setSearchData] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewData, setViewData] = useState<any>(null);
  const [editData, setEditData] = useState<any>(null);
  const [deleteData, setDeleteData] = useState<any>(null);
  const [viewDataRecords, setViewDataRecords] = useState<any>(null);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedStatFilter, setSelectedStatFilter] = useState('all');
  const [selectedAgencyFilter, setSelectedAgencyFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState({
    department: '',
    dataType: '',
    frequency: '',
    format: '',
    status: '',
    priority: '',
    dateFrom: '',
    dateTo: ''
  });

  // Get unique departments for filter
  const uniqueDepartments = Array.from(new Set(dataCollectionList.map(item => item.department))).sort();

  const filteredData = dataCollectionList.filter(item => {
    // Basic search filter
    const matchesSearch = searchData === '' ||
      item.dataName.toLowerCase().includes(searchData.toLowerCase()) ||
      item.department.toLowerCase().includes(searchData.toLowerCase());

    // Department filter
    const matchesDepartment = departmentFilter === '' || item.department === departmentFilter;

    // Advanced filters
    const matchesAdvDepartment = advancedFilters.department === '' || item.department === advancedFilters.department;
    const matchesDataType = advancedFilters.dataType === '' || item.dataType === advancedFilters.dataType;
    const matchesFrequency = advancedFilters.frequency === '' || item.frequency === advancedFilters.frequency;
    const matchesFormat = advancedFilters.format === '' || item.format === advancedFilters.format;
    const matchesStatus = advancedFilters.status === '' || item.status === advancedFilters.status;
    const matchesPriority = advancedFilters.priority === '' || item.priority === advancedFilters.priority;

    return matchesSearch && matchesDepartment && matchesAdvDepartment && matchesDataType &&
      matchesFrequency && matchesFormat && matchesStatus && matchesPriority;
  });

  // Separate data by category
  const externalData = filteredData.filter(item => item.category === 'external');
  const internalData = filteredData.filter(item => item.category === 'internal');

  // Statistics
  const stats = {
    pending: dataCollectionList.filter(r => r.status === 'pending').length,
    collected: dataCollectionList.filter(r => r.status === 'collected').length,
    totalRecords: 5494,
    totalSize: '44.8 MB'
  };

  // Agency statistics - Top 4 departments
  const agencyStats = [
    { agency: 'Đơn vị A', count: 2, color: 'blue' },
    { agency: 'Vụ Pháp luật', count: 2, color: 'green' },
    { agency: 'Cục Công nghệ thông tin', count: 1, color: 'purple' },
    { agency: 'Vụ Tổ chức', count: 0, color: 'orange' },
  ];

  const handleStatCardClick = (filter: string) => {
    setSelectedStatFilter(filter);
    setSelectedAgencyFilter('all');
  };

  const handleAgencyCardClick = (agency: string) => {
    setSelectedAgencyFilter(agency);
    setSelectedStatFilter('all');
  };

  const getAgencyColorClass = (color: string, selected: boolean) => {
    if (selected) {
      switch (color) {
        case 'blue': return 'border-blue-500 shadow-md';
        case 'green': return 'border-green-500 shadow-md';
        case 'purple': return 'border-purple-500 shadow-md';
        case 'orange': return 'border-orange-500 shadow-md';
        default: return 'border-slate-200';
      }
    }
    return 'border-slate-200';
  };

  const getAgencyBgClass = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50';
      case 'green': return 'bg-green-50';
      case 'purple': return 'bg-purple-50';
      case 'orange': return 'bg-orange-50';
      default: return 'bg-slate-50';
    }
  };

  const getAgencyTextClass = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      case 'orange': return 'text-orange-600';
      default: return 'text-slate-600';
    }
  };

  const getDataStatusBadge = (status: string) => {
    switch (status) {
      case 'collected':
        return <span className="px-3 py-1 rounded-full text-base bg-green-100 text-green-700">Đã thu thập</span>;
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-base bg-orange-100 text-orange-700">Đang xử lý</span>;
      case 'not-started':
        return <span className="px-3 py-1 rounded-full text-base bg-slate-100 text-slate-700">Chưa bắt đầu</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-3 py-1 rounded-full text-base bg-red-100 text-red-700">Cao</span>;
      case 'medium':
        return <span className="px-3 py-1 rounded-full text-base bg-yellow-100 text-yellow-700">Trung bình</span>;
      case 'low':
        return <span className="px-3 py-1 rounded-full text-base bg-blue-100 text-blue-700">Thấp</span>;
      default:
        return null;
    }
  };

  // If editing, show edit form
  if (editMethod) {
    return <EditAPIMethodForm method={editMethod} onBack={() => setEditMethod(null)} onSave={() => { }} />;
  }

  // Show Add Form
  if (showAddForm) {
    return <AddDataCollectionForm onBack={() => setShowAddForm(false)} onSave={() => { }} />;
  }

  // Show View Data Records List
  if (viewDataRecords) {
    return <ViewDataRecordsList dataItem={viewDataRecords} onBack={() => setViewDataRecords(null)} />;
  }

  // Show View Detail
  if (viewData) {
    return <ViewDataCollectionDetail data={viewData} onBack={() => setViewData(null)} onEdit={() => { setEditData(viewData); setViewData(null); }} />;
  }

  // Show Edit Form
  if (editData) {
    return <EditDataCollectionForm data={editData} onBack={() => setEditData(null)} onSave={() => { }} />;
  }

  return (
    <div style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px' }}>
    <div className="space-y-6">
      {/* ========== DANH SÁCH DỮ LIỆU CẦN THU THẬT ========== */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-slate-900">Danh sách Dữ liệu Cần Thu thập</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Thêm mới dữ liệu
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input aria-label="Input field"
            type="text"
            placeholder="Tìm kiếm theo tên dữ liệu, cục..."
            value={searchData}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchData(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select aria-label="Select box"
            title="Bộ lọc cơ quan"
            value={departmentFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2.5 border border-slate-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả cơ quan</option>
            {uniqueDepartments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <button
            onClick={() => setShowAdvancedSearch(true)}
            className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Tìm kiếm nâng cao
          </button>
        </div>

        {/* Active Filters Display */}
        {(departmentFilter || advancedFilters.status || advancedFilters.dataType || advancedFilters.priority) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-base flex-wrap">
                <Filter className="w-4 h-4 text-blue-600" />
                <span className="text-blue-900">Bộ lọc đang áp dụng:</span>
                {departmentFilter && (
                  <span className="px-2 py-1 bg-white rounded text-blue-700">
                    Cơ quan: {departmentFilter}
                  </span>
                )}
                {advancedFilters.dataType && (
                  <span className="px-2 py-1 bg-white rounded text-blue-700">
                    Loại: {advancedFilters.dataType}
                  </span>
                )}
                {advancedFilters.status && (
                  <span className="px-2 py-1 bg-white rounded text-blue-700">
                    Trạng thái: {advancedFilters.status === 'collected' ? 'Đã thu thập' : advancedFilters.status === 'pending' ? 'Đang xử lý' : 'Chưa bắt đầu'}
                  </span>
                )}
                {advancedFilters.priority && (
                  <span className="px-2 py-1 bg-white rounded text-blue-700">
                    Mức độ: {advancedFilters.priority === 'high' ? 'Cao' : advancedFilters.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                  </span>
                )}
              </div>
              <button
                onClick={() => {
                  setDepartmentFilter('');
                  setAdvancedFilters({
                    department: '',
                    dataType: '',
                    frequency: '',
                    format: '',
                    status: '',
                    priority: '',
                    dateFrom: '',
                    dateTo: ''
                  });
                }}
                className="text-base text-blue-600 hover:text-blue-700"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}

        {/* 1. Thu thập từ Bộ ngoài */}
        {externalData.length > 0 && (
          <>
            <div className="flex items-center gap-2 pt-4">
              <div className="w-1 h-6 bg-blue-600 rounded"></div>
              <h3 className="text-slate-900">Thu thập dữ liệu từ Bộ ngoài</h3>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-base rounded-full">{externalData.length}</span>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">STT</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">CƠ QUAN</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TÊN DỮ LIỆU</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">LOẠI DỮ LIỆU</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TẦN SUẤT</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">ĐỊNH DẠNG</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">MỨC ĐỘ</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TRẠNG THÁI</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">CẬP NHẬT</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {externalData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-base text-slate-900">{item.stt}</td>
                        <td className="px-4 py-3 text-base text-slate-700">{item.department}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-base text-slate-900">{item.dataName}</p>
                            <p className="text-base text-slate-500 mt-0.5">{item.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-base text-slate-700">{item.dataType}</td>
                        <td className="px-4 py-3 text-base text-slate-700">{item.frequency}</td>
                        <td className="px-4 py-3 text-base text-slate-700">{item.format}</td>
                        <td className="px-4 py-3">{getPriorityBadge(item.priority)}</td>
                        <td className="px-4 py-3">{getDataStatusBadge(item.status)}</td>
                        <td className="px-4 py-3 text-base text-slate-700">{item.lastUpdate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewDataRecords(item)}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Xem dữ liệu"
                            >
                              <Database className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setViewData(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditData(item)}
                              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteData(item)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* 2. Thu thập trong nội bộ */}
        {internalData.length > 0 && (
          <>
            <div className="flex items-center gap-2 pt-4">
              <div className="w-1 h-6 bg-green-600 rounded"></div>
              <h3 className="text-slate-900">Thu thập dữ liệu từ các Hệ thống trong nội bộ</h3>
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-base rounded-full">{internalData.length}</span>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">STT</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">CƠ QUAN</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TÊN DỮ LIỆU</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">LOẠI DỮ LIỆU</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TẦN SUẤT</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">ĐỊNH DẠNG</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">MỨC ĐỘ</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">TRẠNG THÁI</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">CẬP NHẬT</th>
                      <th className="px-4 py-3 text-left text-base text-slate-600 uppercase tracking-wider">THAO TÁC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {internalData.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-base text-slate-900">{item.stt}</td>
                        <td className="px-4 py-3 text-base text-slate-700">{item.department}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-base text-slate-900">{item.dataName}</p>
                            <p className="text-base text-slate-500 mt-0.5">{item.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-base text-slate-700">{item.dataType}</td>
                        <td className="px-4 py-3 text-base text-slate-700">{item.frequency}</td>
                        <td className="px-4 py-3 text-base text-slate-700">{item.format}</td>
                        <td className="px-4 py-3">{getPriorityBadge(item.priority)}</td>
                        <td className="px-4 py-3">{getDataStatusBadge(item.status)}</td>
                        <td className="px-4 py-3 text-base text-slate-700">{item.lastUpdate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setViewDataRecords(item)}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                              title="Xem dữ liệu"
                            >
                              <Database className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setViewData(item)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditData(item)}
                              className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteData(item)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteData && (
        <DeleteDataConfirmModal
          data={deleteData}
          onConfirm={() => setDeleteData(null)}
          onCancel={() => setDeleteData(null)}
        />
      )}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <AdvancedSearchModal
          onClose={() => setShowAdvancedSearch(false)}
          onSearch={(filters) => setAdvancedFilters(filters)}
          currentFilters={advancedFilters}
        />
      )}
    </div>
    </div>
  );
}