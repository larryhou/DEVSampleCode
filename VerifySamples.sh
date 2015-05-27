#!/bin/bash

dir=/Users/larryhou/Downloads/DEVSourceCode
while getopts :d:h OPTION
do
	case ${OPTION} in
		d) dir=${OPTARG};;
		h) echo "Usage: $(basename $0) -d [ZIP_DIR] -h [HELP]"
		   exit;;
		:) echo "ERR: -${OPTARG} 缺少参数, 详情参考: $(basename $0) -h" 1>&2
		   exit 1;;
		?) echo "ERR: 输入参数-${OPTARG}不支持, 详情参考: $(basename $0) -h" 1>&2
		   exit 1;;
	esac
done

find ${dir} -iname '*.zip*' | sort | while read line
do
	file=$(echo ${line} | sed 's/\.[0-9]\{1,\}$//')
	if [ ! "${file}" = "${line}" ]
	then
		mv -fv ${line} ${file}
	fi
	
	7z t ${file} >/dev/null 2>&1
	if [ ! ${?} -eq 0 ]
	then
		echo ${line}
	fi
done