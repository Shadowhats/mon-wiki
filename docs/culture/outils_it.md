# 🧰 La Boîte à Outils IT & Cyber : Panorama des Solutions

Ce document cartographie l'écosystème complet des logiciels et solutions utilisés en entreprise. Il permet de comprendre "qui fait quoi" et de choisir le bon outil selon le budget et les contraintes de souveraineté.

> **💡 Légende du tableau :**
>
> * **Licences :** 🟢 Open Source | 🟡 Freemium (Hybride) | 🔴 Propriétaire
> * **Souveraineté :** 🇫🇷 Éditeur Français ou Européen
> * **Sécurité :** 🛡️ Certifié, qualifié ou fortement recommandé par l'ANSSI
---

## 👁️ 1. Monitoring & Supervision (Surveiller la santé du SI)

| Outil | Licence | 🇫🇷 / 🛡️ | Description / Cas d'usage |
| :--- | :--- | :--- | :--- |
| **LibreNMS** | 🟢 OS | | Excellent outil de monitoring réseau basé sur SNMP avec auto-découverte du matériel. |
| **Zabbix** | 🟢 OS | | Le standard absolu de la supervision gratuite. Tout se fait via agent ou SNMP. |
| **Centreon** | 🟡 Free | 🇫🇷 | Très populaire en France. Interface claire, beaucoup de plugins. |
| **Canopsis** | 🟢 OS | 🇫🇷 | Hyperviseur français, idéal pour consolider les alertes de plusieurs outils. |
| **Prometheus & Grafana**| 🟢 OS | | Le combo moderne, roi de la supervision Cloud, Docker et Linux. |
| **PRTG (Paessler)** | 🔴 Prop | | Interface très visuelle. Très apprécié sous Windows. Payant au capteur. |
| **SolarWinds** | 🔴 Prop | | Mastodonte historique américain (tristement célèbre pour le piratage de 2020). |
| **Datadog** | 🔴 Prop | | La Rolls-Royce du monitoring cloud (SaaS). Très cher mais surpuissant. |

---

## 🚨 2. EDR / XDR & Antivirus (Endpoint Detection & Response)

| Outil | Licence | 🇫🇷 / 🛡️ | Description / Cas d'usage |
| :--- | :--- | :--- | :--- |
| **HarfangLab** | 🔴 Prop | 🇫🇷 🛡️ | **L'EDR Français par excellence.** Certifié ANSSI. Hyper léger et transparent. |
| **Tehtris** | 🔴 Prop | 🇫🇷 🛡️ | Plateforme XDR française ultra-puissante avec neutralisation automatique des menaces. |
| **CrowdStrike Falcon** | 🔴 Prop | | Le leader mondial américain. Ultra-performant (malgré la panne mondiale de 2024). |
| **SentinelOne** | 🔴 Prop | | Grand concurrent US de CrowdStrike. Excellente IA comportementale. |
| **Microsoft Defender** | 🔴 Prop | | L'EDR de Microsoft (inclus dans M365 E5). Nativement intégré à Windows. |
| **Kaspersky** | 🔴 Prop | | Historiquement l'un des meilleurs moteurs, mais banni de beaucoup d'institutions. |
| **Wazuh** | 🟢 OS | | Le couteau suisse absolu (EDR + SIEM gratuit). Parfait pour les petits budgets. |

---

## 🛡️ 3. SIEM & Log Management (Centralisation des événements)

| Outil | Licence | 🇫🇷 / 🛡️ | Description / Cas d'usage |
| :--- | :--- | :--- | :--- |
| **Logging Made Easy (CISA)**| 🟢 OS | | Projet gratuit du CISA/NCSC. Un SIEM "clé en main" pour centraliser et surveiller facilement les logs Windows. |
| **Prelude SIEM** | 🔴 Prop | 🇫🇷 🛡️ | SIEM souverain certifié ANSSI, très utilisé dans les ministères français. |
| **Splunk** | 🔴 Prop | | Le leader historique mondial. Puissance infinie, mais coûte une fortune. |
| **Elastic Security (ELK)**| 🟡 Free | | (Elasticsearch, Logstash, Kibana). Le standard OS pour indexer/visualiser. |
| **Graylog** | 🟡 Free | | L'alternative à ELK. Souvent préféré par les SysAdmins car plus simple à monter. |
| **Microsoft Sentinel** | 🔴 Prop | | Le SIEM 100% Cloud de Microsoft (SaaS) dans Azure. |
| **IBM QRadar** | 🔴 Prop | | SIEM lourd, massivement utilisé dans les gros SOC bancaires. |

