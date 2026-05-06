const fs = require('fs');

const path = 'src/components/pages/collection/CollectionSetupPage.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Ensure icons are imported
if (!content.includes('RefreshCw')) {
    content = content.replace("import { Search", "import { Filter, RefreshCw, Search");
} else if (!content.includes('Filter')) {
    content = content.replace("import { Search", "import { Filter, Search");
}

// 2. Add showFilters state
if (!content.includes('const [showFilters, setShowFilters] = useState(false);')) {
    content = content.replace(
        "const [navigateToPage, setNavigateToPage] = useState<string | null>(null);",
        "const [navigateToPage, setNavigateToPage] = useState<string | null>(null);\n  const [showFilters, setShowFilters] = useState(false);"
    );
}

// 3. Replace the entire filter and action block
const oldFilterStart = "{/* Filters and Actions */}";
const oldFilterEnd = "{/* Services Table */}";

const newFilterBlock = `            {/* Filters and Actions */}
            <div className="mb-6">
              {/* Row 1: Search and Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative w-[300px]">
                    <input aria-label="Input field"
                      type="text"
                      placeholder="Tìm kiếm..."
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                    />
                  </div>
                  <button className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </button>
                  <button onClick={resetFilters} className="p-2 bg-rose-100 text-rose-500 rounded-lg hover:bg-rose-200 transition-colors shadow-sm flex items-center justify-center" title="Làm mới">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowFilters(!showFilters)} 
                    className={\`p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center \${showFilters ? 'bg-blue-50 border border-blue-200 text-blue-500' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}\`}
                    title="Bộ lọc"
                  >
                    {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddServiceModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm mới
                  </button>
                </div>
              </div>

              {/* Row 2: Filters (Collapsible) */}
              {showFilters && (
                <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 grid grid-cols-5 gap-6 mt-4 animate-in slide-in-from-top-2 duration-200 shadow-sm relative">
                  <div className="absolute -top-2 left-[330px] w-4 h-4 bg-slate-50 border-t border-l border-slate-200 transform rotate-45"></div>
                  
                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Loại kết nối</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">Tất cả phương thức</option>
                      <option value="Cơ sở dữ liệu">Cơ sở dữ liệu</option>
                      <option value="API">API</option>
                      <option value="Tải file Excel">Tải file Excel</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Nguồn dữ liệu</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                    >
                      <option value="all">Tất cả nguồn dữ liệu</option>
                      <option value="Trong ngành">Trong ngành</option>
                      <option value="Ngoài ngành">Ngoài ngành</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Hệ thống nguồn</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                    >
                      <option value="all">Tất cả hệ thống nguồn</option>
                      <option value="Bộ ngành ngoài">Bộ ngành ngoài</option>
                      <option value="Cục Hành chính tư pháp">Cục Hành chính tư pháp</option>
                      <option value="Cục Quản lý thi hành án dân sự">Cục Quản lý thi hành án dân sự</option>
                      <option value="Cục Đăng ký giao dịch bảo đảm">Cục Đăng ký giao dịch bảo đảm</option>
                      <option value="Cục Kiểm tra văn bản">Cục Kiểm tra văn bản</option>
                      <option value="Cục Bổ trợ tư pháp">Cục Bổ trợ tư pháp</option>
                      <option value="Vụ Hợp tác quốc tế">Vụ Hợp tác quốc tế</option>
                      <option value="Cục Kế hoạch - Tài chính">Cục Kế hoạch - Tài chính</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Trạng thái</label>
                    <select aria-label="Select box"
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">Tất cả trạng thái</option>
                      <option value="draft">Bản nháp</option>
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Ngưng hoạt động</option>
                    </select>
                  </div>
                  
                  <div className="space-y-1.5 relative z-10">
                    <label className="text-xs font-bold text-slate-700">Thời gian</label>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-sm">
                      <input aria-label="Input field"
                        type="date"
                        className="w-full border-0 bg-transparent text-sm focus:outline-none text-slate-700 p-0"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            `;

let startIndex = content.indexOf(oldFilterStart);
let endIndex = content.indexOf(oldFilterEnd);
if (startIndex !== -1 && endIndex !== -1) {
    content = content.substring(0, startIndex) + newFilterBlock + content.substring(endIndex);
}

// 4. Change Eye icon to SettingsIcon (Quản lý) in the action column
// Look for <Eye className="w-4 h-4" /> inside the action column buttons
content = content.replace(/<Eye className="w-4 h-4" \/>/g, '<SettingsIcon className="w-4 h-4" />');
// Update title text from 'Xem chi tiết' to 'Quản lý'
content = content.replace(/title="Xem chi tiết"/g, 'title="Quản lý"');

fs.writeFileSync(path, content, 'utf8');
console.log('Updated CollectionSetupPage.tsx successfully');
