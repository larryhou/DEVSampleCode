#!/bin/bash
cat DEVSampleCode.txt | xargs -I{} wget -N {}