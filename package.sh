#!/bin/bash

dest_folder_name=${PWD##*/}_deploy
datetime=$(date +"%F-%H-%M")
dest_folder=~/Downloads/$dest_folder_name
dest_zip=$dest_folder-$datetime.zip
echo $dest_zip
echo $dest_folder

rm -rf $dest_folder
mkdir $dest_folder

npm run build

cp -R backend/ $dest_folder
cp -R dist/ $dest_folder/public

cd $dest_folder
zip -r $dest_zip .
cd -
open $dest_folder/..