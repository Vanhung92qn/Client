# ──────────────────────────────────────────────────────────────────
# Inject-Screen.ps1  — Fullscreen cho web mobile (giai phap ON DINH, khong vo game):
#   - Android/iPad: nut Fullscreen -> requestFullscreen + KHOA landscape (xoay ngang that).
#   - iPhone Safari: KHONG co Fullscreen API. 2 duong bo tro:
#       (a) A2HS (Them vao MH chinh) = ON DINH NHAT: standalone an HET thanh Safari nhu app native,
#           KHONG dung toi body/container/canvas.
#       (b) SWIPE (vuot len an thanh URL) = fsc/sc-fullscreen.js, GEOMETRY-FREE: CHI chay khi may cam
#           NGANG that (cc.view._isRotated===false); tao body cao 110vh cho cuon, phat hien thanh URL co,
#           roi ban 1 'resize' de ENGINE tu reflow (_setupForceLandscape/_resizeEvent). TUYET DOI khong
#           ghi canvas/container -> KHONG tai lai loi LECH+CHET INPUT cua ban cu. Cam DOC (engine xoay
#           90deg) -> adapter TAT, nhuong A2HS; A2HS cung tu nhuong khi swipe-hint dang hien.
#   - Xoay ngang: o LoadingView.js (cc.view.setOrientation) - khong lien quan file nay.
# Giu loading mac dinh Cocos (#splash) + hash boot -> khong crash, an toan CDN. Idempotent.
#   .\Inject-Screen.ps1 -IndexPath "C:\Temp\build\index.html"
# ──────────────────────────────────────────────────────────────────
[CmdletBinding()]
param([Parameter(Mandatory=$true)][string]$IndexPath)

if (-not (Test-Path $IndexPath)) { Write-Host "Inject-Screen: khong thay $IndexPath" -ForegroundColor Red; exit 1 }
$h = Get-Content $IndexPath -Raw
if ($h -match 'SC_BOOT_INJECTED') { Write-Host "      index.html da chen roi (skip)" -ForegroundColor Green; exit 0 }

if ($h -notmatch 'viewport-fit') {
    $h = $h -replace '(<meta name="viewport"[^>]*content=")([^"]*)(")', '$1$2,viewport-fit=cover$3'
}
$h = $h -replace '<link rel="icon"[^>]*>', '<link rel="icon" href="favicon.ico"/>'
# Icon man hinh chinh (A2HS) + ten duoi icon. iOS lay icon tu apple-touch-icon.
if ($h -notmatch 'href="apple-touch-icon\.png"') {
    $appleHead = '  <link rel="apple-touch-icon" href="apple-touch-icon.png"/>' + "`r`n" +
                 '  <meta name="apple-mobile-web-app-title" content="SumClub"/>' + "`r`n</head>"
    $h = $h -replace '</head>', $appleHead
}

$inject = @'
<!-- SC_BOOT_INJECTED -->
<style>
  /* Nen den: khi ghim scrollY=1, 1px duoi body lo ra -> de #000 thi chim vao canh toi game (khong lo xam #2c2c2c). */
  html,body{background:#000 !important;}
  #sc-fs{position:fixed;z-index:2147483646;top:7px;right:9px;width:40px;height:40px;border-radius:9px;
    background:rgba(0,0,0,.42);color:#fff;font-size:23px;line-height:40px;text-align:center;cursor:pointer;
    -webkit-tap-highlight-color:transparent;user-select:none;display:none;}
  /* A2HS card = full-screen THAT, on dinh 100% tren iPhone (standalone an het thanh Safari nhu app). */
  #sc-a2hs{position:fixed;z-index:2147483646;left:10px;right:10px;bottom:calc(12px + env(safe-area-inset-bottom));
    display:none;background:#fff;color:#13233f;border-radius:16px;padding:14px 15px;
    box-shadow:0 12px 38px rgba(0,0,0,.5);max-width:460px;margin:0 auto;
    font:14px/1.5 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;align-items:center;gap:12px;animation:scrise .3s ease both;}
  #sc-a2hs.on{display:flex;}
  #sc-a2hs .ic{flex:0 0 auto;width:42px;height:42px;border-radius:10px;background:center/74% no-repeat url('favicon.ico');background-color:#0a0e18;}
  #sc-a2hs .tx{flex:1;}
  #sc-a2hs .tx .t1{font-weight:700;font-size:15px;margin-bottom:2px;}
  #sc-a2hs .tx .t2{color:#42506a;}
  #sc-a2hs .tx b{color:#c98a2b;}
  #sc-a2hs .shr{display:inline-block;vertical-align:-3px;width:15px;height:15px;margin:0 1px;background:center/contain no-repeat;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23007aff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 16V4M8 8l4-4 4 4'/><path d='M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7'/></svg>");}
  #sc-a2hs .x{flex:0 0 auto;align-self:flex-start;font-size:22px;color:#9aa3b2;cursor:pointer;padding:0 2px;line-height:1;}
  @keyframes scrise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
  /* [SWIPE] Goi y "vuot len" cho iPhone Safari cam ngang (adapter fsc/sc-fullscreen.js dieu khien). */
  /* position:ABSOLUTE (KHONG fixed!) — fixed thi vuot len khong cuon trang -> bar khong an.
     absolute cuon theo trang (nhu #mask hitclub) -> vuot len = trang cuon = an thanh URL. */
  #sc-mask{position:absolute;left:0;top:0;width:100%;height:100%;z-index:9998;display:none;
    background:rgba(12,12,12,.55);-webkit-tap-highlight-color:transparent;}
  #sc-swipe{position:absolute;left:0;top:0;width:100%;height:100%;
    background:#000 center/auto no-repeat url('fsc/swipe.gif');opacity:.9;}
  /* Fallback neu thieu swipe.gif: mui ten + chu, thuan CSS (ASCII-safe, \2191 = arrow up). */
  #sc-swipe:after{content:"\2191  Vuot len de choi toan man hinh";position:absolute;left:0;right:0;
    bottom:14%;text-align:center;color:#fff;font:600 15px/1.4 -apple-system,"Segoe UI",Roboto,Arial,sans-serif;
    text-shadow:0 1px 3px rgba(0,0,0,.8);}
  #sc-hide{position:absolute;top:calc(8px + env(safe-area-inset-top));right:10px;width:38px;height:38px;
    border:0;border-radius:9px;background:rgba(0,0,0,.5);color:#fff;font-size:20px;line-height:38px;
    text-align:center;cursor:pointer;-webkit-tap-highlight-color:transparent;z-index:1;}
