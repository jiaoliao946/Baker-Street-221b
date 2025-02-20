@echo off
setlocal enabledelayedexpansion

:: 获取当前目录
set "current_dir=%cd%"
:: 遍历所有.md文件
for /r %%f in (*.md) do (
    set "file=%%f"
    :: 获取文件名
    set "filename=%%~nxf"
    :: 排除特定文件
    if /i not "!filename!"=="_sidebar.md" if /i not "!filename!"=="_coverpage.md" if /i not "!filename!"=="_404.md" (
        :: 获取相对路径
        set "relative_path=!file:%current_dir%\=!"
        :: 将路径中的\替换为/
        set "relative_path=!relative_path:\=/!"
        :: 去除拓展名.md
        set "relative_path=!relative_path:.md=!"
        :: 输出相对路径
        if /i not "!relative_path!"=="README" (echo "!relative_path!",)
    )
)

pause