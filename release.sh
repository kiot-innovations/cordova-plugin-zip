#!/bin/bash
echo "Enter tag name (ie: 6.117.0)"
read tagnumber
echo "Enter OS (ios | android)"
read os
echo "Enter environment (test | prod | uat )"
read env
echo "-------------------------------"
echo "These tags looks like the one you selected:"
echo $(git tag | grep $tagnumber)
echo "-------------------------------"
echo "Want to create anyways? (y/n)"
read answer

if [ $answer = "y" ];
then
echo "Please enter tag's message"
read message
echo "-------------------------------"
echo "Creating $tagnumber-$os$env"
git tag -d $tagnumber-$os$env
git push origin --delete $tagnumber-$os$env
git tag -a $tagnumber-$os$env -m "$message"
echo "Done"
echo "-------------------------------"
echo "Want to push this tag? $tagnumber-$os$env (y/n)"
read pusha

if [ $pusha = "y" ];
then
git push origin $tagnumber-$os$env
else
echo "Exiting..."
fi
fi
