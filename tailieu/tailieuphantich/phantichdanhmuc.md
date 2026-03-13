# 4.3. PM03.QLDM_Quản lý danh mục

## 4.3.1. PM03.QLDM.BC – Báo cáo & Tra cứu danh mục

### *4.3.1.1. Mục đích*
Chức năng này cung cấp cho cán bộ nghiệp vụ, cán bộ quản lý và quản trị viên một cái nhìn tổng quan về tình trạng các danh mục trong hệ thống. Nó cho phép người dùng tra cứu, theo dõi tiến độ phê duyệt và tình trạng công bố của các danh mục, với điều kiện là hệ thống đã có dữ liệu danh mục được tạo hoặc đồng bộ.

### 4.3.1.2. PM03.QLDM.BC.MH01 – Báo cáo & Tra cứu

#### 4.3.1.2.1. MH01 Màn hình báo cáo và tra cứu
##### Màn hình
- Màn hình:

![Báo cáo Danh mục](./images/baocao_danhmuc.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 1 - Giao diện báo cáo và tra cứu danh mục</p>

##### Mô tả thông tin trên màn hình

**A. Khung chỉ số thống kê (Stats Cards)**
... (giữ nguyên)

**B. Bộ lọc & Tìm kiếm nâng cao**
... (giữ nguyên)

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup tìm kiếm nâng cao (MH01.P01). |
| 2 | CN02 | Button text | Kết xuất danh sách danh mục (theo bộ lọc hiện tại) ra file Excel. |
| 3 | CN03 | Button icon | Mở popup hiển thị các giá trị chi tiết (bản ghi) của một danh mục cụ thể (MH01.P02). |

#### 4.3.1.2.2. MH01.P01 – Tìm kiếm nâng cao
##### Màn hình
- Màn hình:

![Tìm kiếm nâng cao](./images/timkiemnangcao_danhmuc.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 4 - Popup tìm kiếm nâng cao danh mục</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Tên danh mục | VARCHAR2(255) | Không | - | Tìm kiếm theo tên danh mục. |
| Mã danh mục | VARCHAR2(50) | Không | - | Tìm kiếm chính xác theo mã. |
| Loại danh mục | VARCHAR2(50) | Không | - | Lọc theo loại (Chuyên ngành, Dùng chung). |
| Trạng thái | VARCHAR2(50) | Không | - | Lọc theo trạng thái (Đã công bố, Chờ duyệt...). |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Áp dụng bộ lọc tìm kiếm. |
| 2 | CN02 | Button text | Đặt lại các trường lọc về mặc định. |
| 3 | CN03 | Button text | Đóng popup. |

#### 4.3.1.2.3. MH01.P02 – Chi tiết giá trị danh mục
##### Màn hình
- Màn hình:

![Chi tiết giá trị danh mục](./images/chitietgiatridanhmuc.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 5 - Popup hiển thị các bản ghi trong danh mục</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã giá trị | VARCHAR2(50) | - | - | Mã định danh giá trị (VD: HN, HCM). |
| Tên giá trị | VARCHAR2(255) | - | - | Tên hiển thị (VD: Hà Nội, TP. Hồ Chí Minh). |
| Mô tả | VARCHAR2(1000) | - | - | Ghi chú thêm về giá trị. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Đóng popup. |
| 2 | CN02 | Button text | Xuất danh sách giá trị ra Excel. |

## 4.3.2. PM03.QLDM.TL – Thiết lập danh mục

### *4.3.2.1. Mục đích*
Chức năng này cho phép cán bộ có thẩm quyền tạo mới, chỉnh sửa và quản lý vòng đời của các loại danh mục trong kho DLDC, từ lúc khởi tạo (Nháp) đến khi sẵn sàng để phê duyệt.

### 4.3.2.2. PM03.QLDM.TL.MH02 – Danh sách thiết lập

#### 4.3.2.2.1. MH02 Màn hình danh sách thiết lập
##### Màn hình
- Màn hình:

![Thiết lập Danh mục](./images/thietlap_danhmuc.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 2 - Giao diện quản lý thiết lập danh mục</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Mở popup để cấu hình một danh mục mới (MH02.P01). |
| 2 | CN02 | Button icon | Mở popup cập nhật thông tin danh mục (MH02.P01). |
| 3 | CN03 | Button icon | Mở popup xác nhận loại bỏ danh mục (MH02.P02). |
| 4 | CN04 | Button icon | Mở popup xác nhận gửi phê duyệt (MH02.P03). |

#### 4.3.2.2.2. MH02.P01 – Thêm/Sửa danh mục
##### Màn hình
- Màn hình:

![Thêm sửa danh mục](./images/themsua_danhmuc.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 6 - Popup khởi tạo hoặc cập nhật danh mục</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Mã danh mục | VARCHAR2(50) | Có | - | Mã định danh kỹ thuật duy nhất. |
| Tên danh mục | VARCHAR2(255) | Có | - | Tên hiển thị của danh mục. |
| Loại dữ liệu | VARCHAR2(50) | Có | - | Phân loại: Danh mục hành chính, chuyên ngành... |
| Ghi chú | VARCHAR2(1000) | Không | - | Thông tin diễn giải. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Lưu thông tin danh mục và đóng popup. |
| 2 | CN02 | Button text | Hủy thao tác. |

#### 4.3.2.2.3. MH02.P02 – Xác nhận xóa danh mục
##### Màn hình
- Màn hình:

![Xác nhận xóa danh mục](./images/confirm_delete_cat.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 7 - Popup xác nhận xóa danh mục</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo | VARCHAR2(500) | - | - | "Bạn có chắc chắn muốn xóa danh mục này? Mọi dữ liệu bản ghi liên quan sẽ bị mất." |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xác nhận xóa vĩnh viễn danh mục. |
| 2 | CN02 | Button text | Hủy bỏ và đóng popup. |

#### 4.3.2.2.4. MH02.P03 – Xác nhận gửi phê duyệt
##### Màn hình
- Màn hình:

![Xác nhận gửi phê duyệt](./images/confirm_submit_cat.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 8 - Popup xác nhận chuyển trạng thái danh mục sang chờ duyệt</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Cảnh báo | VARCHAR2(500) | - | - | "Bạn có chắc chắn muốn gửi phê duyệt danh mục này? Sau khi gửi, bạn sẽ không thể chỉnh sửa cho đến khi có phản hồi." |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Gửi phê duyệt chính thức. |
| 2 | CN02 | Button text | Hủy bỏ. |

## 4.3.3. PM03.QLDM.PD – Phê duyệt danh mục

### *4.3.3.1. Mục đích*
... (giữ nguyên)

### 4.3.3.2. PM03.QLDM.PD.MH03 – Giao diện phê duyệt

#### 4.3.3.2.1. MH03 Màn hình giao diện phê duyệt
##### Màn hình
- Màn hình:

![Giao diện phê duyệt danh mục](./images/pheduyet_danhmuc.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 3 - Màn hình giao diện phê duyệt danh mục</p>

##### Mô tả thông tin trên màn hình
... (giữ nguyên)

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Xác nhận danh mục hợp lệ, chuyển trạng thái của danh mục sang "Đã phê duyệt". |
| 2 | CN02 | Button text | Mở popup từ chối phê duyệt (MH03.P01). |

#### 4.3.3.2.2. MH03.P01 – Từ chối phê duyệt
##### Màn hình
- Màn hình:

![Từ chối phê duyệt](./images/reject_cat.png)

<p align="center" style="background-color: #E0E0E0; padding: 5px; display: inline-block; margin: 0 auto;">Hình 9 - Popup nhập lý do từ chối phê duyệt danh mục</p>

##### Mô tả thông tin trên màn hình
| Trường thông tin | Kiểu dữ liệu | Bắt buộc | Mặc định | Mô tả |
| :--- | :--- | :--- | :--- | :--- |
| Lý do từ chối | CLOB | Có | - | Nhập chi tiết lý do không phê duyệt danh mục này. |

##### Chức năng trên màn hình
| STT | Mã chức năng | Định dạng | Mô tả |
| :--- | :--- | :--- | :--- |
| 1 | CN01 | Button text | Gửi lý do từ chối và thông báo cho người khởi tạo. |
| 2 | CN02 | Button text | Hủy bỏ và đóng popup. |

## 4.3.4. PM03.QLDM.CB – Công bố danh mục

### *4.3.4.1. Mục đích*
... (giữ nguyên)

### 4.3.4.2. PM03.QLDM.CB.MH04 – Thiết lập công bố

#### 4.3.4.2.1. MH04 Màn hình thiết lập công bố danh mục
... (giữ nguyên)
