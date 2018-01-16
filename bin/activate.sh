#!/bin/bash

current_location="$(pwd)"

script_location="${BASH_SOURCE[0]}"
script_location_target="$(readlink -f $script_location)"
script_location_target_dir="$(dirname $script_location_target)"

cd $script_location_target_dir/..

npm run hooks --dir "$current_location"