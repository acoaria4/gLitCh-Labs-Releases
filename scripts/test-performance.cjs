// Runtime checks for the restored native-scrolling implementation.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try {
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(process.env.SITE_URL||'http://127.0.0.1:8088');
  const toggle=page.locator('.motion-toggle');
  await toggle.click();assert.equal(await toggle.getAttribute('aria-pressed'),'true');
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction(()=>document.body.dataset.scene==='expenses');
  assert.equal(await toggle.getAttribute('aria-pressed'),'true');
  await page.keyboard.press('Home');
  await page.waitForFunction(()=>document.body.dataset.scene==='home');
  await toggle.click();assert.equal(await toggle.getAttribute('aria-pressed'),'false');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.motion-toggle').getAttribute('aria-pressed')==='true');
  for(const id of ['expenses','aura','lumen','studio']) {
   await page.evaluate(id=>document.querySelector(`a[href="#${id}"]`).click(),id);
   await page.waitForFunction(id=>document.body.dataset.scene===id,id);
  }
  assert.equal(await page.locator('#next-section').isDisabled(),true);
  assert.equal(await page.evaluate(()=>{const e=new WheelEvent('wheel',{deltaY:120,bubbles:true,cancelable:true});document.body.dispatchEvent(e);return e.defaultPrevented;}),false);
  console.log('PASS: restored section controls, keyboard/anchor navigation, explicit pause, reduced motion, and native wheel handling.');
 } finally {await browser.close();}
})();