</style>
<div id="sc-mask"><div id="sc-swipe"><button id="sc-hide" aria-label="Dong">&times;</button></div></div>
<div id="sc-fs">&#9974;</div>
<div id="sc-a2hs">
  <div class="ic"></div>
  <div class="tx">
    <div class="t1">Ch&#417;i <b>TO&#192;N M&#192;N H&#204;NH</b> nh&#432; app</div>
    <div class="t2">B&#7845;m <span class="shr"></span><b>Chia s&#7867;</b> &#7903; thanh d&#432;&#7899;i &#8594; <b>&ldquo;Th&#234;m v&#224;o MH ch&#237;nh&rdquo;</b>. M&#7903; t&#7915; icon s&#7869; &#7849;n h&#7871;t thanh Safari.</div>
  </div>
  <div class="x">&times;</div>
</div>
<script type="text/javascript">
(function(){
  try{
    var ua=navigator.userAgent||'';
    var touch=(navigator.maxTouchPoints||0)>1;
    var macTouch=touch && /Macintosh/i.test(ua);          // iPad / iPhone o che do "Request Desktop Website"
    if(!/Mobi|Android|iP(hone|ad|od)/i.test(ua) && !macTouch) return;
    var reallyIphone=/iPhone|iPod/i.test(ua);
    var isIphone=reallyIphone || macTouch;
    var standalone=(('standalone' in navigator)&&navigator.standalone)||(window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches);
    if(standalone) return;   // da o standalone -> da full man
    var de=document.documentElement;
    var canFS=!!(de.requestFullscreen||de.webkitRequestFullscreen||de.webkitRequestFullScreen||de.mozRequestFullScreen||de.msRequestFullscreen);

    if(canFS && !reallyIphone){
      // Android / iPad: nut fullscreen THAT + khoa landscape. KHONG dung canvas Cocos -> khong vo.
      var fsBtn=document.getElementById('sc-fs'); if(!fsBtn) return;
      fsBtn.style.display='block';
      function fsEl(){return document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement;}
      fsBtn.addEventListener('click',function(){
        if(fsEl()){ var ex=document.exitFullscreen||document.webkitExitFullscreen||document.mozCancelFullScreen||document.msExitFullscreen; if(ex)try{ex.call(document);}catch(e){} return; }
        var fn=de.requestFullscreen||de.webkitRequestFullscreen||de.webkitRequestFullScreen||de.mozRequestFullScreen||de.msRequestFullscreen;
        if(fn)try{fn.call(de);}catch(e){}
        try{ if(screen.orientation&&screen.orientation.lock) screen.orientation.lock('landscape').catch(function(){}); }catch(e){}
      });
    } else if(isIphone){
      // iPhone: A2HS = duong full DUY NHAT khong vo game (an HET thanh Safari nhu app). Hien 1 the, nho 1 lan.
      var a=document.getElementById('sc-a2hs'); if(!a) return;
      var dismissed=false; try{ if(localStorage.getItem('sc_a2hs_v3')) dismissed=true; }catch(e){}
      if(dismissed) return;
      var ax=a.querySelector('.x');
      if(ax) ax.addEventListener('click',function(){ a.classList.remove('on'); try{localStorage.setItem('sc_a2hs_v3','1');}catch(e){} });
      setTimeout(function(){ if(!window.__SC_SWIPE_ACTIVE__) a.classList.add('on'); }, 2600);   // cho game on dinh; nhuong neu swipe-hint dang hien
    }
  }catch(e){}
})();
</script>
<script src="fsc/sc-fullscreen.js?v=19" charset="utf-8"></script>
'@
$h = $h -replace '</body>', ($inject + '</body>')

[System.IO.File]::WriteAllText($IndexPath, $h, [System.Text.UTF8Encoding]::new($false))
Write-Host "      Injected: Android=fullscreen+lock | iPhone=A2HS card + SWIPE(fsc/sc-fullscreen.js, geometry-free). Game KHONG bi vo/lech/chet-input." -ForegroundColor Green
