# 🕵️‍♂️ Audit de Sécurité & Pentest (Sécurité Offensive)

L'audit de sécurité offensive consiste à tester la robustesse d'un Système d'Information en utilisant les mêmes techniques qu'un attaquant. Ce document recense les outils de référence, leur utilité et les commandes essentielles pour auditer un parc informatique.

> **⚠️ AVERTISSEMENT LÉGAL :** > L'utilisation de ces outils est strictement réservée à un cadre pédagogique ou professionnel avec une **autorisation écrite (mandat d'audit)**. Scanner un réseau qui ne vous appartient pas est puni par la loi (Code Pénal, articles 323-1 à 323-7).

---

## 🔍 1. Reconnaissance et Scan Réseau

Le but est de cartographier le réseau, d'identifier les machines vivantes et les services qui tournent (ports ouverts).

### Nmap (Network Mapper) - Le Roi
L'outil indispensable pour tout auditeur. 

| Commande | Action |
| :--- | :--- |
| `nmap -sn 192.168.1.0/24` | **Ping Sweep** : Liste les machines allumées sur le réseau (remplace l'ancien `-sP`). |
| `nmap -sV -sC -T4 192.168.1.50` | **Scan Standard** : Détermine les versions des services (`-sV`) et lance les scripts par défaut (`-sC`). |
| `nmap -p- 192.168.1.50` | **Scan Full** : Analyse les 65535 ports TCP (très lent mais exhaustif). |
| `nmap --script vuln 192.168.1.50` | **Scan de vulnérabilités** : Utilise les scripts Nmap pour trouver des failles connues (CVE). |

### Rustscan - Le challenger ultra-rapide
Écrit en Rust, il est capable de scanner l'intégralité des ports d'une machine en quelques secondes avant de passer le relais à Nmap.
* **Exemple :** `rustscan -a 192.168.1.50 -- -sV`

---

## 🏰 2. Audit Active Directory (AD)

L'AD est la cible n°1 des attaquants. Ces outils permettent de trouver les failles de configuration souvent invisibles.

### PingCastle 🇫🇷 🛡️
Outil français (recommandé par l'ANSSI) qui génère un rapport de santé complet de l'AD sous forme de score de risque.
* **Utilisation :** Se lance sans installation sur un poste du domaine. 
* **Sortie :** Un fichier HTML interactif avec des recommandations précises (ex: "Liaisons SMB non signées").

### BloodHound
C'est le GPS de l'attaquant. Il cartographie visuellement les chemins de privilèges.
* **Concept :** On lance un collecteur (**Sharphound**) sur le domaine, puis on importe les données dans l'interface BloodHound (Neo4j).
* **Objectif :** Visualiser comment un simple compte "Utilisateur" peut devenir "Admin du Domaine" en 3 sauts.

### NetExec (Anciennement CrackMapExec)
Le couteau suisse pour tester les identifiants et l'énumération de protocoles (SMB, WMI, MSSQL, SSH).
* **Exemple (Droits admin) :** `nxc smb 192.168.1.0/24 -u 'p.tech' -p 'P@ssword123!' --local-auth`
* **Exemple (Partages anonymes) :** `nxc smb 192.168.1.0/24 --shares`

---

## 🦠 3. Scanners de Vulnérabilités (Gestion des failles)

Ces logiciels comparent les versions des logiciels installés avec des bases de données de failles mondiales (CVE).

| Logiciel | Type | Usage |
| :--- | :--- | :--- |
| **OpenVAS (Greenbone)** | 🟢 Open Source | Scanner complet à installer sur un serveur Debian. Rapports PDF détaillés. |
| **Tenable Nessus** | 🔴 Pro | La référence pro. Moins de faux positifs, mais licence payante (Essentials gratuit pour 16 IP). |
| **Qualys** | 🔴 Cloud | Utilisé pour scanner des infrastructures externes ou des parcs multi-sites. |

---

## 🕸️ 4. Audit Web (Sites et Applications)

### Burp Suite (Le standard absolu)
Proxy d'interception. Il se place entre votre navigateur et le serveur web pour analyser, modifier et rejouer toutes les requêtes (HTTP/HTTPS). Indispensable pour tester les failles d'authentification ou les injections SQL.

### Gobuster / ffuf (Fuzzing)
Pour trouver les pages cachées d'un serveur web (ex: `/admin`, `/.env`, `/backup`).
* **Exemple :** `gobuster dir -u http://192.168.1.20 -w /usr/share/wordlists/dirb/common.txt`

### Nikto
Scanner web efficace pour trouver des fichiers de configuration oubliés ou des serveurs mal patchés.
* **Exemple :** `nikto -h http://192.168.1.20`

---

## 🔑 5. Audit de Mots de Passe (Password Cracking)

Vérifier que la politique de mots de passe de l'entreprise est robuste en essayant de "casser" les empreintes (hashes).

* **John the Ripper :** Le plus polyvalent (CPU).
  * `john --wordlist=passwords.txt my_hashes.txt`
* **Hashcat :** Le plus puissant (utilise la puissance de la carte graphique GPU).
  * `hashcat -m 1000 hashes.txt rockyou.txt` (Le `-m 1000` = format NTLM de Windows).

---

## 🛠️ 6. Frameworks "Tout-en-un"

| Outil | Usage |
| :--- | :--- |
| **Kali Linux** | La distribution Linux qui contient déjà TOUS les outils cités plus haut. |
| **Metasploit Framework** | Une base de données d'exploits. Permet de tester si l'exploitation d'une faille est réellement possible. |
| **Impacket** | Scripts Python pour manipuler les protocoles réseau (indispensable pour l'audit AD avancé). |

---

## 📝 Check-list d'un Audit Rapide (TSSR)

Si tu dois auditer un nouveau serveur que tu viens de monter :
1. **Scan de ports :** `nmap -sn [IP]` puis `nmap -sV [IP]` (Vérifier qu'aucun service inutile ne tourne).
2. **Audit AD :** Lancer **PingCastle** (Vérifier les mauvaises configurations de base).
3. **Audit de droits :** Vérifier les partages réseaux avec `nxc smb [IP] --shares`.
4. **Vérification MAJ :** Lancer un scan **OpenVAS** pour voir si des CVE critiques sont présentes.
