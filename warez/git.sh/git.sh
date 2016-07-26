function github { # $1=commit_message
    clear;
    if [ -z "$1" ]; then
        git status; # Check commit index
        git add . ; # add all files to commit index
        git status; # Recheck commit index
    elif [ "$1" == '-a' ]     ; # all
        then git diff HEAD    ; # before github; but as if it is after github
    elif [ "$1" == '-s' ]     ; # staged
        then git diff --cached; # after  github
    elif [ "$1" == '-d' ]     ; # default
        then git diff         ; # before github; against after pseudo github
    elif [ "$1" == '-f' ]     ; # fetch
        then git status       ;
        git pull --all        ; # Pull changes from GitHub
    else
        git commit -m "$1"    ; # Commit the index you just ∑up
        git push origin master; # Push changes to GitHub
    fi;
} # ...how to capture colour from command?
# clear; git status; git add .; git status
github
# git diffs
github -a
github -s
github -d
# git pull -all
github -f
# git commit -m 'm'; git push origin master
github 'descriptive comment of changes; a wi╫y ңø╪⠑╈ꝏßéﬂ, if you wi║.'
64_Hare_Kṛṣṇa_Hare_Kṛṣṇa_Kṛṣṇa_Kṛṣṇa_Hare_Hare_Hare_Rāma_Hare_Rāma_Rāma_Rāma_Hare_Hare_108
# ...is there a way to automate password?!?
# ...does `git status` check GitHub "Pull requests"? Like I'll ever get any of those anyway...

# Remove file from commit index; also removes the file itself
git rm files
# Move file or directory; also moves the actual file or directory
git mv /path/from /path/to

# https://www.gitignore.io/
# Detect
find -name ".git*" -maxdepth 1 ~
# Observe
cat ~/.gitignore
# Destroy
rm ~/.gitignore
# Append/Create
cat>>~/.gitignore <<WHEN
test-*
*pass*
*key*
*secret*
*PolymericFalcigholDerivation*
WHEN
# Reconfigure
git config --global core.excludesfile ~/.gitignore

# Install
clear; sudo apt-get install git
# Configure
clear; git config --global user.name 'Shyam'
clear; git config --global user.email 'shyam@shyam.id.au'
# Clone
clear; git clone 'https://Shyam-Has-Your-Anomaly-Mitigated@github.com/Shyam-Has-Your-Anomaly-Mitigated/Shyam-Has-Your-Anomaly-Mitigated.github.io.git'
# Integrate username; probably can just clone the SSH address...
git remote set-url origin 'https://Shyam-Has-Your-Anomaly-Mitigated@github.com/Shyam-Has-Your-Anomaly-Mitigated/Shyam-Has-Your-Anomaly-Mitigated.github.io.git'

#HTTPS = convenience
'https://Shyam-Has-Your-Anomaly-Mitigated@github.com/Shyam-Has-Your-Anomaly-Mitigated/Shyam-Has-Your-Anomaly-Mitigated.github.io.git'
#SSH = security; shorter acronym means more efficient...
'git@github.com:Shyam-Has-Your-Anomaly-Mitigated/Shyam-Has-Your-Anomaly-Mitigated.github.io.git'
