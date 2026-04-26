# 🌐 CLI Cisco IOS vs HPE Comware

Ce document traduit l'intégralité de mon référentiel Cisco CCNA vers l'environnement HPE Comware (Switchs 5130, 5940, etc.).

>"Les 5 Règles d'Or de Comware"

  >  * Le `show` devient **`display`**.
    
  >  * Le `no` devient **`undo`**.
    
  > * Le `configure terminal` devient **`system-view`**.
    
  > * Le "Cheat Code" absolu : taper **`display this`** dans n'importe quel sous-menu (interface, vlan...) affiche sa configuration spécifique.
    
  >  * On peut utiliser `display` depuis n'importe quel mode (pas besoin de rajouter `do` comme chez Cisco).
    

---

## 🧭 1. Navigation et Système de base

| Action (Cisco) | Commande Cisco IOS | Équivalent HPE Comware |
| :--- | :--- | :--- |
| **Passer en mode privilège** | `enable` | *(Inutile, souvent déjà actif)* |
| **Mode configuration** | `configure terminal` | `system-view` |
| **Reculer / Sortir** | `exit` / `end` | `quit` / `return` |
| **Nommer l'équipement** | `hostname [nom]` | `sysname [nom]` |
| **Redémarrer** | `reload` | `reboot` |
| **Générer clés SSH** | `crypto key generate rsa` | `public-key local create rsa` |
| **Régler l'horloge** | `clock set [hh:mm:ss]` | `clock datetime [hh:mm:ss] [date]` |
| **Désactiver recherche DNS** | `no ip domain-lookup` | `undo dns resolve` |
| **Mode secours (mdp oublié)**| `confreg 0x2142` | *(Se fait via le menu Boot ROM au démarrage)* |

---

## 💾 2. Fichiers et Sauvegarde

| Action (Cisco) | Commande Cisco IOS | Équivalent HPE Comware |
| :--- | :--- | :--- |
| **Sauvegarder la config** | `copy run start` ou `write` | `save` ou `save force` (Rapide/Scripts) |
| **Effacer la sauvegarde** | `erase startup-config` | `reset saved-configuration` |
| **Lister les fichiers** | `dir` / `show file systems` | `dir` |
| **Supprimer un fichier** | `delete [nom]` | `delete [nom]` |
| **Formater la mémoire** | `format flash:` | `format flash:` |
| **Copier un fichier** | `copy [source] [dest]` | `copy [source] [dest]` |
| **Choisir l'OS au boot** | `boot system [image]` | `boot-loader file [image] main` |

---

## 🔌 3. Gestion des Interfaces

| Action (Cisco) | Commande Cisco IOS | Équivalent HPE Comware |
| :--- | :--- | :--- |
| **Accéder au port** | `interface [type/num]` | `interface [type/num]` |
| **Allumer le port** | `no shutdown` | `undo shutdown` |
| **Description** | `description [texte]` | `description [texte]` |
| **IP (Manuelle / DHCP)** | `ip address [ip] [mask]` | `ip address [ip] [mask]` |
| **Plage de ports** | `interface range [debut-fin]` | `interface range [type/debut] to [type/fin]` |
| **Vitesse & Duplex** | `speed 1000` / `duplex full` | `speed 1000` / `duplex full` |
| **Interface virtuelle** | `interface loopback [num]` | `interface loopback [num]` |

---

## 🔀 4. Switching (VLAN, Trunk, LACP, MAC)

!!! warning "Attention à la syntaxe et aux protocoles"
    * **VTP** est propriétaire Cisco. Sur HP, on utilise le standard **MVRP** (`mvrp global enable`).
    * **Séparateur :** Contrairement à Cisco qui utilise des virgules pour lister des VLANs, Comware utilise des **espaces** (ex: `10 20 30`).

| Action (Cisco) | Commande Cisco IOS | Équivalent HPE Comware |
| :--- | :--- | :--- |
| **Créer/Nommer VLAN** | `vlan [id]` / `name [nom]` | `vlan [id]` / `name [nom]` |
| **Port en Accès** | `switchport mode access` | `port link-type access` |
| **Assigner le VLAN** | `switchport access vlan [id]`| `port access vlan [id]` |
| **Port en Trunk** | `switchport mode trunk` | `port link-type trunk` |
| **Filtrer VLANs sur Trunk**| `switchport trunk allowed vlan`| `port trunk permit vlan 10 20 30` |
| **Changer le VLAN natif** | `switchport trunk native vlan` | `port trunk pvid vlan [id]` |
| **Agrégation (LACP)** | `channel-group [id] mode active` | `port link-aggregation group [id]` |
| **Fixer une adresse MAC** | `mac address-table static` | `mac-address static [mac] port [int] vlan [id]` |

---

## 🛡️ 5. Sécurité et Contrôle d'accès (Port-Security & ACL)