---

## 🕵️ 4. IDS / IPS & NDR (Analyse du réseau & Intrusion)

| Outil | Licence | 🇫🇷 / 🛡️ | Description / Cas d'usage |
| :--- | :--- | :--- | :--- |
| **Trackwatch (Gatewatcher)**| 🔴 Prop | 🇫🇷 🛡️ | NDR (Network Detection & Response) français qualifié ANSSI. |
| **Suricata** | 🟢 OS | | Le moteur IPS open-source le plus performant et moderne (multithreadé). |
| **Snort** | 🟢 OS | | Le plus vieux et connu (Cisco). Utilise un système de règles standard de l'industrie. |
| **Zeek (ex-Bro)** | 🟢 OS | | Analyseur de métadonnées réseau (génère des logs hyper détaillés des connexions). |
| **Vectra AI** | 🔴 Prop | | Solution NDR américaine très connue utilisant l'IA pour traquer les pirates en interne. |

---

## 🔥 5. Firewalls, Proxys & Filtrage Web (Périmètre)

| Outil | Licence | 🇫🇷 / 🛡️ | Description / Cas d'usage |
| :--- | :--- | :--- | :--- |
| **Olfeo** | 🔴 Prop | 🇫🇷 🛡️ | Passerelle de sécurité web (Proxy). Incontournable dans le public pour le filtrage web conforme à la loi française. |
| **Stormshield** | 🔴 Prop | 🇫🇷 🛡️ | **Le pare-feu souverain (Airbus).** Qualifié ANSSI, c'est le standard absolu du secteur public (Mairies, Hôpitaux, Ministères). |
| **pfSense / OPNsense** | 🟢 OS | | Les rois de l'open-source. Robustes, parfaits pour PME et Labs. |
| **Fortinet (FortiGate)** | 🔴 Prop | | Leader mondial du firewall matériel. Interface rapide via puces ASIC dédiées. |
| **Palo Alto Networks** | 🔴 Prop | | Pare-feu "Next-Gen" (NGFW) haut de gamme. Le plus cher et avancé du marché. |
| **Check Point** | 🔴 Prop | | Historique (Israël), très présent dans les grands groupes internationaux. |
| **HAProxy** | 🟢 OS | 🇫🇷 | Reverse-proxy/Load-balancer d'origine française, standard absolu du web mondial. |

---

## 🎯 6. Scanners de Vulnérabilités, Pentest & AD

| Outil | Licence | 🇫🇷 / 🛡️ | Description / Cas d'usage |
| :--- | :--- | :--- | :--- |
| **Cyberwatch** | 🔴 Prop | 🇫🇷 🛡️ | Excellente solution française de cartographie des failles et gestion des patchs. |
| **PingCastle** | 🟢 OS | 🇫🇷 🛡️ | **Indispensable.** Outil français qui audite la sécurité de l'AD et génère un rapport immédiat. |
| **OpenVAS / Greenbone** | 🟢 OS | | Le meilleur scanner de failles réseau généraliste gratuit. |
| **Tenable Nessus** | 🔴 Prop | | Le scanner de vulnérabilités pro de référence absolue dans l'industrie. |
| **Nmap** | 🟢 OS | | Le couteau suisse du scan de ports réseau. |
| **BloodHound** | 🟢 OS | | Outil redoutable qui cartographie visuellement les chemins d'attaque dans un Active Directory. |
| **Metasploit / Cobalt Strike**| 🟡/🔴 | | Les frameworks des hackers éthiques pour exploiter les failles. |

---

## 🎫 7. ITSM, Ticketing & Inventaire de Parc

