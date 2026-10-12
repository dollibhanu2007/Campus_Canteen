@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script for Windows PowerShell / Batch
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "MAVEN_VERSION=3.9.9"
set "MAVEN_DIR=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%"
set "MAVEN_HOME=%MAVEN_DIR%\apache-maven-%MAVEN_VERSION%"
set "MAVEN_ZIP=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%-bin.zip"
set "MAVEN_URL=https://archive.apache.org/dist/maven/maven-3/%MAVEN_VERSION%/binaries/apache-maven-%MAVEN_VERSION%-bin.zip"

if exist "%MAVEN_HOME%\bin\mvn.cmd" goto runMaven

echo [INFO] Maven %MAVEN_VERSION% not found in cache. Downloading Maven...
if not exist "%MAVEN_DIR%" mkdir "%MAVEN_DIR%"

powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object System.Net.WebClient).DownloadFile('%MAVEN_URL%', '%MAVEN_ZIP%'); Expand-Archive -Path '%MAVEN_ZIP%' -DestinationPath '%MAVEN_DIR%' -Force; Remove-Item '%MAVEN_ZIP%'"

if not exist "%MAVEN_HOME%\bin\mvn.cmd" (
    echo [ERROR] Failed to download or unpack Maven.
    exit /b 1
)

:runMaven
"%MAVEN_HOME%\bin\mvn.cmd" %*
