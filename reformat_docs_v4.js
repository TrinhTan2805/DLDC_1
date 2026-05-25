const fs = require('fs');

const targetFile = 'D:/tuphap/khodldc/dldc_1/tailieu/tailieuphantich/mauthuthapCSDL.md';
let data = fs.readFileSync(targetFile, 'utf8');

const sections = [
    { title: 'Hồ sơ đăng ký khai sinh', code: 'KS' },
    { title: 'Hồ sơ đăng ký kết hôn', code: 'KH' },
    { title: 'Hồ sơ cấp GĐKN kết hôn', code: 'GDKN' },
    { title: 'Hồ sơ đăng ký khai tử', code: 'KT' },
    { title: 'Hồ sơ DK nhận cha, mẹ, con', code: 'NC' },
    { title: 'Hồ sơ đăng ký nuôi con nuôi', code: 'NN' },
    { title: 'Hồ sơ đăng ký giám hộ', code: 'GH' },
    { title: 'Hồ sơ DK chấm dứt giám hộ', code: 'CDGH' },
    { title: 'Hồ sơ DK thay đổi TT hộ tịch...', code: 'TDHT' },
    { title: 'Hồ sơ đăng ký kiểm sát việc giám hộ', code: 'KSGH' },
    { title: 'Hồ sơ đăng ký giám sát việc giám hộ', code: 'GSGH' },
    { title: 'Hồ sơ ly hôn/hủy kết hôn ở nước ngoài', code: 'LH' }
];

let lines = data.split('\n');
let newLines = ['# 4.2.3. DC102.QLTT.TN  CSDL Trong ngành', ''];
let currentSectionIdx = -1;
let currentScreenIdx = 0;
let imgTotalCount = 23;

for (let i = 0; i < lines.length; i++) {
    let rawLine = lines[i];
    let line = rawLine.trim();

    // Check for major section
    let foundSection = sections.findIndex(s => line.includes(s.title) && line.startsWith('######'));
    if (foundSection !== -1) {
        currentSectionIdx = foundSection;
        currentScreenIdx = 0;
        newLines.push('## 4.2.3.' + (currentSectionIdx + 1) + '. PM02.QLTT.TN.' + sections[currentSectionIdx].code + '  ' + sections[currentSectionIdx].title, '');
        continue;
    }

    if (currentSectionIdx === -1) continue;

    // Screen title
    if (line.includes('Màn danh sách') || line.includes('Màn hình thông tin chi tiết') || line.includes('Tab Thông tin') || line.includes('Popup:')) {
        currentScreenIdx++;
        let screenName = line;
        if (line.includes('.')) screenName = line.split('.').slice(-1)[0].trim();
        newLines.push('### 4.2.3.' + (currentSectionIdx + 1) + '.' + currentScreenIdx + ' ' + screenName, '');
        continue;
    }

    // Sub-sections
    if (line === 'Mô tả thông tin trên màn hình') {
        newLines.push('#### 4.2.3.' + (currentSectionIdx + 1) + '.' + currentScreenIdx + '.1 Mô tả thông tin trên màn hình', '');
        continue;
    }
    if (line === 'Chức năng trên màn hình') {
        newLines.push('#### 4.2.3.' + (currentSectionIdx + 1) + '.' + currentScreenIdx + '.2 Chức năng trên màn hình', '');
        continue;
    }

    // Image captions
    if (line.startsWith('Hình ') || (line.startsWith('*Hình ') && line.endsWith('*'))) {
        imgTotalCount++;
        let imgName = line.replace(/^\*?Hình \d+  /, '').replace(/\*$/, '').trim();
        newLines.push('*Hình ' + imgTotalCount + '  ' + imgName + '*', '');
        continue;
    }

    // Table Headers
    if (line.includes('| **Trường thông tin** |')) {
        newLines.push('| **STT** | **Tên trường thông tin** | **Kiểu dữ liệu** | **Bắt buộc** | **Mặc định** | **Mô tả** |');
        newLines.push('| --- | --- | --- | --- | --- | --- |');
        i++; continue;
    }
    if (line.includes('| **TT** |')) {
        newLines.push('| **STT** | **Tên chức năng** | **Định dạng** | **Mô tả** |');
        newLines.push('| --- | --- | --- | --- |');
        i++; continue;
    }

    newLines.push(rawLine);
}

