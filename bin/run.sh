#!/bin/bash

hook_type=$1

# check parameters
if [[ $hook_type != 'pre-commit' && $hook_type != 'pre-push' ]]; then
    echo "WARNING: only pre-commit and pre-push hooks supported"
    exit 0
fi

# check environment
check_jscs=$(which jscs)
if [[ ! $check_jscs ]]; then
    echo "WARNING: no jscs installation found. Please install with 'npm install -g jscs'"
    exit 0
fi

check_jscsrc=$(git ls-files .jscsrc)
if [[ ! $check_jscsrc ]]; then
    echo "WARNING: no jscs config file found. Please create a '.jscsrc'-file in the git-versioned folder"
    exit 0
fi

# get list of files to check
if [[ $hook_type == 'pre-commit' ]]; then
    files_js=$(git diff --cached --name-only --diff-filter=ACM | grep '\.js$')
    files=$(git diff --cached --name-only --diff-filter=ACM)
elif [[ $hook_type == 'pre-push' ]]; then
    files_js=$(git diff origin/$(git name-rev --name-only HEAD)..HEAD --name-only --diff-filter=ACM | grep '\.js$')
    files=$(git diff origin/$(git name-rev --name-only HEAD)..HEAD --name-only --diff-filter=ACM)
fi

# check for jscs-compliance
echo

if [[ $files_js != '' ]]; then
    check=$(jscs $files_js)
    if [[ $check != '' ]]; then
        echo "$check"
        echo
        echo "note: you can bypass this hook with the --no-verify (-n) option"
        exit 1
    else
        echo -e "\e[32m✓ \e[39mall files are properly code-styled"
    fi
else
    echo -e "\e[32m✓ \e[39mno javascript changes included"
fi

# check for meteor or cordova library updates
cordova_update=false
meteor_update=false

if [[ $files != '' ]]; then
    for file in "${files[@]}"; do
        if [[ $file == *"cordova-plugins"* ]]; then
            cordova_update=true
        fi

        if [[ $file == *"release"* ]]; then
            meteor_update=true
        fi
    done
fi

if [[ $cordova_update == false ]]; then
    echo -e "\e[32m✓ \e[39mno cordova updates found"
fi

if [[ $meteor_update == false ]]; then
    echo -e "\e[32m✓ \e[39mno meteor updates found"
fi

git_action="COMMIT"
if [[ $hook_type == 'pre-push' ]]; then
    git_action='PUSH'
fi

if [[ $cordova_update == true ]]; then
    echo
    echo -e "\e[91m!!! THIS $git_action CONTAINS CORDOVA PLUGIN UPDATES !!!"
    echo -e "\e[39m"
    echo "note: a build for Android and iOS needs to get scheduled as otherwise a HCP"
    echo "      won't work without an update from Play Store or iTunes."
    echo "file: .meteor/cordova-plugins"
    echo
fi

if [[ $meteor_update == true ]]; then
    echo
    echo -e "\e[91m!!! THIS $git_action CONTAINS A METEOR UPDATE !!!"
    echo -e "\e[39m"
    echo "note: a build for Android and iOS needs to get scheduled as otherwise a HCP"
    echo "      won't work without an update from Play Store or App Store."
    echo "file: .meteor/release"
    echo
fi

if [[ $cordova_update == false && $meteor_update == false ]]; then
    echo
fi