# 🏗️ Fondamentaux du Réseau : Le Socle Technique

Comprendre le réseau est indispensable pour administrer un système, configurer un switch, dépanner un serveur, sécuriser une infrastructure ou préparer une certification comme le **CCNA**.

Cette fiche couvre les notions essentielles à maîtriser pour un profil **TSSR / AdminSys / Cybersécurité** :

- modèles OSI et TCP/IP ;
- adressage IPv4 et IPv6 ;
- sous-réseaux, VLAN, routage ;
- switching, STP, EtherChannel ;
- DHCP, DNS, NAT, ACL, Wi-Fi ;
- sécurité réseau ;
- commandes de diagnostic ;
- réflexes de dépannage.

---

## 📌 0. Vue d’ensemble : qu’est-ce qu’un réseau ?

Un **réseau informatique** est un ensemble d’équipements capables de communiquer entre eux afin d’échanger des données.

Exemples d’équipements réseau :

| Équipement | Rôle principal |
| :--- | :--- |
| **PC / Serveur / Imprimante** | Équipement final, appelé endpoint |
| **Switch** | Relie les machines d’un même réseau local |
| **Routeur** | Relie plusieurs réseaux différents |
| **Pare-feu** | Filtre et contrôle les flux réseau |
| **Point d’accès Wi-Fi** | Donne un accès sans fil au réseau |
| **Contrôleur Wi-Fi / WLC** | Centralise la gestion des bornes Wi-Fi |
| **Modem / Box** | Connexion au fournisseur d’accès Internet |
| **Proxy** | Intermédiaire applicatif entre client et Internet |
| **IDS / IPS** | Détection ou prévention d’intrusions |
| **Load balancer** | Répartit la charge entre plusieurs serveurs |

---

## 🧠 1. Vocabulaire réseau indispensable

| Terme | Définition |
| :--- | :--- |
| **LAN** | Local Area Network : réseau local d’une maison, entreprise, salle serveur |
| **WAN** | Wide Area Network : réseau étendu, interconnexion de sites distants |
| **WLAN** | Wireless LAN : réseau local sans fil, Wi-Fi |
| **MAN** | Metropolitan Area Network : réseau à l’échelle d’une ville |
| **Internet** | Réseau mondial public |
| **Intranet** | Réseau interne privé d’une organisation |
| **Extranet** | Partie d’un réseau interne accessible à des partenaires externes |
| **DMZ** | Zone réseau exposée mais isolée du LAN interne |
| **Hôte** | Machine connectée au réseau |
| **Client** | Machine qui consomme un service |
| **Serveur** | Machine qui fournit un service |
| **Interface réseau** | Carte réseau physique ou virtuelle |
| **NIC** | Network Interface Card, carte réseau |
| **Débit** | Quantité de données transférées par seconde |
| **Latence** | Temps de traversée du réseau |
| **Jitter** | Variation de latence |
| **Perte de paquets** | Paquets envoyés mais jamais reçus |
| **Bande passante** | Capacité maximale théorique d’un lien |
| **Throughput** | Débit réellement constaté |

---

## 🧱 2. Les modèles de référence : OSI vs TCP/IP

Le modèle **OSI** est un modèle théorique en 7 couches utilisé pour comprendre et dépanner les communications réseau.

Le modèle **TCP/IP** est le modèle réellement utilisé par Internet.

---

## 📚 2.1 Le modèle OSI

| N° | Couche | PDU | Adresse utilisée | Rôle | Exemples |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **7** | Application | Données | Nom, URL, FQDN | Services utilisés par l’utilisateur | HTTP, HTTPS, DNS, SMTP, SSH |
| **6** | Présentation | Données | - | Format, chiffrement, compression | TLS, SSL, JPEG, JSON |
| **5** | Session | Données | - | Ouverture, maintien et fermeture de sessions | RPC, NetBIOS |
| **4** | Transport | Segment / Datagramme | Port | Communication de bout en bout | TCP, UDP |
| **3** | Réseau | Paquet | IP | Routage entre réseaux | IPv4, IPv6, ICMP |
| **2** | Liaison | Trame | MAC | Communication locale, VLAN | Ethernet, Wi-Fi, ARP |
| **1** | Physique | Bits | - | Signal électrique, optique ou radio | Câble RJ45, fibre, ondes |

---

## 🧩 2.2 Le modèle TCP/IP

| Couche TCP/IP | Correspondance OSI | Exemples |
| :--- | :--- | :--- |
| **Application** | OSI 5 à 7 | HTTP, HTTPS, DNS, DHCP, SMTP, SSH |
| **Transport** | OSI 4 | TCP, UDP |
| **Internet** | OSI 3 | IP, ICMP |
| **Accès réseau** | OSI 1 à 2 | Ethernet, Wi-Fi, ARP |

---

## 📦 2.3 Encapsulation et décapsulation

Quand une application envoie une donnée, chaque couche ajoute ses propres informations.

```text
Application  : Données
Transport    : Segment TCP ou datagramme UDP
Réseau       : Paquet IP
Liaison      : Trame Ethernet
Physique     : Bits sur câble, fibre ou Wi-Fi
```

À la réception, l’opération inverse se produit : c’est la **décapsulation**.

### Exemple simple : ouvrir un site web

```text
1. L’utilisateur tape https://example.com
2. Le PC interroge le DNS pour obtenir l’adresse IP
3. Le navigateur établit une connexion TCP vers le port 443
4. TLS chiffre la session HTTPS
5. Les paquets IP sont envoyés vers la passerelle
6. Le routeur transmet vers Internet
7. Le serveur web répond
```

---

## 🧭 2.4 Quelle couche dépanner ?

| Symptôme | Couche probable | Vérification |
| :--- | :--- | :--- |
| Câble débranché | 1 | LED carte réseau, câble, switch |
| Mauvais VLAN | 2 | Configuration switch, port access/trunk |
| Pas de passerelle | 3 | IP, masque, gateway |
| Port fermé | 4 | TCP/UDP, firewall, service |
| DNS KO | 7 | Résolution de nom |
| HTTPS KO mais ping OK | 4 à 7 | Port 443, proxy, certificat, firewall |

---

# 🌐 3. Adressage IPv4

Une adresse IPv4 identifie une interface réseau.

Elle est codée sur **32 bits**, généralement écrite en notation décimale pointée :

```text
192.168.1.10
```

Chaque nombre représente un octet, donc une valeur de `0` à `255`.

```text
192.168.1.10
= 11000000.10101000.00000001.00001010
```

---

## 🧮 3.1 IP, masque et réseau

Une adresse IPv4 est composée de deux parties :

```text
[ Partie réseau ][ Partie hôte ]
```

Le **masque de sous-réseau** indique quelle partie correspond au réseau.

Exemple :

| Élément | Valeur |
| :--- | :--- |
| Adresse IP | `192.168.1.10` |
| Masque | `255.255.255.0` |
| CIDR | `/24` |
| Réseau | `192.168.1.0` |
| Broadcast | `192.168.1.255` |
| Hôtes utilisables | `192.168.1.1` à `192.168.1.254` |

---

## 🏷️ 3.2 Notation CIDR

La notation CIDR indique le nombre de bits réservés à la partie réseau.

```text
/24 = 24 bits réseau
/16 = 16 bits réseau
/8  = 8 bits réseau
```

