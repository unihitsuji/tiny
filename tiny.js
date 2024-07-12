/*
  ## 使用中の名前
  - 変数 _name: 現在の編集中のテキストの名前
  - 変数 _old: 関数 _out の退避
  - 関数 _dst(dom, args): _txt _url _out _err の下請け関数
  - 関数 _txt(...args): 編集用
  - 関数 _url(...args): link の href または script の src 用
  - 関数 _out(...args): 出力用
  - 関数 _err(...args): エラーまたはメッセージ用
  - 関数 _both(...args): 出力＋console.log
  - 関数 _coo(key, ...vals): cookie の読込み、または書込み
  - 関数 _num(dom, prop): computed スタイルプロパティの単位を除き、数値を返す
  - 関数 _pos(dom): window.pageXOffset, pageYOffset を足した位置を返す
  - 関数 _sis(dom): 同じタグの兄弟を配列にして返す
  - 関数 _del(name): 指定したキー(tiny#のみ)をローカルストレージから削除
  - 関数 _lst(): ローカルストレージの全キー(tiny#のみ)を配列にして返す
  - 関数 _all(): ローカルストレージの全キーを配列にして返す
  - 関数 _qs(sel): querySelector のショートカット
  - 関数 _qss(sel, func = null): querySelectorAll のショートカット
  - 関数 _ipa(sel, prop): プロパティ, 属性を表示
  - 関数 _isc(sel, prop): スタイルプロパティ, computed スタイルプロパティを表示
  ## ガイド
  - dom: DOM要素のオブジェクトまたは ID 文字列
  - sel: DOM要素のオブジェクトまたは CSS セレクタ文字列
  - prop: プロパティ名の文字列
*/

let _name = _coo('_name');
_name = _name ? _name : '名前はまだない';

// cookie の読込み、または書込み
function _coo(key, ...vals) {
    if (vals.length) {
        const encoded = encodeURIComponent(vals[0]);
        // max-age: 8,640,000=100days  604,800=7days
        // samesite: 
        const attrs_str = 'max-age=8640000; samesite=strict;';
        document.cookie = `${key}=${encoded}; ${attrs_str}`;
        return encoded; }
    else {
        const cookies = document.cookie.split(";");
        const found = cookies.find(
            (cookie) => cookie.split("=")[0].trim() === key.trim() );
        if (found) {
            var ary = found.split("=",2);
            var decoded = decodeURIComponent(ary[1]);
            return decoded; }
        return ""; } }

function _dst(dom, args) {
    let el = typeof dom == 'string' ? document.getElementById(dom) : dom;
    if (args.length == 0)        return el;
    else if ( args[0] === null ) el.value = '';
    else                         el.value += args.join("") + "\n";
    return el; }

function _txt(...args) { return _dst('txt', args); }
function _url(...args) { return _dst('url', args); }
function _out(...args) { return _dst('out', args); }
let _old = _out;
function _err(...args) { return _dst('err', args); }
function _both(...args) {
    if (args.length > 0 && args[0] !== null)
        console.log.apply(console, args);
    return _dst('out', args); }

/* スタイルプロパティの単位を除き、数値を返す style number */
function _num(dom, prop) {
    let el = typeof dom == 'string' ? document.getElementById(dom) : dom;
    let style = window.getComputedStyle(el);
    let value = style[prop];
    if (value == null) return null;
    let match = value.match(/(-*[\d\.]+)\D+$/);
    if ( match )
        return Number(match[1]);
    else
        return null; }

/* window.pageXOffset, pageYOffset を足した位置を返す */
function _pos(dom) {
    let el = typeof dom == 'string' ? document.getElementById(dom) : dom;
    let rect = el.getBoundingClientRect();
    return { y: window.pageYOffset + rect.y,
             t: window.pageYOffset + rect.top,
             b: window.pageYOffset + rect.bottom,
             x: window.pageXOffset + rect.x,
             l: window.pageXOffset + rect.left,
             r: window.pageXOffset + rect.right,
             w: rect.width,
             h: rect.height }; }

/* 指定した要素と同じタグの兄弟を配列にして返す SIblingS */
function _sis(dom) {
    let el = typeof sel == 'string' ? document.getElementById(dom) : dom;
    let sis = el.parentNode.getElementsByTagName(el.tagName);
    return Array.from(sis); }

//  ローカルストレージの指定したキーを削除 tiny# のみ
function _del(name) { localStorage.removeItem(`tiny#${name}`); }

//  ローカルストレージの全キー名 (tiny# のみ) を配列にして返す.
function _lst() {
    let names = [];
    for (let i = 0; i < localStorage.length; i++) {
        let name = localStorage.key(i);
        if ( name.startsWith('tiny#') ) names.push(name.substring(5)) }
    return names.sort(); }

//  ローカルストレージの全キー名を配列にして返す.
function _all() {
    let names = [];
    for (let i = 0; i < localStorage.length; i++)
        names.push(localStorage.key(i));
    return names.sort(); }