| Outil | Licence | 🇫🇷 / 🛡️ | Description / Cas d'usage |
| :--- | :--- | :--- | :--- |
| **GLPI** | 🟢 OS | 🇫🇷 | **Le standard en France**. Inventaire, tickets, helpdesk. Maintenu par Teclib. |
| **OCS Inventory** | 🟢 OS | 🇫🇷 | Agent installé sur les PC pour remonter la config matérielle vers GLPI. |
| **iTop** | 🟢 OS | 🇫🇷 | Concurrent direct de GLPI par Combodo, très orienté ITIL et CMDB (cartographie). |
| **ServiceNow** | 🔴 Prop | | Le mastodonte mondial. Gère tous les processus d'entreprise. Très cher. |
| **Microsoft Intune** | 🔴 Prop | | Standard MDM (Mobile Device Management) pour gérer les flottes Windows/Mobiles. |
| **Jamf** | 🔴 Prop | | Le leader pour la gestion de flotte informatique Apple (Mac, iPhone). |

---

## 💾 8. Sauvegarde, PCA / PRA (Disaster Recovery)

| Outil | Licence | 🇫🇷 / 🛡️ | Description / Cas d'usage |
| :--- | :--- | :--- | :--- |
| **Atempo (Tina)** | 🔴 Prop | 🇫🇷 🛡️ | Solution de sauvegarde souveraine massive, très utilisée dans le secteur public/Recherche. |
| **Veeam Backup** | 🔴 Prop | | Le standard absolu mondial (surtout pour les machines virtuelles VMware/Hyper-V). |
| **Rubrik / Cohesity** | 🔴 Prop | | Les challengers modernes de Veeam, très orientés "immuabilité" (anti-ransomware). |
| **Proxmox Backup Server**| 🟢 OS | | Parfait avec l'hyperviseur Proxmox. Sauvegardes incrémentales hyper rapides. |
| **BorgBackup** | 🟢 OS | | Outil Linux en CLI ultra-puissant pour sauvegarder avec déduplication et chiffrement. |

---

## 🔑 9. IAM, Bastions (PAM) & Mots de Passe

| Outil | Licence | 🇫🇷 / 🛡️ | Description / Cas d'usage |
| :--- | :--- | :--- | :--- |
| **Keeper** | 🔴 Prop | | Gestionnaire de mots de passe d'entreprise et coffre-fort robuste (PAM). |
| **Wallix (Bastion)** | 🔴 Prop | 🇫🇷 🛡️ | **Le leader européen du PAM.** Un "sas" qui enregistre en vidéo tout ce que font les admins. |
| **Systancia** | 🔴 Prop | 🇫🇷 🛡️ | Concurrent de Wallix, spécialisé dans l'accès distant sécurisé (ZTNA) et PAM. |
| **Active Directory (AD)** | 🔴 Prop | | Le standard Microsoft pour l'identité d'entreprise (On-Premise). |
| **Keycloak / Authelia** | 🟢 OS | | Solutions open-source pour ajouter du SSO et du MFA sur ses propres applis. |
| **Bitwarden / Vaultwarden**| 🟢 OS | | Le meilleur gestionnaire de mots de passe hébergeable soi-même. |
| **Passbolt** | 🟢 OS | 🇫🇷🇪🇺| Gestionnaire de mots de passe pensé pour les équipes (partage fin des accès). |
| **Microsoft LAPS** | 🟢 Free | | Indispensable : Change auto les mots de passe des admins locaux Windows. |

---

## 💬 10. Bonus Souveraineté : Collaboration Sécurisée

| Outil | Licence | 🇫🇷 / 🛡️ | Description / Cas d'usage |
| :--- | :--- | :--- | :--- |
| **Olvid** | 🟡 Free | 🇫🇷 🛡️ | La messagerie la plus sécurisée au monde (remplace WhatsApp pour les ministres français !). |
| **Oodrive** | 🔴 Prop | 🇫🇷 🛡️ | Le "Google Drive / SharePoint" certifié SecNumCloud. |
| **Nextcloud** | 🟢 OS | 🇪🇺 | Le Drive collaboratif open-source de référence en Europe, totalement autohébergé. |