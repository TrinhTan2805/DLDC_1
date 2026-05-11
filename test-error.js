const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('pageerror', (err) => {
    console.log('PAGE ERROR:', err.toString());
  });
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  console.log('Navigating to http://localhost:5173...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  
  console.log('Clicking to open data details...');
  // We need to click a row to open details.
  // The Eye icon is usually the details button.
  try {
    // Wait for eye icons to appear
    await page.waitForSelector('button[title="Xem chi tiết"]', { timeout: 5000 });
    
    // Click the first eye icon
    await page.click('button[title="Xem chi tiết"]');
    
    // Wait a bit to see if error occurs
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('No error caught after clicking.');
  } catch (err) {
    console.log('Error during interaction:', err.message);
  }
  
  await browser.close();
})();
