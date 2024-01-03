# This script is intended to be run as a cron job on the server collecting data.
# Load nvm
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use version 20.10.0
nvm use 20.10.0

# Get conditions
node /home/agoric/Desktop/The\ Lab/HamConditions/HamConditions.js
