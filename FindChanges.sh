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

sort -r $old $new | uniq -d > dup.txt
sort -r $new dup.txt | uniq -u > change.txt
cleanUp dup.txt

cat change.txt
echo =========[COUNT]=========
cat change.txt | wc -l 