// Nationality Section
const nextSectionIdx = sections.length + 1;
newLines.push('');
newLines.push('## 4.2.3.' + nextSectionIdx + '. PM02.QLTT.TN.QT  Hệ thống quản lý Bộ Tư Pháp hồ sơ quốc tịch');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.1 DC1-QT-DB-01 Dashboard Thu thập quốc tịch');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_nationality_dashboard.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Màn hình Dashboard Thu thập quốc tịch*');
newLines.push('');
newLines.push('#### 4.2.3.' + nextSectionIdx + '.1.1 Mô tả thông tin trên màn hình');
newLines.push('');
newLines.push('| **STT** | **Tên trường thông tin** | **Kiểu dữ liệu** | **Bắt buộc** | **Mặc định** | **Mô tả** |');
newLines.push('| --- | --- | --- | --- | --- | --- |');
newLines.push('| 1 | Thống kê Nhập QT | Card/Number | | | Số lượng hồ sơ nhập quốc tịch đã thu thập. |');
newLines.push('| 2 | Thống kê Thôi QT | Card/Number | | | Số lượng hồ sơ thôi quốc tịch đã thu thập. |');
newLines.push('| 3 | Thống kê Trở lại QT | Card/Number | | | Số lượng hồ sơ trở lại quốc tịch đã thu thập. |');
newLines.push('| 4 | Biểu đồ Thu thập | Chart | | | Biểu đồ so sánh số lượng thu thập giữa tháng trước và tháng này. |');
newLines.push('| 5 | Danh sách CSDL thu thập | Table | | | Bảng liệt kê chi tiết số lượng đăng ký và lỗi theo từng loại hồ sơ. |');
newLines.push('');
newLines.push('#### 4.2.3.' + nextSectionIdx + '.1.2 Chức năng trên màn hình');
newLines.push('');
newLines.push('| **STT** | **Tên chức năng** | **Định dạng** | **Mô tả** |');
newLines.push('| --- | --- | --- | --- |');
newLines.push('| 1 | Lọc thời gian | DatePicker | Chọn khoảng thời gian để thống kê số liệu. |');
newLines.push('| 2 | Kết xuất | Button | Xuất dữ liệu dashboard ra file báo cáo. |');
newLines.push('| 3 | Xem chi tiết | Card Click | Nhấn vào các thẻ thống kê để xem danh sách hồ sơ chi tiết. |');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.2 MH01 Màn danh sách dữ liệu hồ sơ Nhập Quốc tịch');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_nhapqt_img_001.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Danh sách dữ liệu hồ sơ Nhập Quốc tịch*');
newLines.push('');
newLines.push('#### 4.2.3.' + nextSectionIdx + '.2.1 Mô tả thông tin trên màn hình');
newLines.push('');
newLines.push('| **STT** | **Tên trường thông tin** | **Kiểu dữ liệu** | **Bắt buộc** | **Mặc định** | **Mô tả** |');
newLines.push('| --- | --- | --- | --- | --- | --- |');
newLines.push('| 1 | Từ khóa tìm kiếm | Text | | | Tìm kiếm theo họ tên hoặc số hồ sơ. |');
newLines.push('| 2 | Bảng danh sách | Table | | | Hiển thị: STT, Họ tên, Ngày sinh, Số quyết định, Ngày quyết định, Trạng thái. |');
newLines.push('');
newLines.push('#### 4.2.3.' + nextSectionIdx + '.2.2 Chức năng trên màn hình');
newLines.push('');
newLines.push('| **STT** | **Tên chức năng** | **Định dạng** | **Mô tả** |');
newLines.push('| --- | --- | --- | --- |');
newLines.push('| 1 | Tìm kiếm | Button | Thực hiện lọc dữ liệu theo điều kiện nhập. |');
newLines.push('| 2 | Xem chi tiết | Icon Eye | Mở popup xem chi tiết thông tin hồ sơ nhập quốc tịch. |');
newLines.push('| 3 | Đồng bộ | Button | Kích hoạt tiến trình đồng bộ dữ liệu từ nguồn. |');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.3 MH02 Màn hình thông tin chi tiết hồ sơ Nhập Quốc tịch');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_nhapqt_img_002.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Thông tin chi tiết hồ sơ Nhập Quốc tịch*');
newLines.push('');
newLines.push('#### 4.2.3.' + nextSectionIdx + '.3.1 Mô tả thông tin trên màn hình');
newLines.push('');
newLines.push('| **STT** | **Tên trường thông tin** | **Kiểu dữ liệu** | **Bắt buộc** | **Mặc định** | **Mô tả** |');
newLines.push('| --- | --- | --- | --- | --- | --- |');
newLines.push('| 1 | Thông tin cá nhân | Section | | | Bao gồm: Họ tên, Ngày sinh, Giới tính, Quốc tịch cũ. |');
newLines.push('| 2 | Thông tin quyết định | Section | | | Số quyết định, Ngày ký, Cơ quan ban hành. |');
newLines.push('');
newLines.push('#### 4.2.3.' + nextSectionIdx + '.3.2 Chức năng trên màn hình');
newLines.push('');
newLines.push('| **STT** | **Tên chức năng** | **Định dạng** | **Mô tả** |');
newLines.push('| --- | --- | --- | --- |');
newLines.push('| 1 | Đóng | Button | Đóng popup chi tiết, quay lại danh sách. |');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.4 MH03 Tab Lịch sử chỉnh sửa kết nối (Nhập QT)');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_nhapqt_img_003.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Lịch sử chỉnh sửa kết nối hồ sơ Nhập Quốc tịch*');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.5 MH04 Tab Lịch sử đồng bộ (Nhập QT)');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_nhapqt_img_004.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Lịch sử đồng bộ dữ liệu hồ sơ Nhập Quốc tịch*');
newLines.push('');
newLines.push('---');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.6 MH01 Màn danh sách dữ liệu hồ sơ Thôi Quốc tịch');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_thoiqt_img_001.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Danh sách dữ liệu hồ sơ Thôi Quốc tịch*');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.7 MH02 Màn hình thông tin chi tiết hồ sơ Thôi Quốc tịch');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_thoiqt_img_002.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Thông tin chi tiết hồ sơ Thôi Quốc tịch*');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.8 MH03 Tab Lịch sử chỉnh sửa kết nối (Thôi QT)');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_thoiqt_img_003.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Lịch sử chỉnh sửa kết nối hồ sơ Thôi Quốc tịch*');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.9 MH04 Tab Lịch sử đồng bộ (Thôi QT)');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_thoiqt_img_004.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Lịch sử đồng bộ dữ liệu hồ sơ Thôi Quốc tịch*');
newLines.push('');
newLines.push('---');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.10 MH01 Màn danh sách dữ liệu hồ sơ Trở lại Quốc tịch');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_trolaiqt_img_001.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Danh sách dữ liệu hồ sơ Trở lại Quốc tịch*');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.11 MH02 Màn hình thông tin chi tiết hồ sơ Trở lại Quốc tịch');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_trolaiqt_img_002.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Thông tin chi tiết hồ sơ Trở lại Quốc tịch*');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.12 MH03 Tab Lịch sử chỉnh sửa kết nối (Trở lại QT)');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_trolaiqt_img_003.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Lịch sử chỉnh sửa kết nối hồ sơ Trở lại Quốc tịch*');
newLines.push('');
newLines.push('### 4.2.3.' + nextSectionIdx + '.13 MH04 Tab Lịch sử đồng bộ (Trở lại QT)');
newLines.push('');
newLines.push('Màn hình');
newLines.push('');
newLines.push('![](images/mauthuthapCSDL_trolaiqt_img_004.png)');
newLines.push('');
newLines.push('*Hình ' + (++imgTotalCount) + '  Lịch sử đồng bộ dữ liệu hồ sơ Trở lại Quốc tịch*');

fs.writeFileSync(targetFile, newLines.join('\n'), 'utf8');
