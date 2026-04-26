# 🧠 Bienvenue sur WIKI IT

**Base de Connaissances Technique — Administration Système, Réseau & Cybersécurité**

---

Bienvenue sur mon espace de documentation personnel. Ce wiki a été pensé et conçu comme un véritable "Second Cerveau". Il centralise l'ensemble de mes notes, procédures, scripts et référentiels techniques accumulés lors de ma formation TSSR et de mes expériences professionnelles en entreprise.

L'objectif de ce site est simple : **Ne plus jamais chercher deux fois la même information.** > **💡 Astuce de navigation :**
> Utilisez la **barre de recherche** en haut de l'écran pour trouver instantanément une commande, un outil ou une procédure parmi toutes les pages du wiki.

---

## 🗂️ Organisation de la Base de Connaissances

La documentation est structurée autour de quatre grands piliers de l'infrastructure IT :

### 📚 Culture Générale IT & Cybersécurité
Comprendre l'écosystème, les obligations légales et les outils du marché pour concevoir des architectures sécurisées.

* **[Masterclass Fondamentaux (CCNA)](reseau/notions_reseau.md) :** Modèle OSI, Commutation (VLAN, STP, LACP) et Routage dynamique (OSPF).

* **[Panorama des Solutions IT](culture/outils_it.md) :** Cartographie des logiciels (SIEM, EDR, Firewall, Supervision), licences et souveraineté.

* **[NIS2 & Hygiène ANSSI](culture/nis2_anssi.md) :** Le référentiel des obligations légales et des bonnes pratiques de sécurité en France.

* **[Audit & Sécurité Offensive](culture/audit_securite.md) :** Cartographie (Nmap), Audit AD (PingCastle, BloodHound) et scanners de vulnérabilités.

### 🌐 Ingénierie Réseau
Déploiement, configuration et dépannage des équipements de commutation et de routage.

* **[Ports & Protocoles (Cheat Sheet)](reseau/ports_reseau.md) :** Liste exhaustive des ports standards (TCP/UDP) et commandes de diagnostic (netstat, ss, nmap).

* **[Cheat Sheet Cisco vs HPE](reseau/cisco_hpe.md) :** Traduction intégrale des commandes Cisco IOS vers l'environnement HPE Comware.

* **[Stormshield Network Security](reseau/stormshield.md) :** Administration CLI du firewall leader français (Objets, Filtrage, VPN).

* **[Troubleshooting Réseau](reseau/troubleshooting.md) :** Méthodologie et commandes de diagnostic (Couches 1 à 7, TCP/IP, DNS, ARP).

### 🐧 & 🪟 Administration Système
Gestion des serveurs, des annuaires d'entreprise et automatisation en ligne de commande.

* **[Virtualisation & Docker](sys/virtualisation.md) :** Gestion des hyperviseurs (Hyper-V, Proxmox) et conteneurisation.

* **[Windows Server & AD (PowerShell)](sys/ad_windows.md) :** De l'installation d'un domaine à la gestion avancée des rôles (Hyper-V, WSUS, WDS...).

* **[Scripts & Automatisation](sys/scripts.md) :** Bibliothèque de scripts PowerShell et Bash pour la gestion de parc et les sauvegardes.

* **[Dépannage AD & GPO](sys/troubleshooting_ad.md) :** Résolution des pannes courantes (Réplication, Tickets, GPO, Trust Relationship).

* **[Masterclass Linux (Debian/Ubuntu)](sys/linux.md) :** L'encyclopédie des commandes CLI pour dominer un environnement Linux sans interface graphique.

---

## 🚀 À propos de ce projet

Ce site est généré statiquement grâce au framework **MkDocs** et au thème **Material for MkDocs**. Il est hébergé et versionné en continu (CI/CD) sur GitHub/GitLab, reflétant ainsi les bonnes pratiques modernes d'Infrastructure as Code (IaC) et de documentation ("Docs as Code").

*Mise à jour régulière au fil des projets et incidents rencontrés en production.*