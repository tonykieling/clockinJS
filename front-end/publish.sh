echo "You are at ===> "
pwd
echo "Run this command to generate a new react build front-end :)"
echo " Starting ..."
echo "1/3 => remove ../public"
rm -rf ../public
echo "... done"
echo ""
echo "2/3 => rebuil front-end"
npm run build
echo "... done"
echo ""
echo "3/3 => copy front-end to the public directory"
cp -r build ../public
echo "... done"