| CIDR | Masque | Nombre d’adresses | Hôtes utilisables |
| :--- | :--- | :--- | :--- |
| `/8` | `255.0.0.0` | 16 777 216 | 16 777 214 |
| `/16` | `255.255.0.0` | 65 536 | 65 534 |
| `/24` | `255.255.255.0` | 256 | 254 |
| `/25` | `255.255.255.128` | 128 | 126 |
| `/26` | `255.255.255.192` | 64 | 62 |
| `/27` | `255.255.255.224` | 32 | 30 |
| `/28` | `255.255.255.240` | 16 | 14 |
| `/29` | `255.255.255.248` | 8 | 6 |
| `/30` | `255.255.255.252` | 4 | 2 |
| `/31` | `255.255.255.254` | 2 | Cas spécifique point-à-point |
| `/32` | `255.255.255.255` | 1 | Une seule adresse |

---

## 🔢 3.3 Formule de calcul des hôtes

Pour connaître le nombre d’adresses dans un sous-réseau :

```text
Nombre d’adresses = 2^(nombre de bits hôte)
```

Pour un réseau classique :

```text
Hôtes utilisables = 2^(bits hôte) - 2
```

On retire généralement :

- l’adresse réseau ;
- l’adresse de broadcast.

Exemple en `/24` :

```text
32 - 24 = 8 bits hôte
2^8 = 256 adresses
256 - 2 = 254 hôtes utilisables
```

---

## 🏠 3.4 Adresses privées RFC1918

Les adresses privées ne sont pas routables directement sur Internet.

| Plage privée | CIDR | Usage courant |
| :--- | :--- | :--- |
| `10.0.0.0` à `10.255.255.255` | `10.0.0.0/8` | Grandes entreprises |
| `172.16.0.0` à `172.31.255.255` | `172.16.0.0/12` | Entreprises, sites multiples |
| `192.168.0.0` à `192.168.255.255` | `192.168.0.0/16` | Maison, PME, lab |

---

## 🚩 3.5 Adresses spéciales IPv4

| Adresse / plage | Rôle |
| :--- | :--- |
| `127.0.0.1` | Loopback locale |
| `127.0.0.0/8` | Plage loopback |
| `0.0.0.0` | Adresse non définie ou route par défaut |
| `255.255.255.255` | Broadcast limité |
| `169.254.0.0/16` | APIPA, auto-adressage sans DHCP |
| `224.0.0.0/4` | Multicast |
| `100.64.0.0/10` | CGNAT opérateur |
| `192.0.2.0/24` | Documentation |
| `198.51.100.0/24` | Documentation |
| `203.0.113.0/24` | Documentation |

---

## 🧠 3.6 Les 4 paramètres IP essentiels d’un poste

Pour communiquer correctement, un poste a besoin de :

| Paramètre | Rôle |
| :--- | :--- |
| **Adresse IP** | Identité logique de la machine |
| **Masque** | Détermine le réseau local |
| **Passerelle** | Routeur utilisé pour sortir du réseau |
| **DNS** | Résolution des noms en adresses IP |

### Règle d’or

```text
Même réseau IP + même VLAN = communication directe via switch.
Réseaux différents = passage obligatoire par une passerelle.
```

---

## 🧮 3.7 Méthode rapide de subnetting

Pour découper un réseau :

1. Identifier le réseau de départ.
2. Déterminer le nombre de sous-réseaux ou d’hôtes nécessaires.
3. Choisir le préfixe CIDR adapté.
4. Calculer l’incrément.
5. Lister les réseaux, broadcasts et plages utilisables.

### Exemple : découper `192.168.10.0/24` en 4 sous-réseaux

Pour obtenir 4 sous-réseaux :

```text
2 bits empruntés = 2^2 = 4 sous-réseaux
/24 + 2 = /26
```

Un `/26` donne :

```text
256 - 192 = 64
```

L’incrément est donc de 64.

| Sous-réseau | Adresse réseau | Plage utilisable | Broadcast |
| :--- | :--- | :--- | :--- |
| 1 | `192.168.10.0/26` | `.1` à `.62` | `.63` |
| 2 | `192.168.10.64/26` | `.65` à `.126` | `.127` |
| 3 | `192.168.10.128/26` | `.129` à `.190` | `.191` |
| 4 | `192.168.10.192/26` | `.193` à `.254` | `.255` |

---

# 🌍 4. IPv6 : les bases indispensables

IPv6 remplace progressivement IPv4.

Une adresse IPv6 est codée sur **128 bits** et écrite en hexadécimal.

Exemple :

```text
2001:db8:abcd:0012:0000:0000:0000:0001
```

Elle peut être raccourcie :

```text
2001:db8:abcd:12::1
```

---

## ✂️ 4.1 Règles de simplification IPv6

### Supprimer les zéros en tête

```text
2001:0db8:0001:0000
devient
2001:db8:1:0
```

### Remplacer une seule suite de zéros par `::`

```text
2001:db8:0:0:0:0:0:1
devient
2001:db8::1
```

!!! warning
    On ne peut utiliser `::` qu’une seule fois dans une adresse IPv6.

---

## 📦 4.2 Types d’adresses IPv6

| Type | Exemple | Rôle |
| :--- | :--- | :--- |
| **Loopback** | `::1` | Machine locale |
| **Unspecified** | `::` | Adresse non définie |
| **Link-local** | `fe80::/10` | Communication sur le lien local |
| **Global unicast** | `2000::/3` | Adresse publique routable |
| **Unique local** | `fc00::/7` | Équivalent privé |
| **Multicast** | `ff00::/8` | Communication vers un groupe |

---

## 🧭 4.3 IPv6 et passerelle

En IPv6, la passerelle est souvent une adresse **link-local** :

```text
fe80::1
```

Un poste peut donc avoir :

```text
IPv6 : 2001:db8:10:1::50/64
Gateway : fe80::1
```

---

## 🔎 4.4 NDP remplace ARP

En IPv4, ARP permet de trouver l’adresse MAC correspondant à une IP.

En IPv6, c’est **NDP** : Neighbor Discovery Protocol.

| IPv4 | IPv6 |
| :--- | :--- |
| ARP | NDP |
| Broadcast | Multicast |
| DHCP possible | SLAAC, DHCPv6 ou les deux |
| ICMP | ICMPv6 indispensable |

---

## 🧠 4.5 SLAAC et DHCPv6

IPv6 peut configurer automatiquement un poste avec :

| Méthode | Rôle |
| :--- | :--- |
| **SLAAC** | Le poste génère son adresse à partir des annonces routeur |
| **DHCPv6 stateless** | SLAAC pour l’IP, DHCPv6 pour DNS/autres options |
| **DHCPv6 stateful** | DHCPv6 fournit l’adresse IPv6 complète |

---

# 🔌 5. Couche physique : câbles, fibre, Wi-Fi

La couche physique transporte les bits sous forme de signal électrique, optique ou radio.

---

## 🧵 5.1 Câbles cuivre Ethernet

| Type | Usage |
| :--- | :--- |
| **Cat 5e** | 1 Gbit/s courant |
| **Cat 6** | 1 à 10 Gbit/s selon distance |
| **Cat 6a** | 10 Gbit/s plus fiable |
| **Cat 7 / 8** | Datacenter ou besoins spécifiques |

Connecteur courant :

```text
RJ45
```

---

## 🌈 5.2 Fibre optique

| Type | Description | Usage |
| :--- | :--- | :--- |
| **Multimode** | Courtes distances | LAN, datacenter |
| **Monomode** | Longues distances | WAN, opérateurs |

| Connecteur | Remarque |
| :--- | :--- |
| **LC** | Très courant sur switches modernes |
| **SC** | Ancien mais encore utilisé |
| **ST** | Plus ancien |
| **MPO/MTP** | Haut débit, datacenter |

---

## ⚡ 5.3 PoE : Power over Ethernet

