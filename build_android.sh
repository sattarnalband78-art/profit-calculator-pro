#!/usr/bin/env bash
set -e

TOOLS_DIR="/app/applet/.tools"
mkdir -p "$TOOLS_DIR/jdk-21"
mkdir -p "$TOOLS_DIR/android-sdk/cmdline-tools"
mkdir -p "$TOOLS_DIR/gradle-8.14.3"

echo "=== 1. Setting up JDK 21 ==="
if [ ! -f "$TOOLS_DIR/jdk-21/bin/java" ]; then
  curl -sL "https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.6%2B7/OpenJDK21U-jdk_x64_linux_hotspot_21.0.6_7.tar.gz" | tar -xz -C "$TOOLS_DIR/jdk-21" --strip-components=1
fi

export JAVA_HOME="$TOOLS_DIR/jdk-21"
export PATH=$JAVA_HOME/bin:$PATH
java -version

echo "=== 2. Setting up Android SDK ==="
export ANDROID_HOME="$TOOLS_DIR/android-sdk"
export ANDROID_SDK_ROOT="$TOOLS_DIR/android-sdk"

if [ ! -f "$TOOLS_DIR/android-sdk/cmdline-tools/latest/bin/sdkmanager" ]; then
  curl -sL "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip" -o /tmp/cmdline-tools.zip
  unzip -q -o /tmp/cmdline-tools.zip -d "$TOOLS_DIR/android-sdk/cmdline-tools"
  rm -rf "$TOOLS_DIR/android-sdk/cmdline-tools/latest"
  mv "$TOOLS_DIR/android-sdk/cmdline-tools/cmdline-tools" "$TOOLS_DIR/android-sdk/cmdline-tools/latest"
  rm -f /tmp/cmdline-tools.zip
fi

yes | "$TOOLS_DIR/android-sdk/cmdline-tools/latest/bin/sdkmanager" --licenses --sdk_root="$TOOLS_DIR/android-sdk" || true

if [ ! -d "$TOOLS_DIR/android-sdk/platforms/android-36" ] || [ ! -d "$TOOLS_DIR/android-sdk/build-tools/35.0.0" ]; then
  echo "y" | "$TOOLS_DIR/android-sdk/cmdline-tools/latest/bin/sdkmanager" --sdk_root="$TOOLS_DIR/android-sdk" "platforms;android-36" "platforms;android-35" "platforms;android-34" "build-tools;35.0.0" "build-tools;34.0.0" "platform-tools" || true
  yes | "$TOOLS_DIR/android-sdk/cmdline-tools/latest/bin/sdkmanager" --licenses --sdk_root="$TOOLS_DIR/android-sdk" || true
fi

echo "sdk.dir=$TOOLS_DIR/android-sdk" > android/local.properties

echo "=== 3. Setting up Gradle 8.14.3 ==="
if [ ! -f "$TOOLS_DIR/gradle-8.14.3/bin/gradle" ]; then
  curl -sL "https://services.gradle.org/distributions/gradle-8.14.3-bin.zip" -o /tmp/gradle-8.14.3-bin.zip
  unzip -q -o /tmp/gradle-8.14.3-bin.zip -d "$TOOLS_DIR"
  rm -f /tmp/gradle-8.14.3-bin.zip
fi

export PATH="$TOOLS_DIR/gradle-8.14.3/bin":$PATH
gradle -version

cd android
gradle wrapper --gradle-version 8.14.3
chmod +x gradlew
cd ..

echo "=== 4. Syncing Capacitor assets ==="
npm run build
npx cap sync android

echo "=== 5. Running assembleRelease ==="
rm -rf android/.gradle android/app/build
cd android
./gradlew assembleRelease --no-daemon --stacktrace

echo "=== 6. Build Outputs ==="
find app/build/outputs/ -type f
ls -lh app/build/outputs/apk/release/

