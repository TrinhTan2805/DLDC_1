import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Xu hướng thay đổi dữ liệu chủ trong 6 tháng qua [Unverified]
const masterDataTrendData = [
  { month: 'T1', fromSource: 1850, manual: 620 },
  { month: 'T2', fromSource: 2040, manual: 580 },
  { month: 'T3', fromSource: 2260, manual: 710 },
  { month: 'T4', fromSource: 2480, manual: 640 },
  { month: 'T5', fromSource: 2650, manual: 690 },
  { month: 'T6', fromSource: 2820, manual: 750 },
].map(row => ({ ...row, total: row.fromSource + row.manual }));

// Danh sách tập dữ liệu mở theo Phụ lục II - Quyết định 1634/QĐ-BTP ngày 30/6/2026
// Tên tập dữ liệu và ngày cung cấp lần đầu lấy từ văn bản đã cung cấp; số bản ghi là dữ liệu mock [Unverified]
const masterDataPublishedOnOpenData = [
  { name: 'Danh sách tổ chức thực hiện trợ giúp pháp lý', records: 63, publishedAt: '01/01/2019' },
  { name: 'Danh sách người thực hiện trợ giúp pháp lý', records: 210, publishedAt: '01/01/2019' },
  { name: 'Danh sách Luật sư Việt Nam', records: 18450, publishedAt: '01/01/2027' },
  { name: 'Danh sách Tổ chức hành nghề Luật sư Việt Nam', records: 4820, publishedAt: '01/01/2027' },
  { name: 'Danh sách chi nhánh Tổ chức hành nghề Luật sư', records: 960, publishedAt: '01/01/2027' },
  { name: 'Danh sách Luật sư nước ngoài', records: 145, publishedAt: '01/01/2027' },
  { name: 'Danh sách Tổ chức hành nghề Luật sư nước ngoài', records: 62, publishedAt: '01/01/2027' },
  { name: 'Danh sách chi nhánh Tổ chức hành nghề Luật sư nước ngoài', records: 24, publishedAt: '01/01/2027' },
  { name: 'Danh sách Tư vấn viên pháp luật', records: 890, publishedAt: '01/01/2027' },
  { name: 'Danh sách Trung tâm tư vấn pháp luật', records: 320, publishedAt: '01/01/2027' },
  { name: 'Danh sách chi nhánh Trung tâm tư vấn pháp luật', records: 105, publishedAt: '01/01/2027' },
  { name: 'Danh sách công chứng viên Việt Nam', records: 3260, publishedAt: '01/01/2027' },
  { name: 'Danh sách tổ chức hành nghề công chứng', records: 1480, publishedAt: '01/01/2027' },
  { name: 'Danh sách quản tài viên Việt Nam', records: 410, publishedAt: '01/01/2027' },
  { name: 'Danh sách doanh nghiệp quản lý, thanh lý tài sản', records: 180, publishedAt: '01/01/2027' },
  { name: 'Danh sách đấu giá viên', records: 720, publishedAt: '01/01/2027' },
  { name: 'Danh sách tổ chức hành nghề đấu giá', records: 340, publishedAt: '01/01/2027' },
  { name: 'Danh sách giám định viên tư pháp', records: 1050, publishedAt: '01/01/2027' },
  { name: 'Danh sách tổ chức giám định tư pháp', records: 230, publishedAt: '01/01/2027' },
  { name: 'Danh sách trọng tài viên thương mại', records: 380, publishedAt: '01/01/2027' },
  { name: 'Danh sách trung tâm trọng tài thương mại', records: 42, publishedAt: '01/01/2027' },
  { name: 'Danh sách hòa giải viên thương mại', records: 260, publishedAt: '01/01/2027' },
  { name: 'Danh sách trung tâm hòa giải thương mại', records: 28, publishedAt: '01/01/2027' },
  { name: 'Danh sách Báo cáo viên pháp luật trung ương', records: 150, publishedAt: '01/01/2017' },
  { name: 'Dữ liệu thống kê ngành Tư pháp', records: 25, publishedAt: '01/01/2015' },
  { name: 'Tài sản thi hành án được đưa ra bán đấu giá', records: 5600, publishedAt: '01/07/2009' },
  { name: 'Dữ liệu người phải thi hành án chưa có điều kiện thi hành', records: 8300, publishedAt: '01/07/2015' },
];
const PUBLISHED_MODEL_PAGE_SIZE = 5;

export function MasterDataDashboardPage() {
  const [publishedModelPage, setPublishedModelPage] = useState(0);

  const publishedModelTotalPages = Math.ceil(masterDataPublishedOnOpenData.length / PUBLISHED_MODEL_PAGE_SIZE);
  const publishedModelPageItems = masterDataPublishedOnOpenData.slice(
    publishedModelPage * PUBLISHED_MODEL_PAGE_SIZE,
    publishedModelPage * PUBLISHED_MODEL_PAGE_SIZE + PUBLISHED_MODEL_PAGE_SIZE
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan dữ liệu chủ</h1>
        <p className="text-sm text-slate-500 mt-1">
          Tổng hợp mô hình, dung lượng và mức độ công khai dữ liệu chủ
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 border border-slate-200 rounded-lg p-4">
            <h4 className="text-slate-800 font-medium mb-1">Xu hướng thay đổi dữ liệu chủ trong 6 tháng qua</h4>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={masterDataTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: number) => value.toLocaleString()}
                />
                <Legend />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={3} name="Tổng thay đổi" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="fromSource" stroke="#3b82f6" strokeWidth={2} name="Thay đổi từ nguồn" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="manual" stroke="#f59e0b" strokeWidth={2} name="Thay đổi thủ công" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-slate-800 font-medium">Mô hình dữ liệu chủ công khai trên Cổng dữ liệu mở</h4>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPublishedModelPage(p => Math.max(0, p - 1))}
                  disabled={publishedModelPage === 0}
                  className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPublishedModelPage(p => Math.min(publishedModelTotalPages - 1, p + 1))}
                  disabled={publishedModelPage >= publishedModelTotalPages - 1}
                  className="p-1 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-2.5">
              {publishedModelPageItems.map(model => (
                <div key={model.name} className="border border-slate-100 rounded-lg p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-semibold text-slate-900">{model.name}</span>
                    <span className="text-[13px] text-slate-500 whitespace-nowrap">{model.records.toLocaleString('vi-VN')} bản ghi</span>
                  </div>
                  <p className="text-[12px] text-slate-400 mt-1">Công khai: {model.publishedAt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
