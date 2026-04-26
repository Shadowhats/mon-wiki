# 🐧 L'Encyclopédie Linux (Debian/Ubuntu)

Ce mémo est le référentiel absolu pour l'administration système sous Linux. Des bases de la navigation jusqu'à la gestion des volumes logiques (LVM), la manipulation de texte complexe (`sed`/`awk`) et l'analyse réseau approfondie.

---

## 🗂️ 1. Navigation, Fichiers et Liens

| Action | Commande | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Où suis-je ?** | `pwd` | Affiche le chemin absolu actuel. |
| **Lister le contenu** | `ls -lah` | Liste avec détails (`-l`), cachés (`-a`), et tailles lisibles (`-h` = Mo, Go). |
| **Créer un fichier / Mettre à jour**| `touch` | `touch /tmp/test.txt` (Crée vide ou actualise la date de modif). |
| **Créer des dossiers imbriqués** | `mkdir -p` | `mkdir -p /var/www/html/projet1` |
| **Copier en gardant les droits** | `cp -rp` | `cp -rp /var/www/ /backup/www/` (Le `-p` conserve le propriétaire/droits). |
| **Déplacer / Renommer** | `mv` | `mv config.bak config.old` |
| **Supprimer sans confirmation** | `rm -rf` | ⚠️ `rm -rf /tmp/cache/` (Détruit le dossier et son contenu). |
| **Trouver par nom/type** | `find` | `find /var/log -type f -name "*.log"` (Cherche uniquement les fichiers .log). |
| **Trouver par date/taille** | `find` | `find /backup -mtime +30 -size +1G` (Fichiers de + de 30 jours ET de + de 1 Go). |
| **Créer un Raccourci (Lien Symbolique)**| `ln -s` | `ln -s /etc/nginx/sites-available/mon-site /etc/nginx/sites-enabled/` |

---

## ✂️ 2. Manipulation de Texte (Le pouvoir du SysAdmin)

