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

group 1   74  $root/2014
group 75  157 $root/2013
group 158 195 $root/2012
group 196 207 $root/2011
group 208 222 $root/2010
group 223 229 $root/2009


