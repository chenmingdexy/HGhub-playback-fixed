param([ValidateSet('aarch64','armv7','x86_64')][string]$Target='aarch64')
$ErrorActionPreference='Stop'
Set-Location -LiteralPath $PSScriptRoot
foreach($name in @('JAVA_HOME','ANDROID_HOME','NDK_HOME')) {
 if(-not [Environment]::GetEnvironmentVariable($name)){throw "Please set $name before building."}
}
$rustTargets=@{aarch64='aarch64-linux-android';armv7='armv7-linux-androideabi';x86_64='x86_64-linux-android'}
rustup target add $rustTargets[$Target]
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
pnpm install --frozen-lockfile
if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
if(-not(Test-Path -LiteralPath 'src-tauri/gen/android/gradlew.bat')) {
 pnpm tauri android init --ci --skip-targets-install
 if($LASTEXITCODE -ne 0){exit $LASTEXITCODE}
}
pnpm tauri android build --apk --target $Target --ci
exit $LASTEXITCODE
