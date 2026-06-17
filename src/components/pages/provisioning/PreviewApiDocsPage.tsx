import React from 'react';
import { useLocation } from 'react-router-dom';
import { Printer, Download, ArrowLeft, Check, Copy } from 'lucide-react';

const apiInfoMap: Record<string, { title: string; provider: string; consumer: string; targetSystem: string; responseData: string }> = {
  'SVC-HOTICH-001': {
    title: 'API cung cấp dữ liệu Hộ tịch điện tử',
    provider: 'Cơ quan quản lý cơ sở dữ liệu gốc',
    consumer: 'Bộ Kế hoạch và Đầu tư',
    targetSystem: 'Hệ thống Thông tin Quốc gia về Đăng ký Doanh nghiệp',
    responseData: `{
  "status": "200",
  "message": "Thành công",
  "data": {
    "totalRecords": 1,
    "items": [
      {
        "id": "12345",
        "name": "Nguyễn Văn A",
        "dob": "1990-01-01",
        "gender": "Nam",
        "cccd": "001••••123"
      }
    ]
  }
}`
  },
  'SVC-THADS-002': {
    title: 'API đồng bộ dữ liệu thi hành án dân sự',
    provider: 'Tổng cục Thi hành án dân sự',
    consumer: 'Sở Tài chính tỉnh Bắc Ninh',
    targetSystem: 'Hệ thống Quản lý Ngân sách và Tài chính',
    responseData: `{
  "status": "200",
  "message": "Thành công",
  "data": {
    "totalRecords": 1,
    "items": [
      {
        "id": "THADS-998",
        "caseNumber": "123/QĐ-THA",
        "judgmentDate": "2026-04-15",
        "amount": 150000000,
        "status": "Đang thi hành"
      }
    ]
  }
}`
  },
  'SVC-BPBD-003': {
    title: 'API đọc thông tin Biện pháp bảo đảm',
    provider: 'Cục Đăng ký quốc gia giao dịch bảo đảm',
    consumer: 'Sở Tư pháp tỉnh Bắc Ninh',
    targetSystem: 'Hệ thống Thông tin Đăng ký Giao dịch Bảo đảm',
    responseData: `{
  "status": "200",
  "message": "Thành công",
  "data": {
    "totalRecords": 1,
    "items": [
      {
        "id": "BPBD-4452",
        "assetName": "Quyền sử dụng đất số lô 12, tờ bản đồ 4",
        "registryDate": "2026-05-10",
        "owner": "Trần Thị B",
        "status": "Đang thế chấp"
      }
    ]
  }
}`
  },
  'SVC-PHAPLUAT-004': {
    title: 'API tra cứu Cơ sở dữ liệu Pháp luật',
    provider: 'Bộ Tư pháp',
    consumer: 'Sở Thông tin và Truyền thông tỉnh Bắc Ninh',
    targetSystem: 'Hệ thống Quản lý Văn bản và Điều hành',
    responseData: `{
  "status": "200",
  "message": "Thành công",
  "data": {
    "totalRecords": 1,
    "items": [
      {
        "id": "LAW-10025",
        "docNumber": "47/2020/NĐ-CP",
        "docTitle": "Nghị định quản lý, kết nối và chia sẻ dữ liệu số",
        "issueDate": "2020-04-09",
        "status": "Có hiệu lực"
      }
    ]
  }
}`
  }
};

