const fs = require('fs');
const path = require('path');

const targetFile = 'D:/tuphap/khodldc/dldc_1/tailieu/tailieuphantich/mauthuthapCSDL.md';
let data = fs.readFileSync(targetFile, 'utf8');

// 1. Reformat existing sections
// Replace ###### ... with numbering
let sectionCount = 0;
const sections = [
    { old: '###### Thông tin chi tiết dữ liệu hồ sơ đăng ký khai sinh', new: '## 4.2.3.1. PM02.QLTT.TN.KS  Hồ sơ đăng ký khai sinh', slug: 'khaisinh' },
    { old: '###### Thông tin chi tiết dữ liệu hồ sơ đăng ký kết hôn', new: '## 4.2.3.2. PM02.QLTT.TN.KH  Hồ sơ đăng ký kết hôn', slug: 'kethon' },
    { old: '###### Thông tin chi tiết dữ liệu hồ sơ cấp GĐKN kết hôn', new: '## 4.2.3.3. PM02.QLTT.TN.GDKN  Hồ sơ cấp GĐKN kết hôn', slug: 'gdknkethon' },
    { old: '###### Thông tin chi tiết dữ liệu hồ sơ đăng ký khai tử', new: '## 4.2.3.4. PM02.QLTT.TN.KT  Hồ sơ đăng ký khai tử', slug: 'khaitu' },
    { old: '###### Hồ sơ DK nhận cha, mẹ, con', new: '## 4.2.3.5. PM02.QLTT.TN.NC  Hồ sơ DK nhận cha, mẹ, con', slug: 'nhancha' },
    { old: '###### Hồ sơ đăng ký nuôi con nuôi', new: '## 4.2.3.6. PM02.QLTT.TN.NN  Hồ sơ đăng ký nuôi con nuôi', slug: 'nuoicnuoi' },
    { old: '###### Hồ sơ đăng ký giám hộ', new: '## 4.2.3.7. PM02.QLTT.TN.GH  Hồ sơ đăng ký giám hộ', slug: 'giamho' },
    { old: '###### Hồ sơ DK chấm dứt giám hộ', new: '## 4.2.3.8. PM02.QLTT.TN.CDGH  Hồ sơ DK chấm dứt giám hộ', slug: 'chamdutgiamho' },
    { old: '###### Hồ sơ DK thay đổi TT hộ tịch...', new: '## 4.2.3.9. PM02.QLTT.TN.TDHT  Hồ sơ DK thay đổi TT hộ tịch...', slug: 'thaydoihotich' },
    { old: '###### Hồ sơ đăng ký kiểm sát việc giám hộ', new: '## 4.2.3.10. PM02.QLTT.TN.KSGH  Hồ sơ đăng ký kiểm sát việc giám hộ', slug: 'kiemsatgiamho' },
    { old: '###### Hồ sơ đăng ký giám sát việc giám hộ', new: '## 4.2.3.11. PM02.QLTT.TN.GSGH  Hồ sơ đăng ký giám sát việc giám hộ', slug: 'giamsatgiamho' },
    { old: '###### Hồ sơ ly hôn/hủy kết hôn ở nước ngoài', new: '## 4.2.3.12. PM02.QLTT.TN.LH  Hồ sơ ly hôn/hủy kết hôn ở nước ngoài', slug: 'lyhon' }
];

// 2. Formatting rules
function reformatSection(content, section, index) {
    let lines = content.split('\n');
    let screenCount = 0;
    let result = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Fix headings
        if (line.includes('Màn danh sách dữ liệu') || line.includes('Màn hình thông tin chi tiết') || line.includes('Tab Thông tin chi tiết')) {
            screenCount++;
            let code = line.split('.')[0] || '';
            let name = line.substring(line.indexOf('.') + 1).trim();
            line = ### 4.2.3.\.\ \;
        }

        // Fix subheadings
        if (line === 'Mô tả thông tin trên màn hình' || line === 'Mô tả thông tin trên màn hình') {
            line = #### 4.2.3.\.\.1 Mô tả thông tin trên màn hình;
        }
        if (line === 'Chức năng trên màn hình' || line === 'Chức năng trên màn hình') {
            line = #### 4.2.3.\.\.2 Chức năng trên màn hình;
        }

        // Fix image captions
        if (line.startsWith('Hình ') || line.startsWith('Hình ')) {
            line = * Hình \*;
        }

        // Fix tables
        if (line.includes('| **Trường thông tin** |')) {
            line = '| **STT** | **Tên trường thông tin** | **Kiểu dữ liệu** | **Bắt buộc** | **Mặc định** | **Mô tả** |';
        }
        if (line.includes('| **TT** |')) {
            line = '| **STT** | **Tên chức năng** | **Định dạng** | **Mô tả** |';
        }

        result.push(line);
    }
    return result.join('\n');
}

