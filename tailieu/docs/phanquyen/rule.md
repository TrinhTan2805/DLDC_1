# 📋 HƯỚNG DẪN SỬ DỤNG VÀ PHÂN QUYỀN HỆ THỐNG - DỰ ÁN Kho DLDC (Kho DLDC)

> Tài liệu mô tả ma trận phân quyền và quy tắc hoạt động chi tiết của các chức năng trên hệ thống Kho DLDC (Kho DLDC).

---

## 👥 NHÓM NGƯỜI DÙNG & PHÂN QUYỀN

| Nhóm | Ký hiệu | Mô tả |
|------|---------|-------|
| Quản trị hệ thống | QTHT | Quản lý toàn bộ cấu hình, thiết lập quy tắc làm sạch/chuẩn hóa dữ liệu, quản lý API, giám sát log và thiết lập hệ thống. |
| Lãnh đạo bộ phận quản trị | LĐQT | Phê duyệt danh sách, cấu trúc danh mục dùng chung và phê duyệt các dịch vụ chia sẻ dữ liệu. |
| Lãnh đạo nghiệp vụ | LĐNV | Phê duyệt các bản ghi dữ liệu chủ, công bố dữ liệu mở và các nghiệp vụ liên quan đến chuẩn hóa dữ liệu. |
| Cán bộ nghiệp vụ | CBNV | Thực hiện rà soát, biên tập dữ liệu, gửi yêu cầu công bố dữ liệu, và thiết lập lịch tự động lấy/công bố dữ liệu. |
| Hệ thống tích hợp | HTTH | Các hệ thống nguồn/đích (TANDTC, CSDL Dân cư, Hệ thống ngành Tư pháp...) tương tác qua API. |

> **📌 Lưu ý về quyền dữ liệu:** CBNV của từng hệ thống nguồn sẽ thực hiện Quản lý, khai thác, xử lý, chia sẻ trong Kho DLDC cho dữ liệu lấy từ hệ thống nguồn mình quản lý.

---

## 📊 MA TRẬN PHÂN QUYỀN CHỨC NĂNG (CHI TIẾT)

> Ký hiệu: **X** = Có quyền thực hiện | _(trống)_ = Không có quyền