Le **PoE** permet d’alimenter un équipement via le câble réseau.

Exemples :

- téléphone IP ;
- borne Wi-Fi ;
- caméra IP ;
- badgeuse ;
- petit équipement IoT.

| Standard | Puissance approximative |
| :--- | :--- |
| **802.3af** | Jusqu’à 15,4 W |
| **802.3at / PoE+** | Jusqu’à 30 W |
| **802.3bt / PoE++** | Jusqu’à 60 W ou plus |

---

## 🔄 5.4 Duplex et vitesse

| Mode | Description |
| :--- | :--- |
| **Half-duplex** | On parle ou on écoute, pas les deux en même temps |
| **Full-duplex** | Émission et réception simultanées |

Aujourd’hui, l’Ethernet commuté moderne fonctionne normalement en **full-duplex**.

Un mauvais réglage duplex peut provoquer :

- collisions ;
- lenteurs ;
- erreurs CRC ;
- pertes de paquets.

---

# 🔀 6. Ethernet et switching

Un **switch** travaille principalement en couche 2.

Il utilise les adresses **MAC** pour transférer les trames.

---

## 🪪 6.1 Adresse MAC

Une adresse MAC est une adresse physique codée sur 48 bits.

Exemple :

```text
00:1A:2B:3C:4D:5E
```

Elle identifie une interface réseau au niveau Ethernet.

---

## 📦 6.2 Trame Ethernet

Une trame Ethernet contient notamment :

| Champ | Rôle |
| :--- | :--- |
| MAC destination | À qui envoyer la trame |
| MAC source | Qui envoie la trame |
| Type / longueur | Protocole transporté |
| Données | Paquet IP ou autre |
| FCS | Contrôle d’erreur |

---

## 🧠 6.3 Table MAC / CAM table

Un switch apprend les adresses MAC en observant les trames entrantes.

```text
MAC source vue sur port Fa0/1
=> le switch associe cette MAC au port Fa0/1
```

Exemple :

| MAC | Port |
| :--- | :--- |
| `AA:AA:AA:AA:AA:AA` | `Fa0/1` |
| `BB:BB:BB:BB:BB:BB` | `Fa0/2` |

---

## 🚦 6.4 Comportement du switch

| Situation | Action du switch |
| :--- | :--- |
| MAC destination connue | Envoie uniquement sur le bon port |
| MAC destination inconnue | Flood sur tous les ports du VLAN |
| Broadcast | Flood sur tous les ports du VLAN |
| Multicast | Selon configuration, flood ou traitement spécifique |

---

## 📣 6.5 Domaines de collision et de broadcast

| Concept | Définition |
| :--- | :--- |
| **Domaine de collision** | Zone où des collisions peuvent se produire |
| **Domaine de broadcast** | Zone recevant les diffusions broadcast |

Avec des switches modernes :

- chaque port est son propre domaine de collision ;
- chaque VLAN est son propre domaine de broadcast.

---

## ❓ 6.6 ARP : IP vers MAC

ARP permet de trouver l’adresse MAC correspondant à une adresse IPv4 locale.

Exemple :

```text
PC1 veut joindre 192.168.1.20
PC1 connaît l’IP mais pas la MAC
PC1 envoie : Who has 192.168.1.20 ?
192.168.1.20 répond avec sa MAC
```

Commande utile :

```bash
arp -a
```

Sous Linux :

```bash
ip neigh
```

---

# 🏷️ 7. VLAN : Virtual Local Area Network

Un **VLAN** permet de segmenter un switch physique en plusieurs réseaux logiques.

Chaque VLAN correspond généralement à un sous-réseau IP différent.

---

## 🎯 7.1 Pourquoi utiliser des VLAN ?

| Objectif | Explication |
| :--- | :--- |
| **Sécurité** | Isoler utilisateurs, serveurs, invités, téléphonie |
| **Performance** | Réduire les broadcasts |
| **Organisation** | Séparer par service ou fonction |
| **Administration** | Appliquer des politiques différentes |
| **Conformité** | Segmenter les zones sensibles |

Exemple :

| VLAN | Nom | Réseau |
| :--- | :--- | :--- |
| 10 | Admin | `192.168.10.0/24` |
| 20 | Users | `192.168.20.0/24` |
| 30 | Servers | `192.168.30.0/24` |
| 40 | VoIP | `192.168.40.0/24` |
| 50 | Guest | `192.168.50.0/24` |

---

## 🔌 7.2 Port access

Un port **access** appartient à un seul VLAN.

Utilisation typique :

- PC ;
- imprimante ;
- téléphone IP ;
- caméra ;
- serveur simple interface.

Exemple Cisco :

```cisco
interface FastEthernet0/1
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast
```

---

## 🚚 7.3 Port trunk

Un port **trunk** transporte plusieurs VLAN.

Utilisation typique :

- switch vers switch ;
- switch vers routeur ;
- switch vers pare-feu ;
- switch vers hyperviseur ;
- switch vers point d’accès Wi-Fi multi-SSID.

Le trunk utilise généralement **802.1Q** pour taguer les trames.

Exemple Cisco :

```cisco
interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30,40
```

---

## 🏷️ 7.4 VLAN natif

Sur un trunk 802.1Q, le VLAN natif transporte les trames non taguées.

!!! warning
    Par sécurité, il est conseillé d’éviter d’utiliser le VLAN 1 comme VLAN natif en production.

Exemple :

```cisco
interface GigabitEthernet0/1
 switchport trunk native vlan 999
```

---

## 🧠 7.5 Inter-VLAN routing

Deux VLAN différents ne communiquent pas directement via un simple switch L2.

Il faut un équipement de couche 3 :

- routeur ;
- switch L3 ;
- pare-feu.

### Méthode 1 : Router-on-a-stick

Un routeur possède une interface trunk avec des sous-interfaces.

```cisco
interface GigabitEthernet0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0

interface GigabitEthernet0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
```

### Méthode 2 : SVI sur switch L3

Une SVI est une interface virtuelle de VLAN.

```cisco
interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown

interface vlan 20
 ip address 192.168.20.1 255.255.255.0
 no shutdown

ip routing
```

---

# 🌳 8. STP : Spanning Tree Protocol

STP évite les boucles de niveau 2.

Une boucle Ethernet peut provoquer :

- tempête de broadcast ;
- saturation CPU ;
- instabilité de table MAC ;
- panne réseau massive.

---

## 🧠 8.1 Pourquoi les boucles sont dangereuses ?

Ethernet n’a pas de TTL au niveau 2.

Une trame broadcast peut tourner indéfiniment dans une boucle.

```text
Switch A -> Switch B -> Switch C -> Switch A -> Switch B...
```

---

## 🌲 8.2 Fonctionnement STP

STP élit un **Root Bridge**.

Ensuite, les switches calculent les meilleurs chemins vers ce root bridge et bloquent certains liens redondants.

| Élément | Rôle |
| :--- | :--- |
| **Root Bridge** | Switch central logique de l’arbre |
| **Root Port** | Meilleur port vers le Root Bridge |
| **Designated Port** | Port autorisé à transmettre sur un segment |
| **Blocked Port** | Port bloqué pour éviter une boucle |

---

## 🏆 8.3 Élection du Root Bridge

Le Root Bridge est celui qui a le plus petit **Bridge ID**.

Le Bridge ID contient :

```text
Priorité + Adresse MAC
```

Plus la priorité est basse, plus le switch a de chances de devenir root.

Exemple :

```cisco
spanning-tree vlan 10 priority 4096
```

---

## ⚡ 8.4 RSTP

