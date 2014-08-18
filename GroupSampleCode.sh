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

# {"2009":"[181, 187]","2010":"[166, 180]","2011":"[154, 165]","2012":"[135, 153]","2013":"[71, 134]","2014":"[1, 70]"}
group 1   70  $dir/2014
group 71  134 $dir/2013
group 135 153 $dir/2012
group 154 165 $dir/2011
group 166 180 $dir/2010
group 181 187 $dir/2009


