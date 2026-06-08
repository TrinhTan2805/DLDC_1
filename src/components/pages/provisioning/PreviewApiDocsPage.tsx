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
    consumer: 'UBND Huyện Tiên Du',
    targetSystem: 'Cổng thông tin pháp luật Huyện Tiên Du',
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
    <div className="min-h-screen bg-slate-700 p-4 md:p-8 flex flex-col items-center select-text font-serif">
      {/* Control Toolbar */}
      <div className="w-full max-w-[820px] bg-slate-900 text-white rounded-lg shadow-lg p-4 mb-6 flex justify-between items-center font-sans no-print">
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
      <div className="w-full max-w-[820px] min-h-[1130px] bg-white p-12 md:p-[60px] shadow-2xl border border-slate-300 text-slate-900 rounded-sm print-doc">
        
        {/* National Emblem & Title Block */}
        <div className="grid grid-cols-12 gap-4 border-b border-slate-900 pb-6 mb-8 text-center font-sans font-bold text-xs uppercase tracking-tight">
          <div className="col-span-5 text-left">
            <div className="text-[10px] text-slate-600">Cơ quan chủ quản DLDC</div>
            <div className="text-[11px] text-slate-900 mt-1">CỔNG DỮ LIỆU SỐ QUỐC GIA</div>
          </div>
          <div className="col-span-7 text-right font-bold text-slate-900">
            <div>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
            <div className="text-[10px] tracking-wide mt-1">Độc lập - Tự do - Hạnh phúc</div>
            <div className="mt-1 font-normal lowercase italic text-slate-600 text-[10px]">-------------------</div>
          </div>
        </div>

        {/* Spec Title */}
        <div className="text-center my-10 font-sans">
          <h1 className="text-xl md:text-2xl font-black text-slate-950 uppercase tracking-wide leading-tight">
            TÀI LIỆU ĐẶC TẢ KỸ THUẬT API
          </h1>
          <h2 className="text-lg font-bold text-slate-900 mt-2 uppercase">
            {info.title}
          </h2>
          <p className="text-sm italic text-slate-600 mt-3">
            (Tài liệu phục vụ tích hợp hệ thống)
          </p>
        </div>

        {/* Section I: Introduction */}
        <div className="mt-12 space-y-4">
          <h3 className="text-base font-bold text-slate-950 font-sans uppercase border-l-4 border-slate-900 pl-3">
            I. Giới thiệu chung
          </h3>
          <p className="text-sm text-slate-800 leading-relaxed text-justify indent-8">
            Tài liệu này cung cấp các đặc tả kỹ thuật chi tiết về việc kết nối và tích hợp dữ liệu thông qua nền tảng API chia sẻ của Cơ quan chủ quản nhằm mục đích đồng bộ thông tin và vận hành kho cơ sở dữ liệu dùng chung.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-sans text-xs space-y-2.5">
            <div className="flex">
              <span className="font-bold text-slate-700 w-48 shrink-0">• Đơn vị cung cấp dữ liệu:</span>
              <span className="text-slate-900">{info.provider}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-slate-700 w-48 shrink-0">• Đơn vị khai thác (dự kiến):</span>
              <span className="text-slate-900 font-semibold">{info.consumer}</span>
            </div>
            <div className="flex">
              <span className="font-bold text-slate-700 w-48 shrink-0">• Hệ thống đích tích hợp:</span>
              <span className="text-slate-900">{info.targetSystem}</span>
            </div>
          </div>
        </div>

        {/* Section II: Connection Info */}
        <div className="mt-10 space-y-4">
          <h3 className="text-base font-bold text-slate-950 font-sans uppercase border-l-4 border-slate-900 pl-3">
            II. Thông tin kết nối API
          </h3>
          
          <div className="border border-slate-300 rounded-lg overflow-hidden font-sans text-xs">
            <table className="w-full text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="py-3.5 px-4 bg-slate-50 font-bold text-slate-700 w-48 border-r border-slate-200">URL Endpoint</td>
                  <td className="py-3.5 px-4 font-mono text-blue-700 font-bold break-all select-all">{apiUrl}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-3.5 px-4 bg-slate-50 font-bold text-slate-700 w-48 border-r border-slate-200">Phương thức (Method)</td>
                  <td className="py-3.5 px-4 font-mono text-slate-800 font-bold">GET / POST</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-3.5 px-4 bg-slate-50 font-bold text-slate-700 w-48 border-r border-slate-200">Giao thức bảo mật</td>
                  <td className="py-3.5 px-4 text-slate-800 font-semibold">HTTPS (TLS 1.2+)</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="py-3.5 px-4 bg-slate-50 font-bold text-slate-700 w-48 border-r border-slate-200">Xác thực (Authentication)</td>
                  <td className="py-3.5 px-4 text-slate-800">OAuth 2.0 (Bearer Token) hoặc API Key</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-4 bg-slate-50 font-bold text-slate-700 w-48 border-r border-slate-200">Định dạng Header</td>
                  <td className="py-3.5 px-4 space-y-1">
                    <div className="font-mono text-[11px] text-slate-600"><span className="font-bold text-slate-800">Content-Type:</span> application/json</div>
                    <div className="font-mono text-[11px] text-slate-600"><span className="font-bold text-slate-800">Authorization:</span> Bearer &lt;token&gt;</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section III: Data Structure */}
        <div className="mt-10 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-950 font-sans uppercase border-l-4 border-slate-900 pl-3">
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
          <p className="text-sm text-slate-800">
            Mô tả cấu trúc dữ liệu JSON trả về từ API khi thực hiện truy vấn thành công:
          </p>
          <div className="bg-slate-950 rounded-lg p-4 font-mono text-[11px] text-emerald-400 overflow-x-auto border border-slate-800">
            <pre><code>{info.responseData}</code></pre>
          </div>
        </div>

        {/* Section IV: Error Codes */}
        <div className="mt-10 space-y-4">
          <h3 className="text-base font-bold text-slate-950 font-sans uppercase border-l-4 border-slate-900 pl-3">
            IV. Bảng mã lỗi (Error Codes)
          </h3>
          <div className="border border-slate-300 rounded-lg overflow-hidden font-sans text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300 font-bold text-slate-700 text-[10px] uppercase">
                  <th className="py-2.5 px-4 border-r border-slate-200 w-32">Mã lỗi (HTTP)</th>
                  <th className="py-2.5 px-4">Mô tả chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-slate-700 border-r border-slate-200">200 OK</td>
                  <td className="py-3 px-4 text-slate-800">Yêu cầu thành công, hệ thống trả về dữ liệu hợp lệ.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-red-600 border-r border-slate-200">401 Unauthorized</td>
                  <td className="py-3 px-4 text-slate-800">Thiếu thông tin xác thực, token không hợp lệ hoặc đã hết hạn.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-red-600 border-r border-slate-200">403 Forbidden</td>
                  <td className="py-3 px-4 text-slate-800">Truy cập bị từ chối do tài khoản không có quyền khai thác dịch vụ này.</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-red-600 border-r border-slate-200">500 Internal Error</td>
                  <td className="py-3 px-4 text-slate-800">Lỗi hệ thống máy chủ cung cấp dịch vụ, cần liên hệ bộ phận hỗ trợ kỹ thuật để xử lý.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="mt-16 grid grid-cols-2 gap-4 font-sans text-[10px] text-slate-500 uppercase tracking-wider border-t border-slate-200 pt-6">
          <div>
            <div>Tài liệu kỹ thuật hệ thống</div>
            <div className="mt-1 font-mono text-[9px] lowercase">phát hành tự động bởi Core Engine</div>
          </div>
          <div className="text-right">
            <div>Bản quyền © 2026 Cổng dữ liệu DLDC</div>
            <div className="mt-1 font-mono text-[9px]">Phiên bản tài liệu: 1.0</div>
          </div>
        </div>

      </div>
      
      {/* Styles for printing */}
      <style>{`
        @media print {
          body {
            background: white !important;
            padding: 0 !important;
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
          }
        }
      `}</style>
    </div>
  );
}