RSTP, pour Rapid Spanning Tree Protocol, est une version plus rapide de STP.

| Protocole | Standard | Remarque |
| :--- | :--- | :--- |
| STP | 802.1D | Ancien |
| RSTP | 802.1w | Convergence plus rapide |
| MSTP | 802.1s | Plusieurs instances STP |

---

## 🛡️ 8.5 Options STP utiles

| Option | Rôle |
| :--- | :--- |
| **PortFast** | Accélère l’activation d’un port endpoint |
| **BPDU Guard** | Coupe un port PortFast recevant des BPDU |
| **Root Guard** | Empêche un switch non autorisé de devenir root |
| **Loop Guard** | Protège contre certaines boucles silencieuses |

Exemple :

```cisco
interface FastEthernet0/10
 spanning-tree portfast
 spanning-tree bpduguard enable
```

!!! warning
    PortFast doit être utilisé sur les ports connectés à des postes, pas sur les liens entre switches.

---

# 🔗 9. EtherChannel

EtherChannel permet d’agréger plusieurs liens physiques en un lien logique.

Objectifs :

- augmenter la bande passante ;
- ajouter de la redondance ;
- simplifier la topologie STP.

---

## 🧩 9.1 Protocoles EtherChannel

| Mode | Description |
| :--- | :--- |
| **Static / On** | Agrégation forcée sans négociation |
| **PAgP** | Protocole Cisco |
| **LACP** | Standard IEEE 802.3ad |

---

## ⚙️ 9.2 Exemple LACP Cisco

```cisco
interface range GigabitEthernet0/1 - 2
 channel-group 1 mode active

interface Port-channel1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
```

---

## ⚠️ 9.3 Conditions de cohérence

Les ports membres doivent avoir une configuration compatible :

- même vitesse ;
- même duplex ;
- même mode access ou trunk ;
- mêmes VLAN autorisés ;
- même VLAN natif ;
- même configuration STP.

---

# 📡 10. Wi-Fi : notions essentielles

Le Wi-Fi est un réseau local sans fil.

Il fonctionne avec des points d’accès, des SSID et des canaux radio.

---

## 📶 10.1 Vocabulaire Wi-Fi

| Terme | Définition |
| :--- | :--- |
| **SSID** | Nom du réseau Wi-Fi |
| **BSSID** | Adresse MAC de la radio de l’AP |
| **AP** | Access Point, borne Wi-Fi |
| **WLC** | Wireless LAN Controller |
| **WPA2 / WPA3** | Méthodes de sécurité Wi-Fi |
| **Roaming** | Passage d’une borne à une autre |
| **Canal** | Fréquence utilisée |
| **RSSI** | Puissance du signal reçu |
| **SNR** | Rapport signal/bruit |

---

## 📻 10.2 Bandes Wi-Fi

| Bande | Avantages | Inconvénients |
| :--- | :--- | :--- |
| **2,4 GHz** | Meilleure portée | Peu de canaux, interférences |
| **5 GHz** | Plus rapide, moins saturé | Portée plus faible |
| **6 GHz** | Très performant | Compatibilité plus récente |

---

## 🔐 10.3 Sécurité Wi-Fi

| Méthode | Niveau |
| :--- | :--- |
| **WEP** | Obsolète, à bannir |
| **WPA** | Ancien |
| **WPA2-Personal** | Correct pour petit réseau |
| **WPA2-Enterprise** | Authentification centralisée |
| **WPA3** | Plus moderne |
| **802.1X** | Authentification forte avec serveur RADIUS |

---

## 🧠 10.4 Wi-Fi entreprise

En entreprise, on trouve souvent :

```text
SSID Corp     -> VLAN interne
SSID Guest    -> VLAN invité isolé
SSID IoT      -> VLAN objets connectés
```

Avec un contrôleur :

```text
AP léger -> WLC -> politiques Wi-Fi centralisées
```

---

# 🧭 11. Routage IP

Le routage permet de faire communiquer plusieurs réseaux IP.

Un routeur prend une décision en fonction de sa **table de routage**.

---

## 📍 11.1 Même réseau ou réseau distant ?

Un poste compare :

```text
son IP + son masque
avec
l’IP de destination
```

Si la destination est dans le même réseau :

```text
communication directe via ARP + switch
```

Si la destination est dans un autre réseau :

```text
envoi à la passerelle par défaut
```

---

## 🗺️ 11.2 Table de routage

Une table de routage contient :

| Élément | Rôle |
| :--- | :--- |
| Réseau destination | Réseau à atteindre |
| Masque / préfixe | Taille du réseau |
| Next-hop | Prochain routeur |
| Interface de sortie | Interface utilisée |
| Métrique | Coût du chemin |
| Distance administrative | Fiabilité de la source |

---

## 🧠 11.3 Longest Prefix Match

Le routeur choisit la route la plus spécifique.

Exemple :

| Route | Destination |
| :--- | :--- |
| `0.0.0.0/0` | Route par défaut |
| `10.0.0.0/8` | Réseau large |
| `10.10.10.0/24` | Plus spécifique |
| `10.10.10.42/32` | Hôte précis |

Pour joindre `10.10.10.42`, la route `/32` est préférée.

---

## 🚪 11.4 Route par défaut

Une route par défaut sert quand aucune route plus spécifique n’existe.

```text
0.0.0.0/0
```

Exemple Cisco :

```cisco
ip route 0.0.0.0 0.0.0.0 192.168.1.254
```

Sous Linux :

```bash
ip route
ip route add default via 192.168.1.254
```

---

## 🛣️ 11.5 Routage statique

Le routage statique est configuré manuellement.

Avantages :

- simple ;
- prévisible ;
- pas de protocole dynamique ;
- utile pour petits réseaux ou routes spécifiques.

Inconvénients :

- peu scalable ;
- maintenance manuelle ;
- pas d’adaptation automatique en cas de panne.

Exemple Cisco :

```cisco
ip route 192.168.20.0 255.255.255.0 192.168.10.2
```

---

## 🔄 11.6 Routage dynamique

Un protocole de routage dynamique permet aux routeurs d’échanger leurs routes.

| Protocole | Type | Usage |
| :--- | :--- | :--- |
| **RIP** | Distance-vector | Ancien, simple |
| **OSPF** | Link-state | Très courant en entreprise |
| **EIGRP** | Advanced distance-vector | Cisco historique |
| **BGP** | Path-vector | Internet, opérateurs, gros réseaux |

---

## 🧠 11.7 Distance administrative

La distance administrative indique la confiance accordée à une source de route.

Plus elle est basse, plus elle est préférée.

| Source | Distance administrative |
| :--- | :--- |
| Connectée | 0 |
| Statique | 1 |
| EIGRP interne | 90 |
| OSPF | 110 |
| RIP | 120 |

---

## 🧭 11.8 OSPF : bases CCNA

OSPF est un protocole de routage dynamique de type **link-state**.

Il construit une carte logique du réseau et calcule le meilleur chemin avec l’algorithme SPF.

Concepts importants :

| Terme | Rôle |
| :--- | :--- |
| **Area** | Zone OSPF |
| **Area 0** | Backbone obligatoire |
| **Router ID** | Identifiant unique du routeur |
| **Neighbor** | Routeur voisin |
| **Adjacency** | Relation OSPF établie |
| **LSA** | Information d’état de lien |
| **Cost** | Métrique OSPF |

Exemple simple :

```cisco
router ospf 1
 router-id 1.1.1.1
 network 192.168.10.0 0.0.0.255 area 0
 network 192.168.20.0 0.0.0.255 area 0
```

Commandes utiles :

