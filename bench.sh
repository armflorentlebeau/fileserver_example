#!/bin/bash

if [ ! -d silesia ]; then
	wget https://sun.aei.polsl.pl//~sdeor/corpus/silesia.zip
	unzip silesia.zip -d silesia
fi

echo "File name, level 1 read (MB/s), level 1 write (MB/s), level 1 compression (%), ..."
for i in $(ls silesia); do
	printf "$i, "
	for lvl in {1..9}; do
		time=$(/usr/bin/time -f "%e" node test_zip.js silesia/$i $lvl 2>&1)
		output=$(du -b silesia/$i\.gz | awk -F" " '{print $1}')
		input=$(du -b silesia/$i | awk -F" " '{print $1}')
		rd=`printf %.2f $(echo "($input / (1024 * 1024) ) / $time" | bc -l )`
		wr=`printf %.2f $(echo "($output / (1024 * 1024) ) / $time" | bc -l )`
		compression=`printf %.2f $(echo "$output / $input * 100" | bc -l )`
	        printf "$rd, $wr, $compression, "
		rm silesia/$i.gz
	done
	printf "\n"
done
