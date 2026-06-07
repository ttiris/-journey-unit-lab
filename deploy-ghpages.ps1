$dist = "d:\研一工作任务\设计资产建构\6.7旅行体验实验室单元\journey-unit-lab\frontend\dist"
$tmp = "d:\研一工作任务\设计资产建构\6.7旅行体验实验室单元\journey-unit-lab\tmp-gh-pages"
$repo = "https://github.com/ttiris/-journey-unit-lab.git"

Write-Host "Creating temp directory..."
New-Item -ItemType Directory -Path $tmp -Force | Out-Null

Write-Host "Copying dist files..."
Copy-Item -Path "$dist\*" -Destination $tmp -Recurse -Force

Set-Location $tmp

Write-Host "Initializing git..."
git init
git config user.email "developer@journey-unit-lab.dev"
git config user.name "Journey Unit Lab"
git checkout -b gh-pages
git add -A
git commit -m "Deploy to GitHub Pages"
git remote add origin $repo
git push origin gh-pages --force

Set-Location ..
Remove-Item -Path $tmp -Recurse -Force -ErrorAction SilentlyContinue
Write-Host "Done!"
