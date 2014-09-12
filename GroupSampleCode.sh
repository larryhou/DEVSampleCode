#!/bin/bash
cd $(dirname $0)

src=/Users/larryhou/Downloads/DEVSourceCode
dir=/Users/larryhou/Documents/developer/samples

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
			
			if [ -f $src/$name ]
			then
				mv -fv $src/$name $folder
				7z x -y $folder/$name -o$folder
			fi
		fi
	done
}

group 81  140 $dir/2013
group 184 190 $dir/2009
group 171 183 $dir/2010
group 160 170 $dir/2011
group 141 159 $dir/2012
group 1   80  $dir/2014


