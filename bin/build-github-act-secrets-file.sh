#!/usr/bin/env bash
# gen-secrets.sh – create a .secrets file for nektos/act

set -euo pipefail

SCRIPT_DIRECTORY=$(dirname "$(realpath "$0")")
APP_DIRECTORY=$(dirname "$SCRIPT_DIRECTORY")
CERT_DIR="$APP_DIRECTORY/archiver/certs"

# ---- sanity checks ---------------------------------------------------------
[[ -f "$CERT_DIR/fullchain.pem" ]] || { echo "Error: $CERT_DIR/fullchain.pem missing"; exit 1; }
[[ -f "$CERT_DIR/icefog.pem"    ]] || { echo "Error: $CERT_DIR/icefog.pem    missing"; exit 1; }

# ---- helper for interactive secrets ---------------------------------------
ask() {                         # ask VAR "Prompt" [silent]
  local var=$1 prompt=$2 silent=${3:-no}
  if [[ -z "${!var:-}" ]]; then
    if [[ $silent == yes ]]; then
      read -rsp "$prompt: " val && echo
    else
      read  -rp "$prompt: " val
    fi
    export "$var"="$val"
  fi
}

# ---- collect credentials ---------------------------------------------------
ask AZURECR_URL      "Azure Container Registry URL (e.g. myregistry.azurecr.io)"
ask AZURECR_USERNAME "ACR service-principal / robot user"
ask AZURECR_PASSWORD "ACR password" yes

# ---- encode PEMs as single-line strings ------------------------------------
encode() { awk '{printf "%s\\n",$0}' "$1"; }        # replace LF → \n
fullchain=$(encode "$CERT_DIR/fullchain.pem")
icefog=$(encode "$CERT_DIR/icefog.pem")

# ---- write .secrets --------------------------------------------------------
cat > "$APP_DIRECTORY/.secrets" <<EOF
AZURECR_URL=$AZURECR_URL
AZURECR_USERNAME=$AZURECR_USERNAME
AZURECR_PASSWORD=$AZURECR_PASSWORD
SSL_CERT_FULLCHAIN_PEM="$fullchain"
SSL_PRIVATE_ICEFOG_PEM="$icefog"
GITHUB_TOKEN=$(gh auth token)
EOF

echo "Success: Wrote .secrets
Run:
  gh act push \
      -P ubuntu-latest=-self-hosted \
      --job build \
      --env DOCKER_PUSH=false \
      --secret-file .secrets
"