```cisco
show ip ospf neighbor
show ip route ospf
show ip protocols
```

---

# 🚪 12. NAT et PAT

Le NAT traduit des adresses IP.

Il est très utilisé pour permettre à des machines privées d’accéder à Internet.

---

## 🔁 12.1 Types de NAT

| Type | Description |
| :--- | :--- |
| **Static NAT** | 1 IP privée = 1 IP publique |
| **Dynamic NAT** | Pool d’IP publiques attribuées dynamiquement |
| **PAT / NAT overload** | Plusieurs IP privées partagent une IP publique via les ports |

---

## 🏠 12.2 Exemple PAT

Plusieurs machines internes :

```text
192.168.1.10
192.168.1.11
192.168.1.12
```

sortent sur Internet avec une seule IP publique :

```text
203.0.113.10
```

Le routeur différencie les connexions avec les ports source.

---

## ⚙️ 12.3 Exemple Cisco NAT overload

```cisco
access-list 1 permit 192.168.1.0 0.0.0.255

interface GigabitEthernet0/0
 ip nat inside

interface GigabitEthernet0/1
 ip nat outside

ip nat inside source list 1 interface GigabitEthernet0/1 overload
```

---

# 🚦 13. TCP, UDP et ports

La couche transport permet la communication entre applications.

Elle utilise des **ports**.

---

## 🔒 13.1 TCP

TCP est orienté connexion.

Il offre :

- fiabilité ;
- accusés de réception ;
- retransmission ;
- contrôle de flux ;
- ordre des segments.

Utilisé par :

- HTTP ;
- HTTPS ;
- SSH ;
- FTP ;
- SMTP ;
- IMAP ;
- LDAP.

---

## ⚡ 13.2 UDP

UDP est non connecté.

Il est :

- plus rapide ;
- plus léger ;
- sans garantie de livraison ;
- adapté au temps réel.

Utilisé par :

- DNS ;
- DHCP ;
- VoIP ;
- streaming ;
- NTP ;
- jeux en ligne.

---

## 🤝 13.3 Three-way handshake TCP

```text
Client -> SYN -> Serveur
Client <- SYN/ACK <- Serveur
Client -> ACK -> Serveur
```

La connexion TCP est ensuite établie.

---

## 🧾 13.4 Ports courants à connaître

| Port | Protocole | Usage |
| :--- | :--- | :--- |
| 20/21 | FTP | Transfert de fichiers |
| 22 | SSH | Administration distante sécurisée |
| 23 | Telnet | Administration distante non chiffrée |
| 25 | SMTP | Envoi d’e-mails |
| 53 | DNS | Résolution de noms |
| 67/68 | DHCP | Attribution automatique IP |
| 69 | TFTP | Transfert simple |
| 80 | HTTP | Web non chiffré |
| 110 | POP3 | Récupération mail |
| 123 | NTP | Synchronisation horaire |
| 143 | IMAP | Consultation mail |
| 161/162 | SNMP | Supervision |
| 389 | LDAP | Annuaire |
| 443 | HTTPS | Web chiffré |
| 445 | SMB | Partage Windows |
| 514 | Syslog | Logs réseau |
| 636 | LDAPS | LDAP chiffré |
| 993 | IMAPS | IMAP chiffré |
| 995 | POP3S | POP3 chiffré |
| 1433 | MSSQL | SQL Server |
| 3306 | MySQL | Base MySQL |
| 3389 | RDP | Bureau à distance Windows |
| 5432 | PostgreSQL | Base PostgreSQL |
| 5900 | VNC | Bureau distant |
| 8080 | HTTP alternatif | Proxy, web app |

---

# 🧰 14. Services IP indispensables

---

## 📦 14.1 DHCP

DHCP attribue automatiquement une configuration IP.

Il fournit généralement :

- adresse IP ;
- masque ;
- passerelle ;
- DNS ;
- durée du bail ;
- options supplémentaires.

---

## 🔄 14.2 Processus DHCP DORA

```text
D - Discover : le client cherche un serveur DHCP
O - Offer    : le serveur propose une adresse
R - Request  : le client demande à utiliser cette adresse
A - ACK      : le serveur confirme
```

Ports :

```text
DHCP serveur : UDP 67
DHCP client  : UDP 68
```

---

## 🧱 14.3 DHCP relay

Un serveur DHCP ne répond pas directement à travers les routeurs, car le Discover est un broadcast.

Pour permettre à un client d’un autre VLAN d’obtenir une adresse, on configure un **relay DHCP**.

Exemple Cisco :

```cisco
interface vlan 20
 ip helper-address 192.168.10.5
```

---

## 🌍 14.4 DNS

DNS traduit les noms en adresses IP.

Exemple :

```text
www.example.com -> 93.184.216.34
```

---

## 🧾 14.5 Types d’enregistrements DNS

| Type | Rôle |
| :--- | :--- |
| **A** | Nom vers IPv4 |
| **AAAA** | Nom vers IPv6 |
| **CNAME** | Alias |
| **MX** | Serveur mail |
| **NS** | Serveur DNS autoritaire |
| **PTR** | Résolution inverse |
| **TXT** | Texte, SPF, DKIM, vérifications |
| **SRV** | Service spécifique |

---

## 🧠 14.6 Résolution DNS

```text
1. Le client regarde son cache DNS
2. Il interroge son DNS configuré
3. Le DNS récursif cherche la réponse si besoin
4. La réponse est mise en cache
```

Commandes utiles :

```bash
nslookup example.com
dig example.com
dig MX example.com
ipconfig /displaydns
```

---

## ⏰ 14.7 NTP

NTP synchronise l’heure des équipements.

C’est critique pour :

- logs ;
- Kerberos / Active Directory ;
- certificats ;
- corrélation d’événements sécurité ;
- forensic ;
- supervision.

Port :

```text
UDP 123
```

---

## 📊 14.8 SNMP

SNMP sert à superviser les équipements réseau.

Il permet de récupérer :

- utilisation CPU ;
- mémoire ;
- trafic interfaces ;
- état des ports ;
- température ;
- erreurs.

| Version | Sécurité |
| :--- | :--- |
| SNMPv1 | Ancien |
| SNMPv2c | Communauté en clair |
| SNMPv3 | Authentification et chiffrement |

---

## 🧾 14.9 Syslog

Syslog centralise les logs.

Port courant :

```text
UDP 514
```

Niveaux Syslog :

| Niveau | Nom | Gravité |
| :--- | :--- | :--- |
| 0 | Emergency | Système inutilisable |
| 1 | Alert | Action immédiate |
| 2 | Critical | Critique |
| 3 | Error | Erreur |
| 4 | Warning | Avertissement |
| 5 | Notice | Normal mais important |
| 6 | Informational | Information |
| 7 | Debug | Débogage |

---

# 🛡️ 15. ACL : Access Control Lists

Une ACL filtre le trafic selon des critères.

Elle peut filtrer :

- IP source ;
- IP destination ;
- protocole ;
- port source ;
- port destination.

---

## 🧱 15.1 ACL standard

Une ACL standard filtre uniquement selon l’adresse source.

Exemple :

```cisco
access-list 10 permit 192.168.10.0 0.0.0.255
access-list 10 deny any
```

---

## 🎯 15.2 ACL étendue

Une ACL étendue filtre selon source, destination, protocole et ports.

Exemple : autoriser HTTP/HTTPS vers un serveur.

```cisco
access-list 100 permit tcp 192.168.20.0 0.0.0.255 host 192.168.30.10 eq 80
access-list 100 permit tcp 192.168.20.0 0.0.0.255 host 192.168.30.10 eq 443
access-list 100 deny ip any any
```

