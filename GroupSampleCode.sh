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

# {"2009":"[182, 188]","2010":"[167, 181]","2011":"[155, 166]","2012":"[136, 154]","2013":"[72, 135]","2014":"[1, 71]"}
group 1   71  $dir/2014
group 72  135 $dir/2013
group 136 154 $dir/2012
group 155 166 $dir/2011
group 167 181 $dir/2010
group 182 188 $dir/2009


