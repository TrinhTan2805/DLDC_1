# Hệ thống quản lý Bộ Tư Pháp và Khai thác Kho dữ liệu DLDC_1

Tài liệu này mô tả chi tiết luồng xử lý và luân chuyển dữ liệu (Data Flow) trong hệ thống DLDC_1, bao gồm các module mới được thiết lập.

## 1. Sơ đồ Luồng Dữ liệu Tổng thể

Hệ thống được thiết kế theo mô hình khép kín từ khâu thu thập, đối soát, xử lý đến khi công bố và chia sẻ dữ liệu.

```mermaid
graph TD
    subgraph "Nguồn Dữ liệu (Data Sources)"
        S1["CSDL Hộ tịch (Dùng chung)"]
        S2["CSDL Thi hành án, Lý lịch... (Trong ngành)"]
        S3["CSDL Tòa án, Bảo hiểm... (Ngoài ngành)"]
    end

    subgraph "Thu thập & Đối soát (Collection)"
        C1["Module Thu thập (CSDL Trong/Ngoài ngành)"]
        C2["Module Đối soát (Reconciliation)"]
        C1 --> C2
    end
    
    S1 & S2 & S3 --> C1

    subgraph "Xử lý & Chuẩn hóa (Processing)"
        P1["Làm sạch & Định dạng dữ liệu"]
        P2["Áp dụng Quy tắc xử lý (Processing Rules)"]
        C2 --> P1
        P1 --> P2
    end

    subgraph "Giá trị dữ liệu & Quản trị (Data Governance)"
        G1[("Cơ sở dữ liệu Chủ - Master Data")]
        G2[("Danh mục dùng chung - Category")]
        G3["Metadata & Thông báo (Notifications)"]
        P2 --> G1
        G1 <--> G2
        G1 --> G3
    end

    subgraph "Khai thác & Chia sẻ (Distribution)"
        D1["Dữ liệu Mở - Open Data (NĐ 47/2020)"]
        D2["Điều phối API - Orchestration"]
        D3["Cung cấp & Chia sẻ dữ liệu - Provision"]
        G1 --> D1 & D2 & D3
    end

    subgraph "Người dùng & Giám sát (Admin & Monitoring)"
        U1["Người dùng (Chuyên viên/Lãnh đạo)"]
        U2["Nhật ký truy cập & Sao lưu (Audit Logs)"]
        D1 & D2 & D3 --> U1
        U1 --> U2
    end
```

---

## 2. Chi tiết các Module chính

### 2.1. Module Thu thập & Đối soát (Collection & Reconciliation)
- **Thu thập**: Tự động hoặc thủ công lấy dữ liệu từ các hệ thống thành phần.
- **Đối soát**: So sánh dữ liệu thu thập được với dữ liệu gốc (trên Firebase/Local) để phát hiện sai lệch hoặc trùng lặp.

### 2.2. Module Xử lý & Chuẩn hóa (Processing & Cleaning)
- **Làm sạch**: Loại bỏ các ký tự thừa, chuẩn hóa định dạng ngày tháng, giới tính, dân tộc theo danh mục chuẩn.
- **Quy tắc (Rules)**: Thiết lập các filter để lọc dữ liệu rác trước khi đưa vào kho dữ liệu chủ.

### 2.3. Module Dữ liệu Chủ & Danh mục (Master Data & Category)
- **Master Data**: Nơi lưu giữ "nguồn sự thật duy nhất" (Single Source of Truth) của dữ liệu dân cư và hạ tầng.
- **Category**: Quản lý tập trung các danh mục mã dùng chung cho toàn bộ hệ thống.

### 2.4. Module Dữ liệu Mở & Điều phối (Open Data & Orchestration)
- **Open Data**: Công bố các tập dữ liệu không bảo mật phục vụ người dân và doanh nghiệp theo Nghị định 47.
- **Orchestration**: Quản lý các dịch vụ API, giám sát (Monitoring) hiện trạng kết nối và hiệu năng hệ thống.

### 2.5. Module Quản trị & Giám sát (Admin & Security)
- **Phân quyền**: Chặt chẽ cho từng cấp Chuyên viên, Lãnh đạo, Quản trị viên.
- **Audit Logs**: Lưu trữ mọi vết thao tác (Edit History), đăng nhập và cấu hình hệ thống.

---

## 3. Quy trình Luân chuyển tiêu biểu

1.  **Dữ liệu thô** được đẩy từ CSDL Hộ tịch sang module **Thu thập**.
2.  Chuyên viên thực hiện **Đối soát** để kiểm tra tính toàn vẹn.
3.  Module **Xử lý** tự động chạy các script chuẩn hóa.
4.  Dữ liệu sau chuẩn hóa được cập nhật vào **Master Data**.
5.  Dữ liệu hợp lệ được cấp quyền thông qua module **Orchestration** để chia sẻ qua API hoặc công bố tại trang **Open Data**.