---

## ⚠️ 15.3 Règles importantes ACL

| Règle | Explication |
| :--- | :--- |
| Lecture de haut en bas | La première correspondance gagne |
| Deny implicite | Tout ce qui n’est pas autorisé est bloqué |
| Ordre critique | Mettre les règles spécifiques avant les générales |
| Placement important | Standard proche destination, étendue proche source |

---

# 🔐 16. Sécurité réseau

La sécurité réseau repose sur plusieurs couches de défense.

---

## 🧱 16.1 Objectifs de sécurité

| Principe | Signification |
| :--- | :--- |
| **Confidentialité** | Empêcher la lecture non autorisée |
| **Intégrité** | Empêcher la modification non autorisée |
| **Disponibilité** | Maintenir le service accessible |
| **Authentification** | Vérifier l’identité |
| **Autorisation** | Définir les droits |
| **Traçabilité** | Journaliser les actions |

---

## 🔥 16.2 Pare-feu

Un pare-feu filtre les communications entre zones réseau.

Exemple de zones :

```text
LAN
DMZ
WAN
VPN
Guest
Management
```

Types de filtrage :

| Type | Description |
| :--- | :--- |
| Stateless | Filtre paquet par paquet |
| Stateful | Suit l’état des connexions |
| Applicatif | Comprend certains protocoles applicatifs |
| NGFW | Filtrage avancé, IPS, identité, applications |

---

## 🕵️ 16.3 IDS et IPS

| Système | Rôle |
| :--- | :--- |
| **IDS** | Détecte et alerte |
| **IPS** | Détecte et bloque |

Un IDS est passif, un IPS est inline et peut interrompre le trafic.

---

## 🧑‍💻 16.4 AAA

AAA signifie :

```text
Authentication
Authorization
Accounting
```

| Élément | Rôle |
| :--- | :--- |
| Authentification | Qui es-tu ? |
| Autorisation | Qu’as-tu le droit de faire ? |
| Accounting | Qu’as-tu fait ? |

Protocoles courants :

- RADIUS ;
- TACACS+.

---

## 🔑 16.5 SSH plutôt que Telnet

Telnet transmet en clair.

SSH chiffre la session.

Exemple Cisco :

```cisco
hostname SW1
ip domain-name lab.local
crypto key generate rsa
username admin secret MotDePasseFort
line vty 0 4
 login local
 transport input ssh
```

---

## 🧷 16.6 Port Security

Port Security limite les adresses MAC autorisées sur un port switch.

Objectif :

- éviter qu’un utilisateur branche un switch sauvage ;
- limiter l’usurpation ;
- contrôler les endpoints.

Exemple :

```cisco
interface FastEthernet0/10
 switchport mode access
 switchport port-security
 switchport port-security maximum 1
 switchport port-security mac-address sticky
 switchport port-security violation shutdown
```

Modes de violation :

| Mode | Effet |
| :--- | :--- |
| Protect | Bloque le trafic non autorisé |
| Restrict | Bloque et log |
| Shutdown | Désactive le port |

---

## 🧪 16.7 DHCP Snooping

DHCP Snooping protège contre les faux serveurs DHCP.

Principe :

- ports vers clients = untrusted ;
- port vers vrai serveur DHCP = trusted.

Exemple :

```cisco
ip dhcp snooping
ip dhcp snooping vlan 10,20

interface GigabitEthernet0/1
 ip dhcp snooping trust
```

---

## 🛡️ 16.8 Dynamic ARP Inspection

DAI protège contre l’ARP spoofing.

Il s’appuie souvent sur la table DHCP Snooping.

```cisco
ip arp inspection vlan 10,20
```

---

## 📌 16.9 Sécurité minimale d’un switch

Checklist :

- changer les mots de passe par défaut ;
- désactiver Telnet ;
- activer SSH ;
- désactiver les ports inutilisés ;
- placer les ports inutilisés dans un VLAN parking ;
- activer Port Security si adapté ;
- éviter VLAN 1 pour management ;
- configurer une bannière légale ;
- journaliser vers Syslog ;
- synchroniser NTP ;
- sauvegarder la configuration.

Exemple :

```cisco
interface range FastEthernet0/20 - 24
 switchport mode access
 switchport access vlan 999
 shutdown
```

---

# 🧬 17. Architectures réseau

---

## 🏢 17.1 Réseau campus classique

Architecture à trois couches :

| Couche | Rôle |
| :--- | :--- |
| **Access** | Connexion des utilisateurs |
| **Distribution** | Agrégation, routage, politiques |
| **Core** | Transport rapide entre blocs réseau |

---

## 🧱 17.2 Architecture deux couches

Souvent utilisée dans les petites structures :

```text
Access + Distribution
Core
```

Ou :

```text
Access
Collapsed Core
```

Le **collapsed core** combine distribution et cœur.

---

## 🕸️ 17.3 Spine-Leaf

Très utilisé en datacenter.

```text
Leaf  = switches connectés aux serveurs
Spine = switches d’agrégation
```

Avantages :

- latence prévisible ;
- haute redondance ;
- évolutif ;
- adapté à l’est-ouest.

---

## ☁️ 17.4 Réseaux hybrides et cloud

Les entreprises utilisent souvent :

```text
LAN interne
VPN site-à-site
Cloud public
SaaS
Datacenter
Télétravail
```

Concepts importants :

| Terme | Rôle |
| :--- | :--- |
| **VPN** | Tunnel chiffré |
| **SD-WAN** | Gestion intelligente des liens WAN |
| **SASE** | Sécurité réseau orientée cloud |
| **Zero Trust** | Ne jamais faire confiance par défaut |

---

# 🧪 18. Troubleshooting réseau

Le dépannage réseau doit être méthodique.

---

## 🪜 18.1 Méthode simple

1. Identifier le problème.
2. Déterminer le périmètre.
3. Vérifier la couche physique.
4. Vérifier IP, masque, passerelle, DNS.
5. Tester localement.
6. Tester la passerelle.
7. Tester une IP externe.
8. Tester le DNS.
9. Vérifier firewall, routes et services.
10. Documenter la résolution.

---

## 🧭 18.2 Diagnostic par étapes

### Étape 1 : configuration IP

Windows :

```powershell
ipconfig /all
```

Linux :

```bash
ip addr
ip route
cat /etc/resolv.conf
```

À vérifier :

- IP ;
- masque ;
- passerelle ;
- DNS ;
- DHCP ou statique ;
- interface active.

---

### Étape 2 : boucle locale

```bash
ping 127.0.0.1
ping ::1
```

Si ça échoue, problème pile TCP/IP locale.

---

### Étape 3 : IP locale

```bash
ping <IP_de_la_machine>
```

Si ça échoue, problème interface locale ou firewall local.

---

### Étape 4 : passerelle

```bash
ping <IP_passerelle>
```

Si ça échoue :

- mauvais VLAN ;
- câble ;
- Wi-Fi ;
- switch ;
- mauvais masque ;
- passerelle incorrecte ;
- firewall local ;
- port désactivé.

---

### Étape 5 : IP externe

```bash
ping 8.8.8.8
ping 1.1.1.1
```

Si la passerelle répond mais pas Internet :

- problème route ;
- NAT ;
- pare-feu ;
- lien WAN ;
- proxy ;
- filtrage opérateur.

---

### Étape 6 : DNS

```bash
nslookup google.com
dig google.com
```

Si ping IP fonctionne mais pas nom DNS :

```text
Problème DNS probable.
```

---

### Étape 7 : port applicatif

