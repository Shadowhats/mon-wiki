# 🧰 Guide de Dépannage Réseau (Troubleshooting)

Un réseau ne "tombe pas en marche". Quand un utilisateur crie *"Internet est cassé !"*, voici la méthodologie et l'arsenal de commandes pour isoler et réparer la panne.

!!! tip "La Méthodologie en Or (modèle OSI)"
    Ne commence jamais par chercher un problème de pare-feu si le câble est débranché ! Remonte toujours du bas vers le haut :

    1. **Couche 1 (Physique)** : le câble est-il branché ? Le port du switch clignote-t-il ?
    2. **Couche 2 (Liaison)** : y a-t-il un problème d'adresse MAC ou de VLAN ?
    3. **Couche 3 (Réseau)** : le PC a-t-il une IP valide ? La passerelle répond-elle au ping ?
    4. **Couches 4 à 7 (Ports & App)** : le DNS fonctionne-t-il ? Le port TCP est-il ouvert ?

---

## 🟢 Scénario 1 : "Je n'ai plus accès à Internet" (Test de base)

*Le but ici est de trouver exactement où le paquet se perd.*

### 1. Tester la boucle locale (La carte réseau du PC)
Si ça échoue, la carte réseau du PC est désactivée ou les pilotes sont morts.
* **Windows / Linux :** `ping 127.0.0.1`

### 2. Tester sa propre passerelle (Le routeur de l'entreprise)
Si ça échoue, le problème est interne (câble, switch, VLAN, ou mauvaise IP).

* **Trouver sa passerelle (Windows) :** `ipconfig` (Regarder "Passerelle par défaut")

* **Trouver sa passerelle (Linux) :** `ip r`

* **Test :** `ping 192.168.1.254` *(Remplacer par l'IP de la passerelle)*

### 3. Tester la sortie sur Internet (Test IP)
Si ça échoue, la box internet de l'entreprise est déconnectée ou le pare-feu bloque.

* **Windows / Linux :** `ping 8.8.8.8` (Serveur de Google, répond toujours).

### 4. Voir où ça bloque exactement (Traceroute)
Affiche chaque routeur traversé par ton paquet. Parfait pour voir si c'est le FAI (Orange, Free) qui a une panne.

* **Windows :** `tracert 8.8.8.8`

* **Linux :** `traceroute 8.8.8.8`

---

## 🔵 Scénario 2 : "Le site web ne s'affiche pas" (Problème DNS)

*Le Ping vers `8.8.8.8` fonctionne, mais le Ping vers `google.com` échoue. C'est 100% un problème DNS (l'annuaire ne traduit plus le nom en IP).*

| Explication du test | Commande Windows (CMD/PowerShell) | Commande Linux (Bash) |
| :--- | :--- | :--- |
| **Vider le cache DNS du PC** (Règle 90% des bugs) | `ipconfig /flushdns` | `resolvectl flush-caches` |
| **Demander à son DNS quelle est l'IP d'un site** | `nslookup studi.fr` | `dig studi.fr` |
| **Forcer l'utilisation d'un autre DNS (ex: Google)**| `nslookup studi.fr 8.8.8.8`| `dig @8.8.8.8 studi.fr` |
| **Vérifier l'IP DNS reçue par DHCP** | `ipconfig /all` | `cat /etc/resolv.conf` |

---

## 🟠 Scénario 3 : "L'application métier ne se connecte pas au serveur" (Problème de Port/Pare-feu)

*Le serveur répond au Ping, mais le logiciel de compta affiche "Connexion refusée". Le Ping ne suffit pas : il faut tester si le "Port" TCP (ex: 443, 3306, 80) est ouvert ou bloqué par le pare-feu.*

| Explication du test | Commande Windows (PowerShell) | Commande Linux (Bash) |
| :--- | :--- | :--- |
| **Tester si le port est ouvert sur le serveur** | `Test-NetConnection 10.0.0.5 -Port 3306` | `nc -zv 10.0.0.5 3306` (Netcat) |
| **Voir qui écoute sur mon propre serveur** | `netstat -ano \| findstr 3306` | `ss -tulpn \| grep 3306` |
| **Scanner les ports ouverts d'une machine distante** | *(Nécessite Nmap)* | `nmap 10.0.0.5` |

> **💡 Résultat de la commande (Netcat / Test-NetConnection) :**
> * **Succeeded / Succeeded :** Le port est ouvert, le pare-feu laisse passer. (Le problème vient du logiciel).
> * **Failed / Timeout :** Le pare-feu bloque, ou le serveur est éteint.
> * **Connection Refused :** Le pare-feu laisse passer, mais AUCUN service ne tourne sur ce port côté serveur !

---

## 🔴 Scénario 4 : "Conflit d'adresse IP" (Problème ARP / Couche 2)

*Un message Windows dit "Conflit d'adresse IP" ou le réseau saute sans arrêt. Deux machines ont la même IP. Il faut trouver le coupable via son adresse MAC.*

| Explication du test | Commande Windows | Commande Linux |
| :--- | :--- | :--- |
| **Voir la table ARP (Correspondance IP <-> MAC)** | `arp -a` | `ip neigh` |
| **Vider la table ARP (Forcer le PC à redécouvrir)** | `arp -d *` | `ip -s -s neigh flush all` |
| **Trouver le fabricant du PC pirate** | Copier les 3 premiers blocs de l'adresse MAC (ex: `00:1A:2B`) et chercher sur **macvendors.com** | Identique |

---

## 📡 Scénario 5 : Sortir l'Artillerie Lourde (Capture de paquets)

*Quand on ne comprend plus rien, on capture le trafic brut pour voir exactement ce qui circule sur le câble.*

1. **Sous Linux (En ligne de commande CLI) :**
   * Capturer tout le trafic HTTP : `tcpdump -i eth0 port 80`
   * Capturer le trafic venant d'une IP précise : `tcpdump host 192.168.10.50`
   * Capturer et sauvegarder dans un fichier pour l'analyser plus tard : `tcpdump -w capture.pcap`

2. **Sous Windows / Linux (Interface Graphique) :**
   * Utiliser **Wireshark**. C'est l'outil indispensable. Il permet d'ouvrir les fichiers `.pcap` et d'analyser visuellement en rouge et noir les erreurs réseau (TCP Retransmission, erreurs DNS).