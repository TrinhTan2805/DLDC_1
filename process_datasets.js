const fs = require('fs');

const rawPath = 'd:/tuphap/khodldc/dldc_1/raw_list.txt';
const mdPath = 'd:/tuphap/khodldc/dldc_1/tailieu/tailieuphantich/phantichtong.md';

const rawText = fs.readFileSync(rawPath, 'utf8');
const lines = rawText.split('\n').map(l => l.trim()).filter(l => l);

const datasets = [];
const seen = new Set();

for (const line of lines) {
    if (line.toLowerCase().startsWith('hệ thống gửi')) continue;

    // Pattern matching
    // "Kho DLDC tiếp nhận dữ liệu " or "Kho DLDC tiếp nhận dữ liệuiệu "
    let match = line.match(/Kho DLDC tiếp nhận dữ liệui?ệ?u?\s+(.*?)\s+từ hệ thống nguồn/i);
    if (!match) {
        // Fallback for edge cases like missing some words
        match = line.match(/tiếp nhận dữ liệui?ệ?u?\s+(.*?)\s+từ/i);
    }

    if (match && match[1]) {
        let name = match[1].trim();
        // Capitalize first letter to make it look nicer if needed, but keeping user's exactly is safer.
        if (!seen.has(name.toLowerCase())) {
            seen.add(name.toLowerCase());
            datasets.push(name);
        }
    } else {
        console.warn("Could not parse line: " + line);
    }
}

console.log(`Found ${datasets.length} unique datasets.`);

let md = "";
let currentSection = 7;

for (const db of datasets) {
    const sectionNum = `4.2.2.2.${currentSection}`;
    md += `#### ${sectionNum}. MH02.P04 Màn hình thông báo lỗi tiếp nhận dữ liệu ${db}
- **Mã chức năng:** DC1-TT-QT-001
- **Mã màn hình:** MH02.P04

Màn hình

![Cài đặt dịch vụ (MH02.P04)](./images/thuthap/MH02_P04_thongbaoloi.png)

*Hình 7 – Màn hình cài đặt dịch vụ thu thập*

${sectionNum}.1 Mô tả thông tin trên màn hình
| **STT** | **Tên trường thông tin** | **Kiểu dữ liệu** | **Bắt buộc** | **Mặc định** | **Mô tả** |
| --- | --- | --- | --- | --- | --- |
| Tự động đồng bộ | TOGGLE | - | Bật | Bật/tắt chế độ tự động chạy theo lịch. |
| Thông báo lỗi | TOGGLE | - | Bật | Gửi thông báo khi tiến trình thất bại. |
| Ghi nhật ký chi tiết | TOGGLE | - | Tắt | Lưu log kỹ thuật chi tiết. |

${sectionNum}.2 Chức năng trên màn hình
|  |  |  |  |
| --- | --- | --- | --- |
| **STT** | **Tên chức năng** | **Định dạng** | **Mô tả** |
| 1 | CN01 | Button text | Kiểm tra Endpoint (MH02.P05). |
| 2 | CN02 | Button blue | Lưu cấu hình cài đặt. |

`;
    currentSection++;
}

let content = fs.readFileSync(mdPath, 'utf8');

const startMarker = '#### 4.2.2.2.7. MH02.P04';
const endMarker = '## 4.2.3. DC102.QLTT.NK';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error("Could not find markers.", { startIndex, endIndex });
    process.exit(1);
}

const before = content.substring(0, startIndex);
const after = content.substring(endIndex);

const newContent = before + md + '\n' + after;

fs.writeFileSync(mdPath, newContent, 'utf8');
console.log("Successfully injected exhaustive dataset list into phantichtong.md.");