```bash
telnet serveur 443
nc -vz serveur 443
Test-NetConnection serveur -Port 443
```

Si ping fonctionne mais pas l’application :

- service arrêté ;
- port fermé ;
- firewall ;
- ACL ;
- certificat ;
- proxy ;
- mauvaise URL ;
- mauvaise application.

---

## 🧰 18.3 Commandes indispensables

### Windows

```powershell
ipconfig /all
ipconfig /release
ipconfig /renew
ipconfig /flushdns
ping 8.8.8.8
tracert 8.8.8.8
nslookup example.com
route print
arp -a
netstat -ano
Test-NetConnection example.com -Port 443
Get-NetIPAddress
Get-NetRoute
Resolve-DnsName example.com
```

### Linux

```bash
ip addr
ip route
ip neigh
ping 8.8.8.8
traceroute 8.8.8.8
tracepath 8.8.8.8
dig example.com
nslookup example.com
ss -tulpen
netstat -tulpen
tcpdump -i eth0
nmcli device status
systemctl status NetworkManager
resolvectl status
```

### Cisco IOS

```cisco
show running-config
show startup-config
show ip interface brief
show interfaces status
show interfaces trunk
show vlan brief
show mac address-table
show arp
show ip route
show cdp neighbors
show lldp neighbors
show spanning-tree
show etherchannel summary
show ip protocols
show ip ospf neighbor
show access-lists
show logging
ping
traceroute
```

---

# 🧯 19. Pannes fréquentes et causes probables

| Symptôme | Causes possibles |
| :--- | :--- |
| Pas d’adresse IP | DHCP HS, mauvais VLAN, câble, relay manquant |
| Adresse `169.254.x.x` | DHCP inaccessible |
| Ping passerelle impossible | VLAN, câble, Wi-Fi, masque, interface down |
| Ping IP externe OK mais web KO | DNS, proxy, navigateur, certificat |
| Ping OK mais service inaccessible | Port fermé, firewall, service arrêté |
| Certains VLAN ne passent pas | Trunk mal configuré, VLAN non autorisé |
| Boucle réseau | STP mal configuré, switch sauvage |
| Lenteurs | Duplex mismatch, saturation, DNS lent, Wi-Fi mauvais |
| Connexion intermittente | Câble, boucle, DHCP conflit, Wi-Fi instable |
| Un seul poste impacté | Poste, câble, port switch, IP locale |
| Tout un VLAN impacté | SVI, DHCP scope, trunk, ACL |
| Tout le site impacté | Routeur, firewall, WAN, DNS, cœur réseau |

---

# 🧪 20. Lecture rapide d’un flux réseau

Quand une machine `192.168.10.50` veut joindre `https://example.com` :

```text
1. Le poste vérifie son IP, masque et passerelle.
2. Il résout example.com via DNS.
3. Il obtient une IP publique.
4. Il voit que cette IP n’est pas dans son réseau local.
5. Il envoie le paquet à sa passerelle.
6. Pour joindre la passerelle, il fait ARP.
7. Le switch transfère la trame dans le bon VLAN.
8. Le routeur ou firewall reçoit le paquet.
9. Le NAT traduit l’adresse privée en adresse publique.
10. Le paquet part vers Internet.
11. Le serveur répond.
12. Le firewall autorise le retour car la session est établie.
13. Le poste reçoit la réponse HTTPS.
```

---

# 🧱 21. Virtualisation et réseau

En environnement virtualisé, un hôte physique peut contenir plusieurs machines virtuelles.

---

## 🖥️ 21.1 vSwitch

Un vSwitch est un switch virtuel dans l’hyperviseur.

Il connecte :

- VM entre elles ;
- VM vers le réseau physique ;
- interfaces virtuelles ;
- cartes physiques.

---

## 🏷️ 21.2 VLAN en virtualisation

Un hyperviseur peut être connecté à un port trunk.

Exemple :

```text
Switch physique trunk
        |
Hyperviseur
        |
vSwitch
        |
VM VLAN 10 / VM VLAN 20 / VM VLAN 30
```

Il faut alors bien gérer :

- VLAN ID ;
- trunk ;
- groupes de ports ;
- sécurité ;
- MTU ;
- redondance.

---

# 📏 22. MTU et fragmentation

La MTU est la taille maximale d’un paquet transmis sans fragmentation.

Ethernet classique :

```text
MTU 1500 octets
```

Si un paquet est trop gros :

- il peut être fragmenté ;
- ou rejeté si DF est activé ;
- ou provoquer des problèmes avec VPN, tunnels, PPPoE.

Commande utile :

```bash
ping -f -l 1472 8.8.8.8
```

Sous Linux :

```bash
ping -M do -s 1472 8.8.8.8
```

---

# 🎛️ 23. QoS : Quality of Service

La QoS permet de prioriser certains trafics.

Utile pour :

- VoIP ;
- visioconférence ;
- supervision ;
- flux critiques ;
- liens WAN saturés.

---

## 🚦 23.1 Types de trafic

| Trafic | Sensibilité |
| :--- | :--- |
| Voix | Très sensible à la latence et au jitter |
| Vidéo | Sensible à la bande passante |
| Sauvegarde | Peut être retardée |
| Web | Tolérance moyenne |
| Supervision | Faible débit mais important |

---

## 🧠 23.2 Notions QoS

| Terme | Rôle |
| :--- | :--- |
| Classification | Identifier le trafic |
| Marking | Marquer le trafic |
| Queuing | Mettre en file d’attente |
| Shaping | Lisser le trafic |
| Policing | Limiter strictement |
| DSCP | Marquage IP de priorité |

---

# 🤖 24. Automatisation et programmabilité réseau

Les réseaux modernes se pilotent de plus en plus par API et automatisation.

---

## 🧠 24.1 Réseau traditionnel vs réseau automatisé

| Traditionnel | Automatisé |
| :--- | :--- |
| Configuration manuelle CLI | Templates et scripts |
| Équipement par équipement | Gestion centralisée |
| Risque d’erreur humaine | Déploiement reproductible |
| Documentation manuelle | Source de vérité |
| Changements lents | Changements contrôlés et rapides |

---

## 🧩 24.2 Concepts clés

| Concept | Définition |
| :--- | :--- |
| **API** | Interface permettant à des programmes de communiquer |
| **REST** | Architecture d’API très courante |
| **JSON** | Format de données lisible et structuré |
| **YAML** | Format souvent utilisé pour la configuration |
| **Ansible** | Outil d’automatisation |
| **NetConf / RestConf** | Protocoles de gestion réseau |
| **Controller-based networking** | Gestion centralisée par contrôleur |

---

## 🧾 24.3 Exemple JSON

```json
{
  "hostname": "SW1",
  "management_ip": "192.168.10.2",
  "vlans": [
    {
      "id": 10,
      "name": "ADMIN"
    },
    {
      "id": 20,
      "name": "USERS"
    }
  ]
}
```

---

## 🧾 24.4 Exemple YAML

```yaml
hostname: SW1
management_ip: 192.168.10.2
vlans:
  - id: 10
    name: ADMIN
  - id: 20
    name: USERS
```

---

# 🧰 25. Configuration Cisco de base

---

## 🖧 25.1 Configuration minimale d’un switch

```cisco
enable
configure terminal

hostname SW1
no ip domain-lookup

enable secret MotDePasseEnable

service password-encryption

banner motd #
Acces reserve aux personnes autorisees.
#

username admin privilege 15 secret MotDePasseFort

ip domain-name lab.local
crypto key generate rsa modulus 2048

line console 0
 password ConsolePassword
 login
 logging synchronous

line vty 0 4
 login local
 transport input ssh

interface vlan 10
 ip address 192.168.10.2 255.255.255.0
 no shutdown

ip default-gateway 192.168.10.1

end
write memory
```

