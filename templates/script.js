(function(){
  /* ---------- 复制代码 ---------- */
  document.querySelectorAll('.copy-code').forEach(function(button){
    button.addEventListener('click',async function(){
      const block=button.closest('.code-wrap');
      const target=block?block.querySelector('pre code'):null;
      if(!target)return;
      await navigator.clipboard.writeText(target.innerText);
      const original=button.textContent;
      button.textContent='已复制';
      setTimeout(function(){button.textContent=original;},1200);
    });
  });

  /* ---------- 左右面板折叠（参考 liyang.space.mcode.cn 的机制） ---------- */
  (function(){
    var PANEL_KEY='python-notes-panel-';
    var LABELS={courseNav:'课程目录',lessonToc:'本页目录'};
    var MAP={courseNav:'course-nav',lessonToc:'lesson-toc'};

    Object.keys(LABELS).forEach(function(name){
      var panel=document.querySelector('.'+MAP[name]);
      var layout=document.querySelector('.page-layout');
      var btn=document.querySelector('[data-panel-toggle="'+name+'"]');
      var rail=document.querySelector('[data-panel-rail="'+name+'"]');
      if(!panel||!layout||!btn)return;

      var collapsed=false;
      try{collapsed=localStorage.getItem(PANEL_KEY+name)==='1';}catch(e){}

      function apply(){
        panel.classList.toggle('is-collapsed',collapsed);
        layout.classList.toggle(name==='courseNav'?'sidebar-collapsed':'toc-collapsed',collapsed);
        btn.setAttribute('aria-expanded',collapsed?'false':'true');
        var label=(collapsed?'展开':'折叠')+LABELS[name];
        btn.setAttribute('aria-label',label);
        btn.setAttribute('title',label);
        if(rail)rail.setAttribute('aria-label',label);
      }

      function toggle(){
        collapsed=!collapsed;
        try{localStorage.setItem(PANEL_KEY+name,collapsed?'1':'0');}catch(e){}
        apply();
      }

      btn.addEventListener('click',toggle);
      if(rail)rail.addEventListener('click',toggle);
      apply();
    });
  })();

  /* ---------- 阅读进度条 ---------- */
  (function(){
    const bar=document.getElementById('reading-progress');
    if(!bar)return;
    function update(){
      const doc=document.documentElement;
      const max=doc.scrollHeight-doc.clientHeight;
      const pct=max>0?(doc.scrollTop/max)*100:0;
      bar.style.width=pct+'%';
      bar.classList.toggle('is-on',pct>0.5);
    }
    document.addEventListener('scroll',update,{passive:true});
    window.addEventListener('resize',update);
    update();
  })();

  /* ---------- 代码高亮（亮色 GitHub 主题） ---------- */
  const style=document.createElement('link');
  style.rel='stylesheet';
  style.href='/assets/highlight.github.min.css';
  document.head.appendChild(style);
  const script=document.createElement('script');
  script.src='/assets/highlight.common.min.js';
  script.onload=function(){
    document.querySelectorAll('pre code[class*="language-"]').forEach(function(block){
      window.hljs.highlightElement(block);
    });
  };
  document.head.appendChild(script);
})();
