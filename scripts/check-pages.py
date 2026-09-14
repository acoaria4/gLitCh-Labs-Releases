from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import re
ROOT=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.links=[];self.ids=set();self.h1=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.add(a['id'])
  if tag=='h1':self.h1+=1
  for key in ('href','src'):
   if a.get(key):self.links.append(a[key])
pages={p:Page(p.read_text()) for p in ROOT.rglob('*.html') if not {'content', 'old_main_website', 'glitch-labs-website', '.git'}.intersection(p.relative_to(ROOT).parts) and not p.name.startswith('google')}
for p,page in pages.items():
 assert page.h1==1,(p,'heading count',page.h1)
 for url in page.links:
  u=urlsplit(url)
  if u.scheme or u.netloc:continue
  target=(p.parent/unquote(u.path)).resolve() if u.path else p
  if target.is_dir():target/= 'index.html'
  assert target.is_file(),(p,url,'missing file')
  if u.fragment and target in pages:assert u.fragment in pages[target].ids,(p,url,'missing anchor')
for slug in ('expenses','aura','lumen'):
 source=(ROOT/'content'/slug/'privacy.html').read_text()
 output=(ROOT/slug/'privacy.html').read_text()
 article=re.search(r'<article class="document-content"[^>]*>([\s\S]*?)</article>',output).group(1)
 article=re.sub(r'<details[\s\S]*?</details>','',article)
 plain=lambda s:' '.join(re.sub('<[^>]*>',' ',s).split())
 assert plain(source)==plain(article),(slug,'privacy wording changed')
for p in ROOT.glob('*.css'):
 for path in re.findall(r'url\(([^)]+)\)',p.read_text()):
  path=path.strip('\'"')
  if not path.startswith(('data:','http')):assert (p.parent/path).exists(),(p,path)
print(f'PASS: {len(pages)} pages, local links/anchors/assets, one h1 per page, privacy text preserved.')
