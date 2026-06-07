@echo off
chcp 65001 >nul
cd /d "d:\研一工作任务\设计资产建构\6.7旅行体验实验室单元\journey-unit-lab"

echo Creating temp deploy dir...
if exist tmp-gh-pages rmdir /s /q tmp-gh-pages
mkdir tmp-gh-pages

echo Copying dist...
xcopy /E /Y "frontend\dist\*" "tmp-gh-pages\"

cd tmp-gh-pages

echo Deploying to gh-pages...
git init
git config user.email "developer@journey-unit-lab.dev"
git config user.name "Journey Unit Lab"
git checkout -b gh-pages
git add -A
git commit -m "Deploy to GitHub Pages"
git remote add origin https://github.com/ttiris/-journey-unit-lab.git
git push origin gh-pages --force

cd ..
rmdir /s /q tmp-gh-pages
echo DONE!
