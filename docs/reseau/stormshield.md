# 🛡️ Mega Cheat Sheet : CLI Stormshield (SNS V4/V5)

Le pare-feu Stormshield (anciennement Netasq) fonctionne avec un moteur interne appelé **Serverd**. Contrairement à Cisco ou Linux, l'invite de commande (accessible via la WebGUI, SSH, ou port 1300) dialogue directement avec ce moteur via une syntaxe propriétaire.

> **💡 Règle d'or Stormshield (CLI) :**
> Presque toutes les modifications exigent d'être **activées** pour prendre effet. Si tu crées un objet, tu dois taper `CONFIG OBJECT ACTIVATE`. Si tu modifies une règle, `CONFIG FILTER ACTIVATE`.

---

## ⚙️ 1. Système, Informations et Redémarrage

Ces commandes permettent de gérer la "boîte" physique ou virtuelle.

| Action | Commande Officielle (Serverd) | Explication & Paramètres |
| :--- | :--- | :--- |
| **Aide** | `HELP` ou `HELP SYSTEM` | Affiche l'aide globale ou l'aide d'un module spécifique. |
| **Version du Pare-feu** | `SYSTEM CHECKVERSION` | Vérifie la version du firmware actuellement installé. |
| **Détails Système** | `SYSTEM INFormatION` | Affiche l'uptime, l'état de la mémoire, et le modèle du boîtier. |
| **Redémarrer** | `SYSTEM REBOOT` | Redémarre proprement le pare-feu. |
| **Éteindre** | `SYSTEM HALT` | Arrête le pare-feu. |
| **Infos de Licence** | `SYSTEM LICENCE` | Vérifie si les licences (Antivirus, URL, IPS) sont actives et valides. |
| **Propriétés Système** | `SYSTEM PROPERTY` | Affiche des variables globales comme le Numéro de Série du boîtier. |

---

## 💾 2. Sauvegarde et Haute Disponibilité (HA)

| Action | Commande Officielle | Explication & Paramètres |
| :--- | :--- | :--- |
| **Sauvegarde Totale** | `SYSTEM BACKUP list=all` | Génère un fichier de configuration complet (fichiers `.na`). *Astuce : `SYSTEM BACKUP list=all > /tmp/backup.na`* |
| **Restaurer Config** | `CONFIG RESTORE` | Restaure une configuration. |
| **État du Cluster (HA)** | `SYSTEM STATUS` | Permet de voir si le boîtier est Actif ou Passif. |
| **Forcer Synchro HA** | `SYSTEM CLONE` | Force la synchronisation de la configuration vers le pare-feu passif. |

---

## 🌐 3. Interfaces et Réseau

| Action | Commande Officielle | Explication & Paramètres |
| :--- | :--- | :--- |
| **Lister les Interfaces** | `CONFIG NETWORK INTERFACE list` | Affiche l'état de toutes les interfaces (in, out, dmz, vlan...). |
| **Voir les IP** | `CONFIG NETWORK ADDRESS list` | Liste les adresses IP assignées aux interfaces. |
| **Configurer une IP** | `CONFIG NETWORK INTERFACE UPDATE` | Ex: `... ifname=in color=00FF00 Comment="LAN"` (Met à jour les paramètres d'une interface). |
| **Appliquer le réseau** | `CONFIG NETWORK ACTIVATE` | **Obligatoire** après toute modification des interfaces réseau. |
| **Table de Routage** | `SYSTEM TRACEROUTE` | Équivalent de la table de routage globale vue par le moteur. |

---

## 🧱 4. Manipulation des Objets (La base du filtrage)

> **⚠️ Différence V3 / V4 :** En V4, les objets réseaux ont été fusionnés. Un objet peut désormais porter une IPv4 ET une IPv6 en même temps.

| Action | Commande Officielle | Explication & Paramètres |
| :--- | :--- | :--- |
| **Créer un Objet Host** | `CONFIG OBJECT HOST NEW` | `... name=PC_BOSS ip=192.168.10.50 resolve=dynamic` |
| **Créer un Réseau** | `CONFIG OBJECT NETWORK NEW` | `... name=LAN_COMPTA ip=192.168.20.0 mask=255.255.255.0` |
| **Supprimer un Objet** | `CONFIG OBJECT REMOVE` | `... type=host name=PC_BOSS` |
| **Lister les Objets** | `CONFIG OBJECT LIST` | Affiche tous les objets de la base. |
| **Sauver les Objets** | `CONFIG OBJECT ACTIVATE` | **Obligatoire** pour que les objets soient utilisables dans les règles ! |

---

## 🚦 5. Pare-feu : Règles de Filtrage et NAT

| Action | Commande Officielle | Explication & Paramètres |
| :--- | :--- | :--- |
| **Voir l'état du filtre** | `CONFIG FILTER STATE` | Vérifie quelle politique de filtrage (Slot) est actuellement active. |
| **Lister les règles** | `CONFIG FILTER RULE list` | Affiche la politique de sécurité actuelle. |
| **Créer une règle** | `CONFIG FILTER RULE INSERT` | *(Très complexe en CLI, il est fortement recommandé d'utiliser l'interface Web ou des scripts pour cela).* |
| **Activer les règles** | `CONFIG FILTER ACTIVATE` | **Obligatoire.** Vérifie la cohérence des règles et les pousse dans le moteur de sécurité. |

---

## 🩺 6. Diagnostics, PCAP et Troubleshooting

Le véritable point fort d'un administrateur Stormshield, c'est de savoir débugger directement dans la console quand le trafic est bloqué.

| Action | Commande Officielle | Explication & Paramètres |
| :--- | :--- | :--- |
| **Ping depuis le FW** | `SYSTEM PING` | Ex: `SYSTEM PING host=8.8.8.8 count=4` |
| **Capture de Paquets** | `SYSTEM PCAP` | Lance un analyseur (type TCPDump). *Ex: `SYSTEM PCAP args="-ni in port 80"` pour écouter le HTTP sur l'interface 'in'.* |
| **Test Résolution DNS** | `SYSTEM NSLOOKUP` | Ex: `SYSTEM NSLOOKUP host=studi.fr` (Vérifie si le pare-feu arrive à résoudre Internet). |
| **Voir Connexions Actives**| `SYSTEM SESSION list` | Affiche la table d'état (State Table) des connexions actuellement ouvertes à travers le pare-feu. |
| **Logs en direct** | `tail -f /log/l_filter` | *(À taper dans le shell Linux sous-jacent)*. Permet de lire les logs de blocage du pare-feu en temps réel ! |
| **Vider le Cache ARP** | `CONFIG NETWORK ARP FLUSH` | Utile en cas de conflit d'IP/MAC ou de remplacement d'un équipement. |

---

## 🤖 7. L'Automatisation (L'écosystème Ansible & Python)

Aujourd'hui, il est rare de taper ces commandes à la main. Stormshield fournit des outils pour gérer des parcs entiers de firewalls :

* **Python SNS-API (`snscli`) :** Un outil officiel en Python qui permet d'envoyer des scripts de configuration via le réseau. Ex: `$ snscli --host 192.168.1.254 --user admin --password admin --script config.script`
* **Ansible :** Stormshield possède une librairie officielle de [modules Ansible](https://stormshield.github.io/ansible-sns-collection/) (ex: `sns_command`) pour pousser de la configuration (règles, objets) via l'Infrastructure as Code (IaC).