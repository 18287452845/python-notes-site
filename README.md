# Python Notes Site

This repository owns the generated static website, templates, layout, scripts, and deployment workflow.

The Markdown source lives in the separate `python-notes-content` repository. Set `CONTENT_DIR` locally when building:

```powershell
$env:CONTENT_DIR = "D:\Documents\Python笔记"
npm ci
npm run build
npm run check
```

Do not edit generated lesson HTML manually. Change Markdown in the content repository, or change templates and scripts here.
