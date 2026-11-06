"""Build shared page shells from local content; writes the live site at the repository root."""
from pathlib import Path
from urllib.parse import urlsplit, unquote
import argparse, hashlib, html, json, posixpath, re
ROOT=Path(__file__).resolve().parents[1]
_parser=argparse.ArgumentParser(description=__doc__)
_parser.add_argument('--reuse-assets',action='store_true',help='Rebuild content and resource links using existing verified assets; do not run the asset optimizer')
_args=_parser.parse_args()

def read(path):
 return path.read_text(encoding='utf-8')

_manifest_path=ROOT/'assets/optimized/manifest.json'
_manifest=json.loads(read(_manifest_path)) if _manifest_path.exists() else {}
if _args.reuse_assets:
 if not _manifest.get('assets'):raise RuntimeError('--reuse-assets requires an existing optimized asset manifest')
 # Validate every reused output before changing any generated page. Source hashes
 # are intentionally not checked: this mode only publishes content changes.
 for _item in _manifest['assets'].values():
  for _key in ('output','fallback'):
   if _key not in _item:continue
   _output=(ROOT/_item[_key]).resolve()
   if not _output.is_relative_to((ROOT/'assets/optimized').resolve()):raise RuntimeError('Asset output escapes optimized directory')
   _expected=_item['output_sha256' if _key=='output' else 'fallback_sha256']
   if not _output.is_file() or hashlib.sha256(_output.read_bytes()).hexdigest()!=_expected:raise RuntimeError(f'Changed or missing optimized asset: {_item[_key]}')

def write_page(path,text):
 if _args.reuse_assets:
  text=re.sub(r'<link\b[^>]*data-optimized-preload[^>]*>\s*','',text)
  def tag(match):
   favicon=bool(re.search(r'rel="icon"',match[0]))
   def attr(attribute):
    url=urlsplit(attribute[2].replace('\\','/'))
    if url.scheme or url.netloc or not url.path:return attribute[0]
    target=(path.parent/unquote(url.path)).resolve()
    if not target.is_relative_to(ROOT):return attribute[0]
    item=_manifest['assets'].get(target.relative_to(ROOT).as_posix())
    if not item:return attribute[0]
    output=item.get('fallback',item['output']) if favicon else item['output']
    return f'{attribute[1]}="{posixpath.relpath(output,path.parent.relative_to(ROOT).as_posix())}"'
   return re.sub(r'\b(src|href)="([^"]+)"',attr,match[0])
  text=re.sub(r'<(?:link|img|script)\b[^>]*>',tag,text)
  numbers=[2,4] if 'aura' in path.relative_to(ROOT).parts else [13,12] if 'lumen' in path.relative_to(ROOT).parts else [10,8] if 'expenses' in path.relative_to(ROOT).parts else [10,4]
  links=''.join(f'<link data-optimized-preload rel="preload" as="font" type="font/woff2" crossorigin href="{posixpath.relpath(_manifest["assets"][f"assets/fonts/font-{number}.ttf"]["output"],path.parent.relative_to(ROOT).as_posix())}">' for number in numbers)
  if 'fonts.' in text:text=text.replace('</head>',links+'</head>')
 if not path.exists() or read(path)!=text:path.write_text(text,encoding='utf-8',newline='\n')

# Resolve generated asset URLs before updating shells; regenerate them at the end.
# Load build dependencies before writing anything, so a missing dependency is safe.
if not _args.reuse_assets:
 import importlib.util
 _spec=importlib.util.spec_from_file_location('optimize_assets', ROOT/'scripts/optimize-assets.py')
 _optimizer=importlib.util.module_from_spec(_spec);_spec.loader.exec_module(_optimizer)
 if _manifest:
  for _page in _optimizer.pages():write_page(_page,_optimizer.original_references(read(_page),_page,_manifest))
PRODUCTS={'expenses':('Expenses','#0b0b12'),'aura':('AURA','#f2ede5'),'lumen':('Lumen','#f8e7ed'),'studio':('gLitCh Labs','#0b0d10')}
LABELS={'privacy':'Privacy','terms':'Terms','support':'Support','delete-account':'Delete account','data-controls':'Data controls','invite':'Group invite','about':'About','contact':'Contact'}
def styles(prefix):
 return ''.join(f'<link rel="stylesheet" href="{prefix}{name}.css?v=unified-1">' for name in ['fonts','styles','product-themes','typography','documents','navigation'])
