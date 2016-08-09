#!/usr/bin/env bash
# su; # SuperUser authentication.
# apt-get install iptables-persistent; # Install iptables-persistent.
# wget -O- https://raw.github.com/Shyam-Has-Your-Anomaly-Mitigated/Shyam-Has-Your-Anomaly-Mitigated.github.io/master/warez/iptables.sh/iptables.sh | bash; # Run this script.

# Just in case, you never know. ;=)
ip6tables -F;#--flush;
ip6tables -X;#--delete-chain;
iptables  -F;#--flush;
iptables  -X;#--delete-chain;

# Default policies.
ip6tables -P INPUT   DROP;
ip6tables -P OUTPUT  DROP;
ip6tables -P FORWARD DROP;
iptables  -P INPUT   DROP;
iptables  -P OUTPUT  DROP;
iptables  -P FORWARD DROP;

# Deny evil/malformed signals.
ip6tables -A INPUT   -m state --state INVALID -j DROP;
ip6tables -A FORWARD -m state --state INVALID -j DROP;
ip6tables -A OUTPUT  -m state --state INVALID -j DROP;
iptables  -A INPUT   -m state --state INVALID -j DROP;
iptables  -A FORWARD -m state --state INVALID -j DROP;
iptables  -A OUTPUT  -m state --state INVALID -j DROP;
iptables  -A INPUT   -f -j DROP; # --fragments
iptables  -A FORWARD -f -j DROP; # --fragments
iptables  -A OUTPUT  -f -j DROP; # --fragments

# Allowable signals.
ip6tables -A INPUT  -m state --state ESTABLISHED     -j ACCEPT;
ip6tables -A OUTPUT -m state --state ESTABLISHED,NEW -j ACCEPT;
iptables  -A INPUT  -m state --state ESTABLISHED     -j ACCEPT;
iptables  -A OUTPUT -m state --state ESTABLISHED,NEW -j ACCEPT;

# Defensive persistence.
iptables-save  > /etc/iptables/rules.v4;
ip6tables-save > /etc/iptables/rules.v6;
# ^Should this be parametrically debatable?

# Need to LOG bad connections into a blacklist..?

exit 0;#########################################################################

<<WHEN

dpkg-reconfigure iptables-persistent

https://en.wikipedia.org/wiki/Iptables
https://wiki.debian.org/iptables
https://wiki.archlinux.org/index.php/iptables
https://wiki.centos.org/HowTos/Network/IPTables
https://help.ubuntu.com/community/IptablesHowTo

http://www.iptables.info/en/iptables-contents.html
http://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
http://unix.stackexchange.com/q/108029
http://askubuntu.com/q/423630
http://security.stackexchange.com/a/4745

https://en.wikipedia.org/wiki/Nftables
https://pkgs.org/download/nftables

WHEN