| Action (Cisco) | Commande Cisco IOS | Équivalent HPE Comware |
| :--- | :--- | :--- |
| **Mdp Console / VTY** | `line con 0` / `line vty 0 4` | `user-interface aux 0` / `user-interface vty 0 4` |
| **Créer utilisateur local**| `username [nom] secret [mdp]` | `local-user [nom] class manage` |
| **Bloquer Telnet (SSH seul)**| `transport input ssh` | `protocol inbound ssh` (sous user-interface) |
| **Activer Port-Security** | `switchport port-security` | `port-security enable` |
| **Limite MAC par port** | `switchport port-security max 2`| `port-security max-mac-count 2` |
| **Créer une ACL** | `access-list [num] [action] [ip]`| `acl basic [num]` ou `acl advanced [num]` |
| **Appliquer une ACL** | `ip access-group [num] in` | `packet-filter [num] inbound` |

---

## 🗺️ 6. Routage (Niveaux 3, OSPF, NAT)

!!! warning "Note sur EIGRP"
    Le protocole EIGRP (`router eigrp`) est 100% propriétaire Cisco. Dans un environnement mixte ou HP, on le remplace obligatoirement par **OSPF**.

| Action (Cisco) | Commande Cisco IOS | Équivalent HPE Comware |
| :--- | :--- | :--- |
| **Route statique** | `ip route [dest] [mask] [next]`| `ip route-static [dest] [mask] [next]` |
| **Passerelle par défaut** | `ip route 0.0.0.0 0.0.0.0` | `ip route-static 0.0.0.0 0.0.0.0` |
| **Activer OSPF** | `router ospf [process-id]` | `ospf [process-id]` |
| **Activer RIP v2** | `router rip` / `version 2` | `rip` / `version 2` |
| **NAT (Partage internet)** | `ip nat inside source...` | `nat outbound [acl]` |
| **Relais DHCP (Helper)** | `ip helper-address [ip]` | `dhcp relay server-address [ip]` |
| **Routage IPv6** | `ipv6 unicast-routing` | `ipv6` |

---

## 🛠️ 7. Services (DHCP, SNMP, NTP)

| Action (Cisco) | Commande Cisco IOS | Équivalent HPE Comware |
| :--- | :--- | :--- |
| **Créer pool DHCP** | `ip dhcp pool [nom]` | `dhcp server ip-pool [nom]` |
| **Réseau DHCP** | `network [ip] [mask]` | `network [ip] mask [mask]` |
| **Passerelle DHCP** | `default-router [ip]` | `gateway-list [ip]` |
| **Serveur DNS** | `dns-server [ip]` | `dns-list [ip]` |
| **Exclure IP du DHCP** | `ip dhcp excluded-address` | `dhcp server forbidden-ip [debut] [fin]` |
| **Activer LLDP (Voisins)** | `lldp run` (Standard) | `lldp global enable` |
| **Monitoring SNMP** | `snmp-server community [nom] RO`| `snmp-agent community read [nom]` |
| **Serveur de temps NTP** | `ntp server [ip]` | `ntp-service unicast-server [ip]` |

---

## 🩺 8. Diagnostics (Les commandes qui sauvent la vie)

| Ce que tu veux voir | Commande Cisco IOS | Équivalent HPE Comware (`display`) |
| :--- | :--- | :--- |
| **La config en cours** | `show running-config` | `display current-configuration` |
| **La config d'un port** | `show run interface [int]` | **`display this`** *(En mode interface)* |
| **La config sauvegardée** | `show startup-config` | `display saved-configuration` |
| **Les IP et l'état des ports**| `show ip interface brief` | `display ip interface brief` |
| **Détails physiques / Câble**| `show interfaces` | `display interface` / `display counters` |
| **Les VLANs actifs** | `show vlan brief` | `display vlan all` |
| **La table MAC (Switch)** | `show mac address-table` | `display mac-address` |
| **La table ARP (IP <=> MAC)**| `show ip arp` | `display arp` |
| **La table de routage** | `show ip route` | `display ip routing-table` |
| **Vérifier le Spanning-Tree**| `show spanning-tree` | `display stp` |
| **Voisins (Cisco / Universel)**| `show cdp / lldp neighbors` | `display lldp neighbor-information` |
| **État du LACP (EtherChannel)**| `show etherchannel summary` | `display link-aggregation summary` |
| **Baux DHCP distribués** | `show ip dhcp binding` | `display dhcp server ip-in-use` |
| **Voir les erreurs et logs** | `show logging` | `display logbuffer` |
| **Voir le CPU et la RAM** | `show processes cpu` | `display cpu-usage` / `display memory` |
| **Logs en direct (SSH)** | `terminal monitor` | `terminal monitor` & `terminal debugging` |
| **Test de connectivité** | `ping [ip]` / `traceroute [ip]` | `ping [ip]` / `tracert [ip]` |

---

## 🧹 9. Nettoyage et Réinitialisation

| Action (Cisco) | Commande Cisco IOS | Équivalent HPE Comware |
| :--- | :--- | :--- |
| **Reset stats interfaces** | `clear counters` | `reset counters interface` |
| **Vider la table ARP** | `clear ip arp` | `reset arp` |
| **Vider table de routage** | `clear ip route *` | `reset ip routing-table` |
| **Arrêter un Debug** | `undebug all` | `undo debugging all` |
