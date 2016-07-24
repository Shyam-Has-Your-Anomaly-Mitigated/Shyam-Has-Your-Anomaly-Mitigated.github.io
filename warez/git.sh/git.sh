function github { # $1=commit_message
    clear;
    if [ -z "$1" ];
        then
            status_A=$(git status);
            test=$'On branch master\nYour branch is up-to-date with \'origin/master\'.\nnothing to commit, working directory clean';
            if [ "$status_A" != "$test" ];
                then
                    git status;
                    git add *;
                    git status;
#                    status_B=$(git status);
#                    if [ "$status_B" != "$test" ];
#                        then
#                            cat<<<"$status_A";
#                            cat<<<"$status_B";
#                        else
#                            cat<<<"$status_B";
#                    fi;
                else
#                    cat<<<"$status_A";
                    git status;
            fi;
        else
            git commit -m "$1";
            git push origin master;
#            64_Hare_Kṛṣṇa_Hare_Kṛṣṇa_Kṛṣṇa_Kṛṣṇa_Hare_Hare_Hare_Rāma_Hare_Rāma_Rāma_Rāma_Hare_Hare_108
    fi;
} # ...how to capture colour from command?
# clear; git status; git add *; git status
github
#git commit -m 'm'; git push origin master
github 'm'
64_Hare_Kṛṣṇa_Hare_Kṛṣṇa_Kṛṣṇa_Kṛṣṇa_Hare_Hare_Hare_Rāma_Hare_Rāma_Rāma_Rāma_Hare_Hare_108
# ...is there a way to automate user and password?!?

# after  github
git diff --cached
# before github; against after github
git diff
# before github; but as if it is after github
git diff  HEAD

clear; git status; git pull --all
# ...does `git status` check GitHub "Pull requests"? Like I'll ever get any of those anyway...

# Check commit index
git status
# Remove file from commit index; also removes the file itself
git rm files
# Move file or directory; also moves the actual file or directory
git mv /path/from /path/to
# Add file to commit index
clear; git status; git add *; git status
git add file.ext
# Commit the index you just ∑up
git commit -m 'verbosely descriptive message of changes'
# Push changes to GitHub
git push origin master
# Pull changes from GitHub
git pull --all

# https://www.gitignore.io/
# Detect
find -name ".git*" -maxdepth 1 ~
# Observe
cat ~/.gitignore
# Destroy
rm ~/.gitignore
# Append/Create
cat>>~/.gitignore<<WHEN
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
# Integrate username; probably can just clone the address...
git remote set-url origin 'https://Shyam-Has-Your-Anomaly-Mitigated@github.com/Shyam-Has-Your-Anomaly-Mitigated/Shyam-Has-Your-Anomaly-Mitigated.github.io.git'

#HTTPS = convenience
'https://Shyam-Has-Your-Anomaly-Mitigated@github.com/Shyam-Has-Your-Anomaly-Mitigated/Shyam-Has-Your-Anomaly-Mitigated.github.io.git'
#SSH = security; shorter acronym means more efficient...
'git@github.com:Shyam-Has-Your-Anomaly-Mitigated/Shyam-Has-Your-Anomaly-Mitigated.github.io.git'
