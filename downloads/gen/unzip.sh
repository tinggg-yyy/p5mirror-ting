cd "/Users/yangting/Desktop/IMSE/p5mirror-ting/downloads/../p5projects"
#
echo unzip 1 "IMSE_Tornado_Ting-jxM3nS9dl"
rm -rf "./IMSE_Tornado_Ting-jxM3nS9dl"
mkdir "./IMSE_Tornado_Ting-jxM3nS9dl"
pushd "./IMSE_Tornado_Ting-jxM3nS9dl" > /dev/null
unzip -q "../../downloads/zips/IMSE_Tornado_Ting-jxM3nS9dl"
popd > /dev/null

cd ..
# remove redundant p5.js p5.sound.min.js
rm -f p5projects/*/p5.*
# sync last_updatedAt.txt
cd downloads/json
if [ -e pending_updatedAt.txt ]; then
  rm -f last_updatedAt.txt
  mv pending_updatedAt.txt last_updatedAt.txt
fi