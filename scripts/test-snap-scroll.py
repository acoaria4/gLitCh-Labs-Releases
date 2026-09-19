"""Compare native scrolling with a separately served a7bd58a homepage.
SITE_URL defaults to :8088; REFERENCE_URL to :8090. Requires Python Playwright.
"""
import os
from playwright.sync_api import sync_playwright
SITE=os.environ.get('SITE_URL','http://127.0.0.1:8088')
REFERENCE=os.environ.get('REFERENCE_URL','http://127.0.0.1:8090')
SIZES=[(320,568),(390,844),(768,1024),(1024,768),(1440,900),(844,390)]

def position(page):
    return page.evaluate('''()=>({y:scrollY,scene:document.body.dataset.scene,heights:[...document.querySelectorAll('.scene')].map(e=>e.getBoundingClientRect().height)})''')

def sequence(page):
    results=[]
    def capture():
        page.wait_for_timeout(1000);results.append(position(page))
    page.mouse.wheel(0,120);capture()
    for _ in range(5):
        page.mouse.wheel(0,90);page.wait_for_timeout(40)
    capture()
    page.mouse.wheel(0,-500);capture()
    page.keyboard.press('Home');capture()
    page.locator('#next-section').click();capture()
    page.keyboard.press('ArrowDown');capture()
    page.keyboard.press('ArrowUp');capture()
    page.locator('#next-section').click();page.wait_for_timeout(70)
    page.locator('#previous-section').click();capture()
    page.keyboard.press('End');capture()
    page.emulate_media(reduced_motion='reduce')
    page.keyboard.press('Home');capture()
    return results

with sync_playwright() as p:
    for engine in os.environ.get('BROWSERS','chromium,webkit,firefox').split(','):
        browser=getattr(p,engine).launch(timeout=20000,**({'channel':'chrome'} if engine=='chromium' else {}))
        try:
            for w,h in SIZES:
                runs=[]
                for url in [REFERENCE,SITE]:
                    page=browser.new_page(viewport={'width':w,'height':h})
                    page.goto(url);page.evaluate('document.fonts.ready')
                    page.evaluate("Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{})}))")
                    # Native wheel gestures must not be canceled by application code.
                    assert page.evaluate("(()=>{const e=new WheelEvent('wheel',{deltaY:120,bubbles:true,cancelable:true});document.body.dispatchEvent(e);return !e.defaultPrevented})()")
                    runs.append(sequence(page));page.close()
                for step,(old,new) in enumerate(zip(*runs)):
                    assert old['heights']==new['heights'],(engine,w,h,'layout changed')
                    assert old['scene']==new['scene'] and abs(old['y']-new['y'])<=3,(engine,w,h,step,old,new)
                print(f'PASS {engine} {w}x{h}: matches reference wheel, momentum, reversal, buttons, keys and reduced motion',flush=True)
        finally:browser.close()
