#!/bin/bash
cd $(dirname $0)

root=/Users/larryhou/Downloads/DEVSourceCode

group()
{
	lower=$1
	upper=$2
	
	folder=$3
	if [ ! -d $folder ]
	then
		mkdir $folder
	fi
	
	count=0
	cat DEVSampleCode.txt | while read line
	do
		let count=count+1
		if [ $count -ge $lower -a $count -le $upper ]
		then
			name=${line##*/}
			
			if [ -f $root/$name ]
			then
				mv -fv $root/$name $folder
			fi
			
			if [ -f $folder/$name ]
			then
				7z x -y $folder/$name -o$folder
			fi
		fi
	done
}

group 1   65  $root/2014
group 66  131 $root/2013
group 132 150 $root/2012
group 151 162 $root/2011
group 163 177 $root/2010
group 178 184 $root/2009


