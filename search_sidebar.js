const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    try {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

        // 1. Login
        const loginBtn = await page.$('button[type="submit"]');
        if (loginBtn) {
            await loginBtn.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => { });
        }

        await new Promise(r => setTimeout(r, 2000));

        // 2. Dump all text in the sidebar recursively
        const tree = await page.evaluate(() => {
            function getMenuTxt(el) {
                return Array.from(el.querySelectorAll('*'))
                    .map(x => x.childNodes.length ? Array.from(x.childNodes).filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(' ') : '')
                    .join(' ')
                    .replace(/\s+/g, ' ');
            }
            return document.querySelector('aside').innerText;
        });

        console.log("=== ROOT SIDEBAR ===");
        console.log(tree);

        // Click "Quản lý thu thập" using a robust click
        await page.evaluate(() => {
            const spans = Array.from(document.querySelectorAll('aside span'));
            const node = spans.find(span => span.textContent.trim() === 'Quản lý thu thập');
            if (node) node.closest('div').click();
        });

        await new Promise(r => setTimeout(r, 1000));

        // Click CSDL Trong ngành
        await page.evaluate(() => {
            const spans = Array.from(document.querySelectorAll('aside span'));
            const node = spans.find(span => span.textContent.trim() === 'CSDL Trong ngành');
            if (node) node.closest('div').click();
        });

        await new Promise(r => setTimeout(r, 1000));

        // Click CSDL Ngoài ngành
        await page.evaluate(() => {
            const spans = Array.from(document.querySelectorAll('aside span'));
            const node = spans.find(span => span.textContent.trim() === 'CSDL Ngoài ngành');
            if (node) node.closest('div').click();
        });

        await new Promise(r => setTimeout(r, 1000));

        const expandedTree = await page.evaluate(() => document.querySelector('aside').innerText);
        console.log("=== EXPANDED SIDEBAR ===");
        console.log(expandedTree);

        await page.screenshot({ path: 'D:/tuphap/khodldc/dldc_1/sidebar_expanded.png', fullPage: true });

        // Try clicking on "CSDL Thông tin Bản án" to see if it has a sub-menu
        await page.evaluate(() => {
            const spans = Array.from(document.querySelectorAll('aside span'));
            const node = spans.find(span => span.textContent.trim().includes('Bản án'));
            if (node) node.closest('div').click();
        });

        await new Promise(r => setTimeout(r, 1000));
        await page.screenshot({ path: 'D:/tuphap/khodldc/dldc_1/sidebar_module_clicked.png', fullPage: true });

        const moduleTree = await page.evaluate(() => document.querySelector('aside').innerText);
        console.log("=== MODULE SIDEBAR ===");
        console.log(moduleTree);

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
