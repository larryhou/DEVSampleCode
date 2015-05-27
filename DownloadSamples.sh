#!/bin/bash

output=/Users/larryhou/Downloads/DEVSourceCode
while getopts :o:h OPTION
do
	case ${OPTION} in
		o) output=${OPTARG};;
		h) echo "Usage: $(basename $0) -o [OUTPUT_DIR] -h [HELP]"
		   exit;;
		:) echo "ERR: -${OPTARG} 缺少参数, 详情参考: $(basename $0) -h" 1>&2
		   exit 1;;
		?) echo "ERR: 输入参数-${OPTARG}不支持, 详情参考: $(basename $0) -h" 1>&2
		   exit 1;;
	esac
done

if [ ! -d "${output}" ]
then
	mkdir -pv ${output}
fi

cat DEVSampleCode.txt | grep http | xargs -I{} wget -P ${output} {}