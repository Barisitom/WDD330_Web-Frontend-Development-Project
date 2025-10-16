const KEY = 'hld-state-v1';
export function loadLogs(){
  try{ const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; }catch(e){return null}
}
export function saveLog(state){
  try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){console.error(e)}
}
