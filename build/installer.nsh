; NSIS 安装器配置文件

; 安装前清理旧版本
Section "UninstallOldVersion"
  ; 这里可以添加清理旧版本的逻辑
SectionEnd

; 安装后操作
Section "PostInstall"
  ; 创建桌面快捷方式
  CreateShortcut "$DESKTOP\DevTools.lnk" "$INSTDIR\DevTools.exe"
  ; 创建开始菜单快捷方式
  CreateShortcut "$SMPROGRAMS\DevTools\DevTools.lnk" "$INSTDIR\DevTools.exe"
SectionEnd

; 卸载前操作
Section "PreUninstall"
  ; 这里可以添加卸载前的清理逻辑
SectionEnd

; 卸载后操作
Section "PostUninstall"
  ; 删除开始菜单文件夹
  RMDir /r "$SMPROGRAMS\DevTools"
  ; 删除桌面快捷方式
  Delete "$DESKTOP\DevTools.lnk"
SectionEnd