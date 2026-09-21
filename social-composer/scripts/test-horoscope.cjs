const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({channel:'chrome',headless:true});try{
 let apiCalls=0;
 const page=await browser.newPage({viewport:{width:1280,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://aura-glitchlabs.fly.dev/**',route=>{apiCalls++;const params=new URL(route.request().url()).searchParams;const date=params.get('date'),language=params.get('lang');return route.fulfill({json:{date,language,timezone:'Asia/Kolkata',disclaimer:'For reflection only. Use your own judgement.',readings:['aries','taurus','gemini','cancer','leo','virgo','libra','scorpio','sagittarius','capricorn','aquarius','pisces'].map(sign=>({sign,summary:language==='ta'?'அடுத்த முடிவுக்கு முன் புதிய கோணத்தில் சிந்தியுங்கள்.':'Take one thoughtful step. Give yourself room to grow.'}))}})});
 await page.goto(process.env.COMPOSER_URL||'http://127.0.0.1:8088/social-composer/');await page.locator('[data-brand="aura"]').click();
 const sample='நண்பர்கள் அல்லது தொழில் வட்டாரத்திலிருந்து உதவி கிடைக்கலாம். நீண்டகால திட்டம் ஒன்றை நடைமுறைப்படுத்தும் எண்ணம் வலுப்படும்.';
 const source=page.locator('#horoscope-source'), fields=page.locator('#horoscope-readings textarea');
 const canvas=()=>page.locator('#stage-canvas').evaluate(c=>c.toDataURL());
 const create=async()=>{await page.locator('#horoscope-create').click();await page.waitForFunction(()=>document.querySelector('#horoscope-status').textContent.startsWith('Ready:'));};
 assert.equal(await source.inputValue(),'manual');assert.equal(await page.locator('#horoscope-language').inputValue(),'ta');assert.equal(await fields.count(),12);assert.equal(apiCalls,0);
 assert.equal(await page.locator('#horoscope-api-status').isVisible(),false);
 const initial=await canvas();await page.locator('#horoscope-create').click();assert.equal(await fields.first().evaluate(e=>e===document.activeElement),true);assert.equal(await canvas(),initial);
 for(let i=0;i<12;i++)await fields.nth(i).fill(sample);
 await fields.nth(3).fill('   ');await page.locator('#horoscope-create').click();assert.equal(await fields.nth(3).evaluate(e=>e===document.activeElement),true);await fields.nth(3).fill(sample);
 await create();assert.equal(apiCalls,0);
 const manualImage=await canvas();
 const fs=require('node:fs');fs.mkdirSync('/tmp/aura-manual-review',{recursive:true});
 const manualDownload=page.waitForEvent('download');await page.locator('#btn-download').click();await (await manualDownload).saveAs('/tmp/aura-manual-review/tamil-story.png');
 await fields.first().fill(sample.repeat(30));await page.locator('#horoscope-create').click();await page.waitForFunction(()=>document.querySelector('#horoscope-status').textContent.includes('No text was cut'));assert.equal(await canvas(),manualImage);await fields.first().fill(sample);
 await page.locator('[data-brand="lumen"]').click();await page.locator('[data-brand="aura"]').click();
 await page.locator('#horoscope-language').selectOption('en');assert.equal(await page.locator('#horoscope-readings label').first().innerText(),'Mesham');await page.locator('#horoscope-language').selectOption('ta');
 assert.equal(await page.locator('#horoscope-theme option').count(),9);
 await page.locator('#horoscope-theme').selectOption('friday');await page.locator('#horoscope-date').fill('2026-09-21');await page.locator('#horoscope-date').dispatchEvent('change');assert.equal(await page.locator('#horoscope-theme').inputValue(),'friday');assert.match(await page.locator('#horoscope-palette').innerText(),/Friday/);
 assert.equal(apiCalls,0);
 await source.selectOption('api');
 await page.locator('#horoscope-create').click();await page.waitForFunction(()=>document.querySelector('#horoscope-status').textContent.startsWith('Ready:'));
 assert.deepEqual(await page.locator('#stage-canvas').evaluate(c=>[c.width,c.height]),[1080,1920]);
 for(const lang of ['ta','en']){await page.locator('#horoscope-language').selectOption(lang);await page.locator('#horoscope-create').click();await page.waitForFunction(()=>document.querySelector('#horoscope-status').textContent.startsWith('Ready:'));}
 await source.selectOption('manual');assert.deepEqual(await fields.evaluateAll(es=>es.map(e=>e.value)),Array(12).fill(sample));
 const stable=await canvas();
 // A selection change during image decoding must not commit the old image.
 assert.equal(await page.evaluate(async()=>{
   const t=window.AuraHoroscopeTemplate;
   const blob=await t.render({date:'2026-09-22',language:'ta'},t.neutral,{blank:true});
   return window.auraComposer.setHoroscope(blob,'2026-09-22',()=>false);
 }),false);assert.equal(await canvas(),stable);

 await page.route('https://aura-glitchlabs.fly.dev/**',route=>route.fulfill({status:503,body:'Unavailable'}));
 await source.selectOption('api');await page.locator('#horoscope-create').click();await page.waitForFunction(()=>document.querySelector('#horoscope-status').textContent.includes('HTTP 503'));assert.equal(await canvas(),stable);
 await page.unroute('https://aura-glitchlabs.fly.dev/**');
 let release;const gate=new Promise(resolve=>{release=resolve});let started;const pending=new Promise(resolve=>{started=resolve});
 await page.route('https://aura-glitchlabs.fly.dev/**',async route=>{started();await gate;await route.abort().catch(()=>{});});
 await page.locator('#horoscope-create').click();await pending;await source.selectOption('manual');release();
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 assert.equal(await canvas(),stable);assert.equal(await page.locator('#horoscope-create').isEnabled(),true);assert.equal(await page.locator('#horoscope-api-status').isVisible(),false);
 assert.deepEqual(await fields.evaluateAll(es=>es.map(e=>e.value)),Array(12).fill(sample));
 await page.locator('#horoscope-language').selectOption('ta');
 for(const key of ['none','sunday','monday','tuesday','wednesday','thursday','friday','saturday','daily']){await page.locator('#horoscope-theme').selectOption(key);await page.locator('#horoscope-blank').click();await page.waitForFunction(()=>document.querySelector('#horoscope-status').textContent.startsWith('Blank template ready'));assert.equal(await page.locator('#horoscope-theme option').count(),9)}
 await create();
 const download=page.waitForEvent('download');await page.locator('#btn-download').click();assert.match((await download).suggestedFilename(),/aura-daily-horoscope-2026-09-21-1080x1920/);
 const overflow=await page.evaluate(async()=>{try{const t=window.AuraHoroscopeTemplate;await t.render({date:'2026-09-21',ordered:t.signs.map(name=>({name,text:'Long summary '.repeat(80)})),disclaimer:'Context'},t.neutral);return false}catch(e){return /No text was cut/.test(e.message)}});assert.equal(overflow,true);
 await page.setViewportSize({width:390,height:844});await fields.first().scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/aura-manual-review/mobile.png'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 await page.setViewportSize({width:1280,height:900});await page.locator('#horoscope-source').scrollIntoViewIfNeeded();await page.screenshot({path:'/tmp/aura-manual-review/desktop.png'});
 console.log('PASS: manual default, Tamil sample, missing/overflow validation, draft retention, API failures/cancellation, API-fed render, all nine selections, date-independent tints, blank templates, PNG export, overflow guard, mobile width.');
}finally{await browser.close()}})();
