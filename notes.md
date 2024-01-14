1/10/2024: code repositories


ls -la
show hidden directories. Use to see .git

-git checkout to go back to a previous version
-you can edit/commit changes directly from github
-git fetch: see latest info about changes on git
-git status: see the differences b/t clone and see if we’re missing a commit. 
Also tells us if we added stuff but haven’t yet committed.
-git -am “message” : Adds all new files and then commits with the message

print “more text” >> hello.txt means concatenate to the file
print “more text” > hello.txt means overwrite
git diff HEAD HEAD~1 //compare version with previous version
git log
Merge Conflicts


Configure your own commands:
git config --global -l
alias.s=status
alias.l=log --all --graph --decorate --oneline --pretty=format:'%C(bold 
red)%d%Creset %cr %C(bold yellow)%h%Creset - %C(green)%an%Creset %s'
pull.rebase=true
core.editor=code



-readme.md: Use to describe modifications and alterations you make to 
startup.
-notes.md: track what you have learned. will be used for the midterm/final

Fork: Create a copy of a github repository. Maintains a link to the original 
repository so you can pull down updates.

1/18: EC2
http://52.87.41.204/
ssh -i cs260/[filename] ubuntu@52.87.41.204

