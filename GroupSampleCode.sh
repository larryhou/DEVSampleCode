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

group 1   65  $dir/2014
group 66  131 $dir/2013
group 132 150 $dir/2012
group 151 162 $dir/2011
group 163 177 $dir/2010
group 178 184 $dir/2009