---

## 🧭 25.2 Configuration VLAN simple

```cisco
configure terminal

vlan 10
 name ADMIN

vlan 20
 name USERS

vlan 30
 name SERVERS

interface FastEthernet0/1
 switchport mode access
 switchport access vlan 20
 spanning-tree portfast

interface GigabitEthernet0/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
 switchport trunk native vlan 999

end
write memory
```

---

## 🛣️ 25.3 Configuration route statique

```cisco
configure terminal

ip route 192.168.50.0 255.255.255.0 192.168.10.254

end
write memory
```

---

## 🔍 25.4 Vérification Cisco

```cisco
show ip interface brief
show vlan brief
show interfaces trunk
show running-config
show mac address-table
show ip route
show arp
ping 192.168.10.1
traceroute 8.8.8.8
```

---

# 📋 26. Checklist diagnostic réseau complète

## Poste client

- [ ] Le câble est branché ?
- [ ] Le Wi-Fi est connecté au bon SSID ?
- [ ] L’interface est active ?
- [ ] Le poste a une IP correcte ?
- [ ] Le masque est correct ?
- [ ] La passerelle est correcte ?
- [ ] Le DNS est correct ?
- [ ] Pas d’adresse APIPA ?
- [ ] Pas de conflit IP ?
- [ ] Le firewall local ne bloque pas ?
- [ ] Le proxy est correct ?
- [ ] L’heure système est correcte ?

## Switch

- [ ] Le port est up ?
- [ ] Le port est dans le bon VLAN ?
- [ ] Le trunk autorise le bon VLAN ?
- [ ] La table MAC apprend l’adresse ?
- [ ] STP ne bloque pas le port ?
- [ ] Le port n’est pas en err-disabled ?
- [ ] Port Security ne bloque pas ?
- [ ] Pas d’erreurs CRC ?
- [ ] Pas de saturation ?

## Routeur / Firewall

- [ ] La passerelle répond ?
- [ ] La route existe ?
- [ ] La route retour existe ?
- [ ] Le NAT fonctionne ?
- [ ] Les ACL autorisent le flux ?
- [ ] Les règles firewall autorisent le flux ?
- [ ] Le service écouté est ouvert ?
- [ ] Les logs montrent un blocage ?
- [ ] Le lien WAN est up ?

## Services

- [ ] DHCP distribue bien les baux ?
- [ ] DNS résout correctement ?
- [ ] NTP est synchronisé ?
- [ ] Les certificats sont valides ?
- [ ] Le service applicatif écoute ?
- [ ] Les logs applicatifs montrent une erreur ?

---

# 🧠 27. Règles d’or à mémoriser

1. **Un switch commute avec des adresses MAC.**
2. **Un routeur route avec des adresses IP.**
3. **Un VLAN = un domaine de broadcast.**
4. **Un sous-réseau IP doit généralement correspondre à un VLAN.**
5. **Deux machines dans des réseaux différents ont besoin d’une passerelle.**
6. **Si l’IP fonctionne mais pas les noms, suspecter DNS.**
7. **Si le poste a une adresse 169.254.x.x, suspecter DHCP.**
8. **Si un seul poste est impacté, commencer localement.**
9. **Si tout un VLAN est impacté, vérifier SVI, DHCP, trunk et ACL.**
10. **Si plusieurs VLAN sont impactés, vérifier routage, firewall ou cœur réseau.**
11. **Le ping teste ICMP, pas forcément l’application.**
12. **Un port TCP ouvert ne veut pas dire que l’application fonctionne correctement.**
13. **Le firewall peut bloquer même si le routage est bon.**
14. **Le routage retour est aussi important que le routage aller.**
15. **Toujours documenter les VLAN, IP, trunks, routes et règles firewall.**

---

# 🧾 28. Mini-lab mental : communication inter-VLAN

Objectif :

```text
PC VLAN 10 veut joindre Serveur VLAN 30
```

Topologie :

```text
PC 192.168.10.50/24
Gateway 192.168.10.1

Serveur 192.168.30.10/24
Gateway 192.168.30.1
```

Étapes :

```text
1. PC voit que 192.168.30.10 n’est pas dans son réseau.
2. PC cherche la MAC de sa passerelle 192.168.10.1 avec ARP.
3. PC envoie la trame au switch.
4. Le switch transmet au routeur ou switch L3.
5. L’équipement L3 route vers le VLAN 30.
6. Il cherche la MAC du serveur avec ARP.
7. Il transmet au serveur.
8. Le serveur répond via sa passerelle 192.168.30.1.
```

Points de panne possibles :

- mauvais masque ;
- mauvaise gateway ;
- VLAN incorrect ;
- trunk incomplet ;
- SVI down ;
- routage désactivé ;
- ACL bloquante ;
- firewall ;
- serveur sans gateway ;
- conflit IP.

---

# 🧠 29. Résumé ultra-condensé

```text
Couche 1 : câble, fibre, radio, signal.
Couche 2 : MAC, switch, VLAN, trunk, STP.
Couche 3 : IP, routeur, passerelle, routage.
Couche 4 : TCP, UDP, ports.
Couche 7 : DNS, HTTP, DHCP, SSH, applications.
```

```text
Même VLAN + même réseau IP :
    communication directe via switch.

VLAN différent ou réseau IP différent :
    passage par routeur, switch L3 ou firewall.

IP externe :
    passerelle + routage + NAT + firewall + DNS.

Ping IP OK mais nom KO :
    DNS.

Pas d’IP ou 169.254.x.x :
    DHCP.

Port applicatif KO :
    firewall, service, ACL, routage retour ou écoute applicative.
```

---

# ✅ 30. Ce qu’il faut savoir faire pour être solide

À maîtriser en pratique :

- lire une configuration IP ;
- calculer un sous-réseau simple ;
- reconnaître réseau, broadcast et plage utilisable ;
- expliquer OSI et TCP/IP ;
- différencier switch et routeur ;
- configurer un VLAN access ;
- comprendre un trunk 802.1Q ;
- expliquer l’inter-VLAN routing ;
- lire une table de routage ;
- configurer une route statique ;
- comprendre DHCP, DNS, NAT ;
- connaître les ports courants ;
- diagnostiquer avec ping, traceroute, nslookup, ipconfig, ip ;
- sécuriser l’administration avec SSH ;
- comprendre ACL, firewall, IDS/IPS ;
- expliquer STP et pourquoi il existe ;
- comprendre les bases du Wi-Fi entreprise ;
- lire des logs réseau ;
- documenter proprement une infra.

---

## 🧭 Conclusion

Le réseau est le socle de presque toute l’informatique moderne.

Un bon administrateur système ou technicien supérieur doit comprendre :

```text
comment une machine obtient son adresse,
comment elle trouve sa passerelle,
comment elle résout un nom DNS,
comment elle traverse les VLAN,
comment elle sort vers Internet,
comment les flux sont filtrés,
et comment diagnostiquer chaque étape.
```

La logique réseau repose toujours sur les mêmes questions :

```text
Qui parle ?
À qui ?
Depuis quel réseau ?
Vers quel réseau ?
Par quel chemin ?
Avec quel protocole ?
Sur quel port ?
Est-ce autorisé ?
Où est-ce bloqué ?
```

Si tu sais répondre méthodiquement à ces questions, tu peux dépanner la majorité des incidents réseau rencontrés en TSSR, AdminSys et cybersécurité.