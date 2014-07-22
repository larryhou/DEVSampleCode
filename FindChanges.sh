#!/bin/bash
cd $(dirname $0)

old=$1
new=$2

cleanUp()
{
	file=$1
	if [ -f $file ]
	then
		rm -f $file
	fi
}

sort $old $new | uniq -d > dup.txt
sort $new dup.txt | uniq -u > rlt.txt
cleanUp dup.txt

cat rlt.txt
echo =========[COUNT]=========
cat rlt.txt | wc -l 
cleanUp rlt.txt