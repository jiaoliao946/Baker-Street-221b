@echo off
setlocal enabledelayedexpansion

:: 获取当前目录
set "current_dir=%cd%"

:: 遍历所有 .md 文件
for /r %%f in (*.md) do (
    set "file=%%f"
    
    :: 获取文件名
    set "filename=%%~nxf"
    
    :: 排除特定文件
    if /i not "!filename!"=="_sidebar.md" if /i not "!filename!"=="_coverpage.md" if /i not "!filename!"=="_404.md"  if /i not "!filename!"=="_navbar.md" (
        :: 获取相对路径
        set "relative_path=!file:%current_dir%\=!"
        
        :: 将路径中的反斜杠 \ 替换为正斜杠 /
        set "relative_path=!relative_path:\=/!"

        set "relative_path=!relative_path:.md=!"

        :: 输出带双引号和正斜杠的相对路径
        if /i not "!relative_path!"=="README" (echo "!relative_path!",)
    )
)

pause