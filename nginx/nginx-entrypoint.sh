#!/usr/bin/bash
WWW_DIR=/usr/share/nginx/html
ENV_PREFIX=VITE_APP_
INJECT_FILE_PATH="${WWW_DIR}/inject.js"
ENV_FILE_PATH="${WWW_DIR}/.env.temp"
printenv > $ENV_FILE_PATH
sed 's/\\n/\\\\\\\\n/g' $ENV_FILE_PATH > "$ENV_FILE_PATH"2
echo "window.config = {" >> "${INJECT_FILE_PATH}"
while read envrole ; do
  IFS='='
  read key value <<< "${envrole}"
  echo "  ${key}: \"${value}\"," >> "${INJECT_FILE_PATH}"
done < "$ENV_FILE_PATH"2
echo "};" >> "${INJECT_FILE_PATH}"
[ -z "$@" ] && nginx -g 'daemon off;' || $@