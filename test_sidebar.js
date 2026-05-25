const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    try {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

        // Login if needed
        const loginBtn = await page.$('button[type="submit"]');
        if (loginBtn) {
            await loginBtn.click();
            await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => { });
        }

        // Wait a bit for sidebar to load
        await new Promise(r => setTimeout(r, 2000));

        // Click "Quản lý thu thập"
        await page.evaluate(() => {
            const all = Array.from(document.querySelectorAll('aside div.hover\\:bg-blue-6\\/10, aside button, aside li'));
            const node = all.find(el => el.textContent.trim().includes('Quản lý thu thập'));
            if (node) node.click();
        });

        await new Promise(r => setTimeout(r, 1000));

        // Click CSDL Trong nganh & Ngoai nganh to expand them
        await page.evaluate(() => {
            const all = Array.from(document.querySelectorAll('aside div, aside button, aside li'));
            const trong = all.find(el => el.textContent.trim() === 'CSDL Trong ngành');
            if (trong) trong.click();
            const ngoai = all.find(el => el.textContent.trim() === 'CSDL Ngoài ngành');
            if (ngoai) ngoai.click();
        });

        await new Promise(r => setTimeout(r, 1000));

        // Dump sidebar text
        const sidebarText = await page.evaluate(() => {
            const aside = document.querySelector('aside');
            return aside ? aside.innerText : 'No aside found';
        });

        console.log("SIDEBAR TEXT:");
        console.log(sidebarText);

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
