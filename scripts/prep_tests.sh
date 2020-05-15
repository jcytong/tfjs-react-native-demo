#!/bin/bash

#This script edits node_modules/@tensorflow/tfjs-core/dist/tests.js to remove
#tests that are incompatible with react native.


SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
TEST_FILE="$SCRIPT_DIR/../node_modules/@tensorflow/tfjs-core/dist/tests.js"
echo $TEST_FILE
sed -e 's/require("\.\/worker_node_test");//g' -i '' "$TEST_FILE"
sed -e 's/require("\.\/version_test");//g;' -i '' "$TEST_FILE"

