const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ============================================================
// CONFIG: App chạy tại port 3000
// ============================================================
const BASE_URL = 'http://localhost:3000';
const IMG_DIR = path.join(__dirname, 'tailieu', 'tailieuphantich', 'images');

// Danh sách 10 loại hồ sơ cần chụp (tên menu + slug ảnh)
const HO_SO_LIST = [
    { menuName: 'Hồ sơ cấp GĐKN kết hôn', slug: 'gdknkethon' },
    { menuName: 'Hồ sơ đăng ký khai tử', slug: 'khaitu' },
    { menuName: 'Hồ sơ DK nhận cha, mẹ, con', slug: 'nhancha' },
    { menuName: 'Hồ sơ đăng ký nuôi con nuôi', slug: 'nuoicnuoi' },
    { menuName: 'Hồ sơ đăng ký giám hộ', slug: 'giamho' },
    { menuName: 'Hồ sơ DK chấm dứt giám hộ', slug: 'chamdutgiamho' },
    { menuName: 'Hồ sơ DK thay đổi TT hộ tịch, văn danh dự dân tộc', slug: 'thaydoihotich' },
    { menuName: 'Hồ sơ đăng ký kiểm sát việc giám hộ', slug: 'kiemsatgiamho' },
    { menuName: 'Hồ sơ đăng ký giám sát việc giám hộ', slug: 'giamsatgiamho' },
    { menuName: 'Hồ sơ ly hôn/hủy kết hôn ở nước ngoài', slug: 'lyhon' },
];

(async () => {
    console.log('=== capture_anhmau.js: Bắt đầu chụp ảnh màn hình ===');

    // Đảm bảo thư mục tồn tại
    if (!fs.existsSync(IMG_DIR)) {
        fs.mkdirSync(IMG_DIR, { recursive: true });
        console.log('Đã tạo thư mục ảnh:', IMG_DIR);
    }

    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // ---- Truy cập app ----
    console.log('Đang truy cập:', BASE_URL);
    try {
        await page.goto(BASE_URL, { waitUntil: 'networkidle2', timeout: 30000 });
    } catch (e) {
        console.error('LỖI: Không thể kết nối đến app. Hãy chắc server đang chạy tại', BASE_URL);
        await browser.close();
        return;
    }

    // ---- Đăng nhập (nếu có form login) ----
    const loginBtn = await page.$('button[type="submit"]');
    if (loginBtn) {
        console.log('Đang đăng nhập...');
        await loginBtn.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => { });
    }
    await delay(2000);

    // ---- Helper functions ----
    async function delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    async function screenshot(filename) {
        const fullPath = path.join(IMG_DIR, filename);
        await page.screenshot({ path: fullPath, fullPage: false });
        console.log(`  [✓] ${filename}`);
    }

    async function screenshotPopup(filename) {
        await delay(1500);
        const fullPath = path.join(IMG_DIR, filename);

        // Tìm popup/dialog lớn nhất
        const dialog = await page.evaluateHandle(() => {
            const selectors = [
                'div[role="dialog"]',
                'div.modal',
                'div.popup',
                'div.bg-white.shadow-xl',
                'div.bg-white.rounded-xl',
            ];
            for (const sel of selectors) {
                const els = Array.from(document.querySelectorAll(sel));
                const big = els.find(el => {
                    const r = el.getBoundingClientRect();
                    return r.width > 400 && r.height > 200;
                });
                if (big) return big;
            }
            return null;
        });

        const el = dialog.asElement ? dialog.asElement() : null;
        if (el) {
            await el.screenshot({ path: fullPath });
            console.log(`  [✓] ${filename} (popup crop)`);
        } else {
            await page.screenshot({ path: fullPath });
            console.log(`  [~] ${filename} (fallback toàn trang)`);
        }
    }

    async function closePopup() {
        await page.keyboard.press('Escape');
        await delay(600);
        await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const close = btns.find(b => ['Đóng', 'Hủy', 'Cancel', 'Close', '×'].includes(b.textContent.trim()));
            if (close) close.click();
        });
        await delay(600);
    }

    async function clickMenuByText(text) {
        const clicked = await page.evaluate((txt) => {
            const all = Array.from(document.querySelectorAll('aside a, aside li, aside span, aside button, nav a, nav li'));
            const found = all.find(el => el.textContent.trim() === txt || el.innerText?.trim() === txt);
            if (found) {
                const clickable = found.closest('a') || found.closest('button') || found.closest('li') || found;
                clickable.click();
                return true;
            }
            return false;
        }, text);
        if (!clicked) console.warn(`  [!] Không tìm thấy menu: "${text}"`);
        await delay(1500);
        return clicked;
    }

    async function clickFirstRowDetail() {
        // Click nút xem chi tiết dòng đầu tiên trong bảng
        const clicked = await page.evaluate(() => {
            // Thử các selector phổ biến
            const selectors = [
                'tbody tr:first-child button[title="Xem chi tiết"]',
                'tbody tr:first-child button[title="Xem"]',
                'tbody tr:first-child svg.lucide-eye',
                'tbody tr:first-child td:last-child button',
                'tbody tr:first-child td:last-child a',
            ];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el) { el.click(); return sel; }
            }
            return null;
        });
        return !!clicked;
    }

    async function clickTab(tabText) {
        await page.evaluate((txt) => {
            const tabs = Array.from(document.querySelectorAll('[role="tab"], button.tab, div.tab, li[role="tab"]'));
            const found = tabs.find(t => t.textContent.trim().includes(txt));
            if (found) found.click();
        }, tabText);
        await delay(1000);
    }

    // ============================================================
    //  CHỤP ẢNH TỪNG LOẠI HỒ SƠ
    // ============================================================
    for (const hoSo of HO_SO_LIST) {
        console.log(`\n--- Đang chụp: ${hoSo.menuName} ---`);
        const s = hoSo.slug;

        // 1. Navigate vào menu loại hồ sơ
        await clickMenuByText(hoSo.menuName);
        await delay(1500);

        // 2. Chụp màn hình danh sách (Tab Danh sách)
        await screenshot(`mauthuthapCSDL_${s}_img_001.png`);

        // 3. Mở chi tiết bản ghi đầu tiên
        const opened = await clickFirstRowDetail();
        if (opened) {
            // 3a. Chụp popup chi tiết - Tab mặc định (Thông tin hồ sơ)
            await screenshotPopup(`mauthuthapCSDL_${s}_img_002.png`);

            // 3b. Thử click các tab con trong popup nếu có
            await clickTab('Bên chồng');
            await screenshotPopup(`mauthuthapCSDL_${s}_img_002b.png`).catch(() => { });

            await closePopup();
        }

        // 4. Chụp Tab Lịch sử chỉnh sửa kết nối
        await clickTab('Lịch sử chỉnh sửa kết nối');
        await screenshot(`mauthuthapCSDL_${s}_img_003.png`);

        // 5. Chụp Tab Lịch sử đồng bộ
        await clickTab('Lịch sử đồng bộ');
        await screenshot(`mauthuthapCSDL_${s}_img_004.png`);

        // Quay lại Tab Danh sách
        await clickTab('Danh sách');
        await delay(500);
    }

    console.log('\n=== HOÀN THÀNH: Tất cả ảnh đã được lưu vào:', IMG_DIR, '===');
    await browser.close();
})();