| STT | Tên Usecase / Nhóm chức năng | QTHT | LĐQT | LĐNV | CBNV | HTTH |
|-----|------------------------------|------|------|------|------|------|
| **STT** | **Tên Usecase** | | | | | |
| **I** | **QUY**  **TRÌNH**  **THU THẬP**  **DỮ LIỆU** | | | | | |
| 1 | Quản lý  phương thức thu thập dữ  liệu | X |  |  |  |  |
| 2 | Quản lý Nhật ký thu thập  dữ liệu | X |  |  |  |  |
| 3 | Dashboard quản lý thu  thập dữ liệu | X |  |  |  |  |
| **I.1** | **Thu thập dữ**  **liệu từ Bộ**  **ngành ngoài** | | | | | |
| 4 | Thu thập dữ liệu Thông tin Bản án, quyết định từ Tòa án nhân dân tối cao |  |  |  |  | X |
| 5 | Thu thập dữ liệu Danh mục giới tính |  |  |  |  | X |
| 6 | Thu thập dữ liệu Danh mục và mã các dân tộc |  |  |  |  | X |
| 7 | Thu thập dữ liệu Danh mục và mã Quốc gia,  Quốc tịch |  |  |  |  | X |
| 8 | Thu thập dữ liệu Danh mục và mã các Tôn giáo |  |  |  |  | X |
| 9 | Thu thập dữ liệu Danh mục cơ quan |  |  |  |  | X |
| 10 | Thu thập dữ liệu Danh mục đơn vị hành chính |  |  |  |  | X |
| 11 | Thu thập dữ liệu Danh mục và mã mối quan hệ trong gia đình |  |  |  |  | X |
| 12 | Thu thập dữ liệu Danh mục mã giấy tờ tùy thân |  |  |  |  | X |
| 13 | Thu thập dữ liệu Bảo trợ xã hội và giảm nghèo - Hưởng trợ giúp xã hội |  |  |  |  | X |
| 14 | Thu thập dữ liệu Bảo trợ xã hội và giảm nghèo - Hưởng trợ giúp xã hội |  |  |  |  | X |
| 15 | Thu thập dữ liệu Bảo trợ xã hội và giảm nghèo - Thông tin người nghèo, cận nghèo |  |  |  |  | X |
| 16 | Thu thập dữ liệu Bảo trợ xã hội và giảm nghèo - Người đơn thân |  |  |  |  | X |
| 17 | Thu thập dữ liệu Bảo trợ xã hội và giảm nghèo - Trẻ em là đối tượng bảo trợ xã hội |  |  |  |  | X |
| 18 | Thu thập dữ liệu Bảo trợ xã hội và giảm nghèo Người có HIV |  |  |  |  | X |
| 19 | Thu thập dữ liệu Bảo trợ xã hội và giảm nghèo Người cao tuổi |  |  |  |  | X |
| 20 | Thu thập dữ liệu Bảo trợ xã hội và giảm nghèo - Thông tin về người khuyết  tật |  |  |  |  | X |
| 21 | Thu thập dữ liệu Người có công - Hồ sơ công nhận người có công |  |  |  |  | X |
| 22 | Thu thập dữ liệu Người có công - Hồ sơ liệt sĩ: |  |  |  |  | X |
| 23 | Thu thập dữ liệu Người có công - Hồ sơ công nhận thân nhân người có công |  |  |  |  | X |
| 24 | Thu thập dữ liệu Trẻ em -  Trẻ em |  |  |  |  | X |
| **I.2** | **Thu thập dữ liệu từ các Hệ thống trong ngành** | | | | | |
| **I.2.1** | **Cục Hành**  **chính tư**  **pháp** | | | | | |
| **I.2.1.1** | **CSDL Hộ**  **tịch điện tử** | | | | | |
| 25 | Thu thập Bộ dữ liệu hồ sơ đăng ký khai sinh |  |  |  |  | X |
| 26 | Thu thập Bộ dữ liệu hồ sơ  đăng ký kết hôn |  |  |  |  | X |
| 27 | Thu thập Bộ dữ liệu hồ sơ cấp Giấy xác nhận tình  trạng hôn nhân |  |  |  |  | X |
| 28 | Thu thập Bộ dữ liệu hồ sơ đăng ký khai tử |  |  |  |  | X |
| 29 | Thu thập Bộ dữ liệu hồ sơ đăng ký nhận cha, mẹ, con |  |  |  |  | X |
| 30 | Thu thập Bộ dữ liệu hồ sơ đăng ký nuôi con nuôi |  |  |  |  | X |
| 31 | Thu thập Bộ dữ liệu hồ sơ đăng ký giám hộ |  |  |  |  | X |
| 32 | Thu thập Bộ dữ liệu hồ sơ đăng ký chấm dứt giám hộ |  |  |  |  | X |
| 33 | Thu thập Bộ dữ liệu hồ sơ đăng ký thay đổi, cải chính, bổ sung thông  tin hộ tịch, xác định lại dân tộc |  |  |  |  | X |
| 34 | Thu thập Bộ dữ liệu hồ sơ đăng ký giám sát việc giám hộ |  |  |  |  | X |
| 35 | Thu thập Bộ dữ liệu hồ sơ đăng ký chấm dứt giám sát việc giám hộ |  |  |  |  | X |
| 36 | Thu thập Bộ dữ liệu hồ sơ ghi vào sổ việc ly hôn/hủy việc kết hôn đã thực hiện tại cơ quan có thẩm quyền của nước ngoài (ghi chú ly hôn) |  |  |  |  | X |
| **I.2.1.2** | **Hệ thống quản lý hồ sơ quốc tịch** | | | | | |
| 37 | Thu thập dữ liệu Nhập Quốc tịch |  |  |  |  | X |
| 38 | Thu thập dữ liệu Thôi Quốc tịch |  |  |  |  | X |
| 39 | Thu thập dữ liệu Trở lại  Quốc tịch |  |  |  |  | X |
| **I.2.2** | **Cục Quản lý thi hành án dân sự** | | | | | |
| **I.2.2.1** | **Cơ sở dữ liệu thi hành án dân sự** | | | | | |
| 40 | Thu thập dữ liệu Yêu cầu thi hành án của cá nhân, cơ quan, tổ chức |  |  |  |  | X |
| 41 | Thu thập dữ liệu Quyết định thi hành án dân sự |  |  |  |  | X |
| 42 | Thu thập dữ liệu Người phải thi hành án, người được thi hành án, người có quyền lợi  nghĩa vụ liên quan |  |  |  |  | X |
| 43 | Thu thập dữ liệu Nghĩa vụ thi hành án |  |  |  |  | X |
| 44 | Thu thập dữ liệu Trạng thái thi hành  án |  |  |  |  | X |
| 45 | Thu thập dữ liệu Tài sản thi hành án |  |  |  |  | X |
| 46 | Thu thập dữ liệu Xác minh điều kiện trong thi hành án dân sự |  |  |  |  | X |
| 47 | Thu thập dữ liệu Cưỡng chế thi hành án trong thi hành án dân sự |  |  |  |  | X |
| 48 | Thu thập dữ liệu Áp dụng biện pháp  bảo đảm trong thi hành án dân sự |  |  |  |  | X |
| 49 | Thu thập dữ liệu Chứng từ nghiệp vụ trong thi hành án dân sự |  |  |  |  | X |
| 50 | Thu thập dữ liệu Biên lai  thu tiền thi hành án dân sự |  |  |  |  | X |
| 51 | Thu thập dữ liệu Vật chứng trong thi hành án dân sự |  |  |  |  | X |
| 52 | Thu thập dữ liệu Thẩm định giá tài sản trong thi hành án dân sự |  |  |  |  | X |
| 53 | Thu thập dữ liệu Đấu giá tài sản trong thi hành án dân sự |  |  |  |  | X |
| 54 | Thu thập dữ liệu Giải quyết khiếu nại, tố cáo trong thi hành án dân sự |  |  |  |  | X |
| 55 | Thu thập dữ liệu Hướng dẫn nghiệp vụ trong thi hành án dân sự |  |  |  |  | X |
| **I.2.3** | **Cục Đăng ký giao dịch**  **bảo đảm và**  **BTNN** | | | | | |
| **I.2.3.1** | **Cơ sở dữ**  **liệu về biện**  **pháp bảo đảm** | | | | | |
| 56 | Thu thập dữ liệu Thông tin chung  (Bao gồm người đăng ký và Hợp đồng bảo đảm) |  |  |  |  | X |
| 57 | Thu thập dữ liệu Bên bảo  đảm |  |  |  |  | X |
| 58 | Thu thập dữ liệu Bên nhận bảo đảm |  |  |  |  | X |
| 59 | Thu thập dữ liệu Tài sản bảo đảm |  |  |  |  | X |
| **I.2.4** | **Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính** | | | | | |
| **I.2.4.1** | **CSDL quốc gia về pháp**  **luật** | | | | | |
| 60 | Thu thập dữ liệu Văn bản quy phạm pháp luật |  |  |  |  | X |
| 61 | Thu thập dữ liệu Nội dung của văn bản quy phạm pháp luật |  |  |  |  | X |
| 62 | Thu thập dữ liệu Quan hệ giữa các điều khoản trong các văn bản quy phạm pháp luật |  |  |  |  | X |
| 63 | Thu thập dữ liệu Văn bản hợp nhất |  |  |  |  | X |
| 64 | Thu thập dữ liệu Hệ thống hóa văn bản quy phạm pháp luật |  |  |  |  | X |
| **I.2.4.2** | **Cơ sở dữ liệu tương trợ tư pháp về dân sự** | | | | | |
| 65 | Thu thập dữ liệu Hồ sơ ủy thác tư pháp đến |  |  |  |  | X |
| 66 | Thu thập dữ liệu Hồ sơ ủy thác tư pháp đi |  |  |  |  | X |
| **I.2.4.3** | **Hệ thống thông tin trợ giúp pháp lý** | | | | | |
| 67 | Thu thập dữ liệu Tổ chức thực hiện trợ giúp pháp lý |  |  |  |  | X |
| 68 | Thu thập dữ liệu Tổ chức đăng ký tham gia trợ giúp pháp lý |  |  |  |  | X |
| 69 | Thu thập dữ liệu Thông tin văn bản cử người thực hiện trợ giúp pháp lý |  |  |  |  | X |
| 70 | Thu thập dữ  liệu Trung tâm TGPL nhà nước |  |  |  |  | X |
| 71 | Thu thập dữ  liệu Chi  nhánh TGPL |  |  |  |  | X |
| 72 | Thu thập dữ liệu Người  thực hiện  TGPL |  |  |  |  | X |
| **I.2.4.4** | **CSDL phổ**  **biến, giáo dục pháp**  **luật và hoà giải cơ sở** | | | | | |
| 73 | Thu thập dữ liệu Báo cáo viên pháp luật |  |  |  |  | X |
| 74 | Thu thập dữ liệu Tuyên truyền viên pháp luật |  |  |  |  | X |
| 75 | Thu thập dữ liệu Chương trình, kế hoạch về phổ biến, giáo dục pháp luật |  |  |  |  | X |
| 76 | Thu thập dữ liệu Hội đồng phối hợp phổ biến, giáo dục pháp luật |  |  |  |  | X |
| 77 | Thu thập dữ liệu Đề án |  |  |  |  | X |
| 78 | Thu thập dữ liệu Hội nghị tập huấn (trực tuyến, trực tiếp) |  |  |  |  | X |
| 79 | Thu thập dữ liệu Hội thảo |  |  |  |  | X |
| 80 | Thu thập dữ liệu Tổ hoà  giải |  |  |  |  | X |
| 81 | Thu thập dữ liệu Hoà giải viên |  |  |  |  | X |
| 82 | Thu thập dữ liệu Vụ việc hoà giải |  |  |  |  | X |
| 83 | Thu thập dữ liệu Tập huấn viên |  |  |  |  | X |
| 84 | Thu thập dữ liệu Kinh phí phổ biến giáo dục pháp luật |  |  |  |  | X |
| 85 | Thu thập dữ liệu Tiêu chí, chỉ tiêu tiếp cận pháp luật |  |  |  |  | X |
| 86 | Thu thập dữ liệu Đánh giá cấp xã đạt chuẩn tiếp cận pháp luật |  |  |  |  | X |
| 87 | Thu thập dữ  liệu Cuộc  PBGDPL |  |  |  |  | X |
| 88 | Thu thập dữ liệu Cuộc thi tìm hiểu về pháp luật |  |  |  |  | X |
| **I.2.5** | **Cục Bổ trợ tư pháp** | | | | | |
| **I.2.5.1** | **CSDL quản**  **lý đấu giá tài sản** | | | | | |
| 89 | Thu thập dữ liệu Đấu giá viên |  |  |  |  | X |
| 90 | Thu thập dữ liệu Tổ chức hành nghề đấu giá |  |  |  |  | X |
| 91 | Thu thập dữ liệu Người có tài sản đấu giá |  |  |  |  | X |
| 92 | Thu thập dữ liệu Thông tin việc đấu giá |  |  |  |  | X |
| 93 | Thu thập dữ liệu Tài sản đấu giá |  |  |  |  | X |
| 94 | Thu thập dữ liệu Công chứng viên |  |  |  |  | X |
| 95 | Thu thập dữ liệu Thông tin ngăn chặn |  |  |  |  | X |
| 96 | Thu thập dữ liệu Tổ chức hành nghề công chứng |  |  |  |  | X |
| 97 | Thu thập dữ liệu Tài sản trong giao dịch công chứng |  |  |  |  | X |
| 98 | Thu thập dữ liệu Kết quả hoạt động công chứng |  |  |  |  | X |
| 99 | Thu thập dữ liệu Quản tài viên |  |  |  |  | X |
| 100 | Thu thập dữ liệu Doanh nghiệp quản lý, thanh lý tài sản |  |  |  |  | X |
| 101 | Thu thập dữ liệu Luật sư  Việt Nam |  |  |  |  | X |
| 102 | Thu thập dữ liệu Người được cấp chứng chỉ hành nghề luật sư |  |  |  |  | X |
| 103 | Thu thập dữ liệu Tổ chức hành nghề  luật sư Việt  Nam |  |  |  |  | X |
| 104 | Thu thập dữ liệu Luật sư nước ngoài |  |  |  |  | X |
| 105 | Thu thập dữ liệu Tổ chức hành nghề luật sư nước ngoài |  |  |  |  | X |
| 106 | Thu thập dữ liệu Trọng tài viên |  |  |  |  | X |
| 107 | Thu thập dữ liệu Trung tâm trọng tài |  |  |  |  | X |
| 108 | Thu thập dữ liệu Chi nhánh của tổ chức trọng tài |  |  |  |  | X |
| 109 | Thu thập dữ liệu Văn phòng đại diện của trung tâm trọng tài |  |  |  |  | X |
| 110 | Thu thập dữ liệu Hòa giải viên thương mại |  |  |  |  | X |
| 111 | Thu thập dữ liệu Trung tâm hòa giải thương mại |  |  |  |  | X |
| 112 | Thu thập dữ liệu Giám  định viên tư pháp |  |  |  |  | X |
| **I.2.5** | **Vụ Hợp tác quốc tế** | | | | | |
| **I.2.5.1** | **CSDL Hợp**  **tác quốc tế** | | | | | |
| 113 | Thu thập dữ liệu Thông tin điều ước quốc tế, thỏa thuận quốc tế |  |  |  |  | X |
| 114 | Thu thập dữ liệu Thông tin chương trình dự án |  |  |  |  | X |
| 115 | Thu thập dữ liệu Danh sách chuyên gia |  |  |  |  | X |
| 116 | Thu thập dữ liệu Thông tin hội nghị, hội thảo |  |  |  |  | X |
| 117 | Thu thập dữ liệu Thông tin sản phẩm nghiên cứu, truyền thông |  |  |  |  | X |
| 118 | Thu thập dữ liệu Thông tin Đoàn |  |  |  |  | X |
| **I.2.6** | **Cục Kế**  **hoạch - Tài chính** | | | | | |
| **I.2.6.1** | **Thu thập số liệu thống kê từ Phần mềm thống kê ngành Tư pháp phục**  **vụ chia sẻ dữ liệu mở theo Quyết định số 1459/QĐBTP ngày 15 tháng 5 năm 2025 của Bộ trưởng Bộ Tư pháp** | | | | | |
| 119 | Thu thập số liệu thống kê trong lĩnh vực Xây dựng văn bản quy phạm pháp luật theo Thông tư của Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 120 | Thu thập số liệu thống kê trong lĩnh vực Kiểm tra văn bản quy phạm pháp luật theo  Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 121 | Thu thập số liệu thống kê trong lĩnh vực Rà soát văn bản quy phạm pháp luật theo  Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 122 | Thu thập số liệu thống kê trong lĩnh vực Tổ chức và người làm công tác pháp chế theo Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 123 | Thu thập số liệu thống kê trong lĩnh vực Phổ biến, giáo dục pháp luật theo Thông tư của Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 124 | Thu thập số liệu thống kê trong lĩnh vực Hòa giải ở cơ sở theo Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 125 | Thu thập số liệu thống kê trong lĩnh vực Chuẩn tiếp cận pháp luật theo  Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 126 | Thu thập số liệu thống kê trong lĩnh vực Hộ tịch theo Thông tư của Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 127 | Thu thập số liệu thống kê trong lĩnh vực Chứng thực theo Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 128 | Thu thập số liệu thống kê trong lĩnh vực Lý lịch tư pháp theo Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 129 | Thu thập số liệu thống kê trong lĩnh vực Nuôi con nuôi theo  Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 130 | Thu thập số liệu thống kê trong lĩnh vực Trợ giúp pháp lý theo  Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 131 | Thu thập số liệu thống kê trong lĩnh vực Đăng ký giao dịch bảo đảm theo Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 132 | Thu thập số liệu thống kê trong lĩnh vực Luật sư theo Thông tư của Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 133 | Thu thập số liệu thống kê trong lĩnh vực Công chứng theo Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 134 | Thu thập số liệu thống kê trong lĩnh vực Giám định tư pháp theo Thông tư của Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 135 | Thu thập số liệu thống kê trong lĩnh vực Đấu giá tài sản theo Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 136 | Thu thập số liệu thống kê trong lĩnh vực Trọng tài thương mại theo Thông tư của Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 137 | Thu thập số liệu thống kê trong lĩnh vực Hòa giải thương mại theo Thông tư của Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 138 | Thu thập số liệu thống kê trong lĩnh vực Quản lý thanh lý tài sản theo Thông tư của  Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| 139 | Thu thập số liệu thống kê trong lĩnh vực Tương trợ tư pháp theo Thông tư của Bộ trưởng Bộ Tư pháp quy định một số nội dung về hoạt động thống kê của ngành Tư pháp |  |  |  |  | X |
| **II** | **QUY**  **TRÌNH ĐỐI SOÁT DỮ**  **LIỆU THU**  **THẬP** | | | | | |
| **II.1** | **Đối soát dữ**  **liệu từ Bộ**  **ngành ngoài** | | | | | |
| 140 | Đối soát tổng hợp các danh mục từ Bộ ngành ngoài (qua Trung tâm dữ liệu Quốc gia) |  |  |  |  | X |
| 141 | Đối soát tổng hợp dữ liệu về Thông tin Bản án, quyết định |  |  |  |  | X |
| **II.2** | **Đối soát dữ liệu từ các Hệ thống trong ngành** | | | | | |
| **II.2.1** | **Cục Hành**  **chính tư**  **pháp** | | | | | |
| **II.2.1.1** | **CSDL Hộ**  **tịch điện tử** | | | | | |
| 142 | Đối soát tổng hợp với CSDL Hộ  tịch điện tử |  |  |  |  | X |
| **II.2.1.2** | **Hệ thống quản lý hồ sơ quốc tịch** | | | | | |
| 143 | Đối soát tổng hợp với Hệ thống quản lý Bộ Tư Pháp hồ sơ quốc tịch |  |  |  |  | X |
| **II.2.2** | **Cục Quản lý thi hành án dân sự** | | | | | |
| **II.2.2.1** | **Cơ sở dữ liệu thi hành án dân sự** | | | | | |
| 144 | Đối soát tổng hợp với Cơ sở dữ liệu thi hành án dân sự |  |  |  |  | X |
| **II.2.3** | **Cục Đăng ký giao dịch**  **bảo đảm và**  **BTNN** | | | | | |
| **II.2.3.1** | **Cơ sở dữ**  **liệu về biện pháp bảo đảm** | | | | | |
| 145 | Đối soát tổng hợp với Cơ sở dữ liệu về biện pháp bảo đảm |  |  |  |  | X |
| **II.2.4** | **Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính** | | | | | |
| **II.2.4.1** | **CSDL quốc gia về pháp**  **luật** | | | | | |
| 146 | Đối soát tổng hợp với  CSDL quốc gia về pháp luật |  |  |  |  | X |
| **II.2.4.2** | **Cơ sở dữ liệu tương trợ tư pháp về dân sự** | | | | | |
| 147 | Đối soát tổng hợp với Cơ sở dữ liệu tương trợ tư pháp về dân sự |  |  |  |  | X |
| **II.2.4.3** | **Hệ thống thông tin trợ giúp pháp lý** | | | | | |
| 148 | Đối soát tổng hợp với Hệ thống thông  tin trợ giúp pháp lý |  |  |  |  | X |
| **II.2.4.4** | **CSDL phổ**  **biến, giáo dục pháp**  **luật và hoà giải cơ sở** | | | | | |
| 149 | Đối soát tổng hợp với Hệ thống thông  tin trợ giúp pháp lý |  |  |  |  | X |
| **II.2.5** | **Cục Bổ trợ tư pháp** | | | | | |
| **II.2.5.1** | **CSDL quản**  **lý đấu giá tài sản** | | | | | |
| 150 | Đối soát tổng hợp với  CSDL quản  lý đấu giá tài  sản |  |  |  |  | X |
| **II.2.6** | **Cục Kế**  **hoạch - Tài chính** | | | | | |
| **II.2.6.1** | **Đối soát số liệu thống kê từ Phần mềm thống kê ngành Tư pháp phục**  **vụ chia sẻ dữ liệu mở theo Quyết định số 1459/QĐBTP ngày 15 tháng 5 năm 2025 của Bộ trưởng Bộ Tư pháp** | | | | | |
| 151 | Đối soát tổng hợp với Phần mềm thống kê ngành Tư pháp |  |  |  |  | X |
| **III** | **QUY**  **TRÌNH XỬ**  **LÝ DỮ**  **LIỆU** | | | | | |
| **III.1** | **Thiết lập quy tắc xử lý dữ liệu danh mục từ Bộ ngành ngoài** | | | | | |
| 152 | Thiết lập quy tắc biến đổi dữ liệu Dữ liệu danh mục dùng chung thu  thập qua  TTDLQG | X |  |  |  |  |
| 153 | Thiết lập quy tắc biến đổi dữ liệu Bảo trợ xã hội và giảm nghèo - Hưởng trợ giúp xã hội | X |  |  |  |  |
| 154 | Thiết lập quy tắc biến đổi dữ liệu Bảo trợ xã hội và giảm nghèo - Hưởng trợ giúp xã hội | X |  |  |  |  |
| 155 | Thiết lập quy tắc biến đổi dữ liệu Bảo trợ xã hội và giảm nghèo - Thông tin người nghèo, cận nghèo | X |  |  |  |  |
| 156 | Thiết lập quy tắc biến đổi dữ liệu Bảo trợ xã hội và giảm nghèo - Người đơn thân | X |  |  |  |  |
| 157 | Thiết lập quy tắc biến đổi dữ liệu Bảo trợ xã hội và giảm nghèo - Trẻ em là đối tượng bảo trợ xã hội | X |  |  |  |  |
| 158 | Thiết lập quy tắc biến đổi dữ liệu Bảo trợ xã hội và giảm nghèo Người có HIV | X |  |  |  |  |
| 159 | Thiết lập quy tắc biến đổi dữ liệu Bảo trợ xã hội và giảm nghèo Người cao tuổi | X |  |  |  |  |
| 160 | Thiết lập quy tắc biến đổi dữ liệu Bảo trợ xã hội và giảm nghèo - Thông tin về người khuyết  tật | X |  |  |  |  |
| 161 | Thiết lập quy tắc biến đổi dữ liệu  Người có công - Hồ sơ công nhận người có công | X |  |  |  |  |
| 162 | Thiết lập quy tắc biến đổi dữ liệu  Người có công - Hồ sơ liệt sĩ: | X |  |  |  |  |
| 163 | Thiết lập quy tắc biến đổi dữ liệu  Người có công - Hồ sơ công nhận thân nhân người có công | X |  |  |  |  |
| 164 | Thiết lập quy tắc biến đổi dữ liệu Trẻ em -Trẻ em | X |  |  |  |  |
| 165 | Thiết lập quy tắc làm sạch Thông tin  Bản án, quyết định | X |  |  |  |  |
| 166 | Thiết lập quy tắc chuẩn hóa Thông tin  Bản án, quyết định | X |  |  |  |  |
| 167 | Thiết lập quy tắc biến đổi Thông tin  Bản án, quyết định | X |  |  |  |  |
| **III.2** | **Thiết lập quy tắc chuẩn hóa, làm sạch dữ liệu thu thập từ các Hệ**  **thống trong ngành** | | | | | |
| **III.2.1** | **Cục Hành**  **chính tư**  **pháp** | | | | | |
| **III.2.1.1** | **CSDL Hộ**  **tịch điện tử** | | | | | |
| 168 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ đăng ký khai sinh | X |  |  |  |  |
| 169 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ đăng ký khai sinh | X |  |  |  |  |
| 170 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ đăng ký khai sinh | X |  |  |  |  |
| 171 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ đăng ký kết hôn | X |  |  |  |  |
| 172 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ đăng ký kết hôn | X |  |  |  |  |
| 173 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ đăng ký kết hôn | X |  |  |  |  |
| 174 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ cấp Giấy xác nhận tình  trạng hôn nhân | X |  |  |  |  |
| 175 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ cấp Giấy xác nhận tình  trạng hôn nhân | X |  |  |  |  |
| 176 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ cấp Giấy xác nhận tình  trạng hôn nhân | X |  |  |  |  |
| 177 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ đăng ký khai tử | X |  |  |  |  |
| 178 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ đăng ký khai tử | X |  |  |  |  |
| 179 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ đăng ký khai tử | X |  |  |  |  |
| 180 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ đăng ký nhận cha, mẹ, con | X |  |  |  |  |
| 181 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ đăng ký nhận cha, mẹ, con | X |  |  |  |  |
| 182 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ đăng ký nhận cha, mẹ, con | X |  |  |  |  |
| 183 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ đăng ký nuôi con nuôi | X |  |  |  |  |
| 184 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ đăng ký nuôi con nuôi | X |  |  |  |  |
| 185 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ đăng ký nuôi con nuôi | X |  |  |  |  |
| 186 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ đăng ký giám hộ | X |  |  |  |  |
| 187 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ đăng ký giám hộ | X |  |  |  |  |
| 188 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ đăng ký giám hộ | X |  |  |  |  |
| 189 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ đăng ký chấm dứt giám hộ | X |  |  |  |  |
| 190 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ đăng ký chấm dứt giám hộ | X |  |  |  |  |
| 191 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ đăng ký chấm dứt giám hộ | X |  |  |  |  |
| 192 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ đăng ký thay đổi, cải chính, bổ sung thông  tin hộ tịch, xác định lại dân tộc | X |  |  |  |  |
| 193 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ đăng ký thay đổi, cải chính, bổ sung thông  tin hộ tịch, xác định lại dân tộc | X |  |  |  |  |
| 194 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ đăng ký thay đổi, cải chính, bổ sung thông  tin hộ tịch, xác định lại dân tộc | X |  |  |  |  |
| 195 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ đăng ký giám sát việc giám hộ | X |  |  |  |  |
| 196 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ đăng ký giám sát việc giám hộ | X |  |  |  |  |
| 197 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ đăng ký giám sát việc giám hộ | X |  |  |  |  |
| 198 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ đăng ký chấm dứt giám sát việc giám hộ | X |  |  |  |  |
| 199 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ đăng ký chấm dứt giám sát việc giám hộ | X |  |  |  |  |
| 200 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ đăng ký chấm dứt giám sát việc giám hộ | X |  |  |  |  |
| 201 | Thiết lập quy tắc làm sạch Bộ dữ liệu hồ sơ ghi vào sổ việc ly hôn/hủy việc kết hôn đã thực hiện tại cơ quan có thẩm quyền của nước ngoài (ghi chú ly hôn) | X |  |  |  |  |
| 202 | Thiết lập quy tắc chuẩn hóa Bộ dữ liệu hồ sơ ghi vào sổ việc ly hôn/hủy việc kết hôn đã thực hiện tại cơ quan có thẩm quyền của nước ngoài (ghi chú ly hôn) | X |  |  |  |  |
| 203 | Thiết lập quy tắc biến đổi Bộ dữ liệu hồ sơ ghi vào sổ việc ly hôn/hủy việc kết hôn đã thực hiện tại cơ quan có thẩm quyền của nước ngoài (ghi chú ly hôn) | X |  |  |  |  |
| **III.2.1.2** | **Hệ thống quản lý hồ sơ quốc tịch** | | | | | |
| 204 | Thiết lập quy tắc làm sạch Nhập Quốc  tịch | X |  |  |  |  |
| 205 | Thiết lập quy tắc chuẩn hóa Nhập Quốc  tịch | X |  |  |  |  |
| 206 | Thiết lập quy tắc biến đổi Nhập Quốc  tịch | X |  |  |  |  |
| 207 | Thiết lập quy tắc làm sạch Thôi Quốc tịch | X |  |  |  |  |
| 208 | Thiết lập quy tắc chuẩn hóa Thôi Quốc tịch | X |  |  |  |  |
| 209 | Thiết lập quy tắc biến đổi Thôi Quốc tịch | X |  |  |  |  |
| 210 | Thiết lập quy tắc làm sạch Trở lại Quốc tịch | X |  |  |  |  |
| 211 | Thiết lập quy tắc chuẩn hóa Trở lại Quốc tịch | X |  |  |  |  |
| 212 | Thiết lập quy tắc biến đổi Trở lại Quốc tịch | X |  |  |  |  |
| **III.2.2** | **Cục Quản lý thi hành án dân sự** | | | | | |
| **III.2.2.1** | **Cơ sở dữ liệu thi hành án dân sự** | | | | | |
| 213 | Thiết lập quy tắc làm sạch Yêu cầu thi hành án của cá nhân, cơ quan, tổ chức | X |  |  |  |  |
| 214 | Thiết lập quy tắc chuẩn hóa Yêu cầu thi hành án của cá nhân, cơ quan, tổ chức | X |  |  |  |  |
| 215 | Thiết lập quy tắc biến đổi Yêu cầu thi hành án của cá nhân, cơ quan, tổ chức | X |  |  |  |  |
| 216 | Thiết lập quy tắc làm sạch Quyết định thi hành án dân sự | X |  |  |  |  |
| 217 | Thiết lập quy tắc chuẩn hóa Quyết định thi hành án dân sự | X |  |  |  |  |
| 218 | Thiết lập quy tắc biến đổi Quyết định thi hành án dân sự | X |  |  |  |  |
| 219 | Thiết lập quy tắc làm sạch Người phải thi hành án, người được thi hành án, người có quyền lợi  nghĩa vụ liên quan | X |  |  |  |  |
| 220 | Thiết lập quy tắc chuẩn hóa Người phải thi hành án, người được thi hành án, người có quyền lợi  nghĩa vụ liên quan | X |  |  |  |  |
| 221 | Thiết lập quy tắc biến đổi Người phải thi hành án, người được thi hành án, người có quyền lợi  nghĩa vụ liên quan | X |  |  |  |  |
| 222 | Thiết lập quy tắc làm sạch Nghĩa vụ thi hành án | X |  |  |  |  |
| 223 | Thiết lập quy tắc chuẩn hóa Nghĩa vụ thi hành án | X |  |  |  |  |
| 224 | Thiết lập quy tắc biến đổi Nghĩa vụ thi hành án | X |  |  |  |  |
| 225 | Thiết lập quy tắc làm sạch Trạng thái thi hành án | X |  |  |  |  |
| 226 | Thiết lập quy tắc chuẩn hóa Trạng thái thi hành án | X |  |  |  |  |
| 227 | Thiết lập quy tắc biến đổi Trạng thái thi hành án | X |  |  |  |  |
| 228 | Thiết lập quy tắc làm sạch Tài sản thi hành án | X |  |  |  |  |
| 229 | Thiết lập quy tắc chuẩn hóa Tài sản thi hành án | X |  |  |  |  |
| 230 | Thiết lập quy tắc biến đổi Tài sản thi hành án | X |  |  |  |  |
| 231 | Thiết lập quy tắc làm sạch Xác minh điều kiện trong thi hành án dân sự | X |  |  |  |  |
| 232 | Thiết lập quy tắc chuẩn hóa Xác minh điều kiện trong thi hành án dân sự | X |  |  |  |  |
| 233 | Thiết lập quy  tắc biến đổi Xác minh điều kiện trong thi hành án dân sự | X |  |  |  |  |
| 234 | Thiết lập quy tắc làm sạch  Cưỡng chế thi hành án trong thi hành án dân sự | X |  |  |  |  |
| 235 | Thiết lập quy tắc chuẩn hóa Cưỡng chế thi hành án trong thi hành án dân sự | X |  |  |  |  |
| 236 | Thiết lập quy tắc biến đổi  Cưỡng chế thi hành án trong thi hành án dân sự | X |  |  |  |  |
| 237 | Thiết lập quy tắc làm sạch Áp dụng biện pháp bảo đảm trong thi hành án dân sự | X |  |  |  |  |
| 238 | Thiết lập quy tắc chuẩn hóa Áp dụng biện pháp bảo đảm trong thi hành án dân sự | X |  |  |  |  |
| 239 | Thiết lập quy tắc biến đổi Áp dụng biện pháp bảo đảm trong thi hành án dân sự | X |  |  |  |  |
| 240 | Thiết lập quy tắc làm sạch Chứng từ nghiệp vụ trong thi hành án dân sự | X |  |  |  |  |
| 241 | Thiết lập quy tắc chuẩn hóa Chứng từ nghiệp vụ trong thi hành án dân sự | X |  |  |  |  |
| 242 | Thiết lập quy tắc biến đổi Chứng từ nghiệp vụ trong thi hành án dân sự | X |  |  |  |  |
| 243 | Thiết lập quy tắc làm sạch Biên lai thu tiền thi hành án dân sự | X |  |  |  |  |
| 244 | Thiết lập quy tắc chuẩn hóa Biên lai thu tiền thi hành án dân sự | X |  |  |  |  |
| 245 | Thiết lập quy tắc biến đổi Biên lai thu tiền thi hành án dân sự | X |  |  |  |  |
| 246 | Thiết lập quy tắc làm sạch Vật chứng  trong thi hành án dân sự | X |  |  |  |  |
| 247 | Thiết lập quy tắc chuẩn hóa Vật chứng  trong thi hành án dân sự | X |  |  |  |  |
| 248 | Thiết lập quy tắc biến đổi Vật chứng  trong thi hành án dân sự | X |  |  |  |  |
| 249 | Thiết lập quy tắc làm sạch Thẩm định giá tài sản trong thi hành án dân sự | X |  |  |  |  |
| 250 | Thiết lập quy tắc chuẩn hóa Thẩm định giá tài sản trong thi hành án dân sự | X |  |  |  |  |
| 251 | Thiết lập quy tắc biến đổi Thẩm định giá tài sản trong thi hành án dân sự | X |  |  |  |  |
| 252 | Thiết lập quy tắc làm sạch Đấu giá tài sản trong thi hành án dân sự | X |  |  |  |  |
| 253 | Thiết lập quy tắc chuẩn hóa Đấu giá tài sản trong thi hành án dân sự | X |  |  |  |  |
| 254 | Thiết lập quy tắc biến đổi Đấu giá tài sản trong thi hành án dân sự | X |  |  |  |  |
| 255 | Thiết lập quy tắc làm sạch Giải quyết khiếu nại, tố cáo trong thi hành án dân sự | X |  |  |  |  |
| 256 | Thiết lập quy tắc chuẩn hóa Giải quyết khiếu nại, tố cáo trong thi hành án dân sự | X |  |  |  |  |
| 257 | Thiết lập quy tắc biến đổi Giải quyết khiếu nại, tố cáo trong thi hành án dân sự | X |  |  |  |  |
| 258 | Thiết lập quy tắc làm sạch Hướng dẫn nghiệp vụ trong thi hành án dân sự | X |  |  |  |  |
| 259 | Thiết lập quy tắc chuẩn hóa Hướng dẫn nghiệp vụ trong thi hành án dân sự | X |  |  |  |  |
| 260 | Thiết lập quy tắc biến đổi  Hướng dẫn nghiệp vụ trong thi hành án dân sự | X |  |  |  |  |
| **III.2.3** | **Cục Đăng ký giao dịch**  **bảo đảm và**  **BTNN** | | | | | |
| **III.2.3.1** | **Cơ sở dữ**  **liệu về biện**  **pháp bảo đảm** | | | | | |
| 261 | Thiết lập quy tắc làm sạch Thông tin chung (Bao gồm người đăng ký và Hợp đồng bảo đảm) | X |  |  |  |  |
| 262 | Thiết lập quy tắc chuẩn hóa Thông tin chung (Bao gồm người đăng ký và Hợp đồng bảo đảm) | X |  |  |  |  |
| 263 | Thiết lập quy tắc biến đổi Thông tin chung (Bao gồm người đăng ký và Hợp đồng bảo đảm) | X |  |  |  |  |
| 264 | Thiết lập quy tắc làm sạch Bên bảo đảm | X |  |  |  |  |
| 265 | Thiết lập quy tắc chuẩn hóa Bên bảo đảm | X |  |  |  |  |
| 266 | Thiết lập quy tắc biến đổi Bên bảo đảm | X |  |  |  |  |
| 267 | Thiết lập quy tắc làm sạch Bên nhận bảo đảm | X |  |  |  |  |
| 268 | Thiết lập quy tắc chuẩn hóa Bên nhận bảo đảm | X |  |  |  |  |
| 269 | Thiết lập quy tắc biến đổi Bên nhận bảo đảm | X |  |  |  |  |
| 270 | Thiết lập quy tắc làm sạch Tài sản bảo  đảm | X |  |  |  |  |
| 271 | Thiết lập quy tắc chuẩn hóa Tài sản bảo  đảm | X |  |  |  |  |
| 272 | Thiết lập quy tắc biến đổi Tài sản bảo  đảm | X |  |  |  |  |
| **III.2.4** | **Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính** | | | | | |
| **III.2.4.1** | **CSDL quốc gia về pháp**  **luật** | | | | | |
| 273 | Thiết lập quy tắc làm sạch Văn bản quy phạm pháp luật | X |  |  |  |  |
| 274 | Thiết lập quy tắc chuẩn hóa Văn bản quy phạm pháp luật | X |  |  |  |  |
| 275 | Thiết lập quy tắc biến đổi Văn bản quy phạm pháp luật | X |  |  |  |  |
| 276 | Thiết lập quy tắc làm sạch Nội dung của văn bản quy phạm pháp luật | X |  |  |  |  |
| 277 | Thiết lập quy tắc chuẩn hóa Nội dung của văn bản quy phạm pháp luật | X |  |  |  |  |
| 278 | Thiết lập quy tắc biến đổi  Nội dung của văn bản quy phạm pháp luật | X |  |  |  |  |
| 279 | Thiết lập quy tắc làm sạch Quan hệ giữa các điều khoản trong các văn bản quy phạm pháp luật | X |  |  |  |  |
| 280 | Thiết lập quy tắc chuẩn hóa Quan hệ giữa các điều khoản trong các văn bản quy phạm pháp luật | X |  |  |  |  |
| 281 | Thiết lập quy tắc biến đổi  Quan hệ giữa các điều khoản trong các văn bản quy phạm pháp luật | X |  |  |  |  |
| 282 | Thiết lập quy tắc làm sạch Văn bản hợp nhất | X |  |  |  |  |
| 283 | Thiết lập quy tắc chuẩn hóa Văn bản hợp nhất | X |  |  |  |  |
| 284 | Thiết lập quy tắc biến đổi Văn bản hợp nhất | X |  |  |  |  |
| 285 | Thiết lập quy tắc làm sạch Hệ thống hóa văn bản quy phạm pháp luật | X |  |  |  |  |
| 286 | Thiết lập quy tắc chuẩn hóa Hệ thống hóa văn bản quy phạm pháp luật | X |  |  |  |  |
| 287 | Thiết lập quy tắc biến đổi  Hệ thống hóa văn bản quy phạm pháp luật | X |  |  |  |  |
| **III.2.4.2** | **Cơ sở dữ liệu tương trợ tư pháp về dân sự** | | | | | |
| 288 | Thiết lập quy tắc làm sạch Hồ sơ ủy thác tư pháp đến | X |  |  |  |  |
| 289 | Thiết lập quy tắc chuẩn hóa Hồ sơ ủy thác tư pháp đến | X |  |  |  |  |
| 290 | Thiết lập quy tắc biến đổi Hồ sơ ủy thác tư pháp đến | X |  |  |  |  |
| 291 | Thiết lập quy tắc làm sạch Hồ sơ ủy thác tư pháp đi | X |  |  |  |  |
| 292 | Thiết lập quy tắc chuẩn hóa Hồ sơ ủy thác tư pháp đi | X |  |  |  |  |
| 293 | Thiết lập quy tắc biến đổi Hồ sơ ủy thác tư pháp đi | X |  |  |  |  |
| **III.2.4.3** | **Hệ thống thông tin trợ giúp pháp lý** | | | | | |
| 294 | Thiết lập quy tắc làm sạch Tổ chức thực hiện trợ giúp pháp lý | X |  |  |  |  |
| 295 | Thiết lập quy tắc chuẩn hóa Tổ chức thực hiện trợ giúp pháp lý | X |  |  |  |  |
| 296 | Thiết lập quy tắc biến đổi Tổ chức thực hiện trợ giúp pháp lý | X |  |  |  |  |
| 297 | Thiết lập quy tắc làm sạch Tổ chức đăng ký tham gia trợ giúp pháp lý | X |  |  |  |  |
| 298 | Thiết lập quy tắc chuẩn hóa Tổ chức đăng ký tham gia trợ giúp pháp lý | X |  |  |  |  |
| 299 | Thiết lập quy tắc biến đổi Tổ chức đăng ký tham gia trợ giúp pháp lý | X |  |  |  |  |
| 300 | Thiết lập quy tắc làm sạch Thông tin văn bản cử người thực hiện trợ giúp pháp lý | X |  |  |  |  |
| 301 | Thiết lập quy tắc chuẩn hóa Thông tin văn bản cử người thực hiện trợ giúp pháp lý | X |  |  |  |  |
| 302 | Thiết lập quy tắc biến đổi Thông tin văn bản cử người thực hiện trợ giúp pháp lý | X |  |  |  |  |
| 303 | Thiết lập quy tắc làm sạch Trung tâm TGPL nhà nước | X |  |  |  |  |
| 304 | Thiết lập quy tắc chuẩn hóa Trung tâm TGPL nhà nước | X |  |  |  |  |
| 305 | Thiết lập quy  tắc biến đổi Trung tâm TGPL nhà nước | X |  |  |  |  |
| 306 | Thiết lập quy tắc làm sạch  Chi nhánh  TGPL | X |  |  |  |  |
| 307 | Thiết lập quy tắc chuẩn hóa  Chi nhánh  TGPL | X |  |  |  |  |
| 308 | Thiết lập quy tắc biến đổi  Chi nhánh  TGPL | X |  |  |  |  |
| 309 | Thiết lập quy tắc làm sạch Người thực hiện TGPL | X |  |  |  |  |
| 310 | Thiết lập quy tắc chuẩn hóa Người thực hiện TGPL | X |  |  |  |  |
| 311 | Thiết lập quy tắc biến đổi Người thực hiện TGPL | X |  |  |  |  |
| **III.2.4.4** | **CSDL phổ**  **biến, giáo dục pháp**  **luật và hoà giải cơ sở** | | | | | |
| 312 | Thiết lập quy tắc làm sạch Báo cáo viên pháp luật | X |  |  |  |  |
| 313 | Thiết lập quy tắc chuẩn hóa Báo cáo viên pháp luật | X |  |  |  |  |
| 314 | Thiết lập quy tắc biến đổi Báo cáo viên pháp luật | X |  |  |  |  |
| 315 | Thiết lập quy tắc làm sạch Tuyên truyền viên pháp luật | X |  |  |  |  |
| 316 | Thiết lập quy tắc chuẩn hóa Tuyên truyền viên pháp luật | X |  |  |  |  |
| 317 | Thiết lập quy tắc biến đổi Tuyên truyền viên pháp luật | X |  |  |  |  |
| 318 | Thiết lập quy tắc làm sạch Chương trình, kế hoạch về phổ biến, giáo dục pháp luật | X |  |  |  |  |
| 319 | Thiết lập quy tắc chuẩn hóa Chương trình, kế hoạch về phổ biến, giáo dục pháp luật | X |  |  |  |  |
| 320 | Thiết lập quy tắc biến đổi Chương trình, kế hoạch về phổ biến, giáo dục pháp luật | X |  |  |  |  |
| 321 | Thiết lập quy tắc làm sạch Hội đồng phối hợp phổ biến, giáo dục pháp luật | X |  |  |  |  |
| 322 | Thiết lập quy tắc chuẩn hóa Hội đồng phối hợp phổ biến, giáo dục pháp luật | X |  |  |  |  |
| 323 | Thiết lập quy tắc biến đổi Hội đồng phối hợp phổ biến, giáo dục pháp luật | X |  |  |  |  |
| 324 | Thiết lập quy tắc làm sạch  Đề án | X |  |  |  |  |
| 325 | Thiết lập quy tắc chuẩn hóa  Đề án | X |  |  |  |  |
| 326 | Thiết lập quy tắc biến đổi  Đề án | X |  |  |  |  |
| 327 | Thiết lập quy tắc làm sạch Hội nghị tập huấn (trực tuyến, trực tiếp) | X |  |  |  |  |
| 328 | Thiết lập quy tắc chuẩn hóa Hội nghị tập huấn (trực tuyến, trực tiếp) | X |  |  |  |  |
| 329 | Thiết lập quy tắc biến đổi Hội nghị tập huấn (trực tuyến, trực tiếp) | X |  |  |  |  |
| 330 | Thiết lập quy tắc làm sạch  Hội thảo | X |  |  |  |  |
| 331 | Thiết lập quy tắc chuẩn hóa  Hội thảo | X |  |  |  |  |
| 332 | Thiết lập quy tắc biến đổi Hội thảo | X |  |  |  |  |
| 333 | Thiết lập quy tắc làm sạch Tổ hoà giải | X |  |  |  |  |
| 334 | Thiết lập quy tắc chuẩn hóa Tổ hoà giải | X |  |  |  |  |
| 335 | Thiết lập quy tắc biến đổi Tổ hoà giải | X |  |  |  |  |
| 336 | Thiết lập quy tắc làm sạch Hoà giải viên | X |  |  |  |  |
| 337 | Thiết lập quy tắc chuẩn hóa Hoà giải viên | X |  |  |  |  |
| 338 | Thiết lập quy tắc biến đổi Hoà giải viên | X |  |  |  |  |
| 339 | Thiết lập quy tắc làm sạch Vụ việc hoà giải | X |  |  |  |  |
| 340 | Thiết lập quy tắc chuẩn hóa Vụ việc hoà giải | X |  |  |  |  |
| 341 | Thiết lập quy tắc biến đổi Vụ việc hoà giải | X |  |  |  |  |
| 342 | Thiết lập quy tắc làm sạch Tập huấn viên | X |  |  |  |  |
| 343 | Thiết lập quy tắc chuẩn hóa Tập huấn viên | X |  |  |  |  |
| 344 | Thiết lập quy tắc biến đổi Tập huấn viên | X |  |  |  |  |
| 345 | Thiết lập quy tắc làm sạch Kinh phí phổ biến giáo dục pháp luật | X |  |  |  |  |
| 346 | Thiết lập quy tắc chuẩn hóa Kinh phí phổ biến giáo dục pháp luật | X |  |  |  |  |
| 347 | Thiết lập quy tắc biến đổi Kinh phí phổ biến giáo dục pháp luật | X |  |  |  |  |
| 348 | Thiết lập quy tắc làm sạch Tiêu chí, chỉ tiêu tiếp cận pháp luật | X |  |  |  |  |
| 349 | Thiết lập quy tắc chuẩn hóa Tiêu chí, chỉ tiêu tiếp cận pháp luật | X |  |  |  |  |
| 350 | Thiết lập quy tắc biến đổi Tiêu chí, chỉ tiêu tiếp cận pháp luật | X |  |  |  |  |
| 351 | Thiết lập quy tắc làm sạch Đánh giá cấp xã đạt chuẩn tiếp cận pháp  luật | X |  |  |  |  |
| 352 | Thiết lập quy tắc chuẩn hóa Đánh giá cấp xã đạt chuẩn tiếp cận pháp  luật | X |  |  |  |  |
| 353 | Thiết lập quy tắc biến đổi Đánh giá cấp xã đạt chuẩn tiếp cận pháp  luật | X |  |  |  |  |
| 354 | Thiết lập quy tắc làm sạch Cuộc  PBGDPL | X |  |  |  |  |
| 355 | Thiết lập quy tắc chuẩn hóa  Cuộc  PBGDPL | X |  |  |  |  |
| 356 | Thiết lập quy tắc biến đổi Cuộc  PBGDPL | X |  |  |  |  |
| 357 | Thiết lập quy tắc làm sạch Cuộc thi tìm hiểu về pháp luật | X |  |  |  |  |
| 358 | Thiết lập quy tắc chuẩn hóa Cuộc thi tìm hiểu về pháp luật | X |  |  |  |  |
| 359 | Thiết lập quy tắc biến đổi Cuộc thi tìm hiểu về pháp luật | X |  |  |  |  |
| **III.2.5** | **Cục Bổ trợ tư pháp** | | | | | |
| **III.2.5.1** | **CSDL quản**  **lý đấu giá tài sản** | | | | | |
| 360 | Thiết lập quy tắc làm sạch Đấu giá viên | X |  |  |  |  |
| 361 | Thiết lập quy tắc chuẩn hóa Đấu giá viên | X |  |  |  |  |
| 362 | Thiết lập quy tắc biến đổi Đấu giá viên | X |  |  |  |  |
| 363 | Thiết lập quy tắc làm sạch Tổ chức hành nghề đấu giá | X |  |  |  |  |
| 364 | Thiết lập quy tắc chuẩn hóa Tổ chức hành nghề đấu giá | X |  |  |  |  |
| 365 | Thiết lập quy tắc biến đổi Tổ chức hành nghề đấu giá | X |  |  |  |  |
| 366 | Thiết lập quy tắc làm sạch Người có tài sản đấu giá | X |  |  |  |  |
| 367 | Thiết lập quy tắc chuẩn hóa Người có tài sản đấu giá | X |  |  |  |  |
| 368 | Thiết lập quy tắc biến đổi Người có tài sản đấu giá | X |  |  |  |  |
| 369 | Thiết lập quy tắc làm sạch Thông tin việc đấu giá | X |  |  |  |  |
| 370 | Thiết lập quy tắc chuẩn hóa Thông tin việc đấu giá | X |  |  |  |  |
| 371 | Thiết lập quy tắc biến đổi Thông tin việc đấu giá | X |  |  |  |  |
| 372 | Thiết lập quy tắc làm sạch Tài sản đấu giá | X |  |  |  |  |
| 373 | Thiết lập quy tắc chuẩn hóa Tài sản đấu giá | X |  |  |  |  |
| 374 | Thiết lập quy tắc biến đổi Tài sản đấu giá | X |  |  |  |  |
| 375 | Thiết lập quy tắc làm sạch Công chứng viên | X |  |  |  |  |
| 376 | Thiết lập quy tắc chuẩn hóa Công chứng viên | X |  |  |  |  |
| 377 | Thiết lập quy tắc biến đổi Công chứng viên | X |  |  |  |  |
| 378 | Thiết lập quy tắc làm sạch Thông tin ngăn chặn | X |  |  |  |  |
| 379 | Thiết lập quy tắc chuẩn hóa Thông tin ngăn chặn | X |  |  |  |  |
| 380 | Thiết lập quy tắc biến đổi Thông tin ngăn chặn | X |  |  |  |  |
| 381 | Thiết lập quy tắc làm sạch Tổ chức hành nghề công chứng | X |  |  |  |  |
| 382 | Thiết lập quy tắc chuẩn hóa Tổ chức hành nghề công chứng | X |  |  |  |  |
| 383 | Thiết lập quy tắc biến đổi Tổ chức hành nghề công chứng | X |  |  |  |  |
| 384 | Thiết lập quy tắc làm sạch Tài sản trong giao dịch công chứng | X |  |  |  |  |
| 385 | Thiết lập quy tắc chuẩn hóa Tài sản trong giao dịch công chứng | X |  |  |  |  |
| 386 | Thiết lập quy tắc biến đổi Tài sản trong giao dịch công chứng | X |  |  |  |  |
| 387 | Thiết lập quy tắc làm sạch Kết quả hoạt động công chứng | X |  |  |  |  |
| 388 | Thiết lập quy tắc chuẩn hóa Kết quả hoạt động công chứng | X |  |  |  |  |
| 389 | Thiết lập quy tắc biến đổi Kết quả hoạt động công chứng | X |  |  |  |  |
| 390 | Thiết lập quy tắc làm sạch Quản tài viên | X |  |  |  |  |
| 391 | Thiết lập quy tắc chuẩn hóa Quản tài viên | X |  |  |  |  |
| 392 | Thiết lập quy tắc biến đổi Quản tài viên | X |  |  |  |  |
| 393 | Thiết lập quy  tắc làm sạch Doanh nghiệp quản lý, thanh lý tài sản | X |  |  |  |  |
| 394 | Thiết lập quy  tắc chuẩn hóa Doanh nghiệp quản lý, thanh lý tài sản | X |  |  |  |  |
| 395 | Thiết lập quy  tắc biến đổi  Doanh nghiệp quản lý, thanh lý tài sản | X |  |  |  |  |
| 396 | Thiết lập quy tắc làm sạch Luật sư Việt  Nam | X |  |  |  |  |
| 397 | Thiết lập quy tắc chuẩn hóa Luật sư Việt  Nam | X |  |  |  |  |
| 398 | Thiết lập quy tắc biến đổi Luật sư Việt  Nam | X |  |  |  |  |
| 399 | Thiết lập quy tắc làm sạch Người được cấp chứng chỉ hành nghề luật sư | X |  |  |  |  |
| 400 | Thiết lập quy tắc chuẩn hóa Người được cấp chứng chỉ hành nghề luật sư | X |  |  |  |  |
| 401 | Thiết lập quy tắc biến đổi Người được cấp chứng chỉ hành nghề luật sư | X |  |  |  |  |
| 402 | Thiết lập quy tắc làm sạch Tổ chức hành nghề luật sư  Việt Nam | X |  |  |  |  |
| 403 | Thiết lập quy tắc chuẩn hóa Tổ chức hành nghề luật sư  Việt Nam | X |  |  |  |  |
| 404 | Thiết lập quy tắc biến đổi Tổ chức hành nghề luật sư  Việt Nam | X |  |  |  |  |
| 405 | Thiết lập quy tắc làm sạch Luật sư nước ngoài | X |  |  |  |  |
| 406 | Thiết lập quy tắc chuẩn hóa Luật sư nước ngoài | X |  |  |  |  |
| 407 | Thiết lập quy tắc biến đổi Luật sư nước ngoài | X |  |  |  |  |
| 408 | Thiết lập quy tắc làm sạch Tổ chức hành nghề luật sư nước ngoài | X |  |  |  |  |
| 409 | Thiết lập quy tắc chuẩn hóa Tổ chức hành nghề luật sư nước ngoài | X |  |  |  |  |
| 410 | Thiết lập quy tắc biến đổi Tổ chức hành nghề luật sư nước ngoài | X |  |  |  |  |
| 411 | Thiết lập quy tắc làm sạch Trọng tài viên | X |  |  |  |  |
| 412 | Thiết lập quy tắc chuẩn hóa Trọng tài viên | X |  |  |  |  |
| 413 | Thiết lập quy tắc biến đổi Trọng tài viên | X |  |  |  |  |
| 414 | Thiết lập quy tắc làm sạch Trung tâm trọng tài | X |  |  |  |  |
| 415 | Thiết lập quy tắc chuẩn hóa Trung tâm trọng tài | X |  |  |  |  |
| 416 | Thiết lập quy  tắc biến đổi Trung tâm trọng tài | X |  |  |  |  |
| 417 | Thiết lập quy tắc làm sạch Chi nhánh của tổ chức trọng tài | X |  |  |  |  |
| 418 | Thiết lập quy tắc chuẩn hóa Chi nhánh của tổ chức trọng tài | X |  |  |  |  |
| 419 | Thiết lập quy tắc biến đổi Chi nhánh của tổ chức trọng tài | X |  |  |  |  |
| 420 | Thiết lập quy tắc làm sạch Văn phòng đại diện của trung tâm trọng tài | X |  |  |  |  |
| 421 | Thiết lập quy tắc chuẩn hóa Văn phòng đại diện của trung tâm trọng tài | X |  |  |  |  |
| 422 | Thiết lập quy tắc biến đổi Văn phòng đại diện của trung tâm trọng tài | X |  |  |  |  |
| 423 | Thiết lập quy tắc làm sạch Hòa giải viên thương mại | X |  |  |  |  |
| 424 | Thiết lập quy tắc chuẩn hóa Hòa giải viên thương mại | X |  |  |  |  |
| 425 | Thiết lập quy tắc biến đổi Hòa giải viên thương mại | X |  |  |  |  |
| 426 | Thiết lập quy tắc làm sạch Trung tâm hòa giải thương mại | X |  |  |  |  |
| 427 | Thiết lập quy tắc chuẩn hóa Trung tâm hòa giải thương mại | X |  |  |  |  |
| 428 | Thiết lập quy  tắc biến đổi Trung tâm hòa giải thương mại | X |  |  |  |  |
| 429 | Thiết lập quy tắc làm sạch Giám định viên tư pháp | X |  |  |  |  |
| 430 | Thiết lập quy tắc chuẩn hóa Giám định viên tư pháp | X |  |  |  |  |
| 431 | Thiết lập quy tắc biến đổi Giám định viên tư pháp | X |  |  |  |  |
| 432 | Thiết lập quy tắc làm sạch Tổ chức giám định tư pháp | X |  |  |  |  |
| 433 | Thiết lập quy tắc chuẩn hóa Tổ chức giám định tư pháp | X |  |  |  |  |
| 434 | Thiết lập quy tắc biến đổi Tổ chức giám định tư pháp | X |  |  |  |  |
| **III.2.6** | **Vụ Hợp tác quốc tế** | | | | | |
| **III.2.5.1** | **CSDL Hợp**  **tác quốc tế** | | | | | |
| 435 | Thiết lập quy tắc làm sạch Thông tin điều ước quốc tế, thỏa thuận quốc tế | X |  |  |  |  |
| 436 | Thiết lập quy tắc chuẩn hóa Thông tin điều ước quốc tế, thỏa thuận quốc tế | X |  |  |  |  |
| 437 | Thiết lập quy tắc biến đổi Thông tin điều ước quốc tế, thỏa thuận quốc tế | X |  |  |  |  |
| 438 | Thiết lập quy tắc làm sạch Thông tin chương trình dự án | X |  |  |  |  |
| 439 | Thiết lập quy tắc chuẩn hóa Thông tin chương trình dự án | X |  |  |  |  |
| 440 | Thiết lập quy tắc biến đổi Thông tin chương trình dự án | X |  |  |  |  |
| 441 | Thiết lập quy tắc làm sạch Danh sách chuyên gia | X |  |  |  |  |
| 442 | Thiết lập quy tắc chuẩn hóa Danh sách chuyên gia | X |  |  |  |  |
| 443 | Thiết lập quy  tắc biến đổi Danh sách chuyên gia | X |  |  |  |  |
| 444 | Thiết lập quy tắc làm sạch Thông tin hội nghị, hội thảo | X |  |  |  |  |
| 445 | Thiết lập quy tắc chuẩn hóa Thông tin hội nghị, hội thảo | X |  |  |  |  |
| 446 | Thiết lập quy tắc biến đổi Thông tin hội nghị, hội thảo | X |  |  |  |  |
| 447 | Thiết lập quy tắc làm sạch Thông tin sản phẩm nghiên cứu, truyền thông | X |  |  |  |  |
| 448 | Thiết lập quy tắc chuẩn hóa Thông tin sản phẩm nghiên cứu, truyền thông | X |  |  |  |  |
| 449 | Thiết lập quy tắc biến đổi Thông tin sản phẩm nghiên cứu, truyền thông | X |  |  |  |  |
| 450 | Thiết lập quy tắc làm sạch Thông tin Đoàn | X |  |  |  |  |
| 451 | Thiết lập quy tắc chuẩn hóa Thông tin Đoàn | X |  |  |  |  |
| 452 | Thiết lập quy tắc biến đổi Thông tin Đoàn | X |  |  |  |  |
| **IV** | **QUY**  **TRÌNH**  **QUẢN LÝ DANH MỤC DÙNG**  **CHUNG** | | | | | |
| **IV.1** | **Thiết lập danh mục** | | | | | |
| 453 | Thiết lập danh sách các danh mục | X |  |  |  |  |
| 454 | Thiết lập cấu trúc danh mục | X |  |  |  |  |
| 455 | Thiết lập quan hệ giữa các danh mục | X |  |  |  |  |
| 456 | Thiết lập phiên bản danh mục | X |  |  |  |  |
| 457 | Phê duyệt danh sách danh mục |  | X |  |  |  |
| 458 | Phê duyệt cấu trúc danh mục |  | X |  |  |  |
| 459 | Phê duyệt phiên bản danh mục |  | X |  |  |  |
| 460 | Hết hiệu lực danh mục | X |  |  |  |  |
| 461 | Phê duyệt hết hiệu lực danh  mục |  | X |  |  |  |
| **IV.2** | **Biên tập dữ liệu danh mục và công khai danh**  **mục** | | | | | |
| 462 | Biên tập danh  mục | X |  |  |  |  |
| 463 | Phê duyệt danh mục cập nhật | X |  |  |  |  |
| 464 | Quản lý phiên bản danh mục dùng chung | X |  |  |  |  |
| 465 | Công khai danh mục |  | X |  |  |  |
| 466 | Hủy công khai danh  mục |  | X |  |  |  |
| **IV.3** | **Khai thác và báo cáo** | | | | | |
| 467 | Tìm kiếm cơ bản | X |  |  |  |  |
| 468 | Tìm kiếm nâng cao | X |  |  |  |  |
| 469 | Xuất dữ liệu tra cứu | X |  |  |  |  |
| 470 | Báo cáo thống kê danh sách danh mục | X |  |  |  |  |
| 471 | Báo cáo tình trạng khai thác danh mục | X |  |  |  |  |
| 472 | Báo cáo trạng thái danh mục | X |  |  |  |  |
| 473 | Báo cáo phiên bản danh mục | X |  |  |  |  |
| **V** | **QUY**  **TRÌNH**  **QUẢN LÝ**  **DANH MỤC**  **DỮ LIỆU**  **MỞ** | | | | | |
| **V.1** | **Quản lý danh mục dữ liệu mở** | | | | | |
| 474 | Quản lý danh mục dữ liệu  mở | X |  |  |  |  |
| 475 | Quản lý metadata  (siêu dữ liệu) về dữ liệu mở | X |  |  |  |  |
| 476 | Quản lý giấy phép | X |  |  |  |  |
| **V.2** | **Công bố dữ liệu mở** | | | | | |
| 477 | Gửi yêu cầu công bố dữ liệu mở |  |  |  | X |  |
| 478 | Quản lý phiên bản dữ liệu mở | X |  |  |  |  |
| 479 | Phê duyệt dữ liệu mở |  |  | X |  |  |
| 480 | Thiết lập lịch công bố / cập nhật tự động |  |  |  | X |  |
| **V.3** | **Báo cáo thống kê dữ liệu mở** | | | | | |
| 481 | Tìm kiếm và lọc tập dữ liệu mở | X |  |  |  |  |
| 482 | Báo cáo thống kê dữ liệu mở | X |  |  |  |  |
| 483 | Báo cáo thống kê phân loại dữ liệu mở | X |  |  |  |  |
| 484 | Thống kê và phân tích lượt truy cập, tải dữ liệu | X |  |  |  |  |
| **VI** | **QUY**  **TRÌNH**  **QUẢN LÝ**  **DỮ LIỆU**  **CHỦ** | | | | | |
| **VI.1** | **Quản lý mô**  **hình dữ liệu**  **chủ** | | | | | |
| 485 | Thiết lập dữ liệu chủ | X |  |  |  |  |
| 486 | Quản lý thuộc tính dữ liệu chủ | X |  |  |  |  |
| 487 | Thiết lập quy tắc hợp nhất dữ liệu chủ | X |  |  |  |  |
| 488 | Thiết lập quan hệ giữa thực thể | X |  |  |  |  |
| 489 | Quy tắc định danh duy nhất | X |  |  |  |  |
| 490 | Phê duyệt danh sách dữ liệu chủ |  |  | X |  |  |
| **VI.2** | **Cập nhật dữ liệu chủ** | | | | | |
| 491 | Rà soát, gửi phê duyệt bản ghi dữ liệu chủ |  |  |  | X |  |
| 492 | Phê duyệt dữ liệu |  |  | X |  |  |
| 493 | Hủy phê duyệt dữ liệu  chủ |  |  | X |  |  |
| 494 | Theo dõi lịch sử thay đổi |  |  | X |  |  |
| 495 | Xóa và khôi phục bản ghi |  |  |  | X |  |
| 496 | Quản lý phiên bản dữ liệu chủ |  |  |  | X |  |
| 497 | Công khai dữ liệu chủ |  |  |  | X |  |
| 498 | Hủy công khai dữ liệu chủ |  |  |  | X |  |
| **VI.3** | **Tra cứu, báo cáo** | | | | | |
| 499 | Tra cứu dữ liệu chủ |  |  | X | X |  |
| 500 | Báo cáo sử dụng dữ liệu chủ |  |  | X | X |  |
| 501 | Báo cáo vòng đời dữ liệu |  |  | X | X |  |
| **VII** | **QUY**  **TRÌNH**  **ĐIỀU PHỐI**  **DỮ LIỆU** | | | | | |
| **VII.1** | **Thiết lập và phê duyệt dịch vụ dữ**  **liệu** | | | | | |
| 502 | Thiết lập dịch vụ cung cấp dữ liệu | X |  |  |  |  |
| 503 | Kiểm tra và phê duyệt dịch vụ dữ liệu |  | X |  |  |  |
| 504 | Từ chối phê duyệt dịch vụ dữ liệu |  | X |  |  |  |
| 505 | Phê duyệt dịch vụ dữ liệu |  | X |  |  |  |
| 506 | Công khai dịch vụ dữ liệu | X |  |  |  |  |
| **VII.2** | **Nhóm chức năng quản lý API cung**  **cấp dữ liệu, đối soát dữ liệu cung cấp** | | | | | |
| 507 | Quản lý danh mục API cung cấp dữ liệu | X |  |  |  |  |
| 508 | Quản lý danh mục API đối soát dữ liệu cung cấp |  |  |  |  | X |
| 509 | Giám sát và ghi log API |  |  |  |  | X |
| 510 | Cấp quyền truy cập API |  |  |  |  | X |
| 511 | Quản lý phiên bản API |  |  |  |  | X |
| **VII.3** | **Nhóm chức năng cung**  **cấp dữ liệu thụ động / theo yêu cầu** | | | | | |
| 512 | Tiếp nhận yêu cầu cung cấp dữ liệu |  |  |  |  | X |
| 513 | Tra cứu dữ liệu theo yêu cầu |  |  |  |  | X |
| 514 | Tạo dịch vụ dữ liệu theo yêu cầu |  |  |  |  | X |
| 515 | Xuất dữ liệu định dạng chuẩn |  |  |  |  | X |
| 516 | Công bố dịch vụ dữ liệu |  |  |  |  | X |
| 517 | Hủy công bố dịch vụ dữ liệu |  |  |  |  | X |
| **VII.4** | **Nhóm chức năng kiểm soát và giám sát cung cấp**  **dữ liệu** | | | | | |
| 518 | Giám sát luồng cung cấp dữ liệu |  |  |  |  | X |
| 519 | Báo cáo thống kê dịch vụ dữ liệu |  |  |  |  | X |
| **VII.5** | **Dịch vụ**  **cung cấp dữ**  **liệu** | | | | | |
| **VII.5.1** | **Cung cấp dữ liệu danh mục cho các**  **hệ thống nội**  **ngành** | | | | | |
| 520 | Cung cấp dữ liệu Bản án, quyết định của Tòa án được cơ quan thi hành án dân sự đưa ra  tổ chức thi  hành |  |  |  |  | X |
| 521 | Cung cấp dữ liệu danh mục |  |  |  |  | X |
| 522 | Cung cấp dữ liệu Bảo trợ xã hội và giảm nghèo - Hưởng trợ giúp xã hội |  |  |  |  | X |
| 523 | Cung cấp dữ liệu Bảo trợ xã hội và giảm nghèo - Hưởng trợ giúp xã hội |  |  |  |  | X |
| 524 | Cung cấp dữ liệu Bảo trợ xã hội và giảm nghèo - Thông tin người nghèo, cận nghèo |  |  |  |  | X |
| 525 | Cung cấp dữ liệu Bảo trợ xã hội và giảm nghèo - Người đơn thân |  |  |  |  | X |
| 526 | Cung cấp dữ liệu Bảo trợ xã hội và giảm nghèo - Trẻ em là đối tượng bảo trợ xã hội |  |  |  |  | X |
| 527 | Cung cấp dữ liệu Bảo trợ xã hội và giảm nghèo Người có HIV |  |  |  |  | X |
| 528 | Cung cấp dữ liệu Bảo trợ xã hội và giảm nghèo Người cao tuổi |  |  |  |  | X |
| 529 | Cung cấp dữ liệu Bảo trợ xã hội và giảm nghèo - Thông tin về người khuyết  tật |  |  |  |  | X |
| 530 | Cung cấp dữ liệu Người có công - Hồ sơ công nhận người có công |  |  |  |  | X |
| 531 | Cung cấp dữ liệu Người có công - Hồ sơ liệt sĩ: |  |  |  |  | X |
| 532 | Cung cấp dữ liệu Người có công - Hồ sơ công nhận thân nhân người có công |  |  |  |  | X |
| 533 | Cung cấp dữ liệu Trẻ em -  Trẻ em |  |  |  |  | X |
| **VII.5.2** | **Cung cấp dữ liệu dùng**  **chung** | | | | | |
| **VII.5.2.1** | **Cục Hành**  **chính tư**  **pháp** | | | | | |
| **VII.5.2.1.** | **CSDL Hộ**  **tịch điện tử** | | | | | |
| 534 | Cung cấp Bộ dữ liệu hồ sơ đăng ký khai sinh |  |  |  |  | X |
| 535 | Cung cấp Bộ dữ liệu hồ sơ  đăng ký kết hôn |  |  |  |  | X |
| 536 | Cung cấp Bộ dữ liệu hồ sơ cấp Giấy xác nhận tình  trạng hôn nhân |  |  |  |  | X |
| 537 | Cung cấp Bộ dữ liệu hồ sơ đăng ký khai tử |  |  |  |  | X |
| 538 | Cung cấp Bộ dữ liệu hồ sơ đăng ký nhận cha, mẹ, con |  |  |  |  | X |
| 539 | Cung cấp Bộ dữ liệu hồ sơ đăng ký nuôi con nuôi |  |  |  |  | X |
| 540 | Cung cấp Bộ dữ liệu hồ sơ đăng ký giám hộ |  |  |  |  | X |
| 541 | Cung cấp Bộ dữ liệu hồ sơ đăng ký chấm dứt giám hộ |  |  |  |  | X |
| 542 | Cung cấp Bộ dữ liệu hồ sơ đăng ký thay đổi, cải chính, bổ sung thông  tin hộ tịch, xác định lại dân tộc |  |  |  |  | X |
| 543 | Cung cấp Bộ dữ liệu hồ sơ đăng ký giám sát việc giám hộ |  |  |  |  | X |
| 544 | Cung cấp Bộ dữ liệu hồ sơ đăng ký chấm dứt giám sát việc giám hộ |  |  |  |  | X |
| 545 | Cung cấp Bộ dữ liệu hồ sơ ghi vào sổ việc ly hôn/hủy việc kết hôn đã thực hiện tại cơ quan có thẩm quyền của nước ngoài (ghi chú ly hôn) |  |  |  |  | X |
| **VII.5.2.1.** | **Hệ thống quản lý hồ sơ quốc tịch** | | | | | |
| 546 | Cung cấp dữ liệu Nhập Quốc tịch |  |  |  |  | X |
| 547 | Cung cấp dữ liệu Thôi Quốc tịch |  |  |  |  | X |
| 548 | Cung cấp dữ liệu Trở lại  Quốc tịch |  |  |  |  | X |
| **VII.5.2.2** | **Cục Quản lý thi hành án dân sự** | | | | | |
| **VII.5.2.2.** | **Cơ sở dữ liệu thi hành án dân sự** | | | | | |
| 549 | Cung cấp dữ liệu Yêu cầu thi hành án của cá nhân, cơ quan, tổ chức |  |  |  |  | X |
| 550 | Cung cấp dữ liệu Quyết định thi hành án dân sự |  |  |  |  | X |
| 551 | Cung cấp dữ liệu Người phải thi hành án, người được thi hành án, người có quyền lợi  nghĩa vụ liên quan |  |  |  |  | X |
| 552 | Cung cấp dữ liệu Nghĩa vụ thi hành án |  |  |  |  | X |
| 553 | Cung cấp dữ liệu Trạng thái thi hành  án |  |  |  |  | X |
| 554 | Cung cấp dữ liệu Tài sản thi hành án |  |  |  |  | X |
| 555 | Cung cấp dữ liệu Xác minh điều kiện trong thi hành án dân sự |  |  |  |  | X |
| 556 | Cung cấp dữ liệu Cưỡng chế thi hành án trong thi hành án dân sự |  |  |  |  | X |
| 557 | Cung cấp dữ liệu Áp dụng biện pháp  bảo đảm trong thi hành án dân sự |  |  |  |  | X |
| 558 | Cung cấp dữ liệu Chứng từ nghiệp vụ trong thi hành án dân sự |  |  |  |  | X |
| 559 | Cung cấp dữ liệu Biên lai  thu tiền thi hành án dân sự |  |  |  |  | X |
| 560 | Cung cấp dữ liệu Vật chứng trong thi hành án dân sự |  |  |  |  | X |
| 561 | Cung cấp dữ liệu Thẩm định giá tài sản trong thi hành án dân sự |  |  |  |  | X |
| 562 | Cung cấp dữ liệu Đấu giá tài sản trong thi hành án dân sự |  |  |  |  | X |
| 563 | Cung cấp dữ liệu Giải quyết khiếu nại, tố cáo trong thi hành án dân sự |  |  |  |  | X |
| 564 | Cung cấp dữ liệu Hướng dẫn nghiệp vụ trong thi hành án dân sự |  |  |  |  | X |
| **VII.5.2.3** | **Cục Đăng ký giao dịch**  **bảo đảm và**  **BTNN** | | | | | |
| **VII.5.2.3.** | **Cơ sở dữ**  **liệu về biện**  **pháp bảo đảm** | | | | | |
| 565 | Cung cấp dữ liệu Thông tin chung  (Bao gồm người đăng ký và Hợp đồng bảo đảm) |  |  |  |  | X |
| 566 | Cung cấp dữ liệu Bên bảo  đảm |  |  |  |  | X |
| 567 | Cung cấp dữ liệu Bên nhận bảo đảm |  |  |  |  | X |
| 568 | Cung cấp dữ liệu Tài sản bảo đảm |  |  |  |  | X |
| **VII.5.2.4** | **Cục Kiểm tra văn bản và Quản lý xử lý vi phạm hành chính** | | | | | |
| **VII.5.2.4.** | **CSDL quốc gia về pháp**  **luật** | | | | | |
| 569 | Cung cấp dữ liệu Văn bản quy phạm pháp luật |  |  |  |  | X |
| 570 | Cung cấp dữ liệu Nội dung của văn bản quy phạm pháp luật |  |  |  |  | X |
| 571 | Cung cấp dữ liệu Quan hệ giữa các điều khoản trong các văn bản quy phạm pháp luật |  |  |  |  | X |
| 572 | Cung cấp dữ liệu Văn bản hợp nhất |  |  |  |  | X |
| 573 | Cung cấp dữ liệu Hệ thống hóa văn bản quy phạm pháp luật |  |  |  |  | X |
| **VII.5.2.4.** | **Cơ sở dữ liệu tương trợ tư pháp về dân sự** | | | | | |
| 574 | Cung cấp dữ liệu Hồ sơ ủy thác tư pháp đến |  |  |  |  | X |
| 575 | Cung cấp dữ liệu Hồ sơ ủy thác tư pháp đi |  |  |  |  | X |
| **VII.5.2.4.** | **Hệ thống thông tin trợ giúp pháp lý** | | | | | |
| 576 | Cung cấp dữ liệu Tổ chức thực hiện trợ giúp pháp lý |  |  |  |  | X |
| 577 | Cung cấp dữ liệu Tổ chức đăng ký tham gia trợ giúp pháp lý |  |  |  |  | X |
| 578 | Cung cấp dữ liệu Thông tin văn bản cử người thực hiện trợ giúp pháp lý |  |  |  |  | X |
| 579 | Cung cấp dữ  liệu Trung tâm TGPL nhà nước |  |  |  |  | X |
| 580 | Cung cấp dữ  liệu Chi  nhánh TGPL |  |  |  |  | X |
| 581 | Cung cấp dữ liệu Người  thực hiện  TGPL |  |  |  |  | X |
| **VII.5.2.4.** | **CSDL phổ**  **biến, giáo dục pháp**  **luật và hoà giải cơ sở** | | | | | |
| 582 | Cung cấp dữ liệu Báo cáo viên pháp luật |  |  |  |  | X |
| 583 | Cung cấp dữ liệu Tuyên truyền viên pháp luật |  |  |  |  | X |
| 584 | Cung cấp dữ liệu Chương trình, kế hoạch về phổ biến, giáo dục pháp luật |  |  |  |  | X |
| 585 | Cung cấp dữ liệu Hội đồng phối hợp phổ biến, giáo dục pháp luật |  |  |  |  | X |
| 586 | Cung cấp dữ liệu Đề án |  |  |  |  | X |
| 587 | Cung cấp dữ liệu Hội nghị tập huấn (trực tuyến, trực tiếp) |  |  |  |  | X |
| 588 | Cung cấp dữ liệu Hội thảo |  |  |  |  | X |
| 589 | Cung cấp dữ liệu Tổ hoà  giải |  |  |  |  | X |
| 590 | Cung cấp dữ liệu Hoà giải viên |  |  |  |  | X |
| 591 | Cung cấp dữ liệu Vụ việc hoà giải |  |  |  |  | X |
| 592 | Cung cấp dữ liệu Tập huấn viên |  |  |  |  | X |
| 593 | Cung cấp dữ liệu Kinh phí phổ biến giáo dục pháp luật |  |  |  |  | X |
| 594 | Cung cấp dữ liệu Tiêu chí, chỉ tiêu tiếp cận pháp luật |  |  |  |  | X |
| 595 | Cung cấp dữ liệu Đánh giá cấp xã đạt chuẩn tiếp cận pháp luật |  |  |  |  | X |
| 596 | Cung cấp dữ  liệu Cuộc  PBGDPL |  |  |  |  | X |
| 597 | Cung cấp dữ liệu Cuộc thi tìm hiểu về pháp luật |  |  |  |  | X |
| **VII.5.2.5** | **Cục Bổ trợ tư pháp** | | | | | |
| **VII.5.2.5.** | **CSDL quản**  **lý đấu giá tài sản** | | | | | |
| 598 | Cung cấp dữ liệu Đấu giá viên |  |  |  |  | X |
| 599 | Cung cấp dữ liệu Tổ chức hành nghề đấu giá |  |  |  |  | X |
| 600 | Cung cấp dữ liệu Người có tài sản đấu giá |  |  |  |  | X |
| 601 | Cung cấp dữ liệu Thông tin việc đấu giá |  |  |  |  | X |
| 602 | Cung cấp dữ liệu Tài sản đấu giá |  |  |  |  | X |
| 603 | Cung cấp dữ liệu Công chứng viên |  |  |  |  | X |
| 604 | Cung cấp dữ liệu Thông tin ngăn chặn |  |  |  |  | X |
| 605 | Cung cấp dữ liệu Tổ chức hành nghề công chứng |  |  |  |  | X |
| 606 | Cung cấp dữ liệu Tài sản trong giao dịch công chứng |  |  |  |  | X |
| 607 | Cung cấp dữ liệu Kết quả hoạt động công chứng |  |  |  |  | X |
| 608 | Cung cấp dữ liệu Quản tài viên |  |  |  |  | X |
| 609 | Cung cấp dữ liệu Doanh nghiệp quản lý, thanh lý tài sản |  |  |  |  | X |
| 610 | Cung cấp dữ liệu Luật sư  Việt Nam |  |  |  |  | X |
| 611 | Cung cấp dữ liệu Người được cấp chứng chỉ hành nghề luật sư |  |  |  |  | X |
| 612 | Cung cấp dữ liệu Tổ chức hành nghề  luật sư Việt  Nam |  |  |  |  | X |
| 613 | Cung cấp dữ liệu Luật sư nước ngoài |  |  |  |  | X |
| 614 | Cung cấp dữ liệu Tổ chức hành nghề luật sư nước ngoài |  |  |  |  | X |
| 615 | Cung cấp dữ liệu Trọng tài viên |  |  |  |  | X |
| 616 | Cung cấp dữ liệu Trung tâm trọng tài |  |  |  |  | X |
| 617 | Cung cấp dữ liệu Chi nhánh của tổ chức trọng tài |  |  |  |  | X |
| 618 | Cung cấp dữ liệu Văn phòng đại diện của trung tâm trọng tài |  |  |  |  | X |
| 619 | Cung cấp dữ liệu Hòa giải viên thương mại |  |  |  |  | X |
| 620 | Cung cấp dữ liệu Trung tâm hòa giải thương mại |  |  |  |  | X |
| 621 | Cung cấp dữ liệu Giám  định viên tư pháp |  |  |  |  | X |
| 622 | Cung cấp dữ liệu Tổ chức  giám định tư pháp |  |  |  |  | X |
| **VII.5.2.6** | **Vụ Hợp tác quốc tế** | | | | | |
| **VII.5.2.5.** | **CSDL Hợp**  **tác quốc tế** | | | | | |
| 623 | Cung cấp dữ liệu Thông tin điều ước quốc tế, thỏa thuận quốc tế |  |  |  |  | X |
| 624 | Cung cấp dữ liệu Thông tin chương trình dự án |  |  |  |  | X |
| 625 | Cung cấp dữ liệu Danh sách chuyên gia |  |  |  |  | X |
| 626 | Cung cấp dữ liệu Thông tin hội nghị, hội thảo |  |  |  |  | X |
| 627 | Cung cấp dữ liệu Thông tin sản phẩm nghiên cứu, truyền thông |  |  |  |  | X |
| 628 | Cung cấp dữ liệu Thông tin Đoàn |  |  |  |  | X |
| **VII.5.3** | **Dịch vụ cung cấp dữ liệu mở theo Quyết định số 1459/QĐBTP ngày 15 tháng 5 năm 2025 của Bộ trưởng Bộ Tư pháp**  **(dịch vụ chủ động)** | | | | | |
| 629 | Cung cấp dữ liệu mở về Danh sách tổ chức thực hiện trợ giúp pháp lý |  |  |  |  | X |
| 630 | Cung cấp dữ liệu mở về Danh sách người thực hiện trợ giúp pháp lý |  |  |  |  | X |
| 631 | Cung cấp dữ liệu mở về Danh sách tổ chức hành nghề công chứng |  |  |  |  | X |
| 632 | Cung cấp dữ liệu mở về Danh sách công chứng viên |  |  |  |  | X |
| 633 | Cung cấp dữ liệu mở về Danh sách tổ chức giám định tư pháp |  |  |  |  | X |
| 634 | Cung cấp dữ liệu mở về Danh sách cá nhân giám định tư pháp |  |  |  |  | X |
| 635 | Cung cấp dữ liệu mở về Danh sách  luật sư Việt  Nam |  |  |  |  | X |
| 636 | Cung cấp dữ liệu mở về Danh sách tổ chức hành nghề luật sư  Việt Nam |  |  |  |  | X |
| 637 | Cung cấp dữ liệu mở về Danh sách luật sư nước ngoài |  |  |  |  | X |
| 638 | Cung cấp dữ liệu mở về Danh sách tổ chức hành nghề luật sư nước ngoài |  |  |  |  | X |
| 639 | Cung cấp dữ liệu mở về Danh sách Báo cáo viên pháp luật trung ương |  |  |  |  | X |
| 640 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Xây dựng văn bản quy phạm pháp luật |  |  |  |  | X |
| 641 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Kiểm tra văn bản quy phạm pháp luật |  |  |  |  | X |
| 642 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Rà soát văn bản quy phạm pháp luật |  |  |  |  | X |
| 643 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Tổ chức và người làm công tác pháp chế |  |  |  |  | X |
| 644 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Phổ biến, giáo dục pháp luật |  |  |  |  | X |
| 645 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Hòa giải ở cơ sở |  |  |  |  | X |
| 646 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Chuẩn tiếp cận pháp  luật |  |  |  |  | X |
| 647 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Hộ tịch |  |  |  |  | X |
| 648 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Chứng thực |  |  |  |  | X |
| 649 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Lý lịch tư pháp |  |  |  |  | X |
| 650 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Nuôi con nuôi |  |  |  |  | X |
| 651 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Trợ giúp pháp lý |  |  |  |  | X |
| 652 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Đăng ký giao dịch bảo  đảm |  |  |  |  | X |
| 653 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Luật sư |  |  |  |  | X |
| 654 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Công chứng |  |  |  |  | X |
| 655 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Giám định tư pháp |  |  |  |  | X |
| 656 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Đấu giá tài sản |  |  |  |  | X |
| 657 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Trọng tài thương mại |  |  |  |  | X |
| 658 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Hòa giải thương mại |  |  |  |  | X |
| 659 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Quản lý thanh lý tài sản |  |  |  |  | X |
| 660 | Cung cấp dữ liệu mở về số liệu thống kê trong lĩnh vực Tương trợ tư pháp |  |  |  |  | X |
| **VII.5.4** | **Cung cấp dữ liệu chủ** | | | | | |
| 661 | Cung cấp dữ liệu chủ |  |  |  |  | X |
| **VIII** | **QUY**  **TRÌNH ĐỐI**  **SOÁT DỮ**  **LIỆU**  **CUNG CẤP** | | | | | |
| **VIII.1** | **Đối soát dữ liệu danh**  **mục** | | | | | |
| 662 | Đối soát tổng hợp về dữ liệu Danh mục cung cấp cho các hệ thống khác |  |  |  |  | X |
| **VIII.2** | **Đối soát dữ liệu các**  **nhóm dữ**  **liệu chia sẻ** | | | | | |
| **VIII.1** | **CSDL Hộ**  **tịch điện tử** | | | | | |
| 663 | Đối soát tổng hợp về cung cấp dữ liệu Hộ tịch điện tử |  |  |  |  | X |
| **VIII.2** | **Hệ thống quản lý hồ sơ quốc tịch** | | | | | |
| 664 | Đối soát tổng hợp về cung cấp dữ liệu hồ sơ quốc tịch |  |  |  |  | X |
| **VIII.3** | **Cơ sở dữ liệu thi hành án dân sự** | | | | | |
| 665 | Đối soát tổng hợp về cung cấp dữ liệu thi hành án dân sự |  |  |  |  | X |
| **VIII.4** | **Cơ sở dữ**  **liệu về biện**  **pháp bảo đảm** | | | | | |
| 666 | Đối soát tổng hợp về cung cấp dữ liệu về biện pháp bảo đảm |  |  |  |  | X |
| **VIII.5** | **CSDL quốc gia về pháp**  **luật** | | | | | |
| 667 | Đối soát tổng hợp về cung cấp dữ liệu quốc gia về pháp luật |  |  |  |  | X |
| **VIII.6** | **Cơ sở dữ liệu tương trợ tư pháp về dân sự** | | | | | |
| 668 | Đối soát tổng hợp về cung cấp dữ liệu tương trợ tư pháp về dân sự |  |  |  |  | X |
| **VIII.7** | **Hệ thống thông tin trợ giúp pháp lý** | | | | | |
| 669 | Đối soát tổng hợp về cung cấp dữ liệu thông tin trợ giúp pháp lý |  |  |  |  | X |
| **VIII.8** | **CSDL phổ**  **biến, giáo dục pháp**  **luật và hoà giải cơ sở** | | | | | |
| 670 | Đối soát tổng hợp về cung cấp dữ liệu phổ biến, giáo dục pháp luật và hoà giải cơ sở |  |  |  |  | X |
| **VIII.9** | **CSDL quản**  **lý đấu giá tài sản** | | | | | |
| 671 | Đối soát tổng hợp về cung cấp dữ liệu quản lý đấu giá tài sản |  |  |  |  | X |
| **VIII.10** | **CSDL Hợp**  **tác quốc tế** | | | | | |
| 672 | Đối soát tổng hợp về cung cấp dữ liệu Hợp tác quốc  tế |  |  |  |  | X |
| **VIII.11** | **Đối soát về dữ liệu mở** | | | | | |
| 673 | Đối soát tổng hợp về cung cấp dữ liệu  mở |  |  |  |  | X |
| **VIII.11** | **Đối soát về dữ liệu chủ** | | | | | |
| 674 | Đối soát tổng hợp về cung cấp dữ liệu chủ |  |  |  |  | X |
| **VIII** | **QUẢN TRỊ**  **HỆ THỐNG** | | | | | |
| 675 | Quản lý người dùng | X |  |  |  |  |
| 676 | Quản lý nhóm người dùng | X |  |  |  |  |
| 677 | Gán người dùng vào nhóm | X |  |  |  |  |
| 678 | Phân quyền chức năng cho nhóm người dùng | X |  |  |  |  |
| 679 | Phân quyền dữ liệu cho nhóm người dùng | X |  |  |  |  |
| 680 | Quản lý danh sách chức năng |  |  |  |  | X |
| 681 | Quản lý vai trò |  |  |  |  | X |
| 682 | Thiết lập cấu hình hệ thống |  |  |  |  | X |
| 683 | Thiết lập quy tắc đặt mật khẩu |  |  |  |  | X |
| 684 | Quản lý nhật ký truy cập |  |  |  |  | X |
| 685 | Quản lý nhật ký đăng nhập |  |  |  |  | X |
| 686 | Quản lý nhật ký các lỗi phát sinh trong quá trình hoạt động |  |  |  |  | X |
| 687 | Quản lý nhật ký quản lý tài khoản |  |  |  |  | X |
| 688 | Quản lý Nhật ký thay đổi cấu hình |  |  |  |  | X |
| 689 | Quản lý cấu hình khoảng thời gian lưu trữ nhật ký qua giao diện Quản lý nhật ký |  |  |  |  | X |
| 690 | Sao lưu dự phòng |  |  |  |  | X |