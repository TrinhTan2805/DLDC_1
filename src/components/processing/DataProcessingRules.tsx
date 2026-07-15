import { useState } from 'react';
import { ChevronDown, ChevronRight, Sparkles, CheckCircle, XCircle, Settings } from 'lucide-react';
import { ConfigureRuleModal } from './ConfigureRuleModal';

interface ProcessingRule {
  id: string;
  name: string;
  type: 'clean' | 'standardize' | 'transform';
  status: 'configured' | 'not-configured' | 'running';
  lastRun?: string;
}

interface DataCategory {
  id: string;
  name: string;
  rules: ProcessingRule[];
  children?: DataCategory[];
}

const processingRulesData: DataCategory[] = [
  {
    id: 'external',
    name: 'Dữ liệu từ Bộ ngoài',
    rules: [],
    children: [
      {
        id: 'catalog',
        name: 'Dữ liệu danh mục từ Bộ ngành ngoài',
        rules: [
          { id: 'catalog-1', name: 'Thiết lập quy tắc danh mục từ Bộ ngành ngoài', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
          { id: 'catalog-2', name: 'Thiết lập quy tắc biến đổi dữ liệu Dữ liệu danh mục dùng chung thu thập qua TTDLQG', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
        ]
      },
      {
        id: 'social-support',
        name: 'Bảo trợ xã hội và giảm nghèo',
        rules: [
          { id: 'ss-1', name: 'Thiết lập quy tắc biến đổi - Hưởng trợ giúp xã hội', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
          { id: 'ss-2', name: 'Thiết lập quy tắc biến đổi - Thông tin người nghèo, cận nghèo', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
          { id: 'ss-3', name: 'Thiết lập quy tắc biến đổi - Người đơn thân', type: 'transform', status: 'not-configured' },
          { id: 'ss-4', name: 'Thiết lập quy tắc biến đổi - Trẻ em là đối tượng bảo trợ xã hội', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
          { id: 'ss-5', name: 'Thiết lập quy tắc biến đổi - Người có HIV', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
          { id: 'ss-6', name: 'Thiết lập quy tắc biến đổi - Người cao tuổi', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
          { id: 'ss-7', name: 'Thiết lập quy tắc biến đổi - Thông tin về người khuyết tật', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
        ]
      },
      {
        id: 'merit',
        name: 'Người có công',
        rules: [
          { id: 'merit-1', name: 'Thiết lập quy tắc biến đổi - Hồ sơ công nhận người có công', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
          { id: 'merit-2', name: 'Thiết lập quy tắc biến đổi - Hồ sơ liệt sĩ', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
          { id: 'merit-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ công nhận thân nhân người có công', type: 'transform', status: 'configured', lastRun: '01/12/2025' },
        ]
      },
      {
        id: 'children',
        name: 'Trẻ em',
        rules: [
          { id: 'children-1', name: 'Thiết lập quy tắc biến đổi - Trẻ em', type: 'transform', status: 'not-configured' },
        ]
      },
      {
        id: 'court',
        name: 'Thông tin Bản án, quyết định',
        rules: [
          { id: 'court-1', name: 'Thiết lập quy tắc làm sạch', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
          { id: 'court-2', name: 'Thiết lập quy tắc chuẩn hóa', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
          { id: 'court-3', name: 'Thiết lập quy tắc biến đổi', type: 'transform', status: 'running' },
        ]
      },
    ]
  },
  {
    id: 'internal',
    name: 'Thu thập từ các Hệ thống trong ngành',
    rules: [],
    children: [
      {
        id: 'civil-admin',
        name: 'Cục Hành chính tư pháp',
        rules: [],
        children: [
          {
            id: 'civil-registry',
            name: 'CSDL Hộ tịch điện tử',
            rules: [
              { id: 'birth-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ đăng ký khai sinh', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'birth-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ đăng ký khai sinh', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'birth-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ đăng ký khai sinh', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'marriage-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ đăng ký kết hôn', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'marriage-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ đăng ký kết hôn', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'marriage-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ đăng ký kết hôn', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'marital-1', name: 'Thiết lập quy tắc làm sạch - Giấy xác nhận tình trạng hôn nhân', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'marital-2', name: 'Thiết lập quy tắc chuẩn hóa - Giấy xác nhận tình trạng hôn nhân', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'marital-3', name: 'Thiết lập quy tắc biến đổi - Giấy xác nhận tình trạng hôn nhân', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'death-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ đăng ký khai tử', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'death-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ đăng ký khai tử', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'death-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ đăng ký khai tử', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'recognition-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ đăng ký nhận cha, mẹ, con', type: 'clean', status: 'not-configured' },
              { id: 'recognition-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ đăng ký nhận cha, mẹ, con', type: 'standardize', status: 'not-configured' },
              { id: 'recognition-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ đăng ký nhận cha, mẹ, con', type: 'transform', status: 'not-configured' },

              { id: 'adoption-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ đăng ký nuôi con nuôi', type: 'clean', status: 'not-configured' },
              { id: 'adoption-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ đăng ký nuôi con nuôi', type: 'standardize', status: 'not-configured' },
              { id: 'adoption-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ đăng ký nuôi con nuôi', type: 'transform', status: 'not-configured' },

              { id: 'guardian-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ đăng ký giám hộ', type: 'clean', status: 'not-configured' },
              { id: 'guardian-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ đăng ký giám hộ', type: 'standardize', status: 'not-configured' },
              { id: 'guardian-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ đăng ký giám hộ', type: 'transform', status: 'not-configured' },

              { id: 'guardian-end-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ đăng ký chấm dứt giám hộ', type: 'clean', status: 'not-configured' },
              { id: 'guardian-end-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ đăng ký chấm dứt giám hộ', type: 'standardize', status: 'not-configured' },
              { id: 'guardian-end-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ đăng ký chấm dứt giám hộ', type: 'transform', status: 'not-configured' },

              { id: 'amendment-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ thay đổi, cải chính, bổ sung thông tin hộ tịch', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'amendment-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ thay đổi, cải chính, bổ sung thông tin hộ tịch', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'amendment-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ thay đổi, cải chính, bổ sung thông tin hộ tịch', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'supervision-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ đăng ký giám sát việc giám hộ', type: 'clean', status: 'not-configured' },
              { id: 'supervision-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ đăng ký giám sát việc giám hộ', type: 'standardize', status: 'not-configured' },
              { id: 'supervision-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ đăng ký giám sát việc giám hộ', type: 'transform', status: 'not-configured' },

              { id: 'supervision-end-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ chấm dứt giám sát việc giám hộ', type: 'clean', status: 'not-configured' },
              { id: 'supervision-end-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ chấm dứt giám sát việc giám hộ', type: 'standardize', status: 'not-configured' },
              { id: 'supervision-end-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ chấm dứt giám sát việc giám hộ', type: 'transform', status: 'not-configured' },

              { id: 'divorce-note-1', name: 'Thiết lập quy tắc làm sạch - Ghi vào sổ việc ly hôn/hủy việc kết hôn tại nước ngoài', type: 'clean', status: 'not-configured' },
              { id: 'divorce-note-2', name: 'Thiết lập quy tắc chuẩn hóa - Ghi vào sổ việc ly hôn/hủy việc kết hôn tại nước ngoài', type: 'standardize', status: 'not-configured' },
              { id: 'divorce-note-3', name: 'Thiết lập quy tắc biến đổi - Ghi vào sổ việc ly hôn/hủy việc kết hôn tại nước ngoài', type: 'transform', status: 'not-configured' },
            ]
          },
          {
            id: 'nationality',
            name: 'HT quản lý hồ sơ QT',
            rules: [
              { id: 'nat-acquire-1', name: 'Thiết lập quy tắc làm sạch - Nhập Quốc tịch', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'nat-acquire-2', name: 'Thiết lập quy tắc chuẩn hóa - Nhập Quốc tịch', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'nat-acquire-3', name: 'Thiết lập quy tắc biến đổi - Nhập Quốc tịch', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'nat-renounce-1', name: 'Thiết lập quy tắc làm sạch - Thôi Quốc tịch', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'nat-renounce-2', name: 'Thiết lập quy tắc chuẩn hóa - Thôi Quốc tịch', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'nat-renounce-3', name: 'Thiết lập quy tắc biến đổi - Thôi Quốc tịch', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'nat-restore-1', name: 'Thiết lập quy tắc làm sạch - Trở lại Quốc tịch', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'nat-restore-2', name: 'Thiết lập quy tắc chuẩn hóa - Trở lại Quốc tịch', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'nat-restore-3', name: 'Thiết lập quy tắc biến đổi - Trở lại Quốc tịch', type: 'transform', status: 'configured', lastRun: '06/12/2025' },
            ]
          }
        ]
      },
      {
        id: 'civil-judgment',
        name: 'Cục Quản lý thi hành án dân sự',
        rules: [],
        children: [
          {
            id: 'judgment-db',
            name: 'Cơ sở dữ liệu thi hành án dân sự',
            rules: [
              { id: 'jd-request-1', name: 'Thiết lập quy tắc làm sạch - Yêu cầu thi hành án', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-request-2', name: 'Thiết lập quy tắc chuẩn hóa - Yêu cầu thi hành án', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-request-3', name: 'Thiết lập quy tắc biến đổi - Yêu cầu thi hành án', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'jd-decision-1', name: 'Thiết lập quy tắc làm sạch - Quyết định thi hành án dân sự', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-decision-2', name: 'Thiết lập quy tắc chuẩn hóa - Quyết định thi hành án dân sự', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-decision-3', name: 'Thiết lập quy tắc biến đổi - Quyết định thi hành án dân sự', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'jd-parties-1', name: 'Thiết lập quy tắc làm sạch - Người phải THA, người được THA', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-parties-2', name: 'Thiết lập quy tắc chuẩn hóa - Người phải THA, người được THA', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-parties-3', name: 'Thiết lập quy tắc biến đổi - Người phải THA, người được THA', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'jd-obligation-1', name: 'Thiết lập quy tắc làm sạch - Nghĩa vụ thi hành án', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-obligation-2', name: 'Thiết lập quy tắc chuẩn hóa - Nghĩa vụ thi hành án', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-obligation-3', name: 'Thiết lập quy tắc biến đổi - Nghĩa vụ thi hành án', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'jd-status-1', name: 'Thiết lập quy tắc làm sạch - Trạng thái thi hành án', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-status-2', name: 'Thiết lập quy tắc chuẩn hóa - Trạng thái thi hành án', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-status-3', name: 'Thiết lập quy tắc biến đổi - Trạng thái thi hành án', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'jd-asset-1', name: 'Thiết lập quy tắc làm sạch - Tài sản thi hành án', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-asset-2', name: 'Thiết lập quy tắc chuẩn hóa - Tài sản thi hành án', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'jd-asset-3', name: 'Thiết lập quy tắc biến đổi - Tài sản thi hành án', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'jd-verify-1', name: 'Thiết lập quy tắc làm sạch - Xác minh điều kiện THA', type: 'clean', status: 'not-configured' },
              { id: 'jd-verify-2', name: 'Thiết lập quy tắc chuẩn hóa - Xác minh điều kiện THA', type: 'standardize', status: 'not-configured' },
              { id: 'jd-verify-3', name: 'Thiết lập quy tắc biến đổi - Xác minh điều kiện THA', type: 'transform', status: 'not-configured' },

              { id: 'jd-enforce-1', name: 'Thiết lập quy tắc làm sạch - Cưỡng chế THA', type: 'clean', status: 'not-configured' },
              { id: 'jd-enforce-2', name: 'Thiết lập quy tắc chuẩn hóa - Cưỡng chế THA', type: 'standardize', status: 'not-configured' },
              { id: 'jd-enforce-3', name: 'Thiết lập quy tắc biến đổi - Cưỡng chế THA', type: 'transform', status: 'not-configured' },

              { id: 'jd-security-1', name: 'Thiết lập quy tắc làm sạch - Áp dụng biện pháp bảo đảm THA', type: 'clean', status: 'not-configured' },
              { id: 'jd-security-2', name: 'Thiết lập quy tắc chuẩn hóa - Áp dụng biện pháp bảo đảm THA', type: 'standardize', status: 'not-configured' },
              { id: 'jd-security-3', name: 'Thiết lập quy tắc biến đổi - Áp dụng biện pháp bảo đảm THA', type: 'transform', status: 'not-configured' },

              { id: 'jd-docs-1', name: 'Thiết lập quy tắc làm sạch - Chứng từ nghiệp vụ THA', type: 'clean', status: 'not-configured' },
              { id: 'jd-docs-2', name: 'Thiết lập quy tắc chuẩn hóa - Chứng từ nghiệp vụ THA', type: 'standardize', status: 'not-configured' },
              { id: 'jd-docs-3', name: 'Thiết lập quy tắc biến đổi - Chứng từ nghiệp vụ THA', type: 'transform', status: 'not-configured' },

              { id: 'jd-receipt-1', name: 'Thiết lập quy tắc làm sạch - Biên lai thu tiền THA', type: 'clean', status: 'not-configured' },
              { id: 'jd-receipt-2', name: 'Thiết lập quy tắc chuẩn hóa - Biên lai thu tiền THA', type: 'standardize', status: 'not-configured' },
              { id: 'jd-receipt-3', name: 'Thiết lập quy tắc biến đổi - Biên lai thu tiền THA', type: 'transform', status: 'not-configured' },

              { id: 'jd-evidence-1', name: 'Thiết lập quy tắc làm sạch - Vật chứng THA', type: 'clean', status: 'not-configured' },
              { id: 'jd-evidence-2', name: 'Thiết lập quy tắc chuẩn hóa - Vật chứng THA', type: 'standardize', status: 'not-configured' },
              { id: 'jd-evidence-3', name: 'Thiết lập quy tắc biến đổi - Vật chứng THA', type: 'transform', status: 'not-configured' },

              { id: 'jd-appraisal-1', name: 'Thiết lập quy tắc làm sạch - Thẩm định giá tài sản THA', type: 'clean', status: 'not-configured' },
              { id: 'jd-appraisal-2', name: 'Thiết lập quy tắc chuẩn hóa - Thẩm định giá tài sản THA', type: 'standardize', status: 'not-configured' },
              { id: 'jd-appraisal-3', name: 'Thiết lập quy tắc biến đổi - Thẩm định giá tài sản THA', type: 'transform', status: 'not-configured' },

              { id: 'jd-auction-1', name: 'Thiết lập quy tắc làm sạch - Đấu giá tài sản THA', type: 'clean', status: 'not-configured' },
              { id: 'jd-auction-2', name: 'Thiết lập quy tắc chuẩn hóa - Đấu giá tài sản THA', type: 'standardize', status: 'not-configured' },
              { id: 'jd-auction-3', name: 'Thiết lập quy tắc biến đổi - Đấu giá tài sản THA', type: 'transform', status: 'not-configured' },

              { id: 'jd-complaint-1', name: 'Thiết lập quy tắc làm sạch - Giải quyết khiếu nại, tố cáo THA', type: 'clean', status: 'not-configured' },
              { id: 'jd-complaint-2', name: 'Thiết lập quy tắc chuẩn hóa - Giải quyết khiếu nại, tố cáo THA', type: 'standardize', status: 'not-configured' },
              { id: 'jd-complaint-3', name: 'Thiết lập quy tắc biến đổi - Giải quyết khiếu nại, tố cáo THA', type: 'transform', status: 'not-configured' },

              { id: 'jd-guide-1', name: 'Thiết lập quy tắc làm sạch - Hướng dẫn nghiệp vụ THA', type: 'clean', status: 'not-configured' },
              { id: 'jd-guide-2', name: 'Thiết lập quy tắc chuẩn hóa - Hướng dẫn nghiệp vụ THA', type: 'standardize', status: 'not-configured' },
              { id: 'jd-guide-3', name: 'Thiết lập quy tắc biến đổi - Hướng dẫn nghiệp vụ THA', type: 'transform', status: 'not-configured' },
            ]
          }
        ]
      },
      {
        id: 'secured-transaction',
        name: 'Cục Đăng ký giao dịch bảo đảm và BTNN',
        rules: [],
        children: [
          {
            id: 'security-db',
            name: 'Cơ sở dữ liệu về biện pháp bảo đảm',
            rules: [
              { id: 'sec-general-1', name: 'Thiết lập quy tắc làm sạch - Thông tin chung (người đăng ký và HĐ bảo đảm)', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'sec-general-2', name: 'Thiết lập quy tắc chuẩn hóa - Thông tin chung', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'sec-general-3', name: 'Thiết lập quy tắc biến đổi - Thông tin chung', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'sec-provider-1', name: 'Thiết lập quy tắc làm sạch - Bên bảo đảm', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'sec-provider-2', name: 'Thiết lập quy tắc chuẩn hóa - Bên bảo đảm', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'sec-provider-3', name: 'Thiết lập quy tắc biến đổi - Bên bảo đảm', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'sec-recipient-1', name: 'Thiết lập quy tắc làm sạch - Bên nhận bảo đảm', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'sec-recipient-2', name: 'Thiết lập quy tắc chuẩn hóa - Bên nhận bảo đảm', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'sec-recipient-3', name: 'Thiết lập quy tắc biến đổi - Bên nhận bảo đảm', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'sec-asset-1', name: 'Thiết lập quy tắc làm sạch - Tài sản bảo đảm', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'sec-asset-2', name: 'Thiết lập quy tắc chuẩn hóa - Tài sản bảo đảm', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'sec-asset-3', name: 'Thiết lập quy tắc biến đổi - Tài sản bảo đảm', type: 'transform', status: 'configured', lastRun: '06/12/2025' },
            ]
          }
        ]
      },
      {
        id: 'doc-inspection',
        name: 'Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính',
        rules: [],
        children: [
          {
            id: 'law-db',
            name: 'CSDL quốc gia về pháp luật',
            rules: [
              { id: 'law-doc-1', name: 'Thiết lập quy tắc làm sạch - Văn bản QPPL', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'law-doc-2', name: 'Thiết lập quy tắc chuẩn hóa - Văn bản QPPL', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'law-doc-3', name: 'Thiết lập quy tắc biến đổi - Văn bản QPPL', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'law-content-1', name: 'Thiết lập quy tắc làm sạch - Nội dung của văn bản QPPL', type: 'clean', status: 'configured', lastRun: '06/12/2025' },
              { id: 'law-content-2', name: 'Thiết lập quy tắc chuẩn hóa - Nội dung của văn bản QPPL', type: 'standardize', status: 'configured', lastRun: '06/12/2025' },
              { id: 'law-content-3', name: 'Thiết lập quy tắc biến đổi - Nội dung của văn bản QPPL', type: 'transform', status: 'configured', lastRun: '06/12/2025' },

              { id: 'law-relation-1', name: 'Thiết lập quy tắc làm sạch - Quan hệ giữa các điều khoản', type: 'clean', status: 'not-configured' },
              { id: 'law-relation-2', name: 'Thiết lập quy tắc chuẩn hóa - Quan hệ giữa các điều khoản', type: 'standardize', status: 'not-configured' },
              { id: 'law-relation-3', name: 'Thiết lập quy tắc biến đổi - Quan hệ giữa các điều khoản', type: 'transform', status: 'not-configured' },

              { id: 'law-merged-1', name: 'Thiết lập quy tắc làm sạch - Văn bản hợp nhất', type: 'clean', status: 'not-configured' },
              { id: 'law-merged-2', name: 'Thiết lập quy tắc chuẩn hóa - Văn bản hợp nhất', type: 'standardize', status: 'not-configured' },
              { id: 'law-merged-3', name: 'Thiết lập quy tắc biến đổi - Văn bản hợp nhất', type: 'transform', status: 'not-configured' },

              { id: 'law-system-1', name: 'Thiết lập quy tắc làm sạch - Hệ thống hóa văn bản QPPL', type: 'clean', status: 'not-configured' },
              { id: 'law-system-2', name: 'Thiết lập quy tắc chuẩn hóa - Hệ thống hóa văn bản QPPL', type: 'standardize', status: 'not-configured' },
              { id: 'law-system-3', name: 'Thiết lập quy tắc biến đổi - Hệ thống hóa văn bản QPPL', type: 'transform', status: 'not-configured' },
            ]
          },
          {
            id: 'judicial-assist',
            name: 'Cơ sở dữ liệu tương trợ tư pháp về dân sự',
            rules: [
              { id: 'ja-incoming-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ ủy thác tư pháp đến', type: 'clean', status: 'not-configured' },
              { id: 'ja-incoming-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ ủy thác tư pháp đến', type: 'standardize', status: 'not-configured' },
              { id: 'ja-incoming-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ ủy thác tư pháp đến', type: 'transform', status: 'not-configured' },

              { id: 'ja-outgoing-1', name: 'Thiết lập quy tắc làm sạch - Hồ sơ ủy thác tư pháp đi', type: 'clean', status: 'not-configured' },
              { id: 'ja-outgoing-2', name: 'Thiết lập quy tắc chuẩn hóa - Hồ sơ ủy thác tư pháp đi', type: 'standardize', status: 'not-configured' },
              { id: 'ja-outgoing-3', name: 'Thiết lập quy tắc biến đổi - Hồ sơ ủy thác tư pháp đi', type: 'transform', status: 'not-configured' },
            ]
          },
          {
            id: 'legal-aid',
            name: 'Hệ thống thông tin trợ giúp pháp lý',
            rules: [
              { id: 'la-org-1', name: 'Thiết lập quy tắc làm sạch - Tổ chức thực hiện TGPL', type: 'clean', status: 'not-configured' },
              { id: 'la-org-2', name: 'Thiết lập quy tắc chuẩn hóa - Tổ chức thực hiện TGPL', type: 'standardize', status: 'not-configured' },
              { id: 'la-org-3', name: 'Thiết lập quy tắc biến đổi - Tổ chức thực hiện TGPL', type: 'transform', status: 'not-configured' },

              { id: 'la-reg-1', name: 'Thiết lập quy tắc làm sạch - Tổ chức đăng ký tham gia TGPL', type: 'clean', status: 'not-configured' },
              { id: 'la-reg-2', name: 'Thiết lập quy tắc chuẩn hóa - Tổ chức đăng ký tham gia TGPL', type: 'standardize', status: 'not-configured' },
              { id: 'la-reg-3', name: 'Thiết lập quy tắc biến đổi - Tổ chức đăng ký tham gia TGPL', type: 'transform', status: 'not-configured' },

              { id: 'la-assign-1', name: 'Thiết lập quy tắc làm sạch - Văn bản cử người thực hiện TGPL', type: 'clean', status: 'not-configured' },
              { id: 'la-assign-2', name: 'Thiết lập quy tắc chuẩn hóa - Văn bản cử người thực hiện TGPL', type: 'standardize', status: 'not-configured' },
              { id: 'la-assign-3', name: 'Thiết lập quy tắc biến đổi - Văn bản cử người thực hiện TGPL', type: 'transform', status: 'not-configured' },

              { id: 'la-center-1', name: 'Thiết lập quy tắc làm sạch - Trung tâm TGPL nhà nước', type: 'clean', status: 'not-configured' },
              { id: 'la-center-2', name: 'Thiết lập quy tắc chuẩn hóa - Trung tâm TGPL nhà nước', type: 'standardize', status: 'not-configured' },
              { id: 'la-center-3', name: 'Thiết lập quy tắc biến đổi - Trung tâm TGPL nhà nước', type: 'transform', status: 'not-configured' },

              { id: 'la-branch-1', name: 'Thiết lập quy tắc làm sạch - Chi nhánh TGPL', type: 'clean', status: 'not-configured' },
              { id: 'la-branch-2', name: 'Thiết lập quy tắc chuẩn hóa - Chi nhánh TGPL', type: 'standardize', status: 'not-configured' },
              { id: 'la-branch-3', name: 'Thiết lập quy tắc biến đổi - Chi nhánh TGPL', type: 'transform', status: 'not-configured' },

              { id: 'la-provider-1', name: 'Thiết lập quy tắc làm sạch - Người thực hiện TGPL', type: 'clean', status: 'not-configured' },
              { id: 'la-provider-2', name: 'Thiết lập quy tắc chuẩn hóa - Người thực hiện TGPL', type: 'standardize', status: 'not-configured' },
              { id: 'la-provider-3', name: 'Thiết lập quy tắc biến đổi - Người thực hiện TGPL', type: 'transform', status: 'not-configured' },
            ]
          },
          {
            id: 'legal-education',
            name: 'CSDL phổ biến, giáo dục pháp luật và hòa giải cơ sở',
            rules: [
              { id: 'le-reporter-1', name: 'Thiết lập quy tắc làm sạch - Báo cáo viên pháp luật', type: 'clean', status: 'not-configured' },
              { id: 'le-reporter-2', name: 'Thiết lập quy tắc chuẩn hóa - Báo cáo viên pháp luật', type: 'standardize', status: 'not-configured' },
              { id: 'le-reporter-3', name: 'Thiết lập quy tắc biến đổi - Báo cáo viên pháp luật', type: 'transform', status: 'not-configured' },

              { id: 'le-promoter-1', name: 'Thiết lập quy tắc làm sạch - Tuyên truyền viên pháp luật', type: 'clean', status: 'not-configured' },
              { id: 'le-promoter-2', name: 'Thiết lập quy tắc chuẩn hóa - Tuyên truyền viên pháp luật', type: 'standardize', status: 'not-configured' },
              { id: 'le-promoter-3', name: 'Thiết lập quy tắc biến đổi - Tuyên truyền viên pháp luật', type: 'transform', status: 'not-configured' },

              { id: 'le-program-1', name: 'Thiết lập quy tắc làm sạch - Chương trình, kế hoạch PBGDPL', type: 'clean', status: 'not-configured' },
              { id: 'le-program-2', name: 'Thiết lập quy tắc chuẩn hóa - Chương trình, kế hoạch PBGDPL', type: 'standardize', status: 'not-configured' },
              { id: 'le-program-3', name: 'Thiết lập quy tắc biến đổi - Chương trình, kế hoạch PBGDPL', type: 'transform', status: 'not-configured' },

              { id: 'le-council-1', name: 'Thiết lập quy tắc làm sạch - Hội đồng phối hợp PBGDPL', type: 'clean', status: 'not-configured' },
              { id: 'le-council-2', name: 'Thiết lập quy tắc chuẩn hóa - Hội đồng phối hợp PBGDPL', type: 'standardize', status: 'not-configured' },
              { id: 'le-council-3', name: 'Thiết lập quy tắc biến đổi - Hội đồng phối hợp PBGDPL', type: 'transform', status: 'not-configured' },

              { id: 'le-project-1', name: 'Thiết lập quy tắc làm sạch - Đề án', type: 'clean', status: 'not-configured' },
              { id: 'le-project-2', name: 'Thiết lập quy tắc chuẩn hóa - Đề án', type: 'standardize', status: 'not-configured' },
              { id: 'le-project-3', name: 'Thiết lập quy tắc biến đổi - Đề án', type: 'transform', status: 'not-configured' },

              { id: 'le-training-1', name: 'Thiết lập quy tắc làm sạch - Hội nghị tập huấn', type: 'clean', status: 'not-configured' },
              { id: 'le-training-2', name: 'Thiết lập quy tắc chuẩn hóa - Hội nghị tập huấn', type: 'standardize', status: 'not-configured' },
              { id: 'le-training-3', name: 'Thiết lập quy tắc biến đổi - Hội nghị tập huấn', type: 'transform', status: 'not-configured' },

              { id: 'le-seminar-1', name: 'Thiết lập quy tắc làm sạch - Hội thảo', type: 'clean', status: 'not-configured' },
              { id: 'le-seminar-2', name: 'Thiết lập quy tắc chuẩn hóa - Hội thảo', type: 'standardize', status: 'not-configured' },
              { id: 'le-seminar-3', name: 'Thiết lập quy tắc biến đổi - Hội thảo', type: 'transform', status: 'not-configured' },

              { id: 'le-med-team-1', name: 'Thiết lập quy tắc làm sạch - Tổ hòa giải', type: 'clean', status: 'not-configured' },
              { id: 'le-med-team-2', name: 'Thiết lập quy tắc chuẩn hóa - Tổ hòa giải', type: 'standardize', status: 'not-configured' },
              { id: 'le-med-team-3', name: 'Thiết lập quy tắc biến đổi - Tổ hòa giải', type: 'transform', status: 'not-configured' },

              { id: 'le-mediator-1', name: 'Thiết lập quy tắc làm sạch - Hòa giải viên', type: 'clean', status: 'not-configured' },
              { id: 'le-mediator-2', name: 'Thiết lập quy tắc chuẩn hóa - Hòa giải viên', type: 'standardize', status: 'not-configured' },
              { id: 'le-mediator-3', name: 'Thiết lập quy tắc biến đổi - Hòa giải viên', type: 'transform', status: 'not-configured' },

              { id: 'le-case-1', name: 'Thiết lập quy tắc làm sạch - Vụ việc hòa giải', type: 'clean', status: 'not-configured' },
              { id: 'le-case-2', name: 'Thiết lập quy tắc chuẩn hóa - Vụ việc hòa giải', type: 'standardize', status: 'not-configured' },
              { id: 'le-case-3', name: 'Thiết lập quy tắc biến đổi - Vụ việc hòa giải', type: 'transform', status: 'not-configured' },

              { id: 'le-trainer-1', name: 'Thiết lập quy tắc làm sạch - Tập huấn viên', type: 'clean', status: 'not-configured' },
              { id: 'le-trainer-2', name: 'Thiết lập quy tắc chuẩn hóa - Tập huấn viên', type: 'standardize', status: 'not-configured' },
              { id: 'le-trainer-3', name: 'Thiết lập quy tắc biến đổi - Tập huấn viên', type: 'transform', status: 'not-configured' },

              { id: 'le-budget-1', name: 'Thiết lập quy tắc làm sạch - Kinh phí PBGDPL', type: 'clean', status: 'not-configured' },
              { id: 'le-budget-2', name: 'Thiết lập quy tắc chuẩn hóa - Kinh phí PBGDPL', type: 'standardize', status: 'not-configured' },
              { id: 'le-budget-3', name: 'Thiết lập quy tắc biến đổi - Kinh phí PBGDPL', type: 'transform', status: 'not-configured' },

              { id: 'le-criteria-1', name: 'Thiết lập quy tắc làm sạch - Tiêu chí, chỉ tiêu tiếp cận pháp luật', type: 'clean', status: 'not-configured' },
              { id: 'le-criteria-2', name: 'Thiết lập quy tắc chuẩn hóa - Tiêu chí, chỉ tiêu tiếp cận pháp luật', type: 'standardize', status: 'not-configured' },
              { id: 'le-criteria-3', name: 'Thiết lập quy tắc biến đổi - Tiêu chí, chỉ tiêu tiếp cận pháp luật', type: 'transform', status: 'not-configured' },

              { id: 'le-standard-1', name: 'Thiết lập quy tắc làm sạch - Đánh giá cấp xã đạt chuẩn tiếp cận PL', type: 'clean', status: 'not-configured' },
              { id: 'le-standard-2', name: 'Thiết lập quy tắc chuẩn hóa - Đánh giá cấp xã đạt chuẩn tiếp cận PL', type: 'standardize', status: 'not-configured' },
              { id: 'le-standard-3', name: 'Thiết lập quy tắc biến đổi - Đánh giá cấp xã đạt chuẩn tiếp cận PL', type: 'transform', status: 'not-configured' },

              { id: 'le-campaign-1', name: 'Thiết lập quy tắc làm sạch - Cuộc PBGDPL', type: 'clean', status: 'not-configured' },
              { id: 'le-campaign-2', name: 'Thiết lập quy tắc chuẩn hóa - Cuộc PBGDPL', type: 'standardize', status: 'not-configured' },
              { id: 'le-campaign-3', name: 'Thiết lập quy tắc biến đổi - Cuộc PBGDPL', type: 'transform', status: 'not-configured' },

              { id: 'le-contest-1', name: 'Thiết lập quy tắc làm sạch - Cuộc thi tìm hiểu về pháp luật', type: 'clean', status: 'not-configured' },
              { id: 'le-contest-2', name: 'Thiết lập quy tắc chuẩn hóa - Cuộc thi tìm hiểu về pháp luật', type: 'standardize', status: 'not-configured' },
              { id: 'le-contest-3', name: 'Thiết lập quy tắc biến đổi - Cuộc thi tìm hiểu về pháp luật', type: 'transform', status: 'not-configured' },
            ]
          }
        ]
      },
      {
        id: 'legal-support',
        name: 'Cục Bổ trợ tư pháp',
        rules: [],
        children: [
          {
            id: 'auction-db',
            name: 'CSDL quản lý đấu giá tài sản',
            rules: [
              { id: 'auc-person-1', name: 'Thiết lập quy tắc làm sạch - Đấu giá viên', type: 'clean', status: 'not-configured' },
              { id: 'auc-person-2', name: 'Thiết lập quy tắc chuẩn hóa - Đấu giá viên', type: 'standardize', status: 'not-configured' },
              { id: 'auc-person-3', name: 'Thiết lập quy tắc biến đổi - Đấu giá viên', type: 'transform', status: 'not-configured' },

              { id: 'auc-org-1', name: 'Thiết lập quy tắc làm sạch - Tổ chức hành nghề đấu giá', type: 'clean', status: 'not-configured' },
              { id: 'auc-org-2', name: 'Thiết lập quy tắc chuẩn hóa - Tổ chức hành nghề đấu giá', type: 'standardize', status: 'not-configured' },
              { id: 'auc-org-3', name: 'Thiết lập quy tắc biến đổi - Tổ chức hành nghề đấu giá', type: 'transform', status: 'not-configured' },

              { id: 'auc-owner-1', name: 'Thiết lập quy tắc làm sạch - Người có tài sản đấu giá', type: 'clean', status: 'not-configured' },
              { id: 'auc-owner-2', name: 'Thiết lập quy tắc chuẩn hóa - Người có tài sản đấu giá', type: 'standardize', status: 'not-configured' },
              { id: 'auc-owner-3', name: 'Thiết lập quy tắc biến đổi - Người có tài sản đấu giá', type: 'transform', status: 'not-configured' },

              { id: 'auc-event-1', name: 'Thiết lập quy tắc làm sạch - Thông tin việc đấu giá', type: 'clean', status: 'not-configured' },
              { id: 'auc-event-2', name: 'Thiết lập quy tắc chuẩn hóa - Thông tin việc đấu giá', type: 'standardize', status: 'not-configured' },
              { id: 'auc-event-3', name: 'Thiết lập quy tắc biến đổi - Thông tin việc đấu giá', type: 'transform', status: 'not-configured' },

              { id: 'auc-asset-1', name: 'Thiết lập quy tắc làm sạch - Tài sản đấu giá', type: 'clean', status: 'not-configured' },
              { id: 'auc-asset-2', name: 'Thiết lập quy tắc chuẩn hóa - Tài sản đấu giá', type: 'standardize', status: 'not-configured' },
              { id: 'auc-asset-3', name: 'Thiết lập quy tắc biến đổi - Tài sản đấu giá', type: 'transform', status: 'not-configured' },

              { id: 'not-person-1', name: 'Thiết lập quy tắc làm sạch - Công chứng viên', type: 'clean', status: 'not-configured' },
              { id: 'not-person-2', name: 'Thiết lập quy tắc chuẩn hóa - Công chứng viên', type: 'standardize', status: 'not-configured' },
              { id: 'not-person-3', name: 'Thiết lập quy tắc biến đổi - Công chứng viên', type: 'transform', status: 'not-configured' },

              { id: 'not-block-1', name: 'Thiết lập quy tắc làm sạch - Thông tin ngăn chặn', type: 'clean', status: 'not-configured' },
              { id: 'not-block-2', name: 'Thiết lập quy tắc chuẩn hóa - Thông tin ngăn chặn', type: 'standardize', status: 'not-configured' },
              { id: 'not-block-3', name: 'Thiết lập quy tắc biến đổi - Thông tin ngăn chặn', type: 'transform', status: 'not-configured' },

              { id: 'not-org-1', name: 'Thiết lập quy tắc làm sạch - Tổ chức hành nghề công chứng', type: 'clean', status: 'not-configured' },
              { id: 'not-org-2', name: 'Thiết lập quy tắc chuẩn hóa - Tổ chức hành nghề công chứng', type: 'standardize', status: 'not-configured' },
              { id: 'not-org-3', name: 'Thiết lập quy tắc biến đổi - Tổ chức hành nghề công chứng', type: 'transform', status: 'not-configured' },

              { id: 'not-asset-1', name: 'Thiết lập quy tắc làm sạch - Tài sản trong giao dịch công chứng', type: 'clean', status: 'not-configured' },
              { id: 'not-asset-2', name: 'Thiết lập quy tắc chuẩn hóa - Tài sản trong giao dịch công chứng', type: 'standardize', status: 'not-configured' },
              { id: 'not-asset-3', name: 'Thiết lập quy tắc biến đổi - Tài sản trong giao dịch công chứng', type: 'transform', status: 'not-configured' },

              { id: 'not-result-1', name: 'Thiết lập quy tắc làm sạch - Kết quả hoạt động công chứng', type: 'clean', status: 'not-configured' },
              { id: 'not-result-2', name: 'Thiết lập quy tắc chuẩn hóa - Kết quả hoạt động công chứng', type: 'standardize', status: 'not-configured' },
              { id: 'not-result-3', name: 'Thiết lập quy tắc biến đổi - Kết quả hoạt động công chứng', type: 'transform', status: 'not-configured' },

              { id: 'trust-person-1', name: 'Thiết lập quy tắc làm sạch - Quản tài viên', type: 'clean', status: 'not-configured' },
              { id: 'trust-person-2', name: 'Thiết lập quy tắc chuẩn hóa - Quản tài viên', type: 'standardize', status: 'not-configured' },
              { id: 'trust-person-3', name: 'Thiết lập quy tắc biến đổi - Quản tài viên', type: 'transform', status: 'not-configured' },

              { id: 'trust-org-1', name: 'Thiết lập quy tắc làm sạch - Doanh nghiệp quản lý, thanh lý tài sản', type: 'clean', status: 'not-configured' },
              { id: 'trust-org-2', name: 'Thiết lập quy tắc chuẩn hóa - Doanh nghiệp quản lý, thanh lý tài sản', type: 'standardize', status: 'not-configured' },
              { id: 'trust-org-3', name: 'Thiết lập quy tắc biến đổi - Doanh nghiệp quản lý, thanh lý tài sản', type: 'transform', status: 'not-configured' },

              { id: 'law-vn-1', name: 'Thiết lập quy tắc làm sạch - Luật sư Việt Nam', type: 'clean', status: 'not-configured' },
              { id: 'law-vn-2', name: 'Thiết lập quy tắc chuẩn hóa - Luật sư Việt Nam', type: 'standardize', status: 'not-configured' },
              { id: 'law-vn-3', name: 'Thiết lập quy tắc biến đổi - Luật sư Việt Nam', type: 'transform', status: 'not-configured' },

              { id: 'law-cert-1', name: 'Thiết lập quy tắc làm sạch - Người được cấp chứng chỉ hành nghề luật sư', type: 'clean', status: 'not-configured' },
              { id: 'law-cert-2', name: 'Thiết lập quy tắc chuẩn hóa - Người được cấp chứng chỉ hành nghề luật sư', type: 'standardize', status: 'not-configured' },
              { id: 'law-cert-3', name: 'Thiết lập quy tắc biến đổi - Người được cấp chứng chỉ hành nghề luật sư', type: 'transform', status: 'not-configured' },

              { id: 'law-org-vn-1', name: 'Thiết lập quy tắc làm sạch - Tổ chức hành nghề luật sư Việt Nam', type: 'clean', status: 'not-configured' },
              { id: 'law-org-vn-2', name: 'Thiết lập quy tắc chuẩn hóa - Tổ chức hành nghề luật sư Việt Nam', type: 'standardize', status: 'not-configured' },
              { id: 'law-org-vn-3', name: 'Thiết lập quy tắc biến đổi - Tổ chức hành nghề luật sư Việt Nam', type: 'transform', status: 'not-configured' },

              { id: 'law-foreign-1', name: 'Thiết lập quy tắc làm sạch - Luật sư nước ngoài', type: 'clean', status: 'not-configured' },
              { id: 'law-foreign-2', name: 'Thiết lập quy tắc chuẩn hóa - Luật sư nước ngoài', type: 'standardize', status: 'not-configured' },
              { id: 'law-foreign-3', name: 'Thiết lập quy tắc biến đổi - Luật sư nước ngoài', type: 'transform', status: 'not-configured' },

              { id: 'law-org-foreign-1', name: 'Thiết lập quy tắc làm sạch - Tổ chức hành nghề luật sư nước ngoài', type: 'clean', status: 'not-configured' },
              { id: 'law-org-foreign-2', name: 'Thiết lập quy tắc chuẩn hóa - Tổ chức hành nghề luật sư nước ngoài', type: 'standardize', status: 'not-configured' },
              { id: 'law-org-foreign-3', name: 'Thiết lập quy tắc biến đổi - Tổ chức hành nghề luật sư nước ngoài', type: 'transform', status: 'not-configured' },

              { id: 'arb-person-1', name: 'Thiết lập quy tắc làm sạch - Trọng tài viên', type: 'clean', status: 'not-configured' },
              { id: 'arb-person-2', name: 'Thiết lập quy tắc chuẩn hóa - Trọng tài viên', type: 'standardize', status: 'not-configured' },
              { id: 'arb-person-3', name: 'Thiết lập quy tắc biến đổi - Trọng tài viên', type: 'transform', status: 'not-configured' },

              { id: 'arb-center-1', name: 'Thiết lập quy tắc làm sạch - Trung tâm trọng tài', type: 'clean', status: 'not-configured' },
              { id: 'arb-center-2', name: 'Thiết lập quy tắc chuẩn hóa - Trung tâm trọng tài', type: 'standardize', status: 'not-configured' },
              { id: 'arb-center-3', name: 'Thiết lập quy tắc biến đổi - Trung tâm trọng tài', type: 'transform', status: 'not-configured' },

              { id: 'arb-branch-1', name: 'Thiết lập quy tắc làm sạch - Chi nhánh của tổ chức trọng tài', type: 'clean', status: 'not-configured' },
              { id: 'arb-branch-2', name: 'Thiết lập quy tắc chuẩn hóa - Chi nhánh của tổ chức trọng tài', type: 'standardize', status: 'not-configured' },
              { id: 'arb-branch-3', name: 'Thiết lập quy tắc biến đổi - Chi nhánh của tổ chức trọng tài', type: 'transform', status: 'not-configured' },

              { id: 'arb-office-1', name: 'Thiết lập quy tắc làm sạch - Văn phòng đại diện của trung tâm trọng tài', type: 'clean', status: 'not-configured' },
              { id: 'arb-office-2', name: 'Thiết lập quy tắc chuẩn hóa - Văn phòng đại diện của trung tâm trọng tài', type: 'standardize', status: 'not-configured' },
              { id: 'arb-office-3', name: 'Thiết lập quy tắc biến đổi - Văn phòng đại diện của trung tâm trọng tài', type: 'transform', status: 'not-configured' },

              { id: 'com-med-person-1', name: 'Thiết lập quy tắc làm sạch - Hòa giải viên thương mại', type: 'clean', status: 'not-configured' },
              { id: 'com-med-person-2', name: 'Thiết lập quy tắc chuẩn hóa - Hòa giải viên thương mại', type: 'standardize', status: 'not-configured' },
              { id: 'com-med-person-3', name: 'Thiết lập quy tắc biến đổi - Hòa giải viên thương mại', type: 'transform', status: 'not-configured' },

              { id: 'com-med-center-1', name: 'Thiết lập quy tắc làm sạch - Trung tâm hòa giải thương mại', type: 'clean', status: 'not-configured' },
              { id: 'com-med-center-2', name: 'Thiết lập quy tắc chuẩn hóa - Trung tâm hòa giải thương mại', type: 'standardize', status: 'not-configured' },
              { id: 'com-med-center-3', name: 'Thiết lập quy tắc biến đổi - Trung tâm hòa giải thương mại', type: 'transform', status: 'not-configured' },

              { id: 'exp-person-1', name: 'Thiết lập quy tắc làm sạch - Giám định viên tư pháp', type: 'clean', status: 'not-configured' },
              { id: 'exp-person-2', name: 'Thiết lập quy tắc chuẩn hóa - Giám định viên tư pháp', type: 'standardize', status: 'not-configured' },
              { id: 'exp-person-3', name: 'Thiết lập quy tắc biến đổi - Giám định viên tư pháp', type: 'transform', status: 'not-configured' },

              { id: 'exp-org-1', name: 'Thiết lập quy tắc làm sạch - Tổ chức giám định tư pháp', type: 'clean', status: 'not-configured' },
              { id: 'exp-org-2', name: 'Thiết lập quy tắc chuẩn hóa - Tổ chức giám định tư pháp', type: 'standardize', status: 'not-configured' },
              { id: 'exp-org-3', name: 'Thiết lập quy tắc biến đổi - Tổ chức giám định tư pháp', type: 'transform', status: 'not-configured' },
            ]
          }
        ]
      },
      {
        id: 'intl-coop',
        name: 'Vụ Hợp tác quốc tế',
        rules: [],
        children: [
          {
            id: 'intl-db',
            name: 'CSDL Hợp tác quốc tế',
            rules: [
              { id: 'intl-treaty-1', name: 'Thiết lập quy tắc làm sạch - Điều ước quốc tế, thỏa thuận quốc tế', type: 'clean', status: 'not-configured' },
              { id: 'intl-treaty-2', name: 'Thiết lập quy tắc chuẩn hóa - Điều ước quốc tế, thỏa thuận quốc tế', type: 'standardize', status: 'not-configured' },
              { id: 'intl-treaty-3', name: 'Thiết lập quy tắc biến đổi - Điều ước quốc tế, thỏa thuận quốc tế', type: 'transform', status: 'not-configured' },

              { id: 'intl-project-1', name: 'Thiết lập quy tắc làm sạch - Chương trình dự án', type: 'clean', status: 'not-configured' },
              { id: 'intl-project-2', name: 'Thiết lập quy tắc chuẩn hóa - Chương trình dự án', type: 'standardize', status: 'not-configured' },
              { id: 'intl-project-3', name: 'Thiết lập quy tắc biến đổi - Chương trình dự án', type: 'transform', status: 'not-configured' },

              { id: 'intl-expert-1', name: 'Thiết lập quy tắc làm sạch - Danh sách chuyên gia', type: 'clean', status: 'not-configured' },
              { id: 'intl-expert-2', name: 'Thiết lập quy tắc chuẩn hóa - Danh sách chuyên gia', type: 'standardize', status: 'not-configured' },
              { id: 'intl-expert-3', name: 'Thiết lập quy tắc biến đổi - Danh sách chuyên gia', type: 'transform', status: 'not-configured' },

              { id: 'intl-conf-1', name: 'Thiết lập quy tắc làm sạch - Hội nghị, hội thảo', type: 'clean', status: 'not-configured' },
              { id: 'intl-conf-2', name: 'Thiết lập quy tắc chuẩn hóa - Hội nghị, hội thảo', type: 'standardize', status: 'not-configured' },
              { id: 'intl-conf-3', name: 'Thiết lập quy tắc biến đổi - Hội nghị, hội thảo', type: 'transform', status: 'not-configured' },

              { id: 'intl-research-1', name: 'Thiết lập quy tắc làm sạch - Sản phẩm nghiên cứu, truyền thông', type: 'clean', status: 'not-configured' },
              { id: 'intl-research-2', name: 'Thiết lập quy tắc chuẩn hóa - Sản phẩm nghiên cứu, truyền thông', type: 'standardize', status: 'not-configured' },
              { id: 'intl-research-3', name: 'Thiết lập quy tắc biến đổi - Sản phẩm nghiên cứu, truyền thông', type: 'transform', status: 'not-configured' },

              { id: 'intl-delegation-1', name: 'Thiết lập quy tắc làm sạch - Thông tin Đoàn', type: 'clean', status: 'not-configured' },
              { id: 'intl-delegation-2', name: 'Thiết lập quy tắc chuẩn hóa - Thông tin Đoàn', type: 'standardize', status: 'not-configured' },
              { id: 'intl-delegation-3', name: 'Thiết lập quy tắc biến đổi - Thông tin Đoàn', type: 'transform', status: 'not-configured' },
            ]
          }
        ]
      },
    ]
  }
];

interface CategoryItemProps {
  category: DataCategory;
  level: number;
  onConfigureRule: (rule: ProcessingRule) => void;
}

function CategoryItem({ category, level, onConfigureRule }: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2);

  const hasChildren = category.children && category.children.length > 0;
  const hasRules = category.rules && category.rules.length > 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'configured':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">Đã cấu hình</span>;
      case 'running':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">Đang chạy</span>;
      case 'not-configured':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600">Chưa cấu hình</span>;
      default:
        return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'clean':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">Làm sạch</span>;
      case 'standardize':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">Chuẩn hóa</span>;
      case 'transform':
        return <span className="px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">Biến đổi</span>;
      default:
        return null;
    }
  };

  const paddingLeft = `${level * 1.5}rem`;

  return (
    <div>
      {/* Category Header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 ${level === 0 ? 'bg-slate-50' : ''
          }`}
        style={{ paddingLeft }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {(hasChildren || hasRules) && (
          isExpanded ?
            <ChevronDown className="w-4 h-4 text-slate-600 flex-shrink-0" /> :
            <ChevronRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
        )}

        <div className="flex-1">
          <h4 className={`text-slate-900 ${level === 0 ? 'font-medium' : ''}`}>
            {category.name}
          </h4>
        </div>

        {(hasChildren || hasRules) && (
          <span className="text-xs text-slate-500">
            {hasRules && `${category.rules.length} quy tắc`}
            {hasChildren && ` · ${category.children?.length} nhóm`}
          </span>
        )}
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <>
          {/* Rules */}
          {hasRules && category.rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-blue-50 border-b border-slate-50 cursor-pointer group"
              style={{ paddingLeft: `${(level + 1) * 1.5}rem` }}
              onClick={() => onConfigureRule(rule)}
            >
              <div className="flex items-center gap-3 flex-1">
                <Sparkles className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm text-slate-900 group-hover:text-blue-700">{rule.name}</p>
                  {rule.lastRun && (
                    <p className="text-xs text-slate-500 mt-0.5">Chạy lần cuối: {rule.lastRun}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {getTypeBadge(rule.type)}
                {getStatusBadge(rule.status)}
                <button
                  className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-blue-100 rounded transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    onConfigureRule(rule);
                  }}
                >
                  <Settings className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          ))}

          {/* Children Categories */}
          {hasChildren && category.children?.map((child) => (
            <CategoryItem key={child.id} category={child} level={level + 1} onConfigureRule={onConfigureRule} />
          ))}
        </>
      )}
    </div>
  );
}

export function DataProcessingRules() {
  const [selectedRule, setSelectedRule] = useState<ProcessingRule | null>(null);

  const handleConfigureRule = (rule: ProcessingRule) => {
    setSelectedRule(rule);
  };

  const handleSaveConfig = (config: any) => {
    console.log('Saved config for rule:', selectedRule, config);
    // Here you would save to backend
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-slate-900 mb-1">Quy trình xử lý dữ liệu</h3>
          <p className="text-sm text-slate-600">
            Thiết lập quy tắc làm sạch, chuẩn hóa và biến đổi dữ liệu cho từng nguồn
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl text-slate-900">328</p>
              <p className="text-xs text-slate-600">Tổng số quy tắc</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl text-slate-900">127</p>
              <p className="text-xs text-slate-600">Đã cấu hình</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-lg">
              <XCircle className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl text-slate-900">201</p>
              <p className="text-xs text-slate-600">Chưa cấu hình</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Settings className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl text-slate-900">15</p>
              <p className="text-xs text-slate-600">Đang chạy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Rules Tree */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200 px-6 py-4 bg-slate-50">
          <h4 className="text-slate-900">Danh sách quy trình xử lý dữ liệu</h4>
        </div>

        <div className="max-h-[600px] overflow-y-auto">
          {processingRulesData.map((category) => (
            <CategoryItem key={category.id} category={category} level={0} onConfigureRule={handleConfigureRule} />
          ))}
        </div>
      </div>

      {/* Configure Rule Modal */}
      {selectedRule && (
        <ConfigureRuleModal
          rule={selectedRule}
          onClose={() => setSelectedRule(null)}
          onSave={handleSaveConfig}
        />
      )}
    </div>
  );
}
