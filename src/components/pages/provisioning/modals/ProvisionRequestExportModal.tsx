import React, { useState } from 'react';
import { X, Search, FileDown, CheckCircle, Table as TableIcon, Filter, AlertCircle, RefreshCw, Layers } from 'lucide-react';

interface ProvisionRequestExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestData: any;
  onConfirmExport: (id: string) => void;
}

export function ProvisionRequestExportModal({ isOpen, onClose, requestData, onConfirmExport }: ProvisionRequestExportModalProps) {
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [exportFormat, setExportFormat] = useState(requestData?.format || 'excel');

  if (!isOpen || !requestData) return null;

  const handleNextStep = () => {
    setActiveStep(2);
  };

  const handleConfirm = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onConfirmExport(requestData.id);
      onClose();
    }, 1500);
  };

  const mockPreviewData = [
    { id: '1', so_dinh_danh: '001095000123', ho_ten: 'Nguyễn Văn A', ngay_sinh: '15/10/1995', tinh_trang: 'Đã kết hôn' },
    { id: '2', so_dinh_danh: '001096000456', ho_ten: 'Trần Thị B', ngay_sinh: '22/05/1996', tinh_trang: 'Đã kết hôn' },
    { id: '3', so_dinh_danh: '001098000789', ho_ten: 'Lê Văn C', ngay_sinh: '08/11/1998', tinh_trang: 'Độc thân' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl w-full max-w-5xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileDown className="w-5 h-5 text-emerald-600" />
              Kết xuất dữ liệu theo yêu cầu
            </h2>
            <div className="flex items-center gap-3 mt-1.5 text-sm">
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{requestData.id}</span>
              <span className="text-slate-500 font-medium">Đơn vị: <strong className="text-slate-700">{requestData.org}</strong></span>
              <span className="text-slate-500 font-medium">Dữ liệu: <strong className="text-slate-700">{requestData.dataType}</strong></span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Sidebar - Steps */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6 shrink-0">
            <div className="flex flex-col gap-4 relative before:absolute before:left-5 before:top-8 before:bottom-8 before:w-0.5 before:bg-slate-200">
              {/* Step 1 */}
              <div className="relative flex gap-4 z-10 cursor-pointer" onClick={() => setActiveStep(1)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${activeStep === 1 ? 'bg-blue-600 border-blue-600 text-white shadow-md' : activeStep > 1 ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-slate-300 text-slate-400'}`}>
                  {activeStep > 1 ? <CheckCircle className="w-5 h-5" /> : 1}
                </div>
                <div className="pt-2.5">
                  <h3 className={`text-sm font-bold ${activeStep === 1 ? 'text-blue-600' : 'text-slate-700'}`}>Thiết lập tiêu chí</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Lọc dữ liệu truy xuất</p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex gap-4 z-10 cursor-pointer" onClick={() => activeStep >= 1 && setActiveStep(2)}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${activeStep === 2 ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-slate-300 text-slate-400'}`}>
                  2
                </div>
                <div className="pt-2.5">
                  <h3 className={`text-sm font-bold ${activeStep === 2 ? 'text-blue-600' : 'text-slate-700'}`}>Xem trước & Xuất</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Kiểm tra và tạo file</p>
                </div>
              </div>
            </div>
            
            <div className="mt-auto bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-start gap-2 text-blue-600 mb-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Mục đích yêu cầu</span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-relaxed italic">
                "{requestData.purpose}"
              </p>
            </div>
          </div>

          {/* Right Main Area */}
          <div className="flex-1 overflow-y-auto bg-white p-8">
            
            {activeStep === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                <section>
                  <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-500" />
                    Thiết lập điều kiện truy xuất
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Thời gian dữ liệu từ</label>
                      <input type="date" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-700" defaultValue={requestData.fromDate || ''} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Đến ngày</label>
                      <input type="date" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-700" defaultValue={requestData.toDate || ''} />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Truy vấn bổ sung (Tùy chọn)</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Nhập từ khóa hoặc câu lệnh SQL WHERE (nếu có quyền)..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-sm text-slate-700" />
                      </div>
                    </div>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-purple-500" />
                    Trường dữ liệu kết xuất
                  </h3>
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                        <tr>
                          <th className="px-4 py-2 w-10 text-center"><input type="checkbox" defaultChecked className="rounded border-slate-300" /></th>
                          <th className="px-4 py-2 font-medium">Tên trường</th>
                          <th className="px-4 py-2 font-medium">Kiểu dữ liệu</th>
                          <th className="px-4 py-2 font-medium">Masking (Che giấu)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-100">
                          <td className="px-4 py-3 text-center"><input type="checkbox" defaultChecked className="rounded border-slate-300" /></td>
                          <td className="px-4 py-3 font-medium text-slate-800">so_dinh_danh</td>
                          <td className="px-4 py-3 text-slate-500">String</td>
                          <td className="px-4 py-3 text-slate-500">Không che</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="px-4 py-3 text-center"><input type="checkbox" defaultChecked className="rounded border-slate-300" /></td>
                          <td className="px-4 py-3 font-medium text-slate-800">ho_ten</td>
                          <td className="px-4 py-3 text-slate-500">String</td>
                          <td className="px-4 py-3 text-slate-500">Không che</td>
                        </tr>
                        <tr className="border-b border-slate-100">
                          <td className="px-4 py-3 text-center"><input type="checkbox" defaultChecked className="rounded border-slate-300" /></td>
                          <td className="px-4 py-3 font-medium text-slate-800">ngay_sinh</td>
                          <td className="px-4 py-3 text-slate-500">Date</td>
                          <td className="px-4 py-3 text-slate-500">Không che</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <div className="flex items-center gap-4 text-emerald-700">
                    <TableIcon className="w-8 h-8 opacity-80" />
                    <div>
                      <h4 className="font-bold text-sm">Dữ liệu sẵn sàng kết xuất</h4>
                      <p className="text-xs mt-0.5 opacity-80">Dự kiến: <strong className="font-bold text-emerald-800">12,450</strong> bản ghi khớp với điều kiện.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Định dạng file:</span>
                    <select 
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value)}
                      className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
                    >
                      <option value="excel">Excel (.xlsx)</option>
                      <option value="csv">CSV (.csv)</option>
                      <option value="json">JSON (.json)</option>
                      <option value="xml">XML (.xml)</option>
                    </select>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bản xem trước dữ liệu (Top 3)</h4>
                    <button className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-100 border-b border-slate-200 text-slate-600">
                        <tr>
                          <th className="px-4 py-2 font-medium">Số định danh</th>
                          <th className="px-4 py-2 font-medium">Họ tên</th>
                          <th className="px-4 py-2 font-medium">Ngày sinh</th>
                          <th className="px-4 py-2 font-medium">Tình trạng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockPreviewData.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                            <td className="px-4 py-2.5 font-mono text-slate-600">{row.so_dinh_danh}</td>
                            <td className="px-4 py-2.5 font-medium text-slate-800">{row.ho_ten}</td>
                            <td className="px-4 py-2.5 text-slate-600">{row.ngay_sinh}</td>
                            <td className="px-4 py-2.5 text-slate-600">{row.tinh_trang}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors uppercase tracking-widest"
          >
            Hủy bỏ
          </button>
          
          <div className="flex items-center gap-3">
            {activeStep === 1 && (
              <button 
                onClick={handleNextStep}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors uppercase tracking-widest"
              >
                Tiếp tục
              </button>
            )}
            {activeStep === 2 && (
              <>
                <button 
                  onClick={() => setActiveStep(1)}
                  className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors uppercase tracking-widest"
                >
                  Quay lại
                </button>
                <button 
                  onClick={handleConfirm}
                  disabled={isGenerating}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-md transition-all uppercase tracking-widest flex items-center gap-2 min-w-[160px] justify-center"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Đang tạo file...
                    </>
                  ) : (
                    <>
                      <FileDown className="w-4 h-4" />
                      Xác nhận kết xuất
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
