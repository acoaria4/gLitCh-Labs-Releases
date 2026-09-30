from pathlib import Path
import json,shutil,hashlib,xml.etree.ElementTree as ET,html,zipfile
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
out=Path(__file__).resolve().parents[1]
svg_ns='http://www.w3.org/2000/svg';ET.register_namespace('',svg_ns)
logo=ET.parse(out/'references/trayn-stacked-silver.svg').getroot();logo.set('x','143');logo.set('y','55');logo.set('width','514');logo.set('height','327');logo.set('id','logo-vector-reconstruction')
logo_markup=ET.tostring(logo,encoding='unicode')
defs='''<defs><linearGradient id="type-silver" x1="0" y1="0" x2="0.8" y2="1"><stop offset="0" stop-color="#f1f1f1"/><stop offset="0.26" stop-color="#e2e2e2"/><stop offset="0.52" stop-color="#b9b9b9"/><stop offset="0.75" stop-color="#909090"/><stop offset="1" stop-color="#c2c2c2"/></linearGradient><linearGradient id="ribbon-red" x1="0" y1="0" x2="1" y2="0.5"><stop stop-color="#b61820"/><stop offset="0.42" stop-color="#ed3035"/><stop offset="0.75" stop-color="#aa1118"/><stop offset="1" stop-color="#e32c32"/></linearGradient><linearGradient id="ribbon-silver" x1="0" y1="0" x2="0.8" y2="1"><stop stop-color="#ededed"/><stop offset="0.5" stop-color="#a4a4a4"/><stop offset="1" stop-color="#dedede"/></linearGradient><clipPath id="panel"><rect width="800" height="1200"/></clipPath></defs>'''
red_paths=['M-15 973 C190 778 592 942 749 485 C810 289 802 124 702 -25 C834 93 863 293 802 514 C675 961 258 827 -15 1008Z','M-15 1000 C269 764 582 880 813 1052 L813 1084 C559 887 222 832 -15 1022Z','M-15 958 C187 811 518 898 714 621 C839 442 868 168 781 41 C888 197 851 475 735 655 C524 916 185 839 -15 980Z']
silver_paths=['M-15 941 C192 795 492 904 683 651 C823 459 824 225 774 97 C843 237 837 478 696 673 C506 927 195 815 -15 956Z','M-15 999 C258 817 597 929 813 1107 L813 1125 C574 927 229 842 -15 1012Z','M-15 982 C253 799 613 915 750 629 C773 582 792 527 805 474 C788 561 776 609 760 646 C603 946 258 822 -15 990Z']
def paths(items,fill):return ''.join(f'<path d="{p}" fill="{fill}"/>' for p in items)
ribbons='<g id="slipstream-ribbons" clip-path="url(#panel)"><g id="silver-ribbons">'+paths(silver_paths,'url(#ribbon-silver)')+'</g><g id="red-ribbons">'+paths(red_paths,'url(#ribbon-red)')+'</g></g>'
copy=[dict(id='hero-whey',text='WHEY',font='BigShoulders-Bold.ttf',x=145,y=404,w=510,h=245),dict(id='descriptor-line-1',text='Whey Protein Concentrate +',font='Montserrat-Bold.ttf',x=130,y=691,size=26),dict(id='descriptor-line-2',text='Whey Protein Isolate Blend',font='Montserrat-Bold.ttf',x=144,y=725,size=26),dict(id='flavour',text='Belgian Chocolate',font='Montserrat-Bold.ttf',x=90,y=1005,size=30),dict(id='quantity',text='Net Quantity: 500 g',font='Montserrat-Regular.ttf',x=90,y=1070,size=20),dict(id='allergen',text='Contains Milk',font='Montserrat-Regular.ttf',x=90,y=1100,size=18),dict(id='concept-footer',text='PACKAGING CONCEPT — NOT FOR SALE',font='Montserrat-Regular.ttf',x=170,y=1160,size=11)]
def lettering(j,outlined):
 font=TTFont(out/'fonts'/j['font']);glyphs=font.getGlyphSet();cmap=font.getBestCmap();units=font['head'].unitsPerEm;advance=0;segments=[]
 from fontTools.pens.boundsPen import BoundsPen
 from fontTools.pens.transformPen import TransformPen
 combined=SVGPathPen(glyphs)
 bounds=[]
 for c in j['text']:
  name=cmap[ord(c)];glyphs[name].draw(TransformPen(combined,(1,0,0,1,advance,0)));pen=SVGPathPen(glyphs);glyphs[name].draw(pen);bp=BoundsPen(glyphs);glyphs[name].draw(bp)
  if bp.bounds:bounds.append((bp.bounds[0]+advance,bp.bounds[1],bp.bounds[2]+advance,bp.bounds[3]))
  segments.append(f'<path transform="translate({advance} 0)" d="{pen.getCommands()}"/>');advance+=font['hmtx'][name][0]
 xmin=min(b[0] for b in bounds);xmax=max(b[2] for b in bounds);ymin=min(b[1] for b in bounds);ymax=max(b[3] for b in bounds)
 if 'w' in j:
  sx=j['w']/(xmax-xmin);sy=j['h']/(ymax-ymin);tx=j['x']-xmin*sx;ty=j['y']+ymax*sy
 else:
  sx=sy=j['size']/units;tx=j['x'];ty=j['y']
  if j['id'].startswith('descriptor'):tx=(800-(xmax-xmin)*sx)/2-xmin*sx
 if outlined:return f'<g id="{j["id"]}" aria-label="{html.escape(j["text"])}" fill="url(#type-silver)" transform="translate({tx} {ty}) scale({sx} {-sy})">'+f'<path d="{combined.getCommands()}"/></g>'
 family='Big Shoulders' if j['font'].startswith('Big') else 'Montserrat';weight='700' if 'Bold' in j['font'] else '400'
 if 'w' in j:return f'<g transform="translate({tx} {ty}) scale({sx} {sy})"><text id="{j["id"]}" x="0" y="0" font-size="{units}" font-family="{family}" font-weight="{weight}" fill="url(#type-silver)">{html.escape(j["text"])}</text></g>'
 return f'<text id="{j["id"]}" x="{tx}" y="{ty}" font-size="{j["size"]}" font-family="{family}" font-weight="{weight}" fill="url(#type-silver)">{html.escape(j["text"])}</text>'
def shell(body):return '<svg xmlns="http://www.w3.org/2000/svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" width="800" height="1200" viewBox="0 0 800 1200"><title>TRAYN Slipstream — flat front artwork draft; not a dieline</title>'+defs+body+'</svg>'
for outlined,name in [(True,'slipstream-front-outlined.svg'),(False,'slipstream-front-editable-text.svg')]:
 body='<g id="black-background"><rect width="800" height="1200" fill="#111111"/></g>'+ribbons+'<g id="logo">'+logo_markup+'</g><g id="product-type">'+''.join(lettering(j,outlined) for j in copy)+'</g><g id="flavour-underline"><path d="M90 1023 L166 1023 L166 1028 L90 1028Z" fill="#e62b31"/></g>'
 (out/'artwork'/name).write_text(shell(body))
(out/'artwork/slipstream-ribbons.svg').write_text(shell(ribbons))
(out/'source/layout.json').write_text(json.dumps(dict(canvas=dict(width=800,height=1200,units='reference SVG units, not physical pouch dimensions'),copy=copy,red_ribbon_paths=red_paths,silver_ribbon_paths=silver_paths),indent=2)+'\n')

print(out)
