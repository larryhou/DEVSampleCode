#!/bin/bash
cd $(dirname $0)

file=$1
offset=$2
if [ "${file}" = "" ]
then
	file=.
else
	if [ ! -f ${file} ]
	then
		file=.
	fi
fi

if [ "${offset}" = "" ]
then
	offset=0
fi

let num=(offset+1)+1
options=$(git log -${num} ${file} | grep '^commit' | awk '{print $2}' | tail -n 2 | xargs | awk '{print $2,$1}')
git diff ${options} ${file} | grep '^[+-]\|diff'