export function PreviewApiDocsPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const apiId = searchParams.get('apiId') || 'SVC-HOTICH-001';
  const apiUrl = searchParams.get('apiUrl') || 'https://api.dldc.gov.vn/api/v1/hotich/search';
  const consumerUnit = searchParams.get('consumerUnit') || 'Bộ Kế hoạch và Đầu tư';
  const [copied, setCopied] = React.useState(false);

  const info = apiInfoMap[apiId] || {
    title: 'API cung cấp dữ liệu Hộ tịch điện tử',
    provider: 'Cơ quan quản lý cơ sở dữ liệu gốc',
    consumer: consumerUnit,
    targetSystem: 'Hệ thống Thông tin Quốc gia về Đăng ký Doanh nghiệp',
    responseData: `{
  "status": "200",
  "message": "Thành công",
  "data": {
    "totalRecords": 1,
    "items": []
  }
}`
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(info.responseData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex flex-col items-center select-text font-sans">
      {/* Control Toolbar */}
      <div className="w-full max-w-[820px] bg-slate-900 text-white rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center no-print">
        <button
          onClick={() => window.close()}
          className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors text-slate-300 hover:text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Đóng tab
        </button>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-lg transition-colors text-white text-xs font-bold shadow-md"
          >
            <Printer className="w-4 h-4" />
            In tài liệu
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors text-white text-xs font-semibold"
          >
            <Download className="w-4 h-4" />
            Xuất PDF
          </button>
        </div>
      </div>

      {/* Styled A4 Technical Spec Paper */}
      <div className="w-full max-w-[820px] min-h-[1130px] bg-white p-12 md:p-[60px] shadow-lg border border-slate-200 text-slate-900 rounded-sm print-doc">
        
        {/* National Emblem & Title Block (Centered) */}
        <div className="text-center font-sans">
          <div className="font-bold text-[13px] uppercase tracking-wider text-black">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
          <div className="text-[12px] font-semibold text-black mt-1">Độc lập - Tự do - Hạnh phúc</div>
        </div>

        {/* Spec Title */}
        <div className="text-center my-8">
          <h1 className="text-xl md:text-2xl font-bold text-blue-800 uppercase tracking-wide leading-tight">
            TÀI LIỆU ĐẶC TẢ KỸ THUẬT API
          </h1>
          <h2 className="text-lg font-bold text-black mt-2 uppercase">
            {info.title}
          </h2>
          <p className="text-sm italic text-slate-500 mt-2">
            (Tài liệu phục vụ tích hợp hệ thống)
          </p>
        </div>

        {/* Section I: Introduction */}
        <div className="mt-8 space-y-3 text-[14px]">
          <h3 className="text-base font-bold text-slate-900">
            I. Giới thiệu chung
          </h3>
          <p className="text-slate-700 leading-relaxed text-justify">
            Tài liệu này cung cấp các đặc tả kỹ thuật chi tiết về việc kết nối và tích hợp dữ liệu thông qua nền tảng API chia sẻ của Cơ quan chủ quản.
          </p>
          <ul className="space-y-1.5 pl-1 text-slate-700">
            <li>
              <span className="font-bold">• Đơn vị cung cấp dữ liệu:</span> {info.provider}
            </li>
            <li>
              <span className="font-bold">• Đơn vị khai thác (dự kiến):</span> {info.consumer}
            </li>
            <li>
              <span className="font-bold">• Hệ thống đích tích hợp:</span> {info.targetSystem}
            </li>
          </ul>
        </div>

        {/* Section II: Connection Info */}
        <div className="mt-8 space-y-3 text-[14px]">
          <h3 className="text-base font-bold text-slate-900">
            II. Thông tin kết nối API
          </h3>
          
          <table className="w-full border-collapse border border-slate-300 text-left">
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-700 w-1/3 border-r border-slate-300">URL Endpoint</td>
                <td className="py-2.5 px-4 font-mono text-blue-600 break-all select-all">{apiUrl}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-700 w-1/3 border-r border-slate-300">Phương thức (Method)</td>
                <td className="py-2.5 px-4 font-mono text-slate-800">GET / POST</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-700 w-1/3 border-r border-slate-300">Giao thức bảo mật</td>
                <td className="py-2.5 px-4 text-slate-800">HTTPS (TLS 1.2+)</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-700 w-1/3 border-r border-slate-300">Xác thực (Authentication)</td>
                <td className="py-2.5 px-4 text-slate-800">OAuth 2.0 (Bearer Token) hoặc API Key</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 bg-slate-50 font-semibold text-slate-700 w-1/3 border-r border-slate-300">Định dạng Header</td>
                <td className="py-2.5 px-4 space-y-1">
                  <div className="font-mono text-xs text-slate-600"><span className="font-semibold text-slate-800">Content-Type:</span> application/json</div>
                  <div className="font-mono text-xs text-slate-600"><span className="font-semibold text-slate-800">Authorization:</span> Bearer &lt;token&gt;</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section III: Data Structure */}
        <div className="mt-8 space-y-3 text-[14px]">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">
              III. Cấu trúc dữ liệu (JSON)
            </h3>
            <button
              onClick={handleCopy}
              className="no-print inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-800 font-sans text-xs border border-slate-300 bg-white hover:bg-slate-50 px-2 py-1 rounded transition-colors font-semibold"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép JSON'}</span>
            </button>
          </div>
          <p className="text-slate-700">
            Mô tả cấu trúc dữ liệu trả về khi gọi API thành công:
          </p>
          <div style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#cbd5e1' }} className="rounded-lg p-5 font-mono text-xs overflow-x-auto border">
            <pre className="whitespace-pre-wrap"><code style={{ color: '#cbd5e1' }}>{info.responseData}</code></pre>
          </div>
        </div>

        {/* Section IV: Error Codes */}
        <div className="mt-8 space-y-3 text-[14px]">
          <h3 className="text-base font-bold text-slate-900">
            IV. Bảng mã lỗi (Error Codes)
          </h3>
          <table className="w-full border-collapse border border-slate-300 text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-300 font-semibold text-slate-700">
                <th className="py-2.5 px-4 border-r border-slate-300 w-1/3">Mã lỗi (HTTP)</th>
                <th className="py-2.5 px-4">Mô tả chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 text-slate-700">
              <tr>
                <td className="py-2.5 px-4 font-mono border-r border-slate-300">200 OK</td>
                <td className="py-2.5 px-4">Yêu cầu thành công, hệ thống trả về dữ liệu hợp lệ.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono border-r border-slate-300">401 Unauthorized</td>
                <td className="py-2.5 px-4">Thiếu thông tin xác thực, token không hợp lệ hoặc đã hết hạn.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono border-r border-slate-300">403 Forbidden</td>
                <td className="py-2.5 px-4">Truy cập bị từ chối do không có quyền truy cập dữ liệu này.</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4 font-mono border-r border-slate-300">500 Internal Error</td>
                <td className="py-2.5 px-4">Lỗi hệ thống máy chủ cung cấp dịch vụ, cần liên hệ bộ phận hỗ trợ kỹ thuật.</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
      
      {/* Styles for printing */}
      <style>{`
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-doc {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