| Action | Commande | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Lire la fin en direct** | `tail -f` | `tail -f /var/log/syslog` (Indispensable pour surveiller un crash en direct). |
| **Filtrer un mot (Grep)** | `grep -iR` | `grep -iR "error" /var/log/` (Cherche "error", ignore majuscules, dans tout le dossier). |
| **Inverser le filtre (Exclure)** | `grep -v` | `cat auth.log | grep -v "CRON"` (Affiche tout SAUF les lignes contenant CRON). |
| **Couper des colonnes** | `cut -d` | `cut -d: -f1 /etc/passwd` (Coupe le fichier avec le délimiteur `:` et affiche la colonne 1 = les noms d'utilisateurs). |
| **Remplacer du texte (Sed)** | `sed -i` | `sed -i 's/ancien/nouveau/g' config.txt` (Remplace toutes les occurrences). |
| **Traiter des colonnes (Awk)** | `awk` | `awk '{print $1}' access.log` (Affiche uniquement la 1ère colonne = les IP du log web). |
| **Trier par ordre alphabétique** | `sort` | `cat liste.txt | sort` |
| **Supprimer les doublons** | `uniq -c` | `sort liste.txt | uniq -c` (Trie et compte combien de fois chaque ligne apparaît). |
| **Compter les lignes/mots** | `wc -l` | `ls -la | wc -l` (Compte le nombre de fichiers dans le dossier actuel). |
| **Envoyer dans un fichier ET lire**| `tee` | `echo "Serveur OK" | tee -a statut.log` (Affiche le texte ET l'ajoute au fichier). |

---

## 👤 3. Utilisateurs, Droits Avancés et ACL

| Action | Commande | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Devenir root** | `sudo su -` | Le `-` charge les variables d'environnement de root. |
| **Créer un user complet** | `useradd -m -s` | `useradd -m -s /bin/bash j.doe` (Crée dossier `/home` et assigne le shell bash). |
| **Bloquer un compte (Mdp)** | `passwd -l` | `passwd -l j.doe` (Lock le compte). `-u` pour débloquer. |
| **Expiration du Mdp** | `chage -l` | `chage -l j.doe` (Voir/Modifier quand son mot de passe expire). |
| **Éditer les droits sudo** | `visudo` | Ouvre le fichier `/etc/sudoers` de façon sécurisée (ne jamais l'éditer avec nano direct !). |
| **Changer Proprio/Groupe** | `chown -R` | `chown -R www-data:www-data /var/www/` |
| **Changer Droits Numériques** | `chmod` | `chmod 644 fichier` (rw-r--r--) / `chmod 755 script.sh` (rwxr-xr-x). |
| **Droit SUID (Avancé)** | `chmod u+s` | `chmod u+s /bin/ping` (Le fichier s'exécute toujours avec les droits du propriétaire). |
| **Voir les droits ACL** | `getfacl` | `getfacl dossier/` (Affiche les droits fins si chmod ne suffit pas). |
| **Mettre un droit ACL** | `setfacl -m` | `setfacl -m u:j.doe:rwx dossier/` (Donne rwx à j.doe sans changer le groupe principal). |

---

## 💽 4. Matériel, Disques et LVM (Volumes Logiques)

| Action | Commande | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Infos CPU & RAM** | `lscpu` / `free -h` | Affiche l'architecture processeur et la mémoire (RAM + Swap) en lisible. |
| **Infos PCI & USB** | `lspci` / `lsusb` | Liste les périphériques physiques branchés. |
| **Espace disques / Inodes** | `df -h` / `df -i` | `df -h` (Espace disques) / `df -i` (Nombre de fichiers max restants). |
| **Poids d'un dossier** | `du -sh` | `du -sh /var/log/` |
| **Lister les partitions** | `lsblk` | Montre l'arbre des disques (`sda`, `sdb`) et leurs partitions. |
| **Créer une partition** | `fdisk` / `cfdisk`| `cfdisk /dev/sdb` (Outil visuel pour partitionner un nouveau disque). |
| **Formater en Ext4** | `mkfs.ext4` | `mkfs.ext4 /dev/sdb1` (Met le système de fichiers). |
| **Monter / Démonter** | `mount` / `umount` | `mount /dev/sdb1 /mnt/data` (Rend le disque accessible). Ne survit pas au reboot (voir `/etc/fstab`). |
| **Créer LVM (Disque Virtuel)** | `pvcreate` -> `vgcreate` -> `lvcreate` | 1. `pvcreate /dev/sdb1` (Prépare le disque)<br>2. `vgcreate DATA_VG /dev/sdb1` (Crée le groupe)<br>3. `lvcreate -n DATA_LV -L 50G DATA_VG` (Crée le volume de 50Go). |

---

## 🌐 5. Réseau, DNS et Analyse de Trames

| Action | Commande | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Afficher les IP (Cartes)** | `ip a` | Remplace `ifconfig`. |
| **Afficher le Routage** | `ip r` | Montre la passerelle (`default via 192.168.1.254`). |
| **Ports en écoute** | `ss -tulpn` | Remplace `netstat`. Montre qui écoute (ex: Nginx sur port 80). |
| **Résolution DNS** | `dig` ou `nslookup`| `dig google.com` (Demande l'IP du site au serveur DNS de `/etc/resolv.conf`). |
| **Sniffer le réseau** | `tcpdump` | `tcpdump -i eth0 port 80` (Affiche le trafic HTTP brut en direct sur la carte eth0). |
| **Scanner les ports réseau** | `nmap` | `nmap 192.168.1.10` (Vérifie les ports ouverts sur une machine distante). |
| **Pare-feu Netfilter (UFW)** | `ufw` | `ufw allow 22/tcp` / `ufw enable` / `ufw status numbered` |
| **Pare-feu (Iptables natif)** | `iptables -L -v` | Affiche les règles brutes du pare-feu noyau. |

---

## ⚙️ 6. Services (Systemd), Logs et Tâches Planifiées (Cron)

| Action | Commande | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **État d'un service** | `systemctl status` | `systemctl status ssh` |
| **Redémarrer / Recharger** | `systemctl restart`| `systemctl reload nginx` (Recharge la config sans couper les connexions en cours !). |
| **Activer au boot** | `systemctl enable` | `systemctl enable apache2` |
| **Lire les logs système** | `journalctl -u` | `journalctl -u ssh -f` (Affiche les logs en direct juste pour le service SSH). |
| **Voir messages du Noyau** | `dmesg -T` | Affiche les erreurs hardware ou de périphériques USB/Disques au boot. |
| **Planifier une tâche (Cron)**| `crontab -e` | Ouvre l'éditeur. Ex: `0 3 * * * /backup.sh` (Lance le script tous les jours à 3h00 du matin). |

---

## 📦 7. Gestion des Paquets (APT) et Archives

| Action | Commande | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Chercher un paquet** | `apt search` | `apt search apache2` |
| **Installer / MAJ** | `apt update && apt upgrade` | Met à jour les listes puis installe les nouvelles versions. |
| **Désinstaller propre** | `apt purge` | `apt purge nginx` (Supprime le programme ET ses fichiers de configuration). |
| **Archives Tar.gz (Zip linux)**| `tar -czvf` | `tar -czvf archive.tar.gz /var/www/` (Créer) / `tar -xzvf archive.tar.gz` (Extraire). |
| **Synchronisation (Rsync)** | `rsync -avz` | `rsync -avz /data/ /backup/` (Copie uniquement les fichiers modifiés, idéal pour les backups). |
| **Copie via SSH (Scp)** | `scp` | `scp fichier.txt user@192.168.1.10:/tmp/` (Envoie un fichier sur un serveur distant). |

---

## 🩺 8. Surveiller l'activité (Troubleshooting)

| Action | Commande | Exemple Réel / Explication |
| :--- | :--- | :--- |
| **Gestionnaire des Tâches** | `htop` | `top` en plus joli. Permet de tuer un processus (F9). |
| **Qui est connecté ?** | `w` ou `who` | Affiche les utilisateurs connectés en SSH et ce qu'ils font. |
| **Historique des commandes** | `history` | Affiche tout ce que tu as tapé. Fais `!142` pour relancer la ligne 142 de l'historique. |
| **Tuer brutalement** | `kill -9` | `kill -9 4589` (Force l'arrêt du Processus ID 4589). |