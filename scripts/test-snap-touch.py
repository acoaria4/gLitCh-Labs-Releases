"""Compare native Chromium touch scrolling against the separately served reference."""
import os
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome')
    try:
        for w,h in [(320,568),(390,844),(768,1024),(844,390)]:
            runs=[]
            for url in [os.environ.get('REFERENCE_URL','http://127.0.0.1:8090'),os.environ.get('SITE_URL','http://127.0.0.1:8088')]:
                page=browser.new_page(viewport={'width':w,'height':h},has_touch=True,is_mobile=True)
                page.goto(url);page.evaluate('document.fonts.ready')
                cdp=page.context.new_cdp_session(page);results=[]
                for direction in [-1,1]:
                    x=w*.5;y=h*(.65 if direction<0 else .35)
                    cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
                    for i in range(1,9):
                        cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y+direction*h*.25*i/8}]})
                        page.wait_for_timeout(35)
                    cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(1200)
                    results.append(page.evaluate('({y:scrollY,scene:document.body.dataset.scene})'))
                runs.append(results);page.close()
            for old,new in zip(*runs):
                assert old['scene']==new['scene'] and abs(old['y']-new['y'])<4,(w,h,old,new)
            print(f'PASS native touch {w}x{h}: forward/reverse matches reference',flush=True)
    finally:browser.close()
