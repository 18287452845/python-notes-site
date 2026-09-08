(function(){
  const nav=document.querySelector('.course-nav'),layout=document.querySelector('.page-layout'),toggle=document.querySelector('.course-nav-toggle');
  if(nav&&layout&&toggle){toggle.addEventListener('click',function(){const collapsed=layout.classList.toggle('nav-collapsed');toggle.setAttribute('aria-expanded',String(!collapsed));toggle.textContent=collapsed?'打开':'收起';});}
  document.querySelectorAll('.copy-code').forEach(function(button){button.addEventListener('click',async function(){await navigator.clipboard.writeText(button.nextElementSibling.innerText);const original=button.textContent;button.textContent='已复制';setTimeout(function(){button.textContent=original;},1200);});});
  const style=document.createElement('link');style.rel='stylesheet';style.href='/assets/highlight.github-dark.min.css';document.head.appendChild(style);
  const script=document.createElement('script');script.src='/assets/highlight.common.min.js';script.onload=function(){document.querySelectorAll('pre code[class*="language-"]').forEach(function(block){window.hljs.highlightElement(block);});};document.head.appendChild(script);
})();