def resources(slug,prefix=''):
 return ''.join(f'<a href="{prefix}{key}.html">{LABELS[key]}</a>' for key in ('privacy','terms','support','delete-account','data-controls') if (ROOT/'content'/slug/(key+'.html')).exists())
for slug,(name,color) in PRODUCTS.items():
 studio=slug=='studio';prefix='' if studio else '../';theme='studio-site' if studio else slug;asset='glitchlabs' if studio else slug
 folder=ROOT if studio else ROOT/slug
 for source in sorted((ROOT/'content'/slug).glob('*.html')):
  key=source.stem;body=read(source);title=re.sub('<[^>]+>',' ',re.search(r'<h1>([\s\S]*?)</h1>',body).group(1)).strip()
  toc=[]
  def heading(m):
   attrs,label=m.group(1),m.group(2)
   existing=re.search(r'id="([^"]+)"',attrs)
   ident=existing.group(1) if existing else 'topic-'+str(len(toc)+1)
   toc.append((ident,re.sub('<[^>]+>','',label)))
   return f'<h2{attrs if existing else attrs+" id="+chr(34)+ident+chr(34)}>{label}</h2>'
  body=re.sub(r'<h2([^>]*)>([\s\S]*?)</h2>',heading,body)
  if key=='privacy':
   links=''.join(f'<li><a href="#{i}">{html.escape(t)}</a></li>' for i,t in toc)
   body=re.sub(r'(</h1>)',r'\1'+f'<details class="document-toc"><summary>On this page</summary><ol>{links}</ol></details>',body,count=1)
  body=body.replace('class="cta"','class="doc-action"')
  sidebar=''.join(f'<a href="{p.stem}.html"'+(' aria-current="page"' if p.stem==key else '')+f'>{LABELS[p.stem]}</a>' for p in sorted((ROOT/'content'/slug).glob('*.html')))
  if not studio:sidebar='<a href="index.html">Overview</a><a href="get/index.html">Get the app</a>'+sidebar
  navbrand=f'<a class="brand" href="index.html"><img src="{prefix}assets/{asset}.png" alt="" width="32" height="32"><span class="product-name">{name}<span class="name-dot" aria-hidden="true">.</span></span></a>'
  navlinks='<a href="about.html">About</a><a href="index.html#expenses">Our apps ↗</a>' if studio else f'<a href="support.html">Support</a><a class="contact-link" href="../index.html#{slug}">All apps ↗</a>'
  footer_links=resources(slug) if not studio else '<a href="about.html">About</a><a href="contact.html">Contact</a>'
  footer=f'<a href="{prefix}index.html">← gLitCh Labs</a><nav aria-label="Product resources">{footer_links}</nav><span>© 2026 gLitCh Labs</span>'
  script='<script src="../invite.js" defer></script>' if key=='invite' else ''
  page=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="{color}"><meta name="description" content="{html.escape(title)} — {name} by gLitCh Labs."><title>{html.escape(title)} — {name}</title><link rel="icon" href="{prefix}assets/{asset}.png">{styles(prefix)}{script}</head><body class="product-site document-site {theme}"><a class="skip" href="#content">Skip to content</a><header class="navigation">{navbrand}<nav aria-label="Main navigation">{navlinks}</nav></header><main class="document-shell"><aside class="document-sidebar"><p class="eyebrow">{name}</p><nav aria-label="{name} pages">{sidebar}</nav></aside><article class="document-content" id="content">{body}</article></main><footer class="product-footer">{footer}</footer></body></html>'''
  write_page(folder/(key+'.html'),page)
# Apply shared typography and local resources to the four existing marketing pages.
for slug,(name,color) in PRODUCTS.items():
 if slug=='studio':continue
 p=ROOT/slug/'index.html';s=read(p)
 if _args.reuse_assets:
  # Content-only builds preserve the existing landing/download design and assets.
  # Only their resource navigation may need a new legal page link.
  for _path,_prefix in ((p,''),(ROOT/slug/'get/index.html','../')):
   if not _path.exists():raise RuntimeError(f'Missing existing download/landing page: {_path}')
   _text=read(_path)
   _extra='<a href="get/index.html">Get the app</a>' if _path==p else ''
   _text=re.sub(r'<nav aria-label="Product resources">.*?</nav>',f'<nav aria-label="Product resources">{resources(slug,_prefix)}{_extra}</nav>',_text)
   write_page(_path,_text)
  continue
 for sheet in ('fonts','typography','navigation'):
  if f'../{sheet}.css' not in s:s=s.replace('</head>',f'<link rel="stylesheet" href="../{sheet}.css"></head>')
 s=re.sub(r'<h1 id="product-title">.*?</h1>',f'<h1 id="product-title">{name}<span class="name-dot" aria-hidden="true">.</span></h1>',s)
 s=re.sub(r'<a class="brand" href="../index.html">[\s\S]*?</a>',f'<a class="brand" href="../index.html#{slug}"><img src="../assets/{slug}.png" alt="" width="32" height="32"><span class="product-name">{name}<span class="name-dot" aria-hidden="true">.</span></span></a>',s,count=1)
 s=re.sub(r'<nav aria-label="Product resources">.*?</nav>',f'<nav aria-label="Product resources">{resources(slug)}<a href="get/index.html">Get the app</a></nav>',s)
 write_page(p,s)
 # Short /get destination shares the exact live download controls and identity.
 title=re.search(r'<h1 id="product-title">.*?</h1>',s).group(0)
 desc='<p class="description">'+{'expenses':'Your spending. One clear picture.','aura':'Your stars. A clearer view.','lumen':'Small quizzes. Big sparks.'}[slug]+'</p>'
 stores=re.search(r'<div class="store-links"[\s\S]*?</div>',s).group(0)
 note=re.search(r'<p class="release-note">.*?</p>',s).group(0)
 get_description=f'Get {name} by gLitCh Labs. '+('Available on Google Play and the App Store.' if slug=='expenses' else 'Download availability and beta links.')
 getdir=ROOT/slug/'get';getdir.mkdir(exist_ok=True)
 write_page(getdir/'index.html',f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="{color}"><meta name="description" content="{get_description}"><title>Get {name} — gLitCh Labs</title><link rel="icon" href="../../assets/{slug}.png">{styles('../../')}<link rel="stylesheet" href="../../get.css?v=compact-2"></head><body class="product-site get-site {slug}"><header class="navigation"><a class="brand" href="../index.html"><img src="../../assets/{slug}.png" alt="" width="32" height="32"><span class="product-name">{name}<span class="name-dot" aria-hidden="true">.</span></span></a><nav aria-label="Main navigation"><a href="../support.html">Support</a><a href="../../index.html#{slug}">All apps ↗</a></nav></header><main class="product-landing"><div class="landing-visual"><img class="landing-icon" src="../../assets/{slug}.png" alt="" width="1280" height="1280"></div><div class="landing-copy">{title}{desc}{stores}{note}</div></main><footer class="product-footer"><a href="../../index.html">gLitCh Labs</a><nav aria-label="Product resources">{resources(slug,'../')}</nav></footer></body></html>''')
if not _args.reuse_assets:
 p=ROOT/'index.html';s=read(p)
 for sheet in ('fonts','typography','navigation'):
  if not re.search(r'href="'+re.escape(sheet)+r'\.css(?:\?[^"]*)?"',s):s=s.replace('</head>',f'<link rel="stylesheet" href="{sheet}.css"></head>')
 for slug in ('expenses','aura','lumen'):
  s=s.replace(f'https://acoaria4.github.io/gLitCh-Labs-Releases/{slug}/privacy.html',f'{slug}/privacy.html')
 s=s.replace('https://acoaria4.github.io/gLitCh-Labs-Releases/about.html','about.html')
 s=s.replace('<a href="mailto:glitchlabsio@gmail.com">Contact</a>','<a href="contact.html">Contact</a>')
 write_page(p,s)
print('Built supporting pages and /get pages; linked shared typography and local resources.')

if not _args.reuse_assets:_optimizer.main()
else:print('Reused verified optimized assets without rebuilding images, fonts, CSS or JavaScript.')