// Full reformatting
let finalContent = '# 4.2.3. DC102.QLTT.TN  CSDL Trong ngành\n\n' + data;

// Replace markers
sections.forEach((s, idx) => {
    finalContent = finalContent.replace(s.old, s.new);
});

// Final cleanup and append Nationality
const nationalityDocs = \
## 4.2.3.13.PM02.QLTT.TN.QT  HT quản lý hồ sơ QT

### 4.2.3.13.1.DC1 - QT - DB-01 Dashboard Thu thập quốc tịch

Màn hình

![](images / mauthuthapCSDL_nationality_dashboard.png)

    * Hình 53  Màn hình Dashboard Thu thập quốc tịch *

#### 4.2.3.13.1.1 Mô tả thông tin trên màn hình

    | ** STT ** | ** Tên trường thông tin ** | ** Kiểu dữ liệu ** | ** Bắt buộc ** | ** Mặc định ** | ** Mô tả ** |
| --- | --- | --- | --- | --- | --- |
| 1 | Thống kê Nhập QT | Card / Number | | | Số lượng hồ sơ nhập quốc tịch đã thu thập. |
| 2 | Thống kê Thôi QT | Card / Number | | | Số lượng hồ sơ thôi quốc tịch đã thu thập. |
| 3 | Thống kê Trở lại QT | Card / Number | | | Số lượng hồ sơ trở lại quốc tịch đã thu thập. |
| 4 | Biểu đồ Thu thập | Chart | | | Biểu đồ so sánh số lượng thu thập giữa tháng trước và tháng này. |
| 5 | Danh sách CSDL thu thập | Table | | | Bảng liệt kê chi tiết số lượng đăng ký và lỗi theo từng loại hồ sơ. |

#### 4.2.3.13.1.2 Chức năng trên màn hình

    | ** STT ** | ** Tên chức năng ** | ** Định dạng ** | ** Mô tả ** |
| --- | --- | --- | --- |
| 1 | Lọc thời gian | DatePicker | Chọn khoảng thời gian để thống kê số liệu. |
| 2 | Kết xuất | Button | Xuất dữ liệu dashboard ra file báo cáo. |
| 3 | Xem chi tiết | Card Click | Nhấn vào các thẻ thống kê để xem danh sách hồ sơ chi tiết. |

### 4.2.3.13.2.MH01 Màn danh sách dữ liệu hồ sơ Nhập Quốc tịch

Màn hình

![](images / mauthuthapCSDL_nhapqt_img_001.png)

    * Hình 54  Danh sách dữ liệu hồ sơ Nhập Quốc tịch *

#### 4.2.3.13.2.1 Mô tả thông tin trên màn hình

    | ** STT ** | ** Tên trường thông tin ** | ** Kiểu dữ liệu ** | ** Bắt buộc ** | ** Mặc định ** | ** Mô tả ** |
| --- | --- | --- | --- | --- | --- |
| 1 | Từ khóa tìm kiếm | Text | | | Tìm kiếm theo họ tên hoặc số hồ sơ. |
| 2 | Bảng danh sách | Table | | | Hiển thị: STT, Họ tên, Ngày sinh, Số quyết định, Ngày quyết định, Trạng thái. |

#### 4.2.3.13.2.2 Chức năng trên màn hình

    | ** STT ** | ** Tên chức năng ** | ** Định dạng ** | ** Mô tả ** |
| --- | --- | --- | --- |
| 1 | Tìm kiếm | Button | Thực hiện lọc dữ liệu theo điều kiện nhập. |
| 2 | Xem chi tiết | Icon Eye | Mở popup xem chi tiết thông tin hồ sơ nhập quốc tịch. |
| 3 | Đồng bộ | Button | Kích hoạt tiến trình đồng bộ dữ liệu từ nguồn. |

### 4.2.3.13.3.MH02 Màn hình thông tin chi tiết hồ sơ Nhập Quốc tịch

Màn hình

![](images / mauthuthapCSDL_nhapqt_img_002.png)

    * Hình 55  Thông tin chi tiết hồ sơ Nhập Quốc tịch *

#### 4.2.3.13.3.1 Mô tả thông tin trên màn hình

    | ** STT ** | ** Tên trường thông tin ** | ** Kiểu dữ liệu ** | ** Bắt buộc ** | ** Mặc định ** | ** Mô tả ** |
| --- | --- | --- | --- | --- | --- |
| 1 | Thông tin cá nhân | Section | | | Bao gồm: Họ tên, Ngày sinh, Giới tính, Quốc tịch cũ. |
| 2 | Thông tin quyết định | Section | | | Số quyết định, Ngày ký, Cơ quan ban hành. |

