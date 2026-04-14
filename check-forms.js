const fs=require('fs'); 
let c=fs.readFileSync('src/components/pages/category/CategoryStatisticsReportPage.tsx', 'utf8'); 
let m=c.match(/<(select|input|textarea)[^>]*>/g); 
if(m){ 
  m.forEach(e=>{
    if(!e.includes('title=') && !e.includes('aria-label=') && !e.includes('type="hidden"')) 
      console.log('Problem element: ' + e);
  });
}
