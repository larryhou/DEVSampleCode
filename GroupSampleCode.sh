#!/bin/bash
cd $(dirname $0)

src=/Users/larryhou/Downloads/DEVSourceCode
dir=/Users/larryhou/Documents/developer/samples
while getopts :d:s:h OPTION
do
	case ${OPTION} in
		d) dir=${OPTARG};;
		s) src=${OPTARG};;
		h) echo "Usage: $(basename $0) -d [OUTPUT_DIR] -s [ZIP_DIR] -h [HELP]"
		   exit;;
		:) echo "ERR: -${OPTARG} 缺少参数, 详情参考: $(basename $0) -h" 1>&2
		   exit 1;;
		?) echo "ERR: 输入参数-${OPTARG}不支持, 详情参考: $(basename $0) -h" 1>&2
		   exit 1;;
	esac
done

group()
{
	lower=$1
	upper=$2
	
	folder=$3
	if [ ! -d "${folder}" ]
	then
		mkdir -pv ${folder}
	fi
	
	count=0
	cat DEVSampleCode.txt | while read line
	do
		let count=count+1
		if [ ${count} -ge ${lower} -a ${count} -le ${upper} ]
		then
			name=$(echo ${line} | awk -F/ '{print $NF}')
			
			if [ -f ${src}/${name} ]
			then
				mv -fv ${src}/${name} ${folder}
			fi
		fi
	done
}

group 246 252 ${dir}/2009
group 235 245 ${dir}/2010
group 224 234 ${dir}/2011
group 189 223 ${dir}/2012
group 123 188 ${dir}/2013
group 46  122 ${dir}/2014
group 1   45  ${dir}/2015