#### 4.2.3.13.3.2 Chức năng trên màn hình

    | ** STT ** | ** Tên chức năng ** | ** Định dạng ** | ** Mô tả ** |
| --- | --- | --- | --- |
| 1 | Đóng | Button | Đóng popup chi tiết, quay lại danh sách. |

### 4.2.3.13.4.MH03 Tab Lịch sử chỉnh sửa kết nối(Nhập QT)

Màn hình

![](images / mauthuthapCSDL_nhapqt_img_003.png)

    * Hình 56  Lịch sử chỉnh sửa kết nối hồ sơ Nhập Quốc tịch *

#### 4.2.3.13.4.1 Mô tả thông tin trên màn hình

    | ** STT ** | ** Tên trường thông tin ** | ** Kiểu dữ liệu ** | ** Bắt buộc ** | ** Mặc định ** | ** Mô tả ** |
| --- | --- | --- | --- | --- | --- |
| 1 | Bảng lịch sử | Table | | | Ghi lại các lần thay đổi thông tin kết nối hoặc cấu hình thu thập. |

### 4.2.3.13.5.MH04 Tab Lịch sử đồng bộ(Nhập QT)

Màn hình

![](images / mauthuthapCSDL_nhapqt_img_004.png)

    * Hình 57  Lịch sử đồng bộ dữ liệu hồ sơ Nhập Quốc tịch *

#### 4.2.3.13.5.1 Mô tả thông tin trên màn hình

    | ** STT ** | ** Tên trường thông tin ** | ** Kiểu dữ liệu ** | ** Bắt buộc ** | ** Mặc định ** | ** Mô tả ** |
| --- | --- | --- | --- | --- | --- |
| 1 | Bảng lịch sử | Table | | | Chi tiết các lần chạy đồng bộ: Thời gian, Số bản ghi, Trạng thái(Thành công / Lỗi). |

    ---

### 4.2.3.13.6.MH01 Màn danh sách dữ liệu hồ sơ Thôi Quốc tịch

Màn hình

![](images / mauthuthapCSDL_thoiqt_img_001.png)

    * Hình 58  Danh sách dữ liệu hồ sơ Thôi Quốc tịch *

#### 4.2.3.13.6.1 Mô tả thông tin trên màn hình

    (Tương tự Hồ sơ Nhập Quốc tịch nhưng cho đối tượng xin thôi quốc tịch)

### 4.2.3.13.7.MH02 Màn hình thông tin chi tiết hồ sơ Thôi Quốc tịch

Màn hình

![](images / mauthuthapCSDL_thoiqt_img_002.png)

    * Hình 59  Thông tin chi tiết hồ sơ Thôi Quốc tịch *

### 4.2.3.13.8.MH03 Tab Lịch sử chỉnh sửa kết nối(Thôi QT)

Màn hình

![](images / mauthuthapCSDL_thoiqt_img_003.png)

    * Hình 60  Lịch sử chỉnh sửa kết nối hồ sơ Thôi Quốc tịch *

### 4.2.3.13.9.MH04 Tab Lịch sử đồng bộ(Thôi QT)

Màn hình

![](images / mauthuthapCSDL_thoiqt_img_004.png)

    * Hình 61  Lịch sử đồng bộ dữ liệu hồ sơ Thôi Quốc tịch *

        ---

### 4.2.3.13.10.MH01 Màn danh sách dữ liệu hồ sơ Trở lại Quốc tịch

Màn hình

![](images / mauthuthapCSDL_trolaiqt_img_001.png)

    * Hình 62  Danh sách dữ liệu hồ sơ Trở lại Quốc tịch *

### 4.2.3.13.11.MH02 Màn hình thông tin chi tiết hồ sơ Trở lại Quốc tịch

Màn hình

![](images / mauthuthapCSDL_trolaiqt_img_002.png)

    * Hình 63  Thông tin chi tiết hồ sơ Trở lại Quốc tịch *

### 4.2.3.13.12.MH03 Tab Lịch sử chỉnh sửa kết nối(Trở lại QT)

Màn hình

![](images / mauthuthapCSDL_trolaiqt_img_003.png)

    * Hình 64  Lịch sử chỉnh sửa kết nối hồ sơ Trở lại Quốc tịch *

### 4.2.3.13.13.MH04 Tab Lịch sử đồng bộ(Trở lại QT)

Màn hình

![](images / mauthuthapCSDL_trolaiqt_img_004.png)

    * Hình 65  Lịch sử đồng bộ dữ liệu hồ sơ Trở lại Quốc tịch *
\;

fs.writeFileSync(targetFile, finalContent + nationalityDocs, 'utf8');
console.log('Done reformatting and adding Nationality docs!');
