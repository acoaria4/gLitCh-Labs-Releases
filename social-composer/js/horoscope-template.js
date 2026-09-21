(() => {
  'use strict';
  const signs=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const rasis=['Mesham','Rishabam','Mithunam','Kadagam','Simmam','Kanni','Thulam','Viruchigam','Dhanusu','Magaram','Kumbam','Meenam'];
  const tamil=['மேஷம்','ரிஷபம்','மிதுனம்','கடகம்','சிம்மம்','கன்னி','துலாம்','விருச்சிகம்','தனுசு','மகரம்','கும்பம்','மீனம்'];
  const palettes=[
    ['Sunday · Warm gold','#efb777','#382d22','#a57938'],
    ['Monday · Moon pearl','#afc7df','#293238','#77868d'],
    ['Tuesday · Terracotta','#da9b88','#40302a','#ac735e'],
    ['Wednesday · Sage','#b3c393','#30372b','#7a8c60'],
    ['Thursday · Saffron','#e5c36a','#403622','#a38a42'],
    ['Friday · Rose','#e8a7ba','#412d35','#ac798b'],
    ['Saturday · Lavender','#b8a6d2','#352f44','#8e80a7'],
  ];
  const neutral=['No tint · AURA ivory','#fbfaf7','#302b26','#ad8658'];
  const keys=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  function palette(key,date){if(key==='none'||key==='general')return neutral;return palettes[key==='daily'?new Date(`${date}T12:00:00Z`).getUTCDay():keys.indexOf(key)]||neutral;}
  const backgroundURL=new URL('../assets/horoscope/ivory-emblems.png',document.currentScript.src).href;
  let background;
  function loadBackground(){return background||(background=new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>{background=null;reject(new Error('Could not load the horoscope artwork. Please reload.'));};i.src=backgroundURL;}));}
  // Segment long Tamil words only at grapheme boundaries, never inside a vowel mark.
  function wrap(c,text,width,locale){
    const lines=[];let line='';
    const pieces=[];
    for(const word of text.trim().split(/\s+/)){
      if(c.measureText(word).width<=width){pieces.push(word);continue;}
      let part='';for(const {segment} of new Intl.Segmenter(locale,{granularity:'grapheme'}).segment(word)){
        if(part&&c.measureText(part+segment).width>width){pieces.push(part);part='';}part+=segment;
      }if(part)pieces.push(part);
    }
    for(const word of pieces){const next=line?`${line} ${word}`:word;if(line&&c.measureText(next).width>width){lines.push(line);line=word;}else line=next;}
    if(line)lines.push(line);return lines;
  }
  async function render(data,colors,{blank=false}={}){
    const ta=data.language==='ta',family=ta?'Noto Sans Tamil':'DM Sans';
    const [art]=await Promise.all([loadBackground(),document.fonts.load('500 64px "Cormorant Garamond"'),document.fonts.load('400 26px "DM Sans"'),document.fonts.load('600 30px "Noto Sans Tamil"','மேஷம்'),document.fonts.load('400 24px "Noto Sans Tamil"','ராசி')]);
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1920;const c=canvas.getContext('2d');
    c.drawImage(art,0,0,1080,1920);
    // Color the atmosphere while leaving the reading panels and brand signature intact.
    if(colors!==neutral&&colors[0]!==neutral[0]){
      c.save();c.beginPath();c.rect(0,0,1080,1920);
      for(let i=0;i<12;i++)c.roundRect(i%2?547:28,412+Math.floor(i/2)*197,505,180,32);
      c.clip('evenodd');
      c.globalCompositeOperation='multiply';c.globalAlpha=.68;c.fillStyle=colors[1];c.fillRect(0,0,1080,1920);c.restore();
    }
    c.textBaseline='top';c.fillStyle=colors[2];
    const text=(v,x,y,font)=>{c.font=font;c.fillText(v,x,y);};
    const center=(v,y,font)=>{c.font=font;c.fillText(v,(1080-c.measureText(v).width)/2,y);};
    center(ta?'இன்றைய ராசிபலன்':'Your daily horoscope',ta?258:250,ta?'600 52px "Noto Sans Tamil"':'500 76px "Cormorant Garamond"');
    const date=new Intl.DateTimeFormat(ta?'ta-IN':'en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${data.date}T12:00:00Z`));
    center(date,345,`400 ${ta?24:25}px "${family}"`);
    signs.forEach((sign,i)=>{
      const cardX=i%2?547:28,y=412+Math.floor(i/2)*197,x=cardX+22;
      c.fillStyle='#fffcf5';c.beginPath();c.roundRect(cardX,y,505,180,32);c.fill();
      // Small header emblems leave the full card width for longer Tamil readings.
      c.save();c.beginPath();c.arc(cardX+42,y+30,22,0,Math.PI*2);c.clip();
      c.drawImage(art,(cardX+29)*art.width/1080,(y+8)*art.height/1920,166*art.width/1080,166*art.height/1920,cardX+20,y+8,44,44);c.restore();c.fillStyle=colors[2];
      let nameSize=ta?27:34;c.font=`${ta?600:500} ${nameSize}px "${ta?family:'Cormorant Garamond'}"`;
      const name=ta?tamil[i]:rasis[i];while(c.measureText(name).width>405){nameSize--;c.font=`${ta?600:500} ${nameSize}px "${ta?family:'Cormorant Garamond'}"`;}
      text(name,cardX+76,y+12,c.font);
      if(blank)return;
      const reading=data.ordered[i];if(!reading||reading.name!==sign)throw new Error(`Missing or unordered ${sign} reading.`);
      let size=ta?23:28,lines;
      do{c.font=`400 ${size}px "${family}"`;lines=wrap(c,reading.text,461,ta?'ta':'en');if(lines.length*Math.ceil(size*1.3)<=116)break;size--;}while(size>=20);
      if(size<20)throw new Error(`${name}'s summary is too long for a readable post. No text was cut and the canvas is unchanged.`);
      lines.forEach((line,n)=>text(line,x,y+56+n*Math.ceil(size*1.3),`400 ${size}px "${family}"`));
    });
    return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('Could not render the horoscope.')),'image/png'));
  }
  window.AuraHoroscopeTemplate={signs,rasis,tamil,palettes,neutral,keys,palette,render};
})();
