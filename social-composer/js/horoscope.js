(() => {
  'use strict';
  const ENDPOINT = 'https://aura-glitchlabs.fly.dev/api/horoscopes/daily';
  const template = window.AuraHoroscopeTemplate;
  const SIGNS = template.signs;
  const dateInput = document.getElementById('horoscope-date');
  const language = document.getElementById('horoscope-language');
  const context = document.getElementById('horoscope-context');
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
  async function fetchReadings(day, lang, signal) {
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
      url.searchParams.set('date', day);url.searchParams.set('lang', lang);
      const response = await fetch(url, {signal:controller.signal, credentials:'omit', cache:'no-store'});
      if (!response.ok) throw new Error(`AURA returned HTTP ${response.status}. Please retry when the daily API is available.`);
      const data = validate(await response.json(), day, lang);
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
    fetchReadings(dateInput.value, language.value).catch(() => {});
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
  function palette() { return template.palette(theme.value, dateInput.value); }
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
  language.addEventListener('change', () => {update();checkApi();});
  update();

  function validate(data, day, lang) {
    if (data.date !== day || data.language !== lang || data.timezone !== 'Asia/Kolkata' || !Array.isArray(data.readings) || data.readings.length !== 12) {
      throw new Error('AURA returned an incomplete, different-language, or different-date edition. No post was created.');
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
  const render = template.render;
  document.getElementById('horoscope-blank').addEventListener('click', async () => {
    if (!dateInput.reportValidity()) return;
    const version=++revision, day=dateInput.value,lang=language.value;
    request?.abort();request=null;button.disabled=false;button.textContent='Create horoscope';
    try {
      const blob=await render({date:day,language:lang},palette(),{blank:true});
      if(version!==revision)return;
      await window.auraComposer.setHoroscope(blob,day);
      context.textContent='';
      status.textContent='Blank template ready. Add your own readings beside each emblem. Download PNG to export.';
    } catch(error) {if(version===revision)status.textContent=error.message;}
  });
  button.addEventListener('click', async()=>{
    if(!dateInput.reportValidity())return;
    const day=dateInput.value,lang=language.value,colors=palette(),version=++revision;
    request?.abort();const controller=new AbortController();request=controller;
    button.disabled=true;button.textContent='Loading AURA…';status.textContent=`Fetching all 12 readings for ${day}…`;
    try {
      const data=await fetchReadings(day, lang, controller.signal);
      const blob=await render(data,colors);
      if(version!==revision)return;
      await window.auraComposer.setHoroscope(blob,day);
      context.textContent=data.disclaimer;context.lang=lang;
      status.textContent=`Ready: ${day} · ${colors[0]} · ${lang==='ta'?'தமிழ்':'English'} · all 12 readings from AURA. Download PNG to export.`;
    } catch(error) {
      if(version!==revision)return;
      status.textContent=error.name==='AbortError' ? 'AURA took too long to respond. Please retry. The canvas is unchanged.' : error instanceof TypeError ? 'Could not reach AURA. Check your connection and that the API allows this website. The canvas is unchanged.' : error.message;
    } finally {
      if(version===revision){button.disabled=false;button.textContent='Create horoscope';request=null;}
    }
  });
})();
