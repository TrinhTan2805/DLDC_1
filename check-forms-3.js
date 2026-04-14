const fs=require('fs'); 
let c=fs.readFileSync('src/components/pages/category/CategoryStatisticsReportPage.tsx', 'utf8'); 
let m=c.match(/<(select|input|textarea)[\s\S]*?>/g); 
let count = 0;
if(m){ 
  m.forEach(e=>{
    if(!e.includes('title=') && !e.includes('aria-label=') && !e.includes('type="hidden"') && !e.includes('type="checkbox"') && !e.includes('type="radio"')) {
      console.log('Problem element: ' + e);
      count++;
    }
  });
}
console.log('Total problem form elements: ' + count);
