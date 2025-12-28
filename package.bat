@echo off
chcp 65001 >nul
echo 正在打包密码管理器项目...

REM 创建临时目录
if exist "保险箱-密码管理器" rmdir /s /q "保险箱-密码管理器"
mkdir "保险箱-密码管理器"

REM 复制主要文件
copy index.html "保险箱-密码管理器\" >nul
copy styles.css "保险箱-密码管理器\" >nul
copy app.js "保险箱-密码管理器\" >nul
copy manifest.json "保险箱-密码管理器\" >nul
copy README.md "保险箱-密码管理器\" >nul
copy test.html "保险箱-密码管理器\" >nul
copy create-icons.js "保险箱-密码管理器\" >nul
copy package.bat "保险箱-密码管理器\" >nul

REM 创建图标说明文件
echo 图标文件说明 > "保险箱-密码管理器\图标说明.txt"
echo. >> "保险箱-密码管理器\图标说明.txt"
echo 项目需要以下图标文件： >> "保险箱-密码管理器\图标说明.txt"
echo 1. icon-192.png (192x192像素) >> "保险箱-密码管理器\图标说明.txt"
echo 2. icon-512.png (512x512像素) >> "保险箱-密码管理器\图标说明.txt"
echo 3. favicon.ico (32x32像素) >> "保险箱-密码管理器\图标说明.txt"
echo. >> "保险箱-密码管理器\图标说明.txt"
echo 生成方法： >> "保险箱-密码管理器\图标说明.txt"
echo 1. 运行 create-icons.js (需要Node.js和canvas模块) >> "保险箱-密码管理器\图标说明.txt"
echo 2. 或使用在线图标生成器创建 >> "保险箱-密码管理器\图标说明.txt"
echo 3. 将生成的图标文件放在与index.html相同的目录下 >> "保险箱-密码管理器\图标说明.txt"

REM 创建部署说明
echo 部署说明 > "保险箱-密码管理器\部署说明.txt"
echo. >> "保险箱-密码管理器\部署说明.txt"
echo 1. 将"保险箱-密码管理器"文件夹中的所有文件上传到Web服务器 >> "保险箱-密码管理器\部署说明.txt"
echo 2. 确保服务器支持HTTPS（PWA要求） >> "保险箱-密码管理器\部署说明.txt"
echo 3. 通过浏览器访问 index.html 即可使用 >> "保险箱-密码管理器\部署说明.txt"
echo. >> "保险箱-密码管理器\部署说明.txt"
echo 本地测试： >> "保险箱-密码管理器\部署说明.txt"
echo python -m http.server 8000 >> "保险箱-密码管理器\部署说明.txt"
echo 然后访问 http://localhost:8000 >> "保险箱-密码管理器\部署说明.txt"

REM 创建ZIP文件（如果7zip可用）
where 7z >nul 2>nul
if %errorlevel% equ 0 (
    7z a -tzip "保险箱-密码管理器.zip" "保险箱-密码管理器\" >nul
    echo 已创建ZIP文件：保险箱-密码管理器.zip
) else (
    where zip >nul 2>nul
    if %errorlevel% equ 0 (
        zip -r "保险箱-密码管理器.zip" "保险箱-密码管理器\" >nul
        echo 已创建ZIP文件：保险箱-密码管理器.zip
    ) else (
        echo 未找到压缩工具，已创建文件夹：保险箱-密码管理器
        echo 请手动压缩该文件夹
    )
)

echo.
echo 打包完成！
echo 项目包含以下文件：
echo - index.html         主应用界面
echo - styles.css         样式文件
echo - app.js             应用逻辑
echo - manifest.json      PWA配置文件
echo - README.md          项目说明
echo - test.html          功能测试页面
echo - create-icons.js    图标生成脚本
echo - package.bat        打包脚本
echo.
echo 请查看"图标说明.txt"了解如何添加图标文件
pause
