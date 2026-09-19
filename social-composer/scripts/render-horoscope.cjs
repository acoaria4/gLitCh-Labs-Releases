// Export review renders from the exact renderer used in the composer.
// NODE_PATH must resolve Playwright; COMPOSER_URL can override the local preview.
const {chromium}=require('playwright');
const fs=require('node:fs');const path=require('node:path');
const samples=[
 'Choose one clear priority. Let the rest wait.',
 'Make room for a slower, steadier kind of progress.',
 'Ask a thoughtful question. A fresh idea may follow.',
 'A small act of care can brighten your day.',
 'Share your warmth. Leave room for others to shine.',
 'Keep it simple. One thoughtful change is enough.',
 'Listen with patience. Say what matters kindly.',
 'Pause before reacting. Give clarity time to arrive.',
 'Try a different route. Stay curious along the way.',
 'Take the next small step. Let consistency do its work.',
 'Make space for a fresh perspective and a new idea.',
 'Notice what restores you. Keep a little time for it.',
];
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 const page=await browser.newPage();await page.goto(process.env.COMPOSER_URL||'http://127.0.0.1:8088/social-composer/');
 const dir=path.resolve(__dirname,'../exports/daily-horoscope');fs.mkdirSync(dir,{recursive:true});
 const edition=process.env.HOROSCOPE_DATA?JSON.parse(fs.readFileSync(process.env.HOROSCOPE_DATA,'utf8')):null;
 const keys=['none','sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
 for(const key of keys)for(const blank of [true,false]){
  const data=await page.evaluate(async({key,blank,samples,edition})=>{
   const t=window.AuraHoroscopeTemplate,date=edition?.date||'2026-09-19';
   const blob=await t.render({...edition,date,ordered:t.signs.map((name,i)=>({name,text:edition?edition.readings.find(r=>r.sign===name.toLowerCase()).summary:samples[i]}))},t.palette(key,date),{blank,sample:!blank});
   return await new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result.split(',')[1]);reader.readAsDataURL(blob)});
  },{key,blank,samples,edition});
  fs.writeFileSync(path.join(dir,`${edition?.language||'en'}-${key}-${blank?'blank':edition?'reading':'sample'}.png`),Buffer.from(data,'base64'));
 }
 const sheet=await page.evaluate(async({keys,language,kind})=>{
  const c=document.createElement('canvas');c.width=1440;c.height=1280;const x=c.getContext('2d');x.fillStyle='#e6e3dd';x.fillRect(0,0,c.width,c.height);
  for(let i=0;i<keys.length;i++){const image=new Image();image.src=`exports/daily-horoscope/${language}-${keys[i]}-${kind}.png`;await image.decode();const xx=20+(i%4)*360,yy=20+Math.floor(i/4)*640;x.drawImage(image,xx,yy,320,569);x.fillStyle='#302b26';x.font='500 20px "DM Sans"';x.fillText(keys[i]==='none'?'No tint':keys[i][0].toUpperCase()+keys[i].slice(1),xx,yy+600);}
  return c.toDataURL().split(',')[1];
 },{keys,language:edition?.language||'en',kind:edition?'reading':'sample'});fs.writeFileSync(path.join(dir,`${edition?.language||'en'}-tint-overview.png`),Buffer.from(sheet,'base64'));
 console.log('Exported 8 blank templates, 8 labeled sample renders, and a tint overview.');
}finally{await browser.close()}})();
