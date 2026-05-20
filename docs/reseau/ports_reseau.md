# 🚪 Ports Réseau & Protocoles Indispensables

En réseau, une adresse IP identifie le **bâtiment** (la machine), et le port identifie la **porte** (le service/l'application). 
Il existe 65 535 ports. Les ports de 0 à 1023 sont dits "bien connus" (Well-Known) et sont réservés aux services standards.

---

## 🔒 1. Accès Distant & Administration

| Port | Protocole | Type | Description |
| :--- | :--- | :--- | :--- |
| **22** | **SSH** | TCP | *Secure Shell*. Prise de main à distance sécurisée en ligne de commande (Linux, Routeurs). Remplace Telnet. |
| **23** | **Telnet** | TCP | Prise de main à distance. **⚠️ Obsolète et non sécurisé** (les mots de passe transitent en clair). |
| **3389** | **RDP** | TCP/UDP | *Remote Desktop Protocol*. Prise de main graphique sur les machines Windows. |

## 🌐 2. Web & Navigation

| Port | Protocole | Type | Description |
| :--- | :--- | :--- | :--- |
| **80** | **HTTP** | TCP | Trafic Web standard (non chiffré). |
| **443** | **HTTPS** | TCP | Trafic Web sécurisé (chiffré via SSL/TLS). La norme absolue aujourd'hui. |
| **8080 / 8443** | **HTTP-ALT** | TCP | Fréquemment utilisés pour les Proxys web (Squid), les serveurs applicatifs (Tomcat) ou les interfaces d'admin web. |

## 📁 3. Transfert de Fichiers & Partage

| Port | Protocole | Type | Description |
| :--- | :--- | :--- | :--- |
| **20 / 21** | **FTP** | TCP | *File Transfer Protocol*. Transfert de fichiers (21 = Contrôle, 20 = Données). Non sécurisé. |
| **69** | **TFTP** | UDP | *Trivial FTP*. Transfert ultra-basique, souvent utilisé pour mettre à jour des switchs ou pour le boot PXE. |
| **445** | **SMB/CIFS** | TCP | Partage de fichiers et d'imprimantes sous Windows. Cible favorite des ransomwares (ex: WannaCry). |
| **2049** | **NFS** | TCP/UDP | *Network File System*. L'équivalent du SMB, mais pour le monde Linux. |

## 📧 4. Messagerie (Emails)

!!! tip "Comprendre le flux de messagerie"
    Pensez au parcours d'un mail : Il est envoyé depuis votre client vers le serveur (SMTP), transite entre les serveurs (SMTP), puis le destinataire vient le lire (POP/IMAP).



| Port | Protocole | Type | Description |
| :--- | :--- | :--- | :--- |
| **25** | **SMTP** | TCP | Envoi d'emails entre serveurs (non chiffré, MTA→MTA). |
| **465** | **SMTPS** | TCP | Soumission de mail avec **TLS implicite** (RFC 8314). Le client se connecte déjà en TLS. |
| **587** | **Submission** | TCP | Soumission de mail client → serveur, généralement avec **STARTTLS**. Standard moderne pour les clients (Thunderbird, Outlook). |
| **110** | **POP3** | TCP | Réception d'emails (télécharge le mail et le supprime du serveur). |
| **995** | **POP3S** | TCP | Réception d'emails POP3 sécurisée (SSL/TLS). |
| **143** | **IMAP** | TCP | Réception d'emails (synchronise avec le serveur, idéal pour multi-appareils). |
| **993** | **IMAPS** | TCP | Réception d'emails IMAP sécurisée (SSL/TLS). |

## ⚙️ 5. Infrastructure & Services de Base

| Port | Protocole | Type | Description |
| :--- | :--- | :--- | :--- |
| **53** | **DNS** | UDP/TCP | *Domain Name System*. Traduit les noms en adresses IP. UDP pour requêtes, TCP pour transferts de zones. |
| **67 / 68** | **DHCP** | UDP | Distribue les adresses IP (67 = Serveur, 68 = Client). |
| **123** | **NTP** | UDP | *Network Time Protocol*. Synchronisation de l'heure des serveurs (critique pour l'AD et les logs). |
| **161 / 162**| **SNMP** | UDP | Supervision réseau. Le 161 pour interroger (Zabbix), le 162 pour recevoir des alertes (Traps). |
| **389** | **LDAP** | TCP/UDP | Annuaire (Active Directory). Utilisé pour l'authentification en clair. |
| **636** | **LDAPS** | TCP | Version sécurisée de LDAP (obligatoire aujourd'hui pour des liaisons externes). |
| **514** | **Syslog** | UDP | Centralisation des journaux d'événements (logs) des équipements réseaux vers un serveur de collecte. |

## 🗄️ 6. Bases de Données (BDD)

| Port | Protocole | Type | Description |
| :--- | :--- | :--- | :--- |
| **3306** | **MySQL / MariaDB**| TCP | Base de données Open Source (très utilisée avec les serveurs Web / WordPress). |
| **5432** | **PostgreSQL** | TCP | Base de données Open Source avancée. |
| **1433** | **MSSQL** | TCP | Microsoft SQL Server (Environnements d'entreprise). |

---

## 🛠️ Commandes Utiles de Dépannage (Troubleshooting)

Savoir quel port correspond à quoi est utile, mais savoir comment vérifier si un port est ouvert, c'est encore mieux !

### Sous Windows (PowerShell & CMD)
* **Voir tous les ports ouverts sur ma machine :**
  `netstat -ano` (L'option `o` permet de voir le PID (l'ID du processus) qui utilise le port).
* **Tester si un port est ouvert sur un serveur distant :**
  `Test-NetConnection -ComputerName 192.168.1.50 -Port 3389` (Remplace le vieux Telnet pour faire des tests en PowerShell).

### Sous Linux (Bash)
* **Lister les services locaux en écoute :**
  `ss -tulpn` (Remplace l'ancienne commande `netstat -plntu`).
* **Scanner les ports d'un serveur distant (Nmap) :**
  `nmap -p 80,443,22 192.168.1.50` (Vérifie si les ports Web et SSH sont ouverts).
* **Tester un port spécifique rapidement :**
  `nc -zv 192.168.1.50 3306` (Utilise Netcat pour tester la connexion MySQL depuis le client).
