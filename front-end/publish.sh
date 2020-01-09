pwd
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