//  RGB 文字列を 16進 #xxxxxx に変換
function _rgb(str) {
  const n = str.match(/\d+/g);
  return '#' + (n[0]<<16 | n[1]<<8 | n[2]).toString(16).padStart(6, '0'); }

/* querySelector のショートカット */
function _qs(sel) { return document.querySelector(sel); }

/* querySelectorAll のショートカット */
function _qss(sel, func = null) {
    return func ?
        document.querySelectorAll(sel).forEach(func) :
        document.querySelectorAll(sel) ; }

/* プロパティと属性を表示する */
function _ipa(sel, prop) {
    document.querySelectorAll(sel).forEach( el => {
        let p = el[prop];
        let a = el.getAttribute(prop);
        _out(`_ipa: ${prop} = ${p} (${typeof p}) `,
             `attribute = ${a} (${typeof a})`); } ); }

/* スタイルプロパティと computed スタイルのプロパティを表示する */
function _isc(sel, prop) {
    document.querySelectorAll(sel).forEach( el => {
        let p = el.style[prop];
        let c = window.getComputedStyle(el)[prop];
        _out(`_isc: ${prop} = ${p} (${typeof p}) `,
             `computed = ${c} (${typeof c})`); } ); }

addEventListener( 'DOMContentLoaded', (ev) => {
    document.getElementById('ref').addEventListener( 'change', ev => {
        if (ev.target.value.trim() != '')
            window.open(ev.target.value.trim(), '_blank'); } );
    /* input type="file" の見た目が見苦しいので label でごまかす */
    let ref = document.getElementById('save');
    let prx = document.getElementById('proxy');
    let style = window.getComputedStyle(ref);
    prx.style.fontFamily = style.fontFamily;
    prx.style.fontSize   = style.fontSize;
    let load = document.getElementById('load');
    prx.addEventListener( 'dragover', ev => {
        ev.preventDefault(); } );
    prx.addEventListener( 'drop', ev => {
        ev.preventDefault();;
        load.files = ev.dataTransfer.files;
        let event = new Event('change');
        load.dispatchEvent(event); } );
    load.addEventListener( 'change', ev => {
        let file = ev.target.files[0];
        if ( file ) {
            let reader = new FileReader();
            reader.addEventListener('load', (ev) => {
                _txt(null);
                _err(`load: ${file.name}`);
                _txt(ev.target.result); } );
            reader.readAsText(file);
            _name = file.name;
            _coo('_name', _name); } } );
    document.getElementById('save').addEventListener( 'click', ev => {
        let text = _txt().value;
        let blob = new Blob( [ text ], { type: 'text/plain' } );
        let hide = document.getElementById('hide');
        hide.href = URL.createObjectURL(blob);
        hide.download = _name;
        hide.click(); } );
    document.getElementById('pull').addEventListener( 'click', ev => {
        let res = prompt('読込みたい文書の名前を入力してください', _name);
        if ( res ) {
            _txt().value = localStorage.getItem(`tiny#${res.trim()}`);
            _name = res;
            _coo('_name', _name); } } );
    document.getElementById('push').addEventListener( 'click', ev => {
        let res = prompt('書込みたい文書の名前を入力してください', _name);
        if ( res ) {
            let val = _txt().value;
            localStorage.setItem(`tiny#${res.trim()}`, val);
            _name = res;
            _coo('_name', _name); } } );
    document.getElementById('url').addEventListener( 'keyup', ev => {
        if (ev.code == 'Enter') {
            let get_ext = (url) => {
                let sla = url.lastIndexOf('/');
                let dot = url.lastIndexOf('.');
                return sla < dot ? url.substring(dot) : ''; }
            let ext = get_ext(_url().value);
            if ( ext == '.js' ) {
                let el = document.createElement('script');
                el.setAttribute('src', _url().value);
                el.addEventListener( 'load', ev => {
                    _err(`mount as javascript: ${_url().value}`); } );
                document.head.appendChild(el); }
            else if ( ext == '.css' ) {
                let el = document.createElement('link');
                el.setAttribute('rel', 'stylesheet');
                el.setAttribute('href', _url().value);
                el.addEventListener( 'load', ev => {
                    _err(`mount as css: ${_url().value}`); } );
                document.head.appendChild(el); }
            else {
                _err(`can\'t mount such file: ${_url().value}`); } } } );
    document.getElementById('reset').addEventListener( 'click', ev => {
        _url(null); _out(null); _err(null); } );
    document.getElementById('exec').addEventListener( 'click', ev => {
        let bgn = _txt().selectionStart;
        let end = _txt().selectionEnd;
        let txt = bgn == end ?
            _txt().value : _txt().value.substring(bgn, end);
        try {
            eval(txt); }
        catch (er) {
            _err(er); } } );
    document.querySelectorAll('input.tiny[type="color"]').forEach( el => {
        let bg = window.getComputedStyle(el.parentElement).backgroundColor;
        el.value = _rgb(bg); } ); } );
