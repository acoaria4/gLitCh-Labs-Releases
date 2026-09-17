(() => {
  'use strict';
  const ENDPOINT = 'https://aura-glitchlabs.fly.dev/api/horoscopes/daily';
  const SIGNS = ['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'];
  const GLYPHS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];
  // Editorial day palettes, selected from the reading date (not the viewer's timezone).
  const PALETTES = [
    ['Sunday · Warm gold','#faf0da','#3b2915','#98611c'],
    ['Monday · Moon pearl','#eff2f5','#263340','#64778a'],
    ['Tuesday · Terracotta','#f8e9e2','#48261f','#a34b36'],
    ['Wednesday · Sage','#edf2e7','#29382a','#597647'],
    ['Thursday · Saffron','#faf2dc','#453317','#986c1d'],
    ['Friday · Rose','#f8e7ed','#492634','#a34d70'],
    ['Saturday · Indigo','#eaeaf4','#2d2c49','#666294'],
  ];
  const GENERAL = ['General · AURA ivory','#f2ede5','#2b1c10','#ba7f46'];
  const dateInput = document.getElementById('horoscope-date');
  const theme = document.getElementById('horoscope-theme');
  const button = document.getElementById('horoscope-create');
  const status = document.getElementById('horoscope-status');
  const paletteLabel = document.getElementById('horoscope-palette');
  const apiStatus = document.getElementById('horoscope-api-status');
  let apiController = null;
  let apiRevision = 0;
  function setApiStatus(state, text) {
    apiStatus.dataset.state = state;
    apiStatus.textContent = text;
    apiStatus.title = state === 'waiting'
      ? 'The response is taking longer than usual. The API may be starting up.'
      : state === 'working' ? 'The daily horoscope endpoint returned a valid edition.'
      : state === 'error' ? 'The request failed, timed out, or returned invalid readings. Select AURA again or create a horoscope to retry.' : '';
  }
  async function fetchReadings(day, signal) {
    apiController?.abort();
    const controller = new AbortController();
    apiController = controller;
    const version = ++apiRevision;
    let timedOut = false;
    const cancel = () => controller.abort();
    signal?.addEventListener('abort', cancel, {once:true});
    if (signal?.aborted) cancel();
    setApiStatus('checking', 'Checking API…');
    const slow = setTimeout(() => {
      if (version === apiRevision) setApiStatus('waiting', 'Waiting for API to cold start');
    }, 3000);
    const timeout = setTimeout(() => {timedOut = true;controller.abort();}, 60000);
    try {
      const url = new URL(ENDPOINT);
      url.searchParams.set('date', day);url.searchParams.set('lang', 'en');
      const response = await fetch(url, {signal:controller.signal, credentials:'omit', cache:'no-store'});
      if (!response.ok) throw new Error(`AURA returned HTTP ${response.status}. Please retry when the daily API is available.`);
      const data = validate(await response.json(), day);
      if (version === apiRevision) setApiStatus('working', 'Working');
      return data;
    } catch (error) {
      // Canceled selections are not outages; only failed or timed-out requests are.
      if (version === apiRevision && (!controller.signal.aborted || timedOut)) setApiStatus('error', 'API not working');
      throw error;
    } finally {
      clearTimeout(slow);clearTimeout(timeout);
      signal?.removeEventListener('abort', cancel);
      if (version === apiRevision) apiController = null;
    }
  }
  function checkApi() {
    if (!dateInput.checkValidity() || request) return;
    fetchReadings(dateInput.value).catch(() => {});
  }
  document.querySelector('[data-brand="aura"]').addEventListener('click', checkApi);
  document.querySelectorAll('[data-brand]:not([data-brand="aura"])').forEach(button => {
    button.addEventListener('click', () => {
      if (!request) {apiRevision++;apiController?.abort();apiController=null;}
    });
  });
  let request = null;
  let revision = 0;
  dateInput.value = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  function palette() {
    return theme.value === 'general' ? GENERAL : PALETTES[new Date(`${dateInput.value}T12:00:00Z`).getUTCDay()] || GENERAL;
  }
  function update() {
    revision++;
    request?.abort();
    request = null;
    button.disabled = false;
    button.textContent = 'Create horoscope';
    const colors = palette();
    paletteLabel.textContent = colors[0];
    paletteLabel.style.setProperty('--day-accent', colors[3]);
    status.textContent = 'Create to apply this date and color. Any existing canvas stays unchanged until ready.';
  }
  dateInput.addEventListener('change', () => {update();checkApi();});
  theme.addEventListener('change', update);
  update();

  function validate(data, day) {
    if (data.date !== day || data.language !== 'en' || data.timezone !== 'Asia/Kolkata' || !Array.isArray(data.readings) || data.readings.length !== 12) {
      throw new Error('AURA returned an incomplete or different-date edition. No post was created.');
    }
    const ordered = SIGNS.map(name => {
      const matches = data.readings.filter(r => r.sign === name.toLowerCase());
      if (matches.length !== 1 || typeof matches[0].summary !== 'string' || !matches[0].summary.trim()) {
        throw new Error(`The ${name} reading is missing. No post was created.`);
      }
      return {name, text: matches[0].summary.trim()};
    });
    if (typeof data.disclaimer !== 'string' || !data.disclaimer.trim()) throw new Error('AURA did not return its reading context. Please retry.');
    return {...data, ordered};
  }
  function wrap(ctx, text, width) {
    const lines=[]; let line='';
    for (const word of text.split(/\s+/)) {
      if (ctx.measureText(word).width > width) throw new Error('A reading contains text too wide for this template.');
      const next=line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > width) {lines.push(line);line=word;} else line=next;
    }
    if(line)lines.push(line);
    return lines;
  }
  async function render(data, colors) {
    await Promise.all([document.fonts.load('500 66px "Cormorant Garamond"'),document.fonts.load('400 26px "DM Sans"')]);
    const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
    const c=canvas.getContext('2d');const [,paper,ink,accent]=colors;
    c.fillStyle=paper;c.fillRect(0,0,1080,1350);
    c.textBaseline='top';
    // AURA's circle-and-crescent motif, drawn sharply at export resolution.
    c.fillStyle=accent;c.beginPath();c.arc(540,42,13,0,Math.PI*2);c.fill();
    c.beginPath();c.arc(540,52,33,0,Math.PI);c.arc(540,42,30,Math.PI,0,true);c.fill();
    function centered(text,y,font,color=ink){c.font=font;c.fillStyle=color;c.fillText(text,(1080-c.measureText(text).width)/2,y);}
    centered('AURA',92,'500 48px "Cormorant Garamond"');
    c.font='500 48px "Cormorant Garamond"';const brandWidth=c.measureText('AURA').width;c.fillStyle=accent;c.beginPath();c.arc(540+brandWidth/2+12,126,4,0,Math.PI*2);c.fill();
    centered('Your daily horoscope',151,'500 66px "Cormorant Garamond"');
    const dateLabel=new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(`${data.date}T12:00:00Z`));
    centered(dateLabel,232,'400 25px "DM Sans"');
    centered('12 Moon signs · A moment of daily reflection',273,'400 20px "DM Sans"');
    c.strokeStyle=accent;c.lineWidth=1.3;
    const top=319,rowH=149,left=48,right=1032;
    for(let row=0;row<=6;row++){c.beginPath();c.moveTo(left,top+row*rowH);c.lineTo(right,top+row*rowH);c.stroke();}
    c.beginPath();c.moveTo(540,top+12);c.lineTo(540,top+6*rowH-12);c.stroke();
    data.ordered.forEach((reading,i)=>{
      const x=i%2===0?60:566,y=top+Math.floor(i/2)*rowH+17;
      c.font='38px Georgia';c.fillStyle=accent;c.fillText(GLYPHS[i]+"\uFE0E",x,y);
      c.font='500 42px "Cormorant Garamond"';c.fillStyle=ink;c.fillText(reading.name,x+62,y-1);
      let lines,size=25;
      do {c.font=`400 ${size}px "DM Sans"`;lines=wrap(c,reading.text,448);if(lines.length*(size*1.22)<=79)break;size--;} while(size>=21);
      if(size<21)throw new Error(`${reading.name}'s summary is too long for a readable post. No text was cut; the existing canvas is unchanged.`);
      lines.forEach((line,n)=>c.fillText(line,x,y+51+n*size*1.22));
    });
    c.font='400 18px "DM Sans"';const footer=wrap(c,data.disclaimer,952);
    if(footer.length>3)throw new Error('Reading context is too long for the footer.');
    footer.forEach((line,i)=>centered(line,1230+i*23,'400 18px "DM Sans"'));
    centered('AURA · Daily transits at 6 AM IST',1311,'400 17px "DM Sans"',accent);
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not render the post.')),'image/png'));
  }
  button.addEventListener('click', async()=>{
    if(!dateInput.reportValidity())return;
    const day=dateInput.value,colors=palette(),version=++revision;
    request?.abort();const controller=new AbortController();request=controller;
    button.disabled=true;button.textContent='Loading AURA…';status.textContent=`Fetching all 12 readings for ${day}…`;
    try {
      const data=await fetchReadings(day, controller.signal);
      const blob=await render(data,colors);
      if(version!==revision)return;
      await window.auraComposer.setHoroscope(blob,day);
      status.textContent=`Ready: ${day} · ${colors[0]} · all 12 readings from AURA. Download PNG to export.`;
    } catch(error) {
      if(version!==revision)return;
      status.textContent=error.name==='AbortError' ? 'AURA took too long to respond. Please retry. The canvas is unchanged.' : error instanceof TypeError ? 'Could not reach AURA. Check your connection and that the API allows this website. The canvas is unchanged.' : error.message;
    } finally {
      if(version===revision){button.disabled=false;button.textContent='Create horoscope';request=null;}
    }
  });
})();
