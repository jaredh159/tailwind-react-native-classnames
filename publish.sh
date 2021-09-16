VERSION_INPUT=$1
GIT_BRANCH=$(git branch | sed -n -e 's/^\* \(.*\)/\1/p')

true && \
  npm version --git-tag-version=false --allow-same-version $VERSION_INPUT &> /dev/null && \
  NEW_VERSION=$(jq -r .version ./package.json) && \
  echo -e "The new version will be \x1b[33m$NEW_VERSION\x1b[0m - You have 10 seconds to abort..." && \
  sleep 10 && \
  npx fldev ci && \
  echo "npm publish --access public" && \
  git add . && \
  git commit -am "v${NEW_VERSION}" && \
  git tag "v${NEW_VERSION}" && \
  git push origin $GIT_BRANCH && \
  git push origin tag "v${NEW_VERSION}"


