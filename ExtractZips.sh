#!/bin/bash

cd $(dirname $0)

src=$1
if [ ! -d $src ]
then
	echo ERR404: samples source-folder doesn\'t exist!
	exit 404
fi

dir=$2
if [ "$dir" = "" ]
then
	echo ERR110: destination-folder cann\'t be empty!
	exit 110
fi

if [ ! -d $dir ]
then
	mkdir $dir
fi

rsync -zrvm --delete --include '*.zip' --exclude "*.*" --exclude '*/*' $src/  $dir/
find $dir -iname '*.zip' | wc